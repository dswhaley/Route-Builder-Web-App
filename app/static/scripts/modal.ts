document.addEventListener("click", activateModal);

function activateModal(event: MouseEvent){
  
    const modal = <HTMLInputElement> document.getElementById("create-activity-modal");
    const modalInputsDiv = <HTMLElement> document.getElementById("modal-inputs");

    const routesResponse = await fetch(`/routes`);
}