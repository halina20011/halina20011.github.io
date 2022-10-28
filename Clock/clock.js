let analog = document.getElementById("analog");
let digital = document.getElementById("digital");

document.addEventListener("click", () => {
    switchDisplay(analog);
    switchDisplay(digital);
    digitalClock();
}, false);

function switchDisplay(element){
    console.log(element.classList);
    element.classList.toggle("hidden");
}

function digitalClock() {
    let rtClock = new Date();

    let hours = rtClock.getHours();
    let minutes = rtClock.getMinutes();
    let seconds = rtClock.getSeconds();

    let amPm = ( hours < 12 ) ? "AM" : "PM";

    hours = (hours > 12) ? hours - 12 : hours;

    hours = ("0" + hours).slice(-2);
    minutes = ("0" + minutes).slice(-2);
    seconds = ("0" + seconds).slice(-2);

    document.getElementById('digitalClock').innerHTML = `${hours}  :  ${minutes}  :  ${seconds} ${amPm}`;
    setTimeout(digitalClock, 500);
}

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
    setTimeout(analogClock, 200);
}

digitalClock();
analogClock();