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
    d.innerText = a.title;
    c.appendChild(d);
    let y = document.createElement("div");
    y.classList.add("card-body");
    c.appendChild(y);
    let z = document.createElement("h1");
    z.classList.add("card-title");
    z.innerText = a.distance + "mi " + a.duration_minute + "min";
    y.appendChild(z);
    if (a.route_id != null) {
        let e = document.createElement("img");
        e.src = "/static/route_images/" + a.route_id + ".png";
        e.alt = "Route-" + a.route_id + "-Map";
        e.classList.add("route-img");
        e.id = "routePic";
        y.appendChild(e);
    }
    let f = document.createElement("button");
    f.id = "delete";
    f.innerText = "Delete Activity";
    y.appendChild(f);
    return n;
}
function vJSON(response) {
    if (response.ok) {
        return response.json();
    }
    else {
        return Promise.reject(response);
    }
}
