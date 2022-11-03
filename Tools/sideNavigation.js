const sideNavigation = document.getElementsByClassName("dropdown");

var sideNavigationOpened = false;

function nav(){
    if(sideNavigationOpened == false){
        console.log("Open " + sideNavigationOpened);
        openNav();
        sideNavigationOpened = !sideNavigationOpened;
    }
    else if(sideNavigationOpened == true){
        console.log("Close " + sideNavigationOpened);
        closeNav();
        sideNavigationOpened = !sideNavigationOpened;
    }
}

var column_middle = document.getElementById("columnMiddle");
var column_left = document.getElementById("columnLeft");
var progress = document.getElementsByClassName("progress")[0];
var dropdown = document.getElementById("dropdown");
var textInfo = document.getElementById("textInfo");
var info = document.getElementById("info");
var extend_reduceButton = document.getElementById("extend-reduceButton");

function openNav(){
    // console.log("Open")
    getElements();
    var left = 20;
    var middle = 75;

    var column_middleWidth = getPrecentWidth(column_middle);
    var column_leftWidth = getPrecentWidth(column_left);

    rotateObject(document.getElementById("extend-reduceButton"), 0, 90, 300, "deg");
    column_left.style.display = "block";
    scaleWidthObject(column_left, column_leftWidth, left, 300);
    return
    // if(window.screen.width < 1026){
    //     middle = 100;
    //     left = 10;
    //     column_left.style.position = "absolute";
    // }
    

    // textInfo.style.display = "block";
    // dropdown.style.display = "block";
    // dropdown.style.width = "fit-content";
    // dropdown.style.height = "fit-content";
    
    // info.style.display = "none";
    // info.style.width = "0px";
    // info.style.height = "0px";
    
    // scaleWidthObject(column_middle, column_middleWidth, middle, 300);
    // scaleWidthObject(progress, column_middleWidth, middle, 300);
    
    // scaleWidthObject(textInfo, column_leftWidth, 6, 300, "vw");
    // moveXObject(progress, column_leftWidth, left, 300)

    // showClass(sideNavigation);
}

function closeNav(){
    // console.log("Close")
    getElements();
    var left = 0;
    var middle = 80;
    
    var column_middleWidth = getPrecentWidth(column_middle);
    var column_leftWidth = getPrecentWidth(column_left);
    
    rotateObject(document.getElementById("extend-reduceButton"), 90, 0, 300, 'deg');
    scaleWidthObject(column_left, column_leftWidth, left, 300);
    setTimeout(function() {
        column_left.style.display = 'none';
    }, 300)
    return

    // if(window.screen.width < 1026){
    //     middle = 100;
    //     left = 5;
    // }

    // dropdown.style.display = "none";
    // dropdown.style.width = "0px";
    // dropdown.style.height = "0px";
    
    // info.style.display = "block";
    // info.style.width = "fit-content";
    // info.style.height = "fit-content";
    
    // scaleWidthObject(column_middle, column_middleWidth, middle, 300);
    // scaleWidthObject(progress, column_middleWidth, middle, 300);

    // scaleWidthObject(textInfo, column_leftWidth, 0, 300, "vw");
    // moveXObject(progress, column_leftWidth, left, 300);
    
    // hideClass(sideNavigation);
}

function getElements(){
    column_middle = document.getElementById("columnMiddle");
    column_left = document.getElementById("columnLeft");
    progress = document.getElementsByClassName("progress")[0];
    dropdown = document.getElementById("dropdown");
    textInfo = document.getElementById("textInfo");
    info = document.getElementById("info");
    extend_reduceButton = document.getElementById("extend-reduceButton");
}

function rotateObject(Element, _start, _stop, _time, _units = 'deg'){
    // toggledirection(Element, 'rotate', 0, 90, 300);
    // toggledirection(Element, 'rotate', _start, _stop, _time, _units);
    rotate(Element, _start, _stop, _time, _units);
}

function scaleWidthObject(Element, _start, _stop, _time, _units = "%"){
    // toggledirection(Element, 'scale-width', _start, _stop, _time, _units);
    scaleWidth(Element, _start, _stop, _time, _units)
}

function moveXObject(Element, _start, _stop, _time, _units = "%"){
    // toggledirection(Element, 'move-x', _start, _stop, _time);
    moveLeft(Element, _start, _stop, _time, _units);
}

function hideClass(Class){
    Class[0].style.visibility = 'hidden';
}

function showClass(Class){
    Class[0].style.visibility = 'visible';
}

function toggledirection(element, type, _start, _stop, _time, _units = "%") {
    var value = 0;
    // if(type == "rotate"){
    //     value = getCurrentRotation(element);
    // }
    // else if(type == "scale-width"){
    //     var width = window.document.documentElement.clientWidth;
    //     var elementWidth = element.getBoundingClientRect().width;
    //     // console.log(width, elementWidth)
    //     value = Math.round(elementWidth / width *100);
    //     // console.log(value);
    // }
    // else if(type == "move-x"){
    //     var width = window.document.documentElement.clientWidth;
    //     var elementPosition = element.getBoundingClientRect().x;
    //     value = Math.round(elementPosition / width *100);
    // }
    
    // console.log(value, _start)
    // if(value == _start){
    //     // console.log("from" +_start + "to" +_stop)
    //     values = [element, _start, _stop, _time];
    //     // animateElement(element, _start, _stop, _time);
    // }
    // else{
    //     // console.log("from" +_stop + "to" +_start)
    //     values = [element, _stop, _start, _time];
    //     // animateElement(element, _stop, _start, _time);
    // }
    if(type == "rotate"){
        rotate(_start, _start, _stop, _time, _units);
    }
    else if(type == "scale-width"){
        scaleWidth(_start, _start, _stop, _time, _units);
    }
    else if(type == "move-x"){
        moveLeft(_start, _start, _stop, _time, _units);
    }
}

function rotate(_el, _start, _stop, _time, _units){
    // get the latest position from the computed css 
    // _start = parseFloat(getComputedStyle(_el).transform.split(',')[4]) || 0;
    // console.log(_start, _stop, _time);
    
    // animate
    _el.animate([{ transform: 'rotate('+_start+'deg)'}, { transform: 'rotate('+_stop+'deg)' }], _time).onfinish = function(){
        _el.style.transform = 'rotate('+_stop+'deg)'; // block the element transition to the '_stop' position
    };
}
function moveLeft(_el, _start, _stop, _time){
    // get the latest position from the computed css 
    // _start = parseFloat(getComputedStyle(_el).transform.split(',')[4]) || 0;
    // console.log(_start, _stop, _time);

    _el.animate([{ left: +_start+'%'}, { left: +_stop+'%' }], _time).onfinish = function(){
        _el.style.left = +_stop+'%'; // block the element transition to the '_stop' position
    };
}
function scaleWidth(_el, _start, _stop, _time, _units){
    console.log(_units);
    _el.animate([{ width: +_start+_units}, { width: +_stop+_units}], _time).onfinish = function(){
        _el.style.width = +_stop+_units; // block the element transition to the '_stop' position
    };
}

function getPrecentWidth(element){
    var width = window.document.documentElement.clientWidth;
    var elementWidth = element.getBoundingClientRect().width;
    value = Math.round(elementWidth / width *100);
    return value;
}

function getCurrentRotation(el){
    var st = window.getComputedStyle(el, null);
    var tm = st.getPropertyValue("-webkit-transform") ||
             st.getPropertyValue("-moz-transform") ||
             st.getPropertyValue("-ms-transform") ||
             st.getPropertyValue("-o-transform") ||
             st.getPropertyValue("transform") ||
             "none";
    if (tm != "none") {
        var values = tm.split('(')[1].split(')')[0].split(',');
        a = values[0];
        b = values[1];
        angle = Math.round(Math.atan2(b,a) * (180/Math.PI));
        //return Math.round(Math.atan2(values[1],values[0]) * (180/Math.PI)); //this would return negative values the OP doesn't wants so it got commented and the next lines of code added
        //   var angle = Math.round(Math.atan2(values[1],values[0]) * (180/Math.PI));
        //   return (angle < 0 ? angle + 360 : angle); //adding 360 degrees here when angle < 0 is equivalent to adding (2 * Math.PI) radians before
        // return (angle < 0 ? angle + 360 : angle); //adding 360 degrees here when angle < 0 is equivalent to adding (2 * Math.PI) radians before
        return angle; //adding 360 degrees here when angle < 0 is equivalent to adding (2 * Math.PI) radians before
    }
    return 0; //Return 0 if angl
}