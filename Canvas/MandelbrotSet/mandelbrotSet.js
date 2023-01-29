// https://rubenvannieuwpoort.nl/posts/smooth-iteration-count-for-the-mandelbrot-set
// https://linas.org/art-gallery/escape/smooth.html

import {CANVAS} from "/Canvas/canvas.js";
import {DOWNLOADER} from "/Canvas/download.js";

let canvasEl = document.getElementById("my-canvas");

let canvas = new CANVAS(canvasEl);
let downloader = new DOWNLOADER(canvasEl);

let downloadImageButton = document.getElementById("downloadImage");
downloadImageButton.addEventListener("click", function() { downloader.downloadImage(); }, false);

let updateButton = document.getElementById("update");
updateButton.addEventListener("click", function() { main(); }, false);

let maxIterationsN = document.getElementById("maxIterations");
maxIterationsN.addEventListener("change", () => { 
    maxIterations = maxIterationsN.value;
    console.log(`Max iterations: ${maxIterations}`);
    main();
}, false);

let color = document.getElementById("color");
color.addEventListener("input", () => { main(); }, false);

function timelapsee(fArguments){
    let from = parseInt(fArguments[0].value);
    let to = parseInt(fArguments[1].value);

    if(from * 0 == 0 && to * 0 == 0){
        maxIterations = from;
        console.log(`Iterations timelapse from: ${from}, to: ${to}.`);

        for(let i = from; i < to - from; i++){
            console.log(`Number of iteration is currently: ${maxIterations}.`)
            main();
            downloader.addImage();
            maxIterations++;
        }

        downloader.downloadAll();
    }
}

let timelapseInputData = {
    "function": timelapsee,
    "arguments": [{
            "text": {"element": "p", "innerHTML": "Iterations: "},
            "inputFrom": {"element": "input", "type": "number", "from": 0, "value": 0},
            "inputTo": {"element": "input", "type": "number", "from": 1, "value": 1}
        }
    ]
}

let timelapse = downloader.timelapse(timelapseInputData);

canvas.scale = 1;

let valueAdd = 0.1;

document.addEventListener("keydown", (event) => {
    // Calculate valueAdd
    let w = canvas.width;
    let h = canvas.height;

    let max = canvas.pixelToPoint(0, 0, w, h);
    let min = canvas.pixelToPoint(w, h, w, h);

    let d = Math.abs(min[0]) + Math.abs(max[0]);
    // console.log(d);

    // let s = 1.0 / scale;

    if(event.key == "ArrowRight"){
        canvas.cenX += valueAdd; // Move right
    }
    else if(event.key == "ArrowUp"){
        canvas.cenY -= valueAdd; // Move right
    }
    else if(event.key == "ArrowLeft"){
        canvas.cenX -= valueAdd; // Move right
    }
    else if(event.key == "ArrowDown"){
        canvas.cenY += valueAdd; // Move right
    }
    else if(event.key == "+"){
        canvas.scale += valueAdd; // Move right
    }
    else if(event.key == "-"){
        canvas.scale -= valueAdd; // Move right
    }
    else if(event.key == "Enter"){
        main();
    }

    console.log(`Zoom ${canvas.scale} center x: ${canvas.cenX}, y: ${canvas.cenY}`);
}, false);

let maxIterations = 100;
let bounds = 2.0;

function hsvToRgb(h, s, v){
    if(v > 1.0){
        v = 1.0;
    } 
        
    let hp = h / 60.0;
    let c = v * s;
    let x = c * (1 - Math.abs((hp % 2) - 1));
    let rgb = [0, 0, 0];

    if(0 <= hp && hp < 1){
        rgb = [c, x, 0];
    }
    if(1 <= hp && hp < 2){
        rgb = [x, c, 0];
    }
    if(2 <= hp && hp < 3){
        rgb = [0, c, x];
    }
    if(3 <= hp && hp < 4){
        rgb = [0, x, c];
    }
    if(4 <= hp && hp < 5){
        rgb = [x, 0, c];
    }
    if(5 <= hp && hp < 6){
        rgb = [c, 0, x];
    }

    let m = v - c;
    rgb[0] += m;
    rgb[1] += m;
    rgb[2] += m;

    rgb[0] *= 255;
    rgb[1] *= 255;
    rgb[2] *= 255;
    return rgb;
}

let logBase = 1.0 / Math.log(2.0);
let logHalfBase = Math.log(0.5) * logBase;

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

    return [i, isIn];
}

function main(){
    for(let yPixel = 0; yPixel < canvas.height; yPixel++){
        for(let xPixel = 0; xPixel < canvas.width; xPixel++){
            // let x = map(xPixel, 0, canvas.width, x1 + cenX, x2 + cenX);
            // let y = map(yPixel, 0, canvas.height, y1 + cenY, y2 + cenY);

            let point = canvas.pixelToPoint(xPixel, yPixel, canvas.width, canvas.height);
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
                let zSquare = x * x - y * y + ca; // Real component
                let c = 2 * x * y + cb;  // Imaginary/Complex component

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
            
            canvas.drawPixel(xPixel, yPixel, r, g, b, 255);
        }
    }
    canvas.swapBuffer();
}

main();
