interface Activity {
    aid: number;
    user_id: number;
    route_id: number
    title: string;
    description: string;
    start_time: number;
    type: string;
    distance: number;
    duration_minute: number;
    image_name: string;
    user: number;
    route: number;
}
interface ActivityList{
    activites: Array<Activity>
}

document.addEventListener("DOMContentLoaded", async () => {
    // find the button and add an event listener
    console.log("begining");
    const btn: HTMLButtonElement = <HTMLButtonElement> document.getElementById("loadMore");
    btn.addEventListener("click", addMore);
    //check with Daniel abt integrating the delete button
    //const d: HTMLButtonElement = <HTMLButtonElement> document.getElementById("");
    //d.addEventListener("click", deleteActivity);
    
    
});

async function addMore(){
    const url = "/home3/";//create a route that returns the activities
    const newActivities = await fetch(url);
    const response = <ActivityList> await validateJSON(newActivities);
    //loop through the new activites
    //const c = <HTMLDivElement> document.getElementById("card1");
    const i = document.getElementById("row");
    console.log("hello");
    for(const a of response.activites){
        console.log("a");
        let n= document.createElement("div");
        let d = helper(n, a);
        i.append(d);
    }
    
    
    //helper function to create a div with all the information
    //update the page with the new div
}

function helper(n : HTMLDivElement, a: Activity){
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
    let d = document.createElement("div")
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
    f.innerText = "Delete Activity"
    b.appendChild(f);
    return n;
}

function validateJSON(response: Response) {
    if (response.ok) {
        return response.json();
    } else {
        return Promise.reject(response);
    }
}