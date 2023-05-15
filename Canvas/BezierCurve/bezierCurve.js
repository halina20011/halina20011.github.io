import {CANVAS} from "/Canvas/canvas.js";
import {DOWNLOADER} from "/Canvas/download.js";

let canvasEl = document.getElementById("my-canvas");

let canvas = new CANVAS(canvasEl);
let downloader = new DOWNLOADER(canvasEl);

let addButton = document.getElementById("addButton");
addButton.addEventListener("click", () => { 
    new CURVESETTING();
    main();
}, false);

let bezierCurveSettingsContainer = document.getElementById("bezierCurveSettingsContainer");

function timelapsee(fArguments){
    let howMenySteps = parseInt(fArguments[0].value);
    let timelapseTValue = parseFloat(fArguments[1].value) / 100;

    let tStep = timelapseTValue / howMenySteps;

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

let timelapseInputData = {
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

let timelapse = downloader.timelapse(timelapseInputData);

let downloadImageButton = document.getElementById("downloadImage");
downloadImageButton.addEventListener("click", function() { downloader.downloadImage(); }, false);

let updateButton = document.getElementById("update");
updateButton.addEventListener("click", function() { main(); }, false);

let tValue = 0.7;

// Controls
let t = document.getElementById("t");
t.addEventListener("input", () => { 
    let f = parseFloat(t.value).toFixed(2);
    tValue = f;
    tText.innerHTML = f;
    main();
}, false);

let tText = document.getElementById("tText");

function getMultitplyOfTen(number){
    if(number == 0){
        return 1;
    }
    return Math.floor(Math.log10(number) + 1);
}

function calculateNumberOfSpaces(number, max){
    if(number < 0){
        number *= -1;
    }
    let numberPower = getMultitplyOfTen(number);
    let numberMaxPower = getMultitplyOfTen(max);

    return numberMaxPower - numberPower;
}

function updateText(number, max, numberEl, invisibleNumber){
    // Make invisible numbers
    let stringLength = calculateNumberOfSpaces(number, max);
    let spaces = "0".repeat(stringLength);
    if(number >= 0){
        spaces = "-" + spaces;
    }
    invisibleNumber.innerHTML = spaces;
    numberEl.innerHTML = number;
}

let colors = [[255, 0, 0, 255], [0, 255, 0, 255], [0, 0, 255, 255], [125, 125, 125, 255], [0, 255, 255, 255], [255, 0, 255, 255]];

function drawBezierCurve(t, points, boolDrawLines = false){
    if(points.length == 1){
        //drawPixel(points[0][0], points[0][1]);
        return points[0];
    }

    if(boolDrawLines == true){
        //console.log(points);
        let colorIndex = (points.length - 2) % colors.length;
        canvas.drawLines(points, colors[colorIndex]);
    }

    let newPoints = [];
    let n = points.length;

    for(let i = 0; i < n - 1; i++){
        let x = (1 - t) * points[i][0] + t * points[i + 1][0];
        let y = (1 - t) * points[i][1] + t * points[i + 1][1];
        newPoints.push([x, y]);
    }

    return drawBezierCurve(t, newPoints, boolDrawLines);
}

class CURVESETTING{
    constructor(x = (canvas.width / 2), y = (canvas.height / 2)){
        this.bezierCurveSetting = null;
        this.input = [];

        this.xValue;
        this.yValue;

        this.draw(x, y);
    }

    draw(x = 0, y = 0){
        this.bezierCurveSetting = document.createElement("div");
        this.bezierCurveSetting.className = "bezierCurveSetting";

        let settingSameLine = document.createElement("div");
        settingSameLine.className = "settingSameLine";
        
        for(let i = 0; i < 2; i++){
            let text = (i == 0) ? "X: " : "Y: ";
            let textEl = document.createElement("p");
            textEl.innerHTML = text;

            let input = document.createElement("input");
            input.type = "number";
            input.min = "0";
            input.max = `${(i == 0) ? canvas.width : canvas.height}`;
            input.value = (i == 0) ? x : y;

            this.input.push(input);     
            input.addEventListener("input", () => { 
                this.xValue = parseInt(this.input[0].value);
                this.yValue = parseInt(this.input[1].value);
                // console.log(this.xValue, this.yValue);
                main();
            });

            settingSameLine.appendChild(textEl);
            settingSameLine.appendChild(input);

        }

        let buttonsSettingSameLine = document.createElement("div");
        buttonsSettingSameLine.className = "settingSameLine";
        buttonsSettingSameLine.style.display = "flex";
        buttonsSettingSameLine.style.justifyContent = "flex-end";

        let removeButton = document.createElement("button");
        removeButton.className = "removeButton";
        removeButton.addEventListener("click", () => { 
            bezierCurveSettingsContainer.removeChild(this.bezierCurveSetting); 
            main();
        });
 
        let freeLine = document.createElement("div");
        freeLine.className = "fS8";

        // buttonsSettingSameLine.appendChild(okButton);
        buttonsSettingSameLine.appendChild(removeButton);

        this.bezierCurveSetting.appendChild(settingSameLine);
        this.bezierCurveSetting.appendChild(freeLine);
        this.bezierCurveSetting.appendChild(buttonsSettingSameLine);

        bezierCurveSettingsContainer.appendChild(this.bezierCurveSetting);
    }
}

function getBezierCurveSettings(){
    let points = [];
    let bezierCurveSettings = document.getElementsByClassName("bezierCurveSetting");

    for(let i = 0; i < bezierCurveSettings.length; i++){
        let x = parseInt(bezierCurveSettings[i].children[0].children[1].value);
        let y = parseInt(bezierCurveSettings[i].children[0].children[3].value);
        points.push([x, y]);
    }

    return points;
}

function main(){
    canvas.clear();

    let points = getBezierCurveSettings(); 
    let curvePoints = [];

    for(let _t = 0; _t < tValue; _t += 0.1){
        curvePoints.push(drawBezierCurve(_t, points));
    }

    let lastPoint = drawBezierCurve(tValue, points, true);
    curvePoints.push(lastPoint);
    canvas.drawPoint(lastPoint[0], lastPoint[1], [255, 0, 0, 255]);
    canvas.drawLines(curvePoints, [255, 0, 0, 255]);

    canvas.swapBuffer();
}

new CURVESETTING(50, 300);
new CURVESETTING(125, 50);
new CURVESETTING(175, 250);
new CURVESETTING(300, 150);
new CURVESETTING(350, 200);
new CURVESETTING(300, 250);

main();
