var column_up = document.getElementById("column-up");
var column_display = document.getElementById("column-display");

window.addEventListener('scroll', function(event) {scroll(event);}, false );

var newValue = 0;
var oldValue = 0;
function scroll(event){
    newValue = window.pageYOffset;
    if(oldValue > newValue){
        moveHead("Up");
    }
    else{
        moveHead("Down")
    }
    oldValue = newValue;
}

// var column_display;
// var column_left;

function moveHead(direction){
    var position = column_up.getBoundingClientRect();
    var topPosition = toPercentage(position.top, "height");
    // console.log(position)
    console.log("direction: " + direction + "  " + topPosition);
    if(direction == "Down" && topPosition == 0){ 
        // console.log("Down");
        column_up.classList.add("collapsedColumnUp");
        column_display.classList.add("collapsedColumnMiddle");
        // moveTopObject(column_up, 0, -2, 30, "vw")
    }
    else if(direction == "Up" && topPosition != 0){
        // console.log("Up");
        column_up.classList.remove("collapsedColumnUp");
        column_display.classList.remove("collapsedColumnMiddle");
        // moveTopObject(column_up, -2, 0, 30, "vw")
    }
    // console.log(topPosition);
}

function moveTopObject(_el, _start, _stop, _time, _units){
    _el.animate([{ top: _start+_units}, { top: _stop + _units}], _time).onfinish = function(){
        _el.style.top = _stop + _units; // block the element transition to the '_stop' position
    };
}

function toPercentage(element, type = "width"){
    var width = 0;
    if(type == "width"){
        width = window.document.documentElement.clientWidth;
    }
    else{
        width = window.document.documentElement.clientHeight;
    }
    var elementPosition = element;
    // console.log(element)
    var valueInPercentege = Math.round(elementPosition / width * 100);
    return valueInPercentege;
}