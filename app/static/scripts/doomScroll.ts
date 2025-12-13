namespace ActivityAPI{
export interface Activity {
    aid: number;
    description?: string;
    distance: number;
    duration_minute: number;
    route_id?: number;
    start_time: number;
    title: string;
    type: string;
    
}

}
document.addEventListener("DOMContentLoaded", async () => {
    // find the button and add an event listener
    console.log("begining");
    addMore();
    // const btn: HTMLButtonElement = <HTMLButtonElement> document.getElementById("loadMore");
    // btn.addEventListener("click", addMore);
    //check with Daniel abt integrating the delete button
    //const d: HTMLButtonElement = <HTMLButtonElement> document.getElementById("");
    //d.addEventListener("click", deleteActivity);
    
    
});

async function addMore(){
    const url = "/activity_json";//create a route that returns the activities
    const newActivities = await fetch(url);
    const response = await vJSON(newActivities);
    //loop through the new activites
    //console.log(response.activities);
    const i = document.getElementById("row");
    console.log("hello");
    for(const a of response){
        console.log("a");
        let n= document.createElement("div");
        let d = helper(n, a);
        i.append(d);
    }
    
    
    //helper function to create a div with all the information
    //update the page with the new div
}

function helper(n : HTMLDivElement, a: ActivityAPI.Activity){
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
    let d = document.createElement("div")
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
    if(a.route_id != null){
    let e = document.createElement("img");
    e.src = "/static/route_images/" + a.route_id + ".png";
    e.alt = "Route-" + a.route_id + "-Map";
    e.classList.add("route-img");
    e.id = "routePic";
    y.appendChild(e);
    }
    let f = document.createElement("button");
    f.id = "delete";
    f.innerText = "Delete Activity"
    y.appendChild(f);
    return n;
}

function vJSON(response: Response) {
    if (response.ok) {
        return response.json();
    } else {
        return Promise.reject(response);
    }
}