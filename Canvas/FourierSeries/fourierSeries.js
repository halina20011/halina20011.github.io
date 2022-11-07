import {DOWNLOADER} from "/Canvas/download.js";

let canvas = document.getElementById("my-canvas");
let context = canvas.getContext("2d");

let image = context.createImageData(canvas.width, canvas.height);
let data = image.data;

let downloader = new DOWNLOADER(canvas);

let addButton = document.getElementById("addButton");
addButton.addEventListener("click", function() {add();}, false);

let removeButton = document.getElementById("removeButton");
removeButton.addEventListener("click", function() {remove();}, false);

let downloadImageButton = document.getElementById("downloadImage");
downloadImageButton.addEventListener("click", function() { downloader.downloadImage(); }, false);

function timelapsee(fArguments){
    let from = parseInt(fArguments[0].value);
    let to = parseInt(fArguments[1].value);
    let clear = fArguments[2].checked;

    if(clear * 0 == 0){
        waveBuffer = [];
    }

    if(from * 0 == 0 && to * 0 == 0){
        angle = from;
        console.log(`From: ${from}, to: ${to}.`);
        for(let i = from; i < to - from; i++){
            angle += angleAdd;
            main();
            downloader.addImage();
            console.log(`Number of levels currently running: ${angle}.`);
        }
        downloader.downloadAll();
    }
    waveBuffer = [];
}

let timelapseInputData = {
    "function": timelapsee,
    "arguments": [{
            "text": {"element": "p", "innerHTML": "Steps: "},
            "inputFrom": {"element": "input", "type": "number", "from": 0, "value": 0},
            "inputTo": {"element": "input", "type": "number", "from": 1, "value": 1}
        },
        {
            "text": {"element": "p", "innerHTML": "Clear window: "},
            "clearWindow": {"element": "input", "type": "checkbox"}
        }
    ]
}

let timelapse = downloader.timelapse(timelapseInputData);

let waveHolder = document.getElementById("waveHolder");

let level = 1;
let waveBuffer = [];

function updateInfo(){
    clear();
    waveBuffer = [];
    
    let count = waveHolder.childElementCount;
    for(let i = 0; i < count; i++){
        // console.log(`Removing: ${i} ${count}.`);
        waveHolder.children[0].remove();
    }

    for(let i = 0; i < level; i++){
        // console.log(`Adding: ${i}.`);
    
        let waveSettingsElement = document.createElement("div");
        waveSettingsElement.className = "waveInfo";
        waveSettingsElement.id = "waveSettings1"
    
        let row1 = document.createElement("div");
        row1.className = "row1"
        let row2 = document.createElement("div");
        row2.className = "row2"
        let row3 = document.createElement("div");
        row3.className = "row3"
    
        waveSettingsElement.appendChild(row1);
        waveSettingsElement.appendChild(row2);
        waveSettingsElement.appendChild(row3);
    
        let indexName = document.createElement("p");
        indexName.innerHTML = `Circle: ${i}`;
        row1.appendChild(indexName);
    
        // Radius
        let radiusHolder = document.createElement("div");
        radiusHolder.className = "radiusHolder";
        row2.appendChild(radiusHolder);
        
        // Radius Text
        let radiusText = document.createElement("div");
        radiusText.innerHTML = "Radius: "
        
        // Radius value
        let radius = document.createElement("div");
        radius.innerHTML = 4 / (Math.PI * (2 * i + 1));
    
        // Append 
        radiusHolder.appendChild(radiusText);
        radiusHolder.appendChild(radius);
    
        waveHolder.appendChild(waveSettingsElement);    
    }

    updatePosition();
}

function add(){
    level++;
    updateInfo();
}

function remove(){
    if(1 < level){
        level--;
        updateInfo();
    }
}

function updatePosition(){
    drawPoint = 0;
    for(let i = 0; i < level; i++){
        let _i = i * 2 + 1;
        drawPoint += multiply * (4 / (Math.PI * _i));
    }

    drawPoint += 5;
}

let multiply = canvas.width / 10;
let drawPoint = 0;

let angle = Math.PI;
let angleAdd = 0.025;

function swapBuffer(){
    context.putImageData(image, 0, 0);
}

let xOffset = 0; let yOffset = 0;

function drawPixel(x, y, r = 255, g = 255, b = 255, a = 255){
    let xRounded = Math.round(x + xOffset);
    let yRounded = Math.round(y + yOffset);
    
    if(0 < xRounded && xRounded < canvas.width && 0 < yRounded && yRounded < canvas.height){
        let index = 4 * (canvas.width * yRounded + xRounded);
        data[index + 0] = r;
        data[index + 1] = g;
        data[index + 2] = b;
        data[index + 3] = a;
    }

}

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

function drawCircle(x, y, radius, rgba = [255, 255, 255, 255]){
    let resoluton = 0.1;
    let x1, y1;
    for(let angle = 0; angle < 360; angle += resoluton){
        x1 = radius * Math.cos(angle * Math.PI / 180);
        y1 = radius * Math.sin(angle * Math.PI / 180);
        drawPixel(x + x1, y + y1, rgba[0], rgba[1], rgba[2], rgba[3]);
    }
}

function translate(_xOffset, _yOffset){
    xOffset = _xOffset
    yOffset = _yOffset
}

function clear(){
    translate(0, 0);
    for (let x = 0; x < canvas.width; x++) {
        for (let y = 0; y < canvas.height; y++) {
            drawPixel(x, y, 0, 0, 0, 0);
        }
    }
}

function main(){
    clear();
    let prevX = 0;
    let prevY = 0;

    let x = 0;
    let y = 0;

    translate(canvas.width / 4, canvas.height / 2);

    for(let i = 0; i < level; i++){
        let _i = i * 2 + 1;
        let r = multiply * (4 / (Math.PI * _i));

        drawCircle(prevX, prevY, r);
        
        x += r * Math.cos(angle * _i);
        y += r * Math.sin(angle * _i);
        drawLine(prevX, prevY, x, y);

        // Draw Point that is on the circle
        let pointR = 4;
        // if it is last circle then drow a point
        if(i == level - 1){
            for(let i = 1; i < pointR; i++){
                drawCircle(x, y, i);
            }
            drawLine(x, y, drawPoint, y);
            waveBuffer.unshift(y);
        }

        prevX = x;
        prevY = y;
    }
    if(waveBuffer.length > canvas.width){
        waveBuffer.pop();
    }
    for(let i = 0; i < waveBuffer.length - 1; i++){
        drawLine(i + drawPoint, waveBuffer[i], i + drawPoint + 1, waveBuffer[i + 1]);
    }
    swapBuffer();
}

updateInfo();

setInterval(() => {
    main(); 
    angle += angleAdd;
}, 10);