export interface Routes {
    "coord_string": string,
    "distance": number,
    "image_name": string,
    "rid": number,
    "route_name": string
}

export interface RouteList{
    data: undefined | {routes: Array<Routes>};
}
const modalElement = document.getElementById("formModal");
modalElement.addEventListener('show.bs.modal', activateModal);

async function activateModal(event: MouseEvent){
  
    const modal = <HTMLInputElement> document.getElementById("create-activity-modal");
    const modalInputsDiv = <HTMLElement> document.getElementById("modal-inputs");

    console.log("Pre-Fetch");
    const routesResponse = await fetch("/routes_json");
    console.log("Post-Fetch");

    console.log(routesResponse);
    const routeList = await validateJSON(routesResponse) as RouteList;
    const routesArray = routeList.data.routes    
    const routeSelectField = document.getElementById("routes");
    routeSelectField.innerHTML = '';

    for(let route of routesArray){
        const option = document.createElement("option");
        option.value = route.rid.toString();
        option.textContent = route.route_name;
        routeSelectField.appendChild(option);

    }



}




function validateJSON(response: Response) {
    if (response.ok) {
        return response.json();
    } else {
        return Promise.reject(response);
    }
}