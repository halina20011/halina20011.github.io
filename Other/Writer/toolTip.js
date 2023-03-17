const mistakes = document.getElementById('mistakes');
const number = document.getElementsByClassName('number');
const checkbox = document.getElementsByClassName("checkbox");
// const checkbox = document.getElementById('checkbox');
const words = document.getElementById('words');
const refresh = document.getElementById('restart');

const checkboxToolTip = document.getElementById('checkboxToolTipText');
const numberToolTipText = document.getElementById('numberToolTipText');

// for(var i = 0; i <checkbox.length; i++){
//     checkbox[i].addEventListener("mouseenter", function() {show(checkboxToolTip);}, false);
//     checkbox[i].addEventListener("mouseleave", function() {hide(checkboxToolTip);}, false);
// }

addEventListener(checkbox, checkboxToolTip, "-50px");
addEventListener(number, numberToolTipText, "-10px");

function show(elem, offset){
    if(elem.style.visibility != "visible"){
        elem.style.marginLeft = offset;
        elem.style.visibility = "visible";
    }
}

function hide(elem, offset){
    if(elem.style.visibility != "hidden"){
        elem.style.marginLeft = offset;
        elem.style.visibility = "hidden";
    }
}

function addEventListener(Class, element, offset){
    for(var i = 0; i <Class.length; i++){
        Class[i].addEventListener("mouseenter", function() {show(element, offset);}, false);
        Class[i].addEventListener("mouseleave", function() {hide(element, offset);}, false);
    }
}