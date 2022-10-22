import {DOWNLOADER} from "/Canvas/download.js";

let canvas = document.getElementById("my-canvas");
let context = canvas.getContext("2d");

let image = context.createImageData(canvas.width, canvas.height);
let data = image.data;

let downloader = new DOWNLOADER(canvas);

let downloadImageButton = document.getElementById("downloadImage");
downloadImageButton.addEventListener("click", function() { downloader.downloadImage(); }, false);

let updateButton = document.getElementById("update");
updateButton.addEventListener("click", function() { main(); }, false);

function swapBuffer(){
    context.putImageData(image, 0, 0);
}

let cenX = 0;
let cenY = 0;
let scale = 1;

function map(x, inMin, inMax, outMin, outMax){
    return (x - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

// console.log(map(100, 0, 400, -10, 10)); // = -0.5
// console.log(map(400, 0, 400, -10, 10)); // = 10

function pixelToPoint(x, y, width, height){
    let px = (x - width / 2.0) * (4.0 / width) * (1.0 / scale) + cenX;
    let py = (y - height / 2.0) * (4.0 / height) * (1.0 / scale) + cenY;

    return [px, py]
}

function drawPixel(x, y, r = 255, g = 255, b = 255, a = 255){
    if(x < 0 || canvas.width < x || y < 0 || canvas.height < y){
        return;
    }
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

function plotLineWidth(x1, y1, x2, y2, wd, rgba=[255, 255, 255, 255]){ 
    // let dx = Math.abs(x2 - x1), sx = x1 < x2 ? 1 : -1;
    let dx = Math.abs(x2 - x1);
    let sx = x1 < x2 ? 1 : -1;
    let dy = Math.abs(y2 - y1);
    let sy = y1 < y2 ? 1 : -1;
    let err = dx - dy
    let e2, eX, eY;
    let ed = dx + dy == 0 ? 1 : Math.sqrt(dx * dx + dy * dy);
    
    for(wd = (wd+1)/2; ;){
        // drawPixel(x1, y1, max(0,255*(Math.abs(err-dx+dy)/ed-wd+1)));
        drawPixel(x1, y1, rgba[0], rgba[1], rgba[2], rgba[3]);
        e2 = err; 
        eX = x1;
        if(2*e2 >= -dx){
            for(e2 += dy, eY = y1; e2 < ed*wd && (y2 != eY || dx > dy); e2 += dx){
                // drawPixel(x1, y2 += sy, max(0,255*(Math.abs(e2)/ed-wd+1)));
                drawPixel(x1, eY += sy, rgba[0], rgba[1], rgba[2], rgba[3]);
            }
            if(x1 == x2){
                break;
            } 
            e2 = err;
            err -= dy;
            x1 += sx;
        } 
        if(2 * e2 <= dy){
            for (e2 = dx-e2; e2 < ed*wd && (x2 != eX || dx < dy); e2 += dy){
                // drawPixel(x2 += sx, y1, max(0,255*(Math.abs(e2)/ed-wd+1)));
                drawPixel(eX += sx, y1, rgba[0], rgba[1], rgba[2], rgba[3]);
            }
            if(y1 == y2){
                break;
            } 
            err += dx; 
            y1 += sy;
        }
    }
}

function drawGrid(resolution){
    let offset = canvas.width / (resolution + 1)
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
    drawGrid(1);
    for(let X = 0; X < canvas.width; X++){
        let x = map(X, 0, canvas.width, from, to);
        let y = x;
        let Y = map(y, from, to, canvas.height / 2, canvas.height / -2);
        drawPixel(X, Y)
    }

    swapBuffer();
}

main();