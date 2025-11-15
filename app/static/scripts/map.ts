/// <reference types="@types/google.maps" />

let map: google.maps.Map;

async function initMap(): Promise<void> {
  const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;



  const mapElement = document.getElementById("map");
  if (!mapElement) {
    console.error("Map container (#map) not found in DOM");
    return;
  }

  map = new Map(mapElement, {
    zoom: 14,
    center: { lat: 41.1573, lng: -80.0881 }, // Grove City
    mapId: "DEMO_MAP_ID",
  });

  map.addListener("click", (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      placeMarkerAndPanTo(event.latLng, map, AdvancedMarkerElement);
    }
  });

  console.log("Map initialized");
}

function placeMarkerAndPanTo(
  latLng: google.maps.LatLng,
  map: google.maps.Map,
  AdvancedMarkerElement: typeof google.maps.marker.AdvancedMarkerElement
): void {
  new AdvancedMarkerElement({
    position: latLng,
    map,
  });

  map.panTo(latLng);
}


document.addEventListener("DOMContentLoaded", () => {
  initMap().catch((err) => console.error("Failed to initialize map:", err));
});
