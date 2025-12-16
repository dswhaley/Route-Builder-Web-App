let map: google.maps.Map;
let markers: google.maps.marker.AdvancedMarkerElement[] = [];
let routePolyline: google.maps.Polyline;
let elevationService: google.maps.ElevationService;
let totalDistance: number;
let elevation: number;
let routeFinalized = false;
let lastEncodedPolyline: string | null = null;

const apiUrl = 'http://localhost:5000/api';

document.addEventListener("DOMContentLoaded", () => {

  const createBtn = document.getElementById('createBtn');
  createBtn.addEventListener('click', handleCreateClick);
  const eraseBtn = document.getElementById('eraseBtn');
  eraseBtn.addEventListener('click', handleEraseClick);


  function handleCreateClick(event: MouseEvent): Promise<void> {
  event.preventDefault();

  if (markers.length < 2) {
    alert("Add at least two points first.");
    return;
  }

  routeFinalized = true;

  // Generate static image
  downloadStaticRouteImage(lastEncodedPolyline);

  // Send everything to backend
  send_route_to_db();
}

  async function send_route_to_db() {
    const routeData = {
      distance: totalDistance,
      elevation: elevation,
      route_name: "TEST",
      coord_string: lastEncodedPolyline,
      image_name: "1.png"
    }

    const message = await fetch("http://127.0.0.1:5000/add_route/", {
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

    console.log(message)
  }

  function handleEraseClick(event: MouseEvent): void {
    console.log('Erase Button was clicked!');

    markers.forEach(marker => {
      marker.map = null;
    });
    markers = [];


    routePolyline.setPath([]);
  }
});

function initMap(): void {
  map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
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

  map.addListener("click", (event: google.maps.MapMouseEvent) => {
    if (event.latLng) addMarker(event.latLng);
  });
}

async function fetchApiKey(): Promise<string | null> {
  try {
    const response = await fetch(`${apiUrl}/get-google-api-key`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.apiKey;
  } catch (error) {
    console.error('Error fetching API key:', error);
    return null;
  }
}

function addMarker(location: google.maps.LatLng): void {
  if (routeFinalized) return;

  // Create custom marker element
  const marker = new google.maps.marker.AdvancedMarkerElement({
    position: location,
    map: map,
  });

  markers.push(marker);

  if (markers.length >= 2) calculateRoute();
}

async function calculateRoute(fitAndCapture = false): Promise<void> {
  if (markers.length < 2) return;

  function toRoutesLatLng(position: google.maps.LatLng | google.maps.LatLngLiteral) {
    if ('lat' in position && typeof position.lat === 'function') {
      // It's a LatLng object
      return { latLng: { latitude: position.lat, longitude: position.lng } };
    } else {
      // It's already a LatLngLiteral
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

    // Draw polyline using geometry.polyline
    if (!route.polyline || !route.polyline.encodedPolyline) {
      console.error("No polyline returned", route);
      return;
    }

    const decodedPath = google.maps.geometry.encoding.decodePath(route.polyline.encodedPolyline);
    routePolyline.setPath(decodedPath);

    elevation = await getRouteElevation(decodedPath);


    // Total distance
    totalDistance = route.distanceMeters;
    // alert("Total distance: " + (totalDistance / 1000).toFixed(2) + " km");

    if (fitAndCapture) {
      const bounds = new google.maps.LatLngBounds();
      decodedPath.forEach(p => bounds.extend(p));
      map.fitBounds(bounds);
    }

  } catch (err) {
    console.error("Routes API error:", err);
  }

}

function getRouteElevation(path: google.maps.LatLng[]): Promise<number> {
  return new Promise((resolve, reject) => {
    elevationService.getElevationAlongPath(
      { path, samples: 256 },
      (results, status) => {
        if (status !== google.maps.ElevationStatus.OK || !results) {
          reject(status);
          return;
        }

        let totalGain = 0;
        for (let i = 1; i < results.length; i++) {
          const diff = results[i].elevation - results[i - 1].elevation;
          if (diff > 0) totalGain += diff;
        }

        resolve(totalGain);
      }
    );
  });
}

async function downloadStaticRouteImage(encodedPolyline: string): Promise<void> {
  const googleApiKey = await fetchApiKey();

  const start = markers[0].position as google.maps.LatLngLiteral;
  const end = markers[markers.length - 1].position as google.maps.LatLngLiteral;

  const baseUrl = "https://maps.googleapis.com/maps/api/staticmap";

  const params = [
    "size=1200x800",

    `markers=color:green|label:S|${start.lat},${start.lng}`,
    
    `markers=color:red|label:E|${end.lat},${end.lng}`,

    `path=weight:5|color:0x0033AA|enc:${encodedPolyline}`,

    `key=${googleApiKey}`
  ];

  const url = `${baseUrl}?${params.join("&")}`;

  const link = document.createElement("a");
  link.href = url;
  link.download = "route.png";
  link.click();
}