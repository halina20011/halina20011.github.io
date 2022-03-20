var number = 0;
var text = "";

const numberDisplay = document.getElementById("numberDisplay");
const resultDisplay = document.getElementById("resultDisplay");

const rangeMinFirst = document.getElementById("rangeMinFirst");
const rangeMaxFirst = document.getElementById("rangeMaxFirst");
const rangeMinSecond = document.getElementById("rangeMinSecond");
const rangeMaxSecond = document.getElementById("rangeMaxSecond");

const rangeMinTextFirst = document.getElementById("rangeMinTextFirst");
const rangeMaxTextFirst = document.getElementById("rangeMaxTextFirst");
const rangeMinTextSecond = document.getElementById("rangeMinTextSecond");
const rangeMaxTextSecond = document.getElementById("rangeMaxTextSecond");

showNumber();

window.addEventListener('keyup', (event) => {
    if(event.key == "Backspace"){
        text = text.slice(0, -1);
    }
    else if(event.key == "1" || event.key == "2" || event.key == "3" || event.key == "4" || event.key == "5" 
    || event.key == "6" || event.key == "7" || event.key == "8" || event.key == "9" || event.key == "0"){
        text += event.key;
    }
    resultDisplay.innerHTML = text;
    checkResult(text, number);
});

rangeMinFirst.addEventListener('change', function() {sliderChange(this, rangeMinTextFirst);}, false);
rangeMaxFirst.addEventListener('change', function() {sliderChange(this, rangeMaxTextFirst);}, false);
rangeMinSecond.addEventListener('change', function() {sliderChange(this, rangeMinTextSecond);}, false);
rangeMaxSecond.addEventListener('change', function() {sliderChange(this, rangeMaxTextSecond);}, false);

function sliderChange(slider, text){
    console.log(slider.value);
    text.innerHTML = slider.value;
}

function showNumber(){
    var rangeFirst = random(rangeMinFirst.value, rangeMaxFirst.value);
    var rangeSecond = random(rangeMinSecond.value, rangeMaxSecond.value);
    numberDisplay.innerHTML = `${rangeFirst}*${rangeSecond}`;
    number = rangeFirst * rangeSecond;
    console.log(number)
}

function checkResult(Text, number){
    if(Text == number){
        text = "";
        resultDisplay.innerHTML = text;
        showNumber();
    }
}

function random(min, max){
    var r = Math.floor(Math.random() * (max - min + 1) + min);
    return r;
}