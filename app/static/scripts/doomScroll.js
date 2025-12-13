document.addEventListener("DOMContentLoaded", async () => {
    console.log("begining");
    const btn = document.getElementById("loadMore");
    btn.addEventListener("click", addMore);
});
async function addMore() {
    const url = "/home3/";
    const newActivities = await fetch(url);
    const response = await validateJSON(newActivities);
    const i = document.getElementById("row");
    console.log("hello");
    for (const a of response.activites) {
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
    n.appendChild(b);
    let c = document.createElement("div");
    c.classList.add("card");
    c.classList.add("text-center");
    b.appendChild(c);
    let d = document.createElement("div");
    d.classList.add("card-header");
    d.innerText = a.title;
    b.appendChild(d);
    let z = document.createElement("h1");
    z.classList.add("card-title");
    z.innerText = a.distance + "mi " + a.duration_minute + "min";
    b.appendChild(z);
    let e = document.createElement("img");
    e.src = "/static/route_images/" + a.image_name + ".png";
    b.appendChild(e);
    let f = document.createElement("button");
    f.id = "delete";
    f.innerText = "Delete Activity";
    b.appendChild(f);
    return n;
}
function validateJSON(response) {
    if (response.ok) {
        return response.json();
    }
    else {
        return Promise.reject(response);
    }
}
