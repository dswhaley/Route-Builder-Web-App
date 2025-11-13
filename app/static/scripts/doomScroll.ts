document.addEventListener("DOMContentLoaded", async () => {
    // find the button and add an event listener
    const btn: HTMLButtonElement = <HTMLButtonElement> document.getElementById("loadMore");
    btn.addEventListener("click", addMore);
    // load three more activites
});

function addMore(){
    //loop through the new activites
    const c = document.getElementById("card1");
    let n = c?.cloneNode();
    //helper();
    //helper function to create a div with all the information
    //update the page with the new div
}

// function helper(){

// return n;
// }