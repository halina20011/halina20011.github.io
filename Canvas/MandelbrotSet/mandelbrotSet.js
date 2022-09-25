// https://rubenvannieuwpoort.nl/posts/smooth-iteration-count-for-the-mandelbrot-set
// https://linas.org/art-gallery/escape/smooth.html

import {DOWNLOADER} from "/Canvas/download.js";

var canvas = document.getElementById("my-canvas");
var context = canvas.getContext("2d");

var image = context.createImageData(canvas.width, canvas.height);
var data = image.data;

let downloadImageButton = document.getElementById("downloadImage");
downloadImageButton.addEventListener("click", function() { downloader.downloadImage(); }, false);

let updateButton = document.getElementById("update");
updateButton.addEventListener("click", function() { update(); }, false);

let maxIterationsN = document.getElementById("maxIterations");
maxIterationsN.addEventListener("input", () => { 
    maxIterations = maxIterationsN.value;
    console.log(`Max iterations: ${maxIterations}`);
}, false);

let color = document.getElementById("color");
color.addEventListener("input", () => { update(); }, false);

let timelapseButton = document.getElementById("timelapseButton");
timelapseButton.addEventListener("click", () => { timelapseEl.style.display = "block"}, false);

let downloader = new DOWNLOADER(canvas);

let cenX = 0;
let cenY = 0;
let scale = 1;

let valueAdd = 0.1;

document.addEventListener("keydown", (event) => {
    // calculate valueAdd
    let w = canvas.width;
    let h = canvas.height;

    let max = pixelToPoint(0, 0, w, h);
    let min = pixelToPoint(w, h, w, h);
    // console.log(`x:${min[0]}, x:${max[0]}`)
    // console.log(`Min: x:${min[0]}, y:${min[1]}`)
    // console.log(`Max: x:${max[0]}, y:${max[1]}`)
    let d = Math.abs(min[0]) + Math.abs(max[0]);
    // console.log(d);
    // let s = 1.0 / scale;

    if(event.key == "ArrowRight"){
        // move right
        cenX -= valueAdd;
    }
    else if(event.key == "ArrowUp"){
        // move right
        cenY += valueAdd;
    }
    else if(event.key == "ArrowLeft"){
        // move right
        cenX += valueAdd;
    }
    else if(event.key == "ArrowDown"){
        // move right
        cenY -= valueAdd;
    }
    else if(event.key == "+"){
        // move right
        scale += valueAdd;
    }
    else if(event.key == "-"){
        // move right
        scale -= valueAdd;
    }
    else if(event.key == "Enter"){
        update();
    }

    console.log(`Center x: ${cenX}, y: ${cenY}`);
    console.log("Zoom", scale);  
}, false)

function swapBuffer(){
    context.putImageData(image, 0, 0);
}

function drawPixel(x, y, r, g, b, a){
    let roundedX = Math.round(x);
    let roundedY = Math.round(y);

    let index = 4 * (canvas.width * roundedY + roundedX);
    data[index + 0] = r;
    data[index + 1] = g;
    data[index + 2] = b;
    data[index + 3] = a;
}

function map(input, min, max, newMin, newMax){
    // Get  calculate difference between max and min (400 - 0) and then devide it by input to get float between 0-1
    let m = input / (max - min);
    // Calculate difference between newMax and newMin (1 - (-1))
    // then multiply it with float and add newMin to it to get to correct range
    let r = (m * (newMin - newMax) + newMin);
    return r;
}

let maxIterations = 100;
let bounds = 2.0;

function update(){  
    main();
    swapBuffer();
}

function pixelToPoint(x, y, width, height){
    let px = (x - width / 2.0) * (4.0 / width) * (1.0 / scale) + cenX;
    let py = (y - height / 2.0) * (4.0 / height) * (1.0 / scale) + cenY;

    return [px, py]
}

function hsvToRgb(h, s, v){
    if ( v > 1.0 ){
        v = 1.0;
    } 
        
    var hp = h / 60.0;
    var c = v * s;
    var x = c * (1 - Math.abs((hp % 2) - 1));
    var rgb = [0,0,0];

    if ( 0 <= hp && hp < 1 ){
        rgb = [c, x, 0];
    }
    if ( 1 <= hp && hp < 2 ){
        rgb = [x, c, 0];
    }
    if ( 2 <= hp && hp < 3 ){
        rgb = [0, c, x];
    }
    if ( 3 <= hp && hp < 4 ){
        rgb = [0, x, c];
    }
    if ( 4 <= hp && hp < 5 ){
        rgb = [x, 0, c];
    }
    if ( 5 <= hp && hp < 6 ){
        rgb = [c, 0, x];
    }

    var m = v - c;
    rgb[0] += m;
    rgb[1] += m;
    rgb[2] += m;

    rgb[0] *= 255;
    rgb[1] *= 255;
    rgb[2] *= 255;
    return rgb;
}

var logBase = 1.0 / Math.log(2.0);
var logHalfBase = Math.log(0.5) * logBase;

function smoothColor(n, x, y){
    // return 5 + n - logHalfBase - Math.log(Math.log(Tr + Ti)) * logBase;
    return 1 + n - Math.log(Math.log(Math.sqrt(x * x + y * y)))/Math.log(2.0)
}

function generateColor(mode, iterations, n, x, y) {
    if(n == iterations){
        return [0, 0, 0, 255];
    }

    let v = smoothColor(n, x, y);

    if(mode == "Grayscale"){
        let g = n / iterations * 255;
        return [g, g, g];
    }
    else if(mode == "Orange"){
        let c = hsvToRgb(360.0* v / iterations, 1.0, 1.0);
        return c;
    }
    else if(mode == "Blue"){
        let c = hsvToRgb(360.0 * v / iterations, 1.0, 10.0 * v / iterations);

        // swap red and blue
        [c[0], c[2]] = [c[2], c[0]];

        return c;
    }
}

function main(){
    for (let yPixel = 0; yPixel < canvas.height; yPixel++) {
        for (let xPixel = 0; xPixel < canvas.width; xPixel++) {
            // let x = map(xPixel, 0, canvas.width, x1 + cenX, x2 + cenX);
            // let y = map(yPixel, 0, canvas.height, y1 + cenY, y2 + cenY);
            let point = pixelToPoint(xPixel, yPixel, canvas.width, canvas.height);
            let x = point[0];
            let y = point[1];
            // let x = (xPixel - canvas.width / 2.0) * (4.0 / canvas.width) * (1.0 / scale) + cenX;
            // let y = (yPixel - canvas.height / 2.0) * (4.0 / canvas.height) * (1.0 / scale) + cenY;

            // f(z0) = 0 + c;
            // f(z1) = f(z0) * f(z0) + c;

            // c = (x + bi) * (x + bi) 
            //  => a2 + abi + bia + b2i2 
            //  i = sqroot of -1
            //  => a2 + 2abi - b2 or
            //  => (a2 - b2) + 2abi
            //        |         |
            //        |         |- Imaginary component
            //        |
            //        |- Real component

            let ca = x;
            let cb = y;

            let n = 0;
            let isIn = true;

            x = 0;
            y = 0;

            for(n = 0; n < maxIterations; n++){
                var zSquare = x * x - y * y + ca; // Real component
                var c = 2 * x * y + cb;  // Imaginary/Complex component

                x = zSquare;
                y = c;

                let d = distance(0.0, 0.0, x, y);
                
                if(d > bounds){
                    isIn = false;
                    n++;
                    break;
                }
            }

            let r, g, b;
            [r, g, b] = generateColor(color.value, maxIterations, n, x, y);
            
            drawPixel(xPixel, yPixel, r, g, b, 255);
        }
    }
}

function distance(x1, y1, x2, y2){
    let x = x2 - x1;
    let y = y2 - y1;

    return Math.sqrt(x * x + y * y);
}

function calculatePoint(cx, cy){
    let zx = 0;
    let zy = 0;

    let i = 0;

    let bounds = 2.0;
    let isIn = 1;

    while(i < 50 && isIn == 1){
        let x = zx * zx - zy * zy + cx;
        let y = 2 * zx * zy + cy;

        zx = x;
        zy = y;
        i++;
        let d = distance(0.0, 0.0, zx, zy);
        if(d > bounds){
            isIn = 0;
        }
    }

    return [i, isIn]
}

function main2(){
    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            let c = pixelToPoint(x, y, canvas.width, canvas.height);
            let result = calculatePoint(c[0], c[1]);

            let r, g, b;
            let a = 255;
            // if number is in
            if(result[1] == 1){
                r = 0; 
                g = 0;
                b = 0;
            }
            else if(result[0] > 1){
                r = 255; 
                g = 255;
                b = 255;
            }
            else{
                r = 115; 
                g = 115;
                b = 115;
            }

            drawPixel(x, y, r, g, b, a);
        }        
    }
}

main();
swapBuffer();

function timelapsee(from, to){
    maxIterations = from;
    console.log(`Iterations timelapse from: ${from}, to: ${to}.`);
    for(let i = from; i < to - from; i++){
        maxIterations++;
        main();
        downloader.addImage();
        console.log(`Number of iterations currently running: ${maxIterations}.`)
    }
    downloader.downloadAll();
}

let timelapseEl = document.getElementById("timelapse");

let next = document.getElementById("nextButton");
let timelapseIterationsFrom = document.getElementById("timelapseIterationsFrom");
let timelapseIterationsTo = document.getElementById("timelapseIterationsTo");

next.addEventListener('click', () => {
    timelapseEl.style.setProperty("display", "none");
    let from = parseInt(timelapseIterationsFrom.value, 10);
    let to = parseInt(timelapseIterationsTo.value, 10);
    console.log(from, to);
    if(from * 0 == 0 && to * 0 == 0){
        timelapsee(from, to);
    }
}, false);