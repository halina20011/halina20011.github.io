var canvas = document.getElementById('my-canvas');
var context = canvas.getContext('2d');

var image = context.createImageData(canvas.width, canvas.height);
var data = image.data;

var playAnimation = true;
var buttonStart = document.getElementById("button-StartStop");
var buttonStartListener = buttonStart.addEventListener("click", function() {changeStateOfPlayPauseButton()}, false);

function changeStateOfPlayPauseButton(){
    playAnimation = !playAnimation;
    if(playAnimation == true){
        buttonStart.style.backgroundImage = "url(\"/images/Icons/pause.png\")";
    }
    else{
        buttonStart.style.backgroundImage = "url(\"/images/Icons/play.png\")";
    }
}

// ################# RED ################
const sliderRed = document.getElementById("sliderRed");
const sliderRedValue = document.getElementById("redSliderVal");
const checkboxRed = document.getElementById("checkboxRed");

const sliderRedListener = sliderRed.addEventListener("input", function() {changeV(sliderRed, sliderRedValue);}, false);
const checkboxRedListener = document.getElementById("checkboxRed").addEventListener("click", function(){changeColor(checkboxRed, sliderRed, sliderRedValue);}, false);
// ################ GREEN ###############
const sliderGreen = document.getElementById("sliderGreen");
const sliderGreenValue = document.getElementById("greenSliderVal");
const checkboxGreen = document.getElementById("checkboxGreen");

const sliderGreenListener = sliderGreen.addEventListener("input", function() {changeV(sliderGreen, sliderGreenValue);}, false);
const checkboxGreenListener = document.getElementById("checkboxGreen").addEventListener("click", function(){changeColor(checkboxGreen, sliderGreen, sliderGreenValue);}, false);
// ################ BLUE ################
const sliderBlue = document.getElementById("sliderBlue");
const sliderBlueValue = document.getElementById("blueSliderVal");
const checkboxBlue = document.getElementById("checkboxBlue");

const sliderBlueListener = sliderBlue.addEventListener("input", function() {changeV(sliderBlue, sliderBlueValue);}, false);
const checkboxBlueListener = document.getElementById("checkboxBlue").addEventListener("click", function(){changeColor(checkboxBlue, sliderBlue, sliderBlueValue);}, false);

// ################ SAVE ################
const saveButton = document.getElementById("saveSettings");
const saveButtonListener = saveButton.addEventListener("click", function() {color = save();}, false);

const checkboxCustomColors = document.getElementById("checkboxCustomColors");
// ##################
sliderRedValue.innerHTML = sliderRed.value;
sliderGreenValue.innerHTML = sliderGreen.value;
sliderBlueValue.innerHTML = sliderBlue.value;

changeColor(checkboxRed, sliderRed, sliderRedValue);
changeColor(checkboxGreen, sliderGreen, sliderGreenValue);
changeColor(checkboxBlue, sliderBlue, sliderBlueValue);

function changeV(slider, sliderValue){
    sliderValue.innerHTML = slider.value;
}

function changeColor(checkbox, slider, value){
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

var color = [];
color = save();

function save(){
    var color = [];
    var checkboxs = [checkboxRed, checkboxGreen, checkboxBlue];
    var sliders = [sliderRed, sliderGreen, sliderBlue];
    for(var i = 0; i < checkboxs.length; i++){
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
        var mRadius = this.radius;
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

function swapBuffer() {
    context.putImageData(image, 0, 0);
}

function clear(){
    for(var x = 0; x < canvas.width; x++) {
        for(var y = 0; y < canvas.height; y++) {
            drawPixel(x, y, 0, 0, 0, 0);
        }
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

function drawPixel(x, y, r, g, b, a) {
    var roundedX = Math.round(x);
    var roundedY = Math.round(y);

    var index = 4 * (canvas.width * roundedY + roundedX);

    data[index + 0] = r;
    data[index + 1] = g;
    data[index + 2] = b;
    data[index + 3] = a;
}

function drawCircle(x, y, radius){
    var resoluton = 1;
    var x1, y1;
    for(var angle = 0; angle < 360; angle += resoluton){
        x1 = radius * Math.cos(angle * Math.PI / 180);
        y1 = radius * Math.sin(angle * Math.PI / 180);
        drawPixel(x + x1, y + y1, 0, 0, 0, 255);
    }
}

// Math Functions
function dist(x1, y1, x2, y2){
    var a = Math.pow(x2 - x1, 2);
    var b = Math.pow(y2 - y1, 2);
    return Math.sqrt(a + b);
}

function random(min, max){
    // Math.random() returns a float between 0 (inclusive) and 1 (exclusive).
    // x = Math.random(), 0.0 <= x < 1.0
    // Calculate range between min and max. 
    // Multiply `range` with random float.
    // Add min to result to number in correct interval.
    return (Math.random() * (max - min + 1) + min);
}

// var ball1 = new BALL(50, 50, 50, 0, 1);
// var ball2 = new BALL(50, 50, 50, 1, 0)
// var ball3 = new BALL(50, 50, 50, 1, 1)
// var metaBallsList = [ball1]
metaBallsList = []
var balls = 2;
for(var i = 1; i <= balls; i++){
    metaBallsList.push(new BALL(50, 50, 50, random(1, 2.5), random(1, 2.5)))
}

function MetaBalls(_metaBalls, _r, _g, _b){
    var r = _r;
    var g = _g;
    var b = _b;
    for(var x = 0; x < canvas.width; x++){
        for(var y = 0; y < canvas.height; y++){
            var sum = 0;
            for (var i = 0; i < _metaBalls.length; i++){
                var ball = _metaBalls[i];
                var d = dist(x, y, ball.x, ball.y);
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
            drawPixel(x, y, r, g, b, 255);
        }
    }
}

function drawMetaBalls(_metaBalls){
    if(checkboxCustomColors.checked == true){
        var r = color[0];
        var g = color[1];
        var b = color[2];
        MetaBalls(_metaBalls, r, g, b);
    }
    else{
        MetaBalls(_metaBalls, null, null, null);
    }
}

var index = 0;
function main(){
    if(playAnimation == true){
        drawMetaBalls(metaBallsList);
        for(var i = 0; i < metaBallsList.length; i++){
            metaBallsList[i].move();
        }
        swapBuffer();
        
        downloadImages();
        index++;
    }
}

main();

setInterval(function () {
    main();
}, 10);


// #################################################################################
var _images = [];
var imagesFile = {imagesBase64: []}

var _downloadImages = false;

// document.getElementById('button-Download').addEventListener("click", function(e) {getImage();});

// document.getElementById('button-DownloadStart').addEventListener("click", function(e) {_downloadImages = true});
// document.getElementById('button-DownloadStop').addEventListener("click", function(e) {_downloadImages = false});

// document.getElementById('button-DownloadAll').addEventListener("click", function(e) {downloadAll();});

var filename = "imagesBase64.json"

function downloadAll(){
    stringJsonImagesFile =  JSON.stringify(imagesFile);
    download(generateTextFileUrl(stringJsonImagesFile), filename);
    imagesFile.imagesBase64 = [];
    console.log("Downloaded!");
}

function downloadImages(){
    if(_downloadImages == true){
        console.log(index);
        var dataURL = canvas.toDataURL("image/jpeg", 1.0);
        imagesFile.imagesBase64.push(dataURL);
    }
}

function getImage(){
    var dataURL = canvas.toDataURL("image/jpeg", 1.0);

    download(dataURL, `${index}.jpeg`);
}

function generateTextFileUrl(txt) {
    var textFileUrl = null;
    let fileData = new Blob([txt], {type: 'text/plain'});
    if (textFileUrl !== null) {
        window.URL.revokeObjectURL(textFile);
    }
    textFileUrl = window.URL.createObjectURL(fileData);
    return textFileUrl;
};


// Save | Download image
function download(data, filename = 'untitled.jpeg') {
    var a = document.createElement('a');
    a.href = data;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
}