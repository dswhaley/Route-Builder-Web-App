let map: google.maps.Map;
let markers: google.maps.marker.AdvancedMarkerElement[] = [];
let routePolyline: google.maps.Polyline;
let elevationService: google.maps.ElevationService;

const apiUrl = 'http://localhost:5000/api';

document.addEventListener("DOMContentLoaded", () => {
  
  const createBtn = document.getElementById('createBtn');
  createBtn.addEventListener('click', handleCreateClick);
  const eraseBtn = document.getElementById('eraseBtn');
  eraseBtn.addEventListener('click', handleEraseClick);


  function handleCreateClick(event: MouseEvent): void {
    console.log('Button was clicked!');
    const output = document.getElementById('outputArea');
    if (output) {
      output.textContent = 'Button clicked at ' + new Date().toLocaleTimeString();
    }
    // Optional: prevent default behavior if the button is part of a form
    event.preventDefault();
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
  // Create custom marker element
  const marker = new google.maps.marker.AdvancedMarkerElement({
    position: location,
    map: map,
  });

  markers.push(marker);

  if (markers.length >= 2) calculateRoute();
}

async function calculateRoute(): Promise<void> {
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
      headers: { "Content-Type": "application/json", "X-Goog-Api-Key": googleApiKey, "X-Goog-FieldMask": "routes.distanceMeters,routes.duration,routes.polyline.encodedPolyline"},
      body: JSON.stringify(body)
    });

    const data = await res.json();

    if (!data.routes || data.routes.length === 0) {
      console.error("No route returned", data);
      return;
    }

    const route = data.routes[0];

    // Draw polyline using geometry.polyline
    if (!route.polyline || !route.polyline.encodedPolyline) {
      console.error("No polyline returned", route);
      return;
    }

    const decodedPath = google.maps.geometry.encoding.decodePath(route.polyline.encodedPolyline);
    routePolyline.setPath(decodedPath);

    const elevation = getRouteElevation(decodedPath);


    // Total distance
    let totalDistance = 0;
    totalDistance = route.distanceMeters;
    alert("Total distance: " + (totalDistance / 1000).toFixed(2) + " km");

    // const routeData = {
    // distance: totalDistance,
    // elevation: elevation,
    // route_name: "",
    // coord_string: "",
    // image_name: ""
    // }

    // const message = await fetch("http://localhost:5000/api/routes", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(route),
    // });

    // if (!res.ok) {
    //   const err = await res.text();
    //   throw new Error(`Flask error: ${err}`);
    // }

  } catch (err) {
    console.error("Routes API error:", err);
  }

}

function getRouteElevation(path: google.maps.LatLng[]): void {
  elevationService.getElevationAlongPath(
    {
      path,
      samples: 256,
    },
    (results, status) => {
      if (status !== google.maps.ElevationStatus.OK || !results) {
        console.error("Elevation service failed:", status);
        return;
      }

      let totalGain = 0;

      for (let i = 1; i < results.length; i++) {
        const diff = results[i].elevation - results[i - 1].elevation;
        totalGain += diff;
      }

      // console.log("Elevation samples:", results);
      console.log("Elevation gain (m):", totalGain.toFixed(1));

      alert(
        `Elevation gain: ${totalGain.toFixed(1)} m`
      );

      return totalGain;
    }
  );
}
