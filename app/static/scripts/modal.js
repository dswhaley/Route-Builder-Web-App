import { addMore } from "./doomScroll.js";
document.addEventListener("DOMContentLoaded", async () => {
    const activity = document.getElementById("activity-button");
    activity.addEventListener("click", activateModal);
    const routeSelectField = document.getElementById("routes");
    routeSelectField.addEventListener('change', handleRouteSelection);
    const createButton = document.getElementById("post-button");
    createButton.addEventListener("click", createActivity);
});
async function activateModal(event) {
    clearActivityForm();
    const modal = document.getElementById("create-activity-modal");
    const modalInputsDiv = document.getElementById("modal-inputs");
    const routesResponse = await fetch("/routes_json");
    console.log(routesResponse);
    const routeList = await validateJSON(routesResponse);
    const routesArray = routeList;
    const routeSelectField = document.getElementById("routes");
    routeSelectField.innerHTML = '';
    const option = document.createElement("option");
    option.value = "0";
    option.textContent = "";
    routeSelectField.appendChild(option);
    for (let route of routesArray) {
        const option = document.createElement("option");
        option.value = route.rid.toString();
        option.textContent = route.route_name;
        routeSelectField.appendChild(option);
    }
}
async function handleRouteSelection(event) {
    const selectElement = event.currentTarget;
    const routeId = selectElement.value;
    const distanceField = document.getElementById("distance");
    if (routeId == "0") {
        distanceField.disabled = false;
        distanceField.value = "0";
    }
    else {
        const routeResponse = await fetch(`/routes_json/${routeId}`);
        const route = await validateJSON(routeResponse);
        const routeDistanceMeters = route.distance;
        const routeDistanceMiles = routeDistanceMeters / 1609.34;
        console.log(`Route Distance: ${routeDistanceMiles}`);
        if (route) {
            distanceField.disabled = true;
            distanceField.value = routeDistanceMiles.toFixed(2);
        }
    }
}
async function createActivity() {
    const currentUserDiv = document.getElementById("currentUser");
    const currentUser = Number(currentUserDiv.innerText);
    let usingRoute = false;
    let canPost = true;
    const ridElement = document.getElementById("routes");
    const rid = ridElement.value;
    if (rid != "0") {
        usingRoute = true;
    }
    const titleElement = document.getElementById("title");
    const title = titleElement.value;
    if (!title) {
        alert("Title");
    }
    const typeElement = document.getElementById("type");
    const type = typeElement.value;
    if (!type) {
        alert("Activity Type Required");
        canPost = false;
    }
    const timeElement = document.getElementById("start-time");
    const time = timeElement.value;
    if (!time) {
        alert("Start Time Required");
        canPost = false;
    }
    const durationElement = document.getElementById("duration");
    const duration = durationElement.value;
    if (!duration) {
        alert("Duration Required");
        canPost = false;
    }
    const distanceElement = document.getElementById("distance");
    const distance = distanceElement.value;
    if (!distance) {
        alert("Distance Required");
        canPost = false;
    }
    let body = '';
    if (canPost) {
        if (usingRoute) {
            body = JSON.stringify({
                user_id: currentUser,
                route_id: rid,
                title: title,
                type: type,
                start_time: time,
                duration: duration,
                distance: distance
            });
        }
        else {
            body = JSON.stringify({
                user_id: currentUser,
                title: title,
                type: type,
                start_time: time,
                duration: duration,
                distance: distance
            });
        }
        const response = await fetch("/create_activity/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: body
        });
        const activity = await validateJSON(response);
        alert("Activity was created");
        reloadActivities();
        clearActivityForm();
    }
}
function reloadActivities() {
    const masterDiv = document.getElementById("box");
    const row = document.getElementById("row");
    row.remove();
    const newRow = document.createElement("div");
    newRow.setAttribute("class", "row align-items-center justify-content-left");
    newRow.setAttribute("id", "row");
    masterDiv.appendChild(newRow);
    addMore();
}
function validateJSON(response) {
    if (response.ok) {
        return response.json();
    }
    else {
        return Promise.reject(response);
    }
}
function clearActivityForm() {
    document.getElementById("title").value = "";
    document.getElementById("type").value = "";
    document.getElementById("start-time").value = "";
    document.getElementById("duration").value = "";
    document.getElementById("distance").value = "";
    document.getElementById("routes").value = "0";
    document.getElementById("distance").disabled = false;
}
