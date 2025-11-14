document.addEventListener("DOMContentLoaded", async () => {
    const btn = document.getElementById("loadMore");
    btn.addEventListener("click", addMore);
});
function addMore() {
    const c = document.getElementById("card1");
    let n = c?.cloneNode();
}
