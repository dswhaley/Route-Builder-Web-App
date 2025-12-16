let map;
let markers = [];
let routePolyline;
let elevationService;
let totalDistance;
let elevation;
let routeFinalized = false;
let lastEncodedPolyline = null;
const apiUrl = 'http://localhost:5000/api';
document.addEventListener("DOMContentLoaded", () => {
    const createBtn = document.getElementById('createBtn');
    createBtn.addEventListener('click', handleCreateClick);
    const eraseBtn = document.getElementById('eraseBtn');
    eraseBtn.addEventListener('click', handleEraseClick);
    async function handleCreateClick(event) {
        event.preventDefault();
        const routeNameInput = document.getElementById("routeName");
        const routeName = routeNameInput.value.trim();
        if (!routeName) {
            alert("Please enter a route name.");
            return;
        }
        if (markers.length < 2) {
            alert("Add at least two points first.");
            return;
        }
        routeFinalized = true;
        if (!lastEncodedPolyline) {
            alert("Route not ready yet.");
            return;
        }
        const imageUrl = await downloadStaticRouteImage(lastEncodedPolyline);
        const imgRes = await fetch("/save_route_image/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                image_url: imageUrl,
                image_name: `${routeName}.png`
            })
        });
        if (!imgRes.ok) {
            alert("Failed to save route image.");
            return;
        }
        const imgData = await imgRes.json();
        send_route_to_db(routeName, imgData.image_path);
    }
    async function send_route_to_db(routeName, imagePath) {
        const routeData = {
            distance: totalDistance,
            elevation: elevation,
            route_name: routeName,
            coord_string: lastEncodedPolyline,
            image_name: imagePath
        };
        const message = await fetch("/add_route/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(routeData),
        });
        if (!message.ok) {
            const err = await message.text();
            throw new Error(`Flask error: ${err}`);
        }
        console.log(message);
        alert("Added route");
    }
    function handleEraseClick(event) {
        console.log('Erase Button was clicked!');
        routeFinalized = false;
        markers.forEach(marker => {
            marker.map = null;
        });
        markers = [];
        routePolyline.setPath([]);
    }
});
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 41.1578, lng: -80.0887 },
        zoom: 14,
        mapId: "DEMO_MAP_ID",
    });
    routePolyline = new google.maps.Polyline({
        map: map,
        strokeColor: "#4285F4",
        strokeWeight: 5,
    });
    elevationService = new google.maps.ElevationService();
    map.addListener("click", (event) => {
        if (event.latLng)
            addMarker(event.latLng);
    });
}
async function fetchApiKey() {
    try {
        const response = await fetch(`${apiUrl}/get-google-api-key`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.apiKey;
    }
    catch (error) {
        console.error('Error fetching API key:', error);
        return null;
    }
}
function addMarker(location) {
    if (routeFinalized)
        return;
    const marker = new google.maps.marker.AdvancedMarkerElement({
        position: location,
        map: map,
    });
    markers.push(marker);
    if (markers.length >= 2)
        calculateRoute();
}
async function calculateRoute(fitAndCapture = false) {
    if (markers.length < 2)
        return;
    function toRoutesLatLng(position) {
        if ('lat' in position && typeof position.lat === 'function') {
            return { latLng: { latitude: position.lat, longitude: position.lng } };
        }
        else {
            return { latLng: { latitude: position.lat, longitude: position.lng } };
        }
    }
    const origin = { location: toRoutesLatLng(markers[0].position) };
    const destination = { location: toRoutesLatLng(markers[markers.length - 1].position) };
    const intermediates = markers.slice(1, -1).map(m => ({ location: toRoutesLatLng(m.position) }));
    const body = {
        origin,
        destination,
        intermediates,
        travelMode: "WALK",
        computeAlternativeRoutes: false
    };
    const googleApiKey = await fetchApiKey();
    try {
        const res = await fetch("https://routes.googleapis.com/directions/v2:computeRoutes", {
            method: "POST",
            headers: { "Content-Type": "application/json", "X-Goog-Api-Key": googleApiKey, "X-Goog-FieldMask": "routes.distanceMeters,routes.duration,routes.polyline.encodedPolyline" },
            body: JSON.stringify(body)
        });
        const data = await res.json();
        if (!data.routes || data.routes.length === 0) {
            console.error("No route returned", data);
            return;
        }
        const route = data.routes[0];
        lastEncodedPolyline = route.polyline.encodedPolyline;
        if (!route.polyline || !route.polyline.encodedPolyline) {
            console.error("No polyline returned", route);
            return;
        }
        const decodedPath = google.maps.geometry.encoding.decodePath(route.polyline.encodedPolyline);
        routePolyline.setPath(decodedPath);
        elevation = await getRouteElevation(decodedPath);
        totalDistance = route.distanceMeters;
        if (fitAndCapture) {
            const bounds = new google.maps.LatLngBounds();
            decodedPath.forEach(p => bounds.extend(p));
            map.fitBounds(bounds);
        }
    }
    catch (err) {
        console.error("Routes API error:", err);
    }
}
function getRouteElevation(path) {
    return new Promise((resolve, reject) => {
        elevationService.getElevationAlongPath({ path, samples: 256 }, (results, status) => {
            if (status !== google.maps.ElevationStatus.OK || !results) {
                reject(status);
                return;
            }
            let totalGain = 0;
            for (let i = 1; i < results.length; i++) {
                const diff = results[i].elevation - results[i - 1].elevation;
                if (diff > 0)
                    totalGain += diff;
            }
            resolve(totalGain);
        });
    });
}
async function downloadStaticRouteImage(encodedPolyline) {
    const googleApiKey = await fetchApiKey();
    const start = markers[0].position;
    const end = markers[markers.length - 1].position;
    const safePolyline = encodeURIComponent(encodedPolyline);
    const url = "https://maps.googleapis.com/maps/api/staticmap" +
        `?size=1200x800&scale=2` +
        `&markers=color:green|label:S|${start.lat},${start.lng}` +
        `&markers=color:red|label:E|${end.lat},${end.lng}` +
        `&path=weight:6|color:0x1A4ED8|enc:${safePolyline}` +
        `&key=${googleApiKey}`;
    return url;
}
