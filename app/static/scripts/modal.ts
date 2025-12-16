import {addMore} from "./doomScroll.js";
namespace RouteManager{
    export interface Route {
        "coord_string": string,
        "distance": number,
        "image_name": string,
        "rid": number,
        "route_name": string
    }

export type RouteList = Array<Route>;
}

document.addEventListener("DOMContentLoaded", async () => {
    // const modalElement = document.getElementById("formModal");
    // modalElement.addEventListener('show.bs.modal', activateModal);
    const activity = document.getElementById("activity-button");
    activity.addEventListener("click", activateModal);

    const routeSelectField = document.getElementById("routes");
    routeSelectField.addEventListener('change', handleRouteSelection);

    const createButton = document.getElementById("post-button");
    createButton.addEventListener("click", createActivity);

});


async function activateModal(event: MouseEvent){
    clearActivityForm();
    
    const modal = <HTMLInputElement> document.getElementById("create-activity-modal");
    const modalInputsDiv = <HTMLElement> document.getElementById("modal-inputs");
    
    const routesResponse = await fetch("/routes_json");

    console.log(routesResponse);
    const routeList = <RouteManager.RouteList> await validateJSON(routesResponse);
    const routesArray = routeList;
    const routeSelectField = document.getElementById("routes");

    routeSelectField.innerHTML = '';
    const option = document.createElement("option");
    option.value = "0";
    option.textContent = "";
    routeSelectField.appendChild(option);



    for(let route of routesArray){
        const option = document.createElement("option");
        option.value = route.rid.toString();
        option.textContent = route.route_name;
        routeSelectField.appendChild(option);

    }
}


async function handleRouteSelection(event: Event){
    const selectElement = <HTMLSelectElement>event.currentTarget;
    const routeId = selectElement.value;
    const distanceField = <HTMLInputElement>document.getElementById("distance");

    if(routeId == "0"){
        distanceField.disabled = false;
        distanceField.value = "0";
    } else {
        const routeResponse =  await fetch(`/routes_json/${routeId}`);
        const route = <RouteManager.Route> await validateJSON(routeResponse);

        const routeDistance = route.distance;

        console.log(`Route Distance: ${routeDistance}`);
        if (route){
            distanceField.disabled = true; 
            distanceField.value = routeDistance.toString();
        }
    }
}

async function createActivity(){
    const currentUserDiv = document.getElementById("currentUser");
    const currentUser = Number(currentUserDiv.innerText);

    let usingRoute = false;
    let canPost = true;

    const ridElement = <HTMLSelectElement> document.getElementById("routes");
    const rid = ridElement.value;
    if(rid != "0"){
        usingRoute = true;
    }

    const titleElement = <HTMLInputElement>document.getElementById("title");
    const title = titleElement.value;

    if(!title){
        alert("Title");
    }

    const typeElement = <HTMLInputElement> document.getElementById("type");
    const type = typeElement.value;
    if(!type){
        alert("Activity Type Required");
        canPost = false;
    }

    const timeElement = <HTMLInputElement> document.getElementById("start-time");
    const time = timeElement.value;

    if(!time){
        alert("Start Time Required");
        canPost = false;

    }

    const durationElement = <HTMLInputElement> document.getElementById("duration");
    const duration = durationElement.value;

    if(!duration){
        alert("Duration Required");
        canPost = false;
    }

    const distanceElement = <HTMLInputElement> document.getElementById("distance");
    const distance = durationElement.value;

    if(!distance){
        alert("Distance Required");
        canPost = false;
    }

    let body = '';
    if(canPost){
        if(usingRoute){
            body = JSON.stringify({
                user_id: currentUser,
                route_id: rid,
                title: title,
                type: type,
                start_time: time,
                duration: duration,
                distance: distance
            });
        } else {
            body = JSON.stringify({
                user_id: currentUser,
                title: title,
                type: type,
                start_time: time,
                duration: duration,
                distance: distance
            });
        }

        const response = await fetch ("/create_activity/",{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: body 
        }); 

        const activity = await validateJSON(response);

        alert("Activity was created")
        reloadActivities();

    }   

}

function reloadActivities(){
    const masterDiv = document.getElementById("box");
    const row = document.getElementById("row");
    row.remove();

    const newRow = document.createElement("div");

    newRow.setAttribute("class", "row align-items-center justify-content-left");
    newRow.setAttribute("id", "row");
    masterDiv.appendChild(newRow);
    addMore();
}

function validateJSON(response: Response) {
    if (response.ok) {
        return response.json();
    } else {
        return Promise.reject(response);
    }
}

function clearActivityForm() {
    (document.getElementById("title") as HTMLInputElement).value = "";
    (document.getElementById("type") as HTMLInputElement).value = "";
    (document.getElementById("start-time") as HTMLInputElement).value = "";
    (document.getElementById("duration") as HTMLInputElement).value = "";
    (document.getElementById("distance") as HTMLInputElement).value = "";
    (document.getElementById("routes") as HTMLSelectElement).value = "0";
    (document.getElementById("distance") as HTMLInputElement).disabled = false;
}