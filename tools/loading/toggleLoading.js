export function startLoadingAnimation(){
    document.getElementById("loadingScreen").style.display = "flex";
    for(var i = 1; i <= 3; i++){
        document.getElementById(`loadingDot${i}`).classList.add(`loadingDot${i}`);
    }
}

export function stopLoadingAnimation(){
    document.getElementById("loadingScreen").style.display = "none";
    for(var i = 1; i <= 3; i++){
        document.getElementById(`loadingDot${i}`).classList.remove(`loadingDot${i}`);
    }
}