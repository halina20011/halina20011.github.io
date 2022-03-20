var arrow1 = document.getElementsByClassName("clockArrow1")[0]
var arrow2 = document.getElementsByClassName("clockArrow2")[0]

getTime()
function getTime(){
    var rtClock = new Date();

    var hours = rtClock.getHours();
    var minutes = rtClock.getMinutes();
    // var seconds = rtClock.getSeconds();

    hours = (hours > 12) ? hours - 12 : hours;
    rotationArrow_1 = minutes * 6
    rotationArrow_2 = hours * 30
    rotationArrow_2 += rotationArrow_1 * 0.06
    setRotatins(rotationArrow_1, rotationArrow_2)
}
function setRotatins(rot1, rot2){
    arrow1.style.transform = "rotate(" + rot1 +"deg)";
    arrow2.style.transform = "rotate(" + rot2 +"deg)";
}