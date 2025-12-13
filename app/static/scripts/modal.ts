document.addEventListener("click", activateModal);

async function activateModal(event: MouseEvent){
  
    const modal = <HTMLInputElement> document.getElementById("create-activity-modal");
    const modalInputsDiv = <HTMLElement> document.getElementById("modal-inputs");

    const routesResponse = await fetch("/routes");
    const routes = validateJSON(routesResponse);


}




function validateJSON(response: Response) {
    if (response.ok) {
        return response.json();
    } else {
        return Promise.reject(response);
    }
}