1. // @ts-ignore
async function deleteActivity(aid: string | number) {
    const response = await fetch(`/api/activities/${aid}`, {
        method: "DELETE"
    });

    if(response.status === 404){
        alert("Activity doesn't exist");
    } else if (response.status === 401) {
        alert("You are not authorized to delete this activity.");
    } else {
        const card = document.getElementById(`activity-${aid}`);

        if (card){
            card.remove();
        }
        window.location.reload();
    }
};