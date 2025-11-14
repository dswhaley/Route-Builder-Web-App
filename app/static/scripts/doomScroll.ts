document.addEventListener("DOMContentLoaded", async () => {
    // find the button and add an event listener
    const btn: HTMLButtonElement = <HTMLButtonElement> document.getElementById("loadMore");
    btn.addEventListener("click", addMore);
    
});

function addMore(){
    const newActivities = document.getElementsByTagName("ol");
    //loop through the new activites
    const c = <HTMLDivElement> document.getElementById("card1");
    for(const a of newActivities){
        let n = <HTMLDivElement> c.cloneNode();
        let d = helper(n, a);
        document.append(d);
    }
    
    
    //helper function to create a div with all the information
    //update the page with the new div
}

function helper(n : HTMLDivElement, a: HTMLOListElement){
    n.innerText = a.innerText
    return n;
}