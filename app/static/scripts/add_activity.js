document.addEventListener("DOMContentLoaded", () => {
    const routeSelect = document.getElementById("route");
    const distanceInput = document.getElementById("distance");
    const routeData = {};
    for (const option of Array.from(routeSelect.options)) {
        const distanceAttr = option.getAttribute("data-distance");
        if (distanceAttr) {
            routeData[option.value] = parseFloat(distanceAttr);
        }
    }
    routeSelect.addEventListener("change", () => {
        const selected = routeSelect.value;
        if (selected === "") {
            distanceInput.value = "";
            distanceInput.readOnly = false;
            return;
        }
        const distance = routeData[selected];
        if (distance !== undefined) {
            distanceInput.value = distance.toString();
            distanceInput.readOnly = true;
        }
    });
});
