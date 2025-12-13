document.addEventListener("click", activateModal);
async function activateModal(event) {
    const modal = document.getElementById("create-activity-modal");
    const modalInputsDiv = document.getElementById("modal-inputs");
    const routesResponse = await fetch("/routes");
    const routes = validateJSON(routesResponse);
}
function validateJSON(response) {
    if (response.ok) {
        return response.json();
    }
    else {
        return Promise.reject(response);
    }
}
