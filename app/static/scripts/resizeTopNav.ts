function resize(){
    const x = document.getElementById("myTopNav");
    if(!x.classList.contains("responsive")){
        x.classList.add("responsive");
        
    }
    else{
        x.classList.remove("responsive");
    }


}