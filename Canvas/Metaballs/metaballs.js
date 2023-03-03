import {CANVAS} from "/Canvas/canvas.js";
import {DOWNLOADER} from "/Canvas/download.js";

let canvasEl = document.getElementById("my-canvas");

let canvas = new CANVAS(canvasEl);
let downloader = new DOWNLOADER(canvasEl);

let downloadImageButton = document.getElementById("downloadImage");
downloadImageButton.addEventListener("click", function() { downloader.downloadImage(); }, false);

let play = true;
let buttonStart = document.getElementById("pauseButton");
let buttonStartListener = buttonStart.addEventListener("click", () => { changeStateOfPlayPauseButton() }, false);

function changeStateOfPlayPauseButton(){
    play = !play;
    if(play == true){
        buttonStart.style.backgroundImage = "url(\"/Images/Icons/pause.png\")";
    }
    else{
        buttonStart.style.backgroundImage = "url(\"/Images/Icons/play.png\")";
    }
}

function getMultitplyOfTen(number){
    if(number == 0){
        return 1;
    }
    
    return Math.floor(Math.log10(number) + 1);
}

function calculateNumberOfSpaces(number, max){
    if(number < 0){
        number *= -1;
    }

    let numberPower = getMultitplyOfTen(number);
    let numberMaxPower = getMultitplyOfTen(max);

    return numberMaxPower - numberPower;
}

function updateText(number, max, numberEl, invisibleNumber){
    console.log(number);
    // Make invisible numbers
    let stringLength = calculateNumberOfSpaces(number, max);
    let spaces = "0".repeat(stringLength);

    invisibleNumber.innerHTML = spaces;
    numberEl.innerHTML = number;
}

// ################# RED ################
const checkboxRed = document.getElementById("checkboxRed");

const sliderRed = document.getElementById("sliderRed");
const sliderRedText = document.getElementById("sliderRedVal");
const sliderRedValue = sliderRedText.children[1];
const sliderRedPrefix = sliderRedText.children[0];

const sliderRedListener = sliderRed.addEventListener("input", () => { updateText(parseInt(sliderRed.value), 255, sliderRedValue, sliderRedPrefix); }, false);
const redCheckboxListener = checkboxRed.addEventListener("click", () => { enableDisable(checkboxRed, sliderRed, sliderRedText); }, false);

// ################ GREEN ###############
const checkboxGreen = document.getElementById("checkboxGreen");

const sliderGreen = document.getElementById("sliderGreen");
const sliderGreenText = document.getElementById("sliderGreenVal");
const sliderGreenValue = sliderGreenText.children[1];
const sliderGreenPrefix = sliderGreenText.children[0];

const sliderGreenListener = sliderGreen.addEventListener("input", () => { updateText(parseInt(sliderGreen.value), 255, sliderGreenValue, sliderGreenPrefix); }, false);
const greenCheckboxListener = checkboxGreen.addEventListener("click", () => { enableDisable(checkboxGreen, sliderGreen, sliderGreenText); }, false);

// ################ BLUE ################
const checkboxBlue = document.getElementById("checkboxBlue");

const sliderBlue = document.getElementById("sliderBlue");
const sliderBlueText = document.getElementById("sliderBlueVal");
const sliderBlueValue = sliderBlueText.children[1];
const sliderBluePrefix = sliderBlueText.children[0];

const blueSliderListener = sliderBlue.addEventListener("input", () => { updateText(parseInt(sliderBlue.value), 255, sliderBlueValue, sliderBluePrefix); }, false);
const blueCheckboxListener = checkboxBlue.addEventListener("click", () => { enableDisable(checkboxBlue, sliderBlue, sliderBlueText); }, false);

// ################ SAVE ################
const saveButton = document.getElementById("saveSettings");
const saveButtonListener = saveButton.addEventListener("click", () => {
    color = save(); 
    enableCustomColors = checkboxCustomColors.checked;
}, false);

const checkboxCustomColors = document.getElementById("checkboxCustomColors");
checkboxCustomColors.checked = false;
let enableCustomColors = false;

// ##################

sliderRedValue.innerHTML = sliderRed.value;
sliderGreenValue.innerHTML = sliderGreen.value;
sliderBlueValue.innerHTML = sliderBlue.value;

enableDisable(checkboxRed, sliderRed, sliderRedText);
enableDisable(checkboxGreen, sliderGreen, sliderGreenText);
enableDisable(checkboxBlue, sliderBlue, sliderBlueText);

function changeV(slider, sliderValue){
    sliderValue.innerHTML = slider.value;
}

function enableDisable(checkbox, slider, value){
    if(checkbox.checked == false){
        slider.disabled;
        slider.classList.add("disabled");
        value.classList.add("disabled");
    }
    else{
        slider.classList.remove("disabled");
        value.classList.remove("disabled");
    }
}

let color = [];
color = save();

function save(){
    let color = [];
    let checkboxs = [checkboxRed, checkboxGreen, checkboxBlue];
    let sliders = [sliderRed, sliderGreen, sliderBlue];
    for(let i = 0; i < checkboxs.length; i++){
        if(checkboxs[i].checked == true){
            color.push(sliders[i].value);
        }
        else{
            color.push(null);
        }
    }
    return color;
}

class BALL {
    constructor(x, y, radius, velocityX, velocityY){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.velocityX = velocityX;
        this.velocityY = velocityY;

    }

    move(){
        let mRadius = this.radius;

        if(this.x > (canvas.width - mRadius) || (this.x < 0 + mRadius)){
            this.velocityX *= -1;
            if(this.velocityY == 0){this.velocityY = Math.random();}
        }

        if(this.y > (canvas.height - mRadius) || (this.y < 0 + mRadius)){
            this.velocityY *= -1;
            if(this.velocityX == 0){this.velocityX = Math.random();}
        }

        this.x += this.velocityX;
        this.y += this.velocityY;
        // drawCircle(this.x, this.y, this.radius)
    }
}

class rgbaColor{
    constructor(r, g, b, a){
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
    
    getColor(){
        return [r, g, b, a];
    }
}

// Math Functions
function dist(x1, y1, x2, y2){
    let a = Math.pow(x2 - x1, 2);
    let b = Math.pow(y2 - y1, 2);
    return Math.sqrt(a + b);
}

function random(min, max){
    // Math.random() returns a float between 0 (inclusive) and 1 (exclusive) => <0; 1)
    // x = Math.random(), 0.0 <= x < 1.0
    // Calculate range between min and max. 
    // Multiply `range` with random float.
    // Add min to result to number in correct interval.
    return (Math.random() * (max - min + 1) + min);
}

// let ball1 = new BALL(50, 50, 50, 0, 1);
// let ball2 = new BALL(50, 50, 50, 1, 0);
// let ball3 = new BALL(50, 50, 50, 1, 1);
// let metaBallsList = [ball1];

let metaBallsList = []
let balls = 2;

for(let i = 1; i <= balls; i++){
    metaBallsList.push(new BALL(50, 50, 50, random(1, 2.5), random(1, 2.5)))
}

function MetaBalls(_metaBalls, _r, _g, _b){
    let r = _r;
    let g = _g;
    let b = _b;

    for(let x = 0; x < canvas.width; x++){
        for(let y = 0; y < canvas.height; y++){
            let sum = 0;
            for(let i = 0; i < _metaBalls.length; i++){
                let ball = _metaBalls[i];
                let d = dist(x, y, ball.x, ball.y);
                // sum += ball.radius / d * 250;
                sum += ball.radius / d * 150;
                // sum += ball.radius / d * 100;
            }

            if(_r == null){
                r = sum;
            }

            if(_g == null){
                g = sum;
            }

            if(_b == null){
                b = sum;
            }

            canvas.drawPixel(x, y, r, g, b, 255);
        }
    }
}

function drawMetaBalls(_metaBalls){
    if(enableCustomColors){
        let r = color[0];
        let g = color[1];
        let b = color[2];
        MetaBalls(_metaBalls, r, g, b);
    }
    else{
        MetaBalls(_metaBalls, null, null, null);
    }
}

function main(){
    if(play == true){
        drawMetaBalls(metaBallsList);

        for(let i = 0; i < metaBallsList.length; i++){
            metaBallsList[i].move();
        }

        canvas.swapBuffer();
    }
}

main();

setInterval(() => {
    main();
}, 10);
