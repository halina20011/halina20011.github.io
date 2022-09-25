import {DOWNLOADER} from "/Canvas/download.js";

var canvas = document.getElementById("my-canvas");
var context = canvas.getContext("2d");

var image = context.createImageData(canvas.width, canvas.height);
var data = image.data;

function swapBuffer(){
    context.putImageData(image, 0, 0);
}

let cenX = 0;
let cenY = 0;
let scale = 1;

function map(input, min1, max1, min2, max2){
    let multiply = max1 > max2 ? max1 : max2;
    input *= multiply;
    let m = input / (max1 - min1);
    let r = (m * (max2 - min2)) + min2 * multiply;
    console.log("m", m, max2 - min2, r);
    return r / multiply;
}

// console.log(map(100, 0, 400, -10, 10)); // = -0.5
// console.log(map(400, 0, 400, -10, 10)); // = 10

function pixelToPoint(x, y, width, height){
    let px = (x - width / 2.0) * (4.0 / width) * (1.0 / scale) + cenX;
    let py = (y - height / 2.0) * (4.0 / height) * (1.0 / scale) + cenY;

    return [px, py]
}

function drawPixel(x, y, r = 255, g = 255, b = 255, a = 255){
    let roundedX = Math.round(x);
    let roundedY = Math.round(y);

    let index = 4 * (canvas.width * roundedY + roundedX);
    data[index + 0] = r;
    data[index + 1] = g;
    data[index + 2] = b;
    data[index + 3] = a;
}

function drawCircle(x, y, radius){
    var resoluton = 10;
    for(i = 0; i < 360; i += resoluton){
        let angle = i;
        let x1 = radius * Math.cos(angle * Math.PI / 180);
        let y1 = radius * Math.sin(angle * Math.PI / 180);
        drawPixel(x + x1, y + y1, {r:0, g:0, b:0, a:255});
    }
}

let from = -10;
let to =    10;

function swap(i1, i2){
    return [i2, i1];
}

function drawLine(x1, y1, x2, y2, rgba = [255, 255, 255, 255]){
    let steep = Math.abs(y2 - y1) > Math.abs(x2 - x1);
    if (steep == true){
        [x1, y1] = swap(x1, y1);
        [x2, y2] = swap(x2, y2);
    }
    if(x1 > x2){
        [x1, x2] = swap(x1, x2);
        [y1, y2] = swap(y1, y2);
    }

    let dx, dy;
    dx = x2 - x1;
    dy = Math.abs(y2 - y1);

    let err = dx / 2;
    let ystep;

    if (y1 < y2){
        ystep = 1;
    }
    else{
        ystep = -1;
    }
    for (let a = 0; x1 <= x2; x1++){
        if (steep == true){
            drawPixel(y1, x1, rgba[0], rgba[1], rgba[2], rgba[3]);
        }
        else {
            drawPixel(x1, y1, rgba[0], rgba[1], rgba[2], rgba[3]);
        }
        err -= dy;
        if (err < 0){
            y1 += ystep;
            err += dx;
        }
    }
}

function grid(resolution){
    let offset = 400 / (resolution + 1)
    for(let r = 0; r < resolution; r++){
        let x = offset + offset * r;
        drawLine(x, 0, x, canvas.height);
    }
    for(let r = 0; r < resolution; r++){
        let y = offset + offset * r;
        drawLine(0, y, canvas.width, y);
    }
}

function main(){
    grid(1);
    // for(let y = canvas.height - 1; y >= 0; y--) {
    //         for(let x = canvas.width - 1; x >= 0; x--) {
    //                 let xp = map(x, 0, canvas.width, -10, 10);
    //                 let yP = map(y, 0, canvas.height, -10, 10);
    //                 // console.log(x, xp, xp * xp);
    //                 let yp = map(xp * xp, -10, 10, canvas.height / 2, -canvas.height/ 2);
    //                 if(xp * xp + yP*yP < 10 * 10){
    //                         drawPixel(x, y, 255, 255, 255, 255);
    //         }
    //     }
    // }
    for(let X = 0; X < canvas.width; X++){
        let x = map(X, 0, canvas.width, from, to);
        let y = x;
        let Y = map(y, from, to, canvas.height / 2, canvas.height / -2);
        drawPixel(X, Y)
    }

    swapBuffer();
}

main();