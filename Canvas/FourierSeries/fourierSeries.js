import {CANVAS} from "/Canvas/canvas.js";
import {DOWNLOADER} from "/Canvas/download.js";

let canvasEl = document.getElementById("my-canvas");

let canvas = new CANVAS(canvasEl);
let downloader = new DOWNLOADER(canvasEl);

let addButton = document.getElementById("addButton");
addButton.addEventListener("click", function() {add();}, false);

let removeButton = document.getElementById("removeButton");
removeButton.addEventListener("click", function() {remove();}, false);

let downloadImageButton = document.getElementById("downloadImage");
downloadImageButton.addEventListener("click", function() { downloader.downloadImage(); }, false);

let waveType = document.getElementById("waveType");
waveType.addEventListener("change", () => { updateTypeOfFunction(); }, false);

// mathEquatoin id
let squareWave = document.getElementById("squareWave");
let halfSawtoothWaveIncreasing = document.getElementById("halfSawtoothWaveIncreasing");
let halfSawtoothWaveDecreasing = document.getElementById("halfSawtoothWaveDecreasing");
let sinhWave = document.getElementById("sinhWave");

let squareWaveMax = document.getElementById("squareWaveMax");
let halfSawtoothWaveIncreasingMax = document.getElementById("halfSawtoothWaveIncreasingMax");
let halfSawtoothWaveDecreasingMax = document.getElementById("halfSawtoothWaveDecreasingMax");
let sinhWaveMax = document.getElementById("sinhWaveMax");

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

let level = 5;
let waveBuffer = [];

function updateInfo(){
    canvas.clear();
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
        radius.innerHTML = Math.abs(calculateDistance(i)).toFixed(4);
    
        // Append 
        radiusHolder.appendChild(radiusText);
        radiusHolder.appendChild(radius);
    
        waveHolder.appendChild(waveSettingsElement);    
    }
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

let multiply = canvas.width / 10;
let drawPoint = 0;

let angle = 180;
let angleAdd = 2;

function swapBuffer(){
    context.putImageData(image, 0, 0);
}

function sin(angle){
    return Math.sin((angle * Math.PI) / 180);
}

function cos(angle){
    return Math.cos((angle * Math.PI) / 180);
}

function sinh(angle){
    return Math.sinh((angle * Math.PI) / 180);
}

function SquareWave(level){
    let prevX = 0;
    let prevY = 0;
    let x = 0;
    let y = 0;
    let r = 0;

    for(let i = 0; i < level; i++){
        let _i = 2 * i + 1;
        r = multiply * (4 / (Math.PI * _i));

        canvas.drawCircle(prevX, prevY, r, r);

        x += r * cos(angle * _i);
        y += r * sin(angle * _i);
        canvas.drawLine(prevX, prevY, x, y);

        prevX = x;
        prevY = y;
    }

    return [x, y, r];
}

function HalfSawtoothWaveIncreasing(level){
    let prevX = 0;
    let prevY = 0;
    let x = 0;
    let y = 0;
    let r = 0;

    for(let i = 1; i < level; i++){
        r = multiply * (Math.pow(-1, i + 1) / i);

        canvas.drawCircle(prevX, prevY, r);

        x += r * cos(angle * i);
        y += r * sin(angle * i);
        canvas.drawLine(prevX, prevY, x, y);

        prevX = x;
        prevY = y;
    }

    return [x, y, r];
}

function HalfSawtoothWaveDecreasing(level){
    let prevX = 0;
    let prevY = 0;
    let x = 0;
    let y = 0;
    let r = 0;

    for(let i = 1; i < level; i++){
        r = multiply * (1 / i);

        canvas.drawCircle(prevX, prevY, r);

        x += r * cos(angle * i);
        y += r * sin(angle * i);
        canvas.drawLine(prevX, prevY, x, y);

        prevX = x;
        prevY = y;
    }

    return [x, y, r];
}

function SinhWave(level){
    let prevX = 0;
    let prevY = 0;
    let x = 0;
    let y = 0;
    let r = 0;

    for(let i = 1; i < level; i++){
        let up = 2 * Math.sinh(Math.PI) * Math.pow(-1, i + 1) * i;
        let down = i * i + 1* Math.PI;
        r = 5 * (up / down);

        canvas.drawCircle(prevX, prevY, r);

        x += r * cos(angle * i);
        y += r * sin(angle * i);
        canvas.drawLine(prevX, prevY, x, y);

        prevX = x;
        prevY = y;
    }

    return [x, y, r];

}

let waveFunctions = [SquareWave,    HalfSawtoothWaveIncreasing,    HalfSawtoothWaveDecreasing,    SinhWave];
let equations     = [squareWave,    halfSawtoothWaveIncreasing,    halfSawtoothWaveDecreasing,    sinhWave];
let maxSum        = [squareWaveMax, halfSawtoothWaveIncreasingMax, halfSawtoothWaveDecreasingMax, sinhWaveMax];
let offset        = [null,          null,                          null,                          null]

let waveFunction;

function showEquation(index){
    // console.log(equations);

    for(let i = 0; i < equations.length; i++){
        if(i == index){
            if(equations[i].classList.contains("hidden") == true){
                equations[i].classList.remove("hidden");
            }
            maxSum[index].innerHTML = level;
        }
        else if(equations[i].classList.contains("hidden") != true && i != index){
            equations[i].classList.add("hidden");
        }
    }
}

function calculateDistance(level){
    let d = 0;
    let x, y, r;

    for(let i = 0; i < level; i++){
        [x, y, r] = waveFunction(i);
        d += Math.abs(r);
    }

    return d;
}

function updateTypeOfFunction(){
    waveBuffer = [];

    let index = parseInt(waveType.value);
    waveFunction = waveFunctions[index];
    console.log(`Slected index: ${index}`); 
    showEquation(index);
    drawPoint = calculateDistance(level);
}

let pointR = 4;

function main(){
    canvas.clear();
    canvas.translate(canvas.width / 4, canvas.height / 2);

    let x, y;
    [x, y] = waveFunction(level);
    waveBuffer.unshift(y);

    // Draw Point that is on the circle
    // if it is last circle then draw a point
    for(let i = 1; i < pointR; i++){
        canvas.drawCircle(x, y, i);
    }
    canvas.drawLine(x, y, drawPoint, y);

    if(waveBuffer.length > canvas.width){
        waveBuffer.pop();
    }

    for(let i = 0; i < waveBuffer.length - 1; i++){
        canvas.drawLine(i + drawPoint, waveBuffer[i], i + drawPoint + 1, waveBuffer[i + 1]);
    }

    canvas.swapBuffer();
}

updateTypeOfFunction();
updateInfo();

setInterval(() => {
    main(); 
    angle += angleAdd;
}, 20);
