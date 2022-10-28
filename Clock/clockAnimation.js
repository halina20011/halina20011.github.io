function analogClock(){
    let arrowHours = document.getElementsByClassName("arrowHours")[0];
    let arrowMinutes = document.getElementsByClassName("arrowMinutes")[0];
    let arrowSeconds = document.getElementsByClassName("arrowSeconds")[0];

    let rtClock = new Date();
    
    let hours = rtClock.getHours();
    let minutes = rtClock.getMinutes();
    let seconds = rtClock.getSeconds();
    
    hours = (hours > 12) ? hours - 12 : hours;
    hoursArrowRotation = minutes * 6;
    minutesArrowRotation = hours * 30 + hoursArrowRotation * 0.06;
    secondsArrowRotation = seconds * 6;
    
    arrowHours.style.transform = "rotate(" + hoursArrowRotation +"deg)";
    arrowMinutes.style.transform = "rotate(" + minutesArrowRotation +"deg)";
    arrowSeconds.style.transform = "rotate(" + secondsArrowRotation +"deg)";
}

analogClock();