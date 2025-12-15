let map;
let markers = [];
let routePolyline;
let elevationService;
const apiUrl = 'http://localhost:5000/api';
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 37.7749, lng: -122.4194 },
        zoom: 12,
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
    const marker = new google.maps.marker.AdvancedMarkerElement({
        position: location,
        map: map,
    });
    markers.push(marker);
    if (markers.length >= 2)
        calculateRoute();
}
async function calculateRoute() {
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
        if (!route.polyline || !route.polyline.encodedPolyline) {
            console.error("No polyline returned", route);
            return;
        }
        const decodedPath = google.maps.geometry.encoding.decodePath(route.polyline.encodedPolyline);
        routePolyline.setPath(decodedPath);
        const elevation = getRouteElevation(decodedPath);
        let totalDistance = 0;
        totalDistance = route.distanceMeters;
        alert("Total distance: " + (totalDistance / 1000).toFixed(2) + " km");
    }
    catch (err) {
        console.error("Routes API error:", err);
    }
}
function getRouteElevation(path) {
    elevationService.getElevationAlongPath({
        path,
        samples: 256,
    }, (results, status) => {
        if (status !== google.maps.ElevationStatus.OK || !results) {
            console.error("Elevation service failed:", status);
            return;
        }
        let totalGain = 0;
        for (let i = 1; i < results.length; i++) {
            const diff = results[i].elevation - results[i - 1].elevation;
            totalGain += diff;
        }
        console.log("Elevation gain (m):", totalGain.toFixed(1));
        alert(`Elevation gain: ${totalGain.toFixed(1)} m`);
        return totalGain;
    });
}
