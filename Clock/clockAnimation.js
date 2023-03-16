function analogClock(){
    let arrowHours = document.getElementsByClassName("arrowHours")[0];
    let arrowMinutes = document.getElementsByClassName("arrowMinutes")[0];
    let arrowSeconds = document.getElementsByClassName("arrowSeconds")[0];

    let date = new Date();
    
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    
    hours = (12 < hours) ? hours - 12 : hours;
    
    // degree/minutes => 360 / 60 => 6
    // degree/hours   => 360 / 12 = 30
    let minutesArrowRotation = minutes * 6;
    let hoursArrowRotation = hours * 30 + minutes * 0.5;
    let secondsArrowRotation = seconds * 6;

    // console.log(hours, minutes);
    // console.log(hoursArrowRotation, minutesArrowRotation);

    arrowHours.style.transform = "rotate(" + hoursArrowRotation +"deg)";
    arrowMinutes.style.transform = "rotate(" + minutesArrowRotation +"deg)";
    arrowSeconds.style.transform = "rotate(" + secondsArrowRotation +"deg)";
}

analogClock();
