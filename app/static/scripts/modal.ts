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
const activityLink = document.getElementById("activity-button")
activityLink.addEventListener("click", activateModal);

async function activateModal(event: MouseEvent){
  
    const modal = <HTMLInputElement> document.getElementById("create-activity-modal");
    const modalInputsDiv = <HTMLElement> document.getElementById("modal-inputs");

    const routesResponse = await fetch("/routes_json");
    const routes = await validateJSON(routesResponse);

    const routeSelectField = document.getElementById("routes");

    for(let route of routes){
        const option = document.createElement("option");
        option.value = route.route_name;
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