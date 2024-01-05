import {CANVAS} from "./canvas.js";
import {DOWNLOADER} from "./download.js";

const canvasEl = document.getElementById("my-canvas");

const canvas = new CANVAS(canvasEl);
const downloader = new DOWNLOADER(canvasEl);

const downloadImageButton = document.getElementById("downloadImage");
downloadImageButton.addEventListener("click", function() { downloader.downloadImage(); }, false);

const updateButton = document.getElementById("update");
updateButton.addEventListener("click", function() { main(); }, false);

function map(x, inMin, inMax, outMin, outMax){
    return (x - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

const from = -10;
const to   =  10;

function main(){
    canvas.drawGrid(1);
    for(let X = 0; X < canvas.width; X++){
        const x = map(X, 0, canvas.width, from, to);
        const y = x;
        const Y = map(y, from, to, canvas.height / 2, canvas.height / -2);
        canvas.drawPixel(X, Y)
    }

    canvas.swapBuffer();
}

main();
