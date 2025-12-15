const modalElement = document.getElementById("formModal");
modalElement.addEventListener('show.bs.modal', activateModal);
async function activateModal(event) {
    const modal = document.getElementById("create-activity-modal");
    const modalInputsDiv = document.getElementById("modal-inputs");
    console.log("Pre-Fetch");
    const routesResponse = await fetch("/routes_json");
    console.log("Post-Fetch");
    console.log(routesResponse);
    const routes = await validateJSON(routesResponse);
    console.log(routes);
    const routeSelectField = document.getElementById("routes");
    routeSelectField.innerHTML = '';
    for (let route of routes.data) {
        const option = document.createElement("option");
        option.value = route.rid.toString();
        option.textContent = route.route_name;
        routeSelectField.appendChild(option);
    }
}
function validateJSON(response) {
    if (response.ok) {
        return response.json();
    }
    else {
        return Promise.reject(response);
    }
}
export {};
