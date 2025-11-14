let map;
async function initMap() {
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    const mapElement = document.getElementById("map");
    if (!mapElement) {
        console.error("Map container (#map) not found in DOM");
        return;
    }
    map = new Map(mapElement, {
        zoom: 4,
        center: { lat: -25.363882, lng: 131.044922 },
        mapId: "DEMO_MAP_ID",
    });
    map.addListener("click", (event) => {
        if (event.latLng) {
            placeMarkerAndPanTo(event.latLng, map, AdvancedMarkerElement);
        }
    });
    console.log("Map initialized and ready for clicks");
}
function placeMarkerAndPanTo(latLng, map, AdvancedMarkerElement) {
    new AdvancedMarkerElement({
        position: latLng,
        map: map,
        title: `Marker at ${latLng.toJSON()}`,
    });
    map.panTo(latLng);
    console.log("Marker placed and panned to:", latLng.toJSON());
}
document.addEventListener("DOMContentLoaded", () => {
    initMap().catch((err) => {
        console.error("Failed to initialize map:", err);
    });
});
