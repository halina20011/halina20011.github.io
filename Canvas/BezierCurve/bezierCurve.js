import func from "../../Tools/func.js";
import { MoveListener } from "../../Tools/func.js";

import {CANVAS} from "../canvas.js";
import {DOWNLOADER} from "../download.js";

const canvasEl = document.getElementById("my-canvas");

const canvas = new CANVAS(canvasEl);
const downloader = new DOWNLOADER(canvasEl);

const moveListener = new MoveListener(canvasEl);

const curvePoints = {};
let counter = 0;

let tValue = 0.7;

const addButton = document.getElementById("addButton");
addButton.addEventListener("click", () => { 
    new CurvePoint();
    main();
}, false);

const bezierCurvePoints = document.querySelector(".bezierCurvePoints");

HTMLElement.prototype.$ = function(name, f, run){
    if(run == true && f){
        f();
    }

    this.addEventListener(name, () => { f(); }, false);
}

function timelapsee(fArguments){
    const howMenySteps = parseInt(fArguments[0].value);
    const timelapseTValue = parseFloat(fArguments[1].value) / 100;

    const tStep = timelapseTValue / howMenySteps;

    console.log(`Run ${howMenySteps} steps.`);
    console.log(`Step value: ${tStep}.`);
    
    for(let _t = 0; _t < timelapseTValue; _t += tStep){
        tValue = _t;
        main();
        downloader.addImage();
        console.log(`Step currently running: ${_t}.`);
    }

    downloader.downloadAll();
}

const timelapseInputData = {
    "function": timelapsee,
    "arguments": [{
            "text": {"element": "p", "innerHTML": "How meny steps to take: "},
            "howMenySteps": {"element": "input", "type": "number", "value": 50, "from": "1"},
        },
        {
            "text": {"element": "p", "innerHTML": "stop at t [0 - 100]: "},
            "tValueMax": {"element": "input", "type": "number", "value": 100},
        },
    ]
};

downloader.timelapse(timelapseInputData);

const downloadImageButton = document.getElementById("downloadImage");
downloadImageButton.addEventListener("click", () => { downloader.downloadImage(); }, false);

const updateButton = document.getElementById("update");
updateButton.addEventListener("click", function() { main(); }, false);

const pointsHolder = document.querySelector(".pointsHolder");

let showLines = false;
const helpLines = document.querySelector(".helpLines");
helpLines.$("change", () => {
    showLines = helpLines.checked;
    main();
}, true);

const tText = document.getElementById("tText");

// Controls
const t = document.getElementById("t");
t.$("input", () => {
    const f = parseFloat(t.value).toFixed(2);
    tValue = f;
    tText.innerHTML = f;
    main();
}, true);

const colors = [[255, 0, 0, 255], [0, 255, 0, 255], [0, 0, 255, 255], [125, 125, 125, 255], [0, 255, 255, 255], [255, 0, 255, 255]];

class CurvePoint{
    constructor(x = (canvas.width / 2), y = (canvas.height / 2)){
        this.id = counter++;
        curvePoints[this.id] = this;
        this.bezierCurveSetting = null;
        this.input = [];

        this.xValue;
        this.yValue;
        
        this.pointHolder = func.createElement(`<div style="position: absolute;"></div>`);
        pointsHolder.appendChild(this.pointHolder);
        this.pointHolder.style.top = "0%";
        this.pointHolder.style.left = "0%";
        
        this.create(x, y);

        moveListener.add(this.pointHolder, (x,y) => { this.moveX(x); this.moveY(y); main(); });
    }
        
    moveX(x){
        x = Math.floor(x);
        this.xValue = x;
        this.xInput.value = x;
        this.pointHolder.style.left = `${func.toProc(this.xValue, canvas.width)}%`;
    }

    moveY(y){
        y = Math.floor(y);
        this.yValue = y;
        this.yInput.value = y;
        this.pointHolder.style.top = `${func.toProc(this.yValue, canvas.height)}%`;
    }

    create(x, y){
        this.bezierCurveSetting = document.createElement("div");
        this.bezierCurveSetting.className = "bezierCurveSetting";

        const settingSameLine = document.createElement("div");
        settingSameLine.className = "settingSameLine";
        const addInput = (text, max, val, f) => {
            const t = func.createElement(`<p>${text}</p>`);
            const input = func.createElement(`<input type="number" min="0" max="${max}" value="${val}"></input>`);
            input.$("input", () => { f(input); main(); }, false);
            settingSameLine.appendChild(t);
            settingSameLine.appendChild(input);
            return input;
        };

        this.xInput = addInput("X:", canvas.width, x, (input) => {
            this.moveX(parseInt(input.value));
        });

        this.yInput = addInput("Y:", canvas.height, y, (input) => {
            this.moveY(parseInt(input.value));
        });

        this.moveY(parseInt(this.yInput.value));
        this.moveX(parseInt(this.xInput.value));

        const buttonsSettingSameLine = func.createElement(`<div style="display: flex; justify-content: flex-end;"></div>`);

        const removeButton = document.createElement("button");
        removeButton.className = "removeButton";
        removeButton.addEventListener("click", () => {
            bezierCurvePoints.removeChild(this.bezierCurveSetting); 
            this.pointHolder.remove();
            delete curvePoints[this.id];
            main();
        });
 
        const freeLine = document.createElement("div");
        freeLine.className = "fS8";

        // buttonsSettingSameLine.appendChild(okButton);
        buttonsSettingSameLine.appendChild(removeButton);

        this.bezierCurveSetting.appendChild(settingSameLine);
        this.bezierCurveSetting.appendChild(freeLine);
        this.bezierCurveSetting.appendChild(buttonsSettingSameLine);

        bezierCurvePoints.appendChild(this.bezierCurveSetting);
    }
}

function drawBezierCurve(t, points, depth, boolDrawLines = false){
    // console.log(depth);
    if(points.length == 0){
        return [];
    }

    if(points.length == 1){
        return points[0];
    }

    if((depth == 0 || showLines) && boolDrawLines == true){
        const colorIndex = (points.length - 2) % colors.length;
        canvas.drawLines(points, colors[colorIndex]);
    }

    const newPoints = [];
    const n = points.length;

    for(let i = 0; i < n - 1; i++){
        const x = (1 - t) * points[i][0] + t * points[i + 1][0];
        const y = (1 - t) * points[i][1] + t * points[i + 1][1];
        newPoints.push([x, y]);
    }

    return drawBezierCurve(t, newPoints, depth + 1, boolDrawLines);
}

function main(){
    canvas.clear();

    const controlPoints = Object.keys(curvePoints).sort().map(key => {
        return [curvePoints[key].xValue, curvePoints[key].yValue];
    });
    
    const points = [];
    const resolution = 0.1;
    for(let _t = 0; _t < tValue; _t += resolution){
        points.push(drawBezierCurve(_t, controlPoints, 0, false));
    }

    const lastPoint = drawBezierCurve(tValue, controlPoints, 0, true);
    points.push(lastPoint);
    canvas.drawPoint(lastPoint[0], lastPoint[1], [255, 0, 0, 255]);
    canvas.drawLines(points, [255, 0, 0, 255]);
    
    canvas.swapBuffer();
}

new CurvePoint(50, 300);
new CurvePoint(125, 50);
new CurvePoint(175, 250);
new CurvePoint(300, 150);
new CurvePoint(350, 200);
new CurvePoint(300, 250);

main();
