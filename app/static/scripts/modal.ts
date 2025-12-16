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
    activity.addEventListener("click", createModal);

    const routeSelectField = document.getElementById("routes");
    routeSelectField.addEventListener('change', handleRouteSelection);

    const createButton = document.getElementById("post-button");
    createButton.addEventListener("click", createActivity);

});

async function createModal(){
    const startingModal = document.getElementById("formModal");
    const a = document.createElement("div");
    a.classList.add("modal-dialog");
    startingModal.appendChild(a);
    const b = document.createElement("div");
    b.classList.add("modal-content");
    a.appendChild(b);
    const c = document.createElement("div");
    c.classList.add("modal-header");
    b.appendChild(c);
    const d = document.createElement("h1");
    d.classList.add("modal-title");
    d.classList.add("fs-5");
    d.id = "formModalLabel";
    d.innerText = "Create Activity";
    c.appendChild(d);
    const e = document.createElement("button");
    e.type = "button";
    e.classList.add("btn-close");
    e.setAttribute("data-bs-dismiss", "modal");
    e.setAttribute("aria-label", "Cancel");
    c.append(e);
    //header is closed, last time to append to c
    const f = document.createElement("div");
    f.classList.add("modal-body");
    f.classList.add("text-align-center");
    b.appendChild(f);
    const g = document.createElement("div");
    g.id = "modal-inputs";
    f.appendChild(g);
    //Activity Title things
    const activityLabel = document.createElement("label");
    activityLabel.setAttribute("for", "title");
    activityLabel.classList.add("form-label");
    activityLabel.innerText = "Activity Title";
    g.appendChild(activityLabel);
    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.id = "title";
    titleInput.classList.add("form-control");
    g.appendChild(titleInput); 
    //Activity Type Things
    const typeLabel = document.createElement("label");
    typeLabel.setAttribute("for", "type");
    typeLabel.classList.add("form-label");
    typeLabel.innerText = "Activity Type";
    g.appendChild(typeLabel);
    const typeInput = document.createElement("select");
    titleInput.required;
    titleInput.id = "type";
    titleInput.classList.add("form-control");
    const opt1 = document.createElement("option");
    opt1.value = "";
    opt1.disabled;
    opt1.selected;
    opt1.innerText = "Select Activity Type";
    titleInput.appendChild(opt1);
    const opt2 = document.createElement("option");
    opt2.value = "Run";
    opt2.innerText = "Run";
    titleInput.appendChild(opt2);
    const opt3 = document.createElement("option");
    opt3.value = "Ride";
    opt3.innerText = "Ride";
    titleInput.appendChild(opt3);
    g.appendChild(typeInput); 
    //Route things
    const routeLabel = document.createElement("label");
    routeLabel.setAttribute("for", "routes");
    routeLabel.classList.add("form-label");
    routeLabel.innerText = "Route";
    g.appendChild(routeLabel);
    const routeInput = document.createElement("input");
    routeInput.id = "routes";
    routeInput.classList.add("form-control");
    g.appendChild(routeInput);

    //Time things
    const timeLabel = document.createElement("label");
    timeLabel.setAttribute("for", "start-time");
    timeLabel.classList.add("form-label");
    timeLabel.innerText = "StartTime";
    g.appendChild(timeLabel);
    const timeInput = document.createElement("input");
    timeInput.type = "datetime-local";
    routeInput.id = "start-time";
    routeInput.classList.add("form-control");
    g.appendChild(timeInput);

    //Duration things
    const durationLabel = document.createElement("label");
    durationLabel.setAttribute("for", "duration");
    durationLabel.classList.add("form-label");
    durationLabel.innerText = "Duration (minutes)";
    g.appendChild(durationLabel);
    const durationInput = document.createElement("input");
    durationInput.type = "number";
    durationInput.id = "duration";
    durationInput.classList.add("form-control");
    g.appendChild(durationInput);

    //Distance things
    const distanceLabel = document.createElement("label");
    distanceLabel.setAttribute("for", "distance");
    distanceLabel.classList.add("form-label");
    distanceLabel.innerText = "Distance (miles)";
    g.appendChild(distanceLabel);
    const distanceInput = document.createElement("input");
    durationInput.type = "number";
    durationInput.id = "distance";
    durationInput.classList.add("form-control");
    g.appendChild(distanceInput);

    //Footer - append to f
    const h = document.createElement("div");
    h.classList.add("modal-footer");
    f.appendChild(h);
    const i = document.createElement("button")
    i.type = "button";
    i.classList.add("btn");
    i.classList.add("btn-secondary");
    i.setAttribute("data-bs-dismiss","modal");
    i.innerText = "Close";
    h.appendChild(i);
    const j = document.createElement("button")
    j.type = "button";
    j.classList.add("btn");
    j.classList.add("btn-primary");
    j.id = "post-button";
    i.innerText = "Save Activity";
    h.appendChild(j);

    activateModal();
}

async function activateModal(){
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

        const routeDistanceMeters = route.distance;
        const routeDistanceMiles = routeDistanceMeters / 1609.34;

        console.log(`Route Distance: ${routeDistanceMiles}`);
        if (route){
            distanceField.disabled = true; 
            distanceField.value = routeDistanceMiles.toFixed(2);
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
    const distance = distanceElement.value;

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
        clearActivityForm();
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