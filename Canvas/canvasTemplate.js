import {CANVAS} from "/Canvas/canvas.js";
import {DOWNLOADER} from "/Canvas/download.js";

let canvasEl = document.getElementById("my-canvas");

let canvas = new CANVAS(canvasEl);
let downloader = new DOWNLOADER(canvas);

let downloadImageButton = document.getElementById("downloadImage");
downloadImageButton.addEventListener("click", function() { downloader.downloadImage(); }, false);

let updateButton = document.getElementById("update");
updateButton.addEventListener("click", function() { main(); }, false);

function map(x, inMin, inMax, outMin, outMax){
    return (x - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

let from = -10;
let to =    10;

function main(){
    canvas.drawGrid(1);
    for(let X = 0; X < canvas.width; X++){
        let x = map(X, 0, canvas.width, from, to);
        let y = x;
        let Y = map(y, from, to, canvas.height / 2, canvas.height / -2);
        canvas.drawPixel(X, Y)
    }

    canvas.swapBuffer();
}

main();
