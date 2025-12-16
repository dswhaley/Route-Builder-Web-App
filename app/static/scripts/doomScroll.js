var ActivityAPI;
(function (ActivityAPI) {
})(ActivityAPI || (ActivityAPI = {}));
document.addEventListener("DOMContentLoaded", async () => {
    console.log("begining");
    addMore();
});
async function addMore() {
    const url = "/activity_json";
    const newActivities = await fetch(url);
    const response = await vJSON(newActivities);
    const i = document.getElementById("row");
    console.log("hello");
    for (const a of response) {
        console.log("a");
        let n = document.createElement("div");
        let d = helper(n, a);
        i.append(d);
    }
}
function helper(n, a) {
    const id = document.getElementById("currentUser");
    const numId = Number(id.innerText);
    const admin = document.getElementById("isAdmin");
    const numAdmin = Number(admin.innerText);
    n.classList.add("col-sm-12");
    n.classList.add("col-md-6");
    n.classList.add("col-lg-6");
    n.classList.add("col-xl-4");
    let b = document.createElement("div");
    b.classList.add("cardEx");
    b.id = "card1";
    n.appendChild(b);
    let c = document.createElement("div");
    c.classList.add("card");
    c.classList.add("text-center");
    b.appendChild(c);
    let d = document.createElement("div");
    d.classList.add("card-header");
    d.innerText = a.username + "'s " + a.title;
    c.appendChild(d);
    let y = document.createElement("div");
    y.classList.add("card-body");
    c.appendChild(y);
    let z = document.createElement("h1");
    z.classList.add("card-title");
    z.innerText = a.distance + "mi " + a.duration_minute + "min";
    y.appendChild(z);
    let x = document.createElement("div");
    x.innerText = a.description;
    y.appendChild(x);
    if (a.route_id != null) {
        let e = document.createElement("img");
        e.src = "/static/route_images/" + a.route_id + ".png";
        e.alt = "Route-" + a.route_id + "-Map";
        e.classList.add("route-img");
        e.id = "routePic";
        y.appendChild(e);
    }
    if (numId === a.user_id || numAdmin === 1) {
        let f = document.createElement("button");
        f.id = a.aid.toString();
        f.innerText = "Delete Activity";
        f.onclick = () => { deleteActivity(a.aid); };
        y.appendChild(f);
    }
    return n;
}
async function deleteActivity(aid) {
    const response = await fetch(`/api/activities/${aid}`, {
        method: "DELETE"
    });
    if (response.status === 404) {
        alert("Activity doesn't exist");
    }
    else if (response.status === 401) {
        alert("You are not authorized to delete this activity.");
    }
    else {
        const card = document.getElementById(`activity-${aid}`);
        if (card) {
            card.remove();
        }
        window.location.reload();
    }
}
function vJSON(response) {
    if (response.ok) {
        return response.json();
    }
    else {
        return Promise.reject(response);
    }
}
