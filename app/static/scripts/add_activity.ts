document.addEventListener("DOMContentLoaded", () => {
    const routeSelect = document.getElementById("route") as HTMLSelectElement;
    const distanceInput = document.getElementById("distance") as HTMLInputElement;

    const routeData: Record<string, number> = {};

    // read data-distance attributes from the <option> elements
    for (const option of Array.from(routeSelect.options)) {
        const distanceAttr = option.getAttribute("data-distance");
        if (distanceAttr) {
            routeData[option.value] = parseFloat(distanceAttr);
        }
    }

    routeSelect.addEventListener("change", () => {
        const selected = routeSelect.value;

        // If "-- None --" is selected
        if (selected === "") {
            distanceInput.value = "";
            distanceInput.readOnly = false;
            return;
        }

        // Auto-fill and lock distance
        const distance = routeData[selected];
        if (distance !== undefined) {
            distanceInput.value = distance.toString();
            distanceInput.readOnly = true;
        }
    });
});