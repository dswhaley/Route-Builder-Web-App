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
    const imagePreview = document.getElementById("route-image-preview");
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
        const selectedOption = routeSelect.options[routeSelect.selectedIndex];
        const imgUrl = selectedOption.getAttribute("data-image");
        if (imgUrl && selected !== "") {
            imagePreview.src = imgUrl;
            imagePreview.style.display = "block";
        }
        else {
            imagePreview.style.display = "none";
        }
    });
});
