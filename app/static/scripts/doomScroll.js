document.addEventListener("DOMContentLoaded", async () => {
    const btn = document.getElementById("loadMore");
    btn.addEventListener("click", addMore);
});
function addMore() {
    const newActivities = document.getElementsByTagName("ol");
    const c = document.getElementById("card1");
    for (const a of newActivities) {
        let n = c.cloneNode();
        let d = helper(n, a);
        document.append(d);
    }
}
function helper(n, a) {
    n.innerText = a.innerText;
    return n;
}
