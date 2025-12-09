interface Activity {
    title: string;
    distance: number;
    duration_minute: number;
}

document.addEventListener("DOMContentLoaded", async () => {
    // find the button and add an event listener
    const btn: HTMLButtonElement = <HTMLButtonElement> document.getElementById("loadMore");
    btn.addEventListener("click", addMore);
    
});

function addMore(){
    const newActivities = document.getElementsByTagName("ol");
    //loop through the new activites
    const c = <HTMLDivElement> document.getElementById("card1");
    const i = document.getElementById("row");
    for(const a of newActivities){
        let n= document.createElement("div");
        let d = helper(n, a);
        i.append(d);
    }
    
    
    //helper function to create a div with all the information
    //update the page with the new div
}

function helper(n : HTMLDivElement, a: HTMLOListElement){
    n.classList.add("col-sm-12 col-md-6 col-lg-6 col-xl-4");
    let b = document.createElement("div");
    b.classList.add("cardEx");
    n.appendChild(b);
    let c = document.createElement("div");
    c.classList.add("card");
    c.classList.add("text-center");
    b.appendChild(c);
    let d = document.createElement("div")
    d.classList.add("card-header");
    return n;
}