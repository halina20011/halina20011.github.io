var column_up = document.getElementById("column-up");
var column_display = document.getElementById("column-display");
var table = document.getElementById("table");

window.addEventListener('scroll', function(event) {scroll(event);}, false );

var newValue = 0;
var oldValue = 0;

function scroll(){
    newValue = window.pageYOffset;
    // console.log("MOVE");
    if(oldValue > newValue){
        moveHead("Up");
    }
    else{
        moveHead("Down")
    }
    oldValue = newValue;
}

function moveHead(direction){
    // var position = document.body.getBoundingClientRect();
    // var topPosition = toPercentage(position.top, "height");
    if(direction == "Down"){ 
        column_up.style.top = "-4vh";
        if(table) table.style.top = "4vh";
    } 
    else if(direction == "Up"){
        column_up.style.top = "0vh";
        if(table) table.style.top = "8vh";
    }
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