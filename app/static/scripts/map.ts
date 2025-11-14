// map.ts
/// <reference types="@types/google.maps" />

let map: google.maps.Map;

async function initMap(): Promise<void> {
  // Import required libraries
  const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

  const mapElement = document.getElementById("map");
  if (!mapElement) {
    console.error("Map container (#map) not found in DOM");
    return;
  }

  // Initialize the map
  map = new Map(mapElement, {
    zoom: 4,
    center: { lat: -25.363882, lng: 131.044922 },
    mapId: "DEMO_MAP_ID", // Required for Advanced Markers
  });

  // Add click listener to place marker
  map.addListener("click", (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      placeMarkerAndPanTo(event.latLng, map, AdvancedMarkerElement);
    }
  });

  console.log("Map initialized and ready for clicks");
}

function placeMarkerAndPanTo(
  latLng: google.maps.LatLng,
  map: google.maps.Map,
  AdvancedMarkerElement: typeof google.maps.marker.AdvancedMarkerElement
): void {
  // Create and place the advanced marker
  new AdvancedMarkerElement({
    position: latLng,
    map: map,
    title: `Marker at ${latLng.toJSON()}`,
  });

  // Pan the map to the clicked location
  map.panTo(latLng);

  console.log("Marker placed and panned to:", latLng.toJSON());
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  initMap().catch((err) => {
    console.error("Failed to initialize map:", err);
  });
});