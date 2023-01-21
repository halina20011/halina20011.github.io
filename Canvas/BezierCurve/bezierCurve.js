import {DOWNLOADER} from "/Canvas/download.js";

let canvas = document.getElementById("my-canvas");
let context = canvas.getContext("2d");

let image = context.createImageData(canvas.width, canvas.height);
let data = image.data;

let downloader = new DOWNLOADER(canvas);

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
}

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

function updateFloatNum(value, numberEl){
}

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

function swapBuffer(){
    context.putImageData(image, 0, 0);
}

function clear(){
    for(let y = 0; y < canvas.height; y++){
        for(let x = 0; x < canvas.width; x++){
            drawPixel(x, y, 0, 0, 0, 0);
        }
    }
}


let cenX = 0;
let cenY = 0;
let scale = 1;

function map(x, inMin, inMax, outMin, outMax){
    return (x - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

function drawPixel(x, y, rgba = [255, 255, 255, 255]){
    if(x < 0 || canvas.width < x || y < 0 || canvas.height < y){
        return;
    }
    let roundedX = Math.round(x);
    let roundedY = Math.round(y);

    let index = 4 * (canvas.width * roundedY + roundedX);
    data[index + 0] = rgba[0];
    data[index + 1] = rgba[1];
    data[index + 2] = rgba[2];
    data[index + 3] = rgba[3];
}

function drawCircle(x, y, radius, rgba = [255, 255, 255, 255]){
    var resoluton = 10;
    for(let i = 0; i < 360; i += resoluton){
        let angle = i;
        let x1 = radius * Math.cos(angle * Math.PI / 180);
        let y1 = radius * Math.sin(angle * Math.PI / 180);
        drawPixel(x + x1, y + y1, rgba);
    }
}

function drawPoint(x, y, rgba){
    let radius = 5;
    for(let r = 0; r < radius; r++){
        drawCircle(x, y, r, rgba);
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

    for(let a = 0; x1 <= x2; x1++){
        if (steep == true){
            drawPixel(y1, x1, rgba);
        }
        else {
            drawPixel(x1, y1, rgba);
        }
        err -= dy;
        if (err < 0){
            y1 += ystep;
            err += dx;
        }
    }
}

function drawLines(points, rgba){
    for(let i = 0; i < points.length - 1; i++){
        drawLine(points[i][0], points[i][1], points[i + 1][0], points[i + 1][1], rgba);
    }
}

function drawLinesWidth(points, width, rgba = [255, 255, 255, 255]){
    for(let i = 0; i < points.length - 1; i++){
        plotLineWidth(points[i][0], points[i][1], points[i + 1][0], points[i + 1][1], width, rgba);
    }
}

function plotLineWidth(x1, y1, x2, y2, wd, rgba = [255, 255, 255, 255]){ 
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
        drawPixel(x1, y1, rgba);
        e2 = err; 
        eX = x1;
        if(2*e2 >= -dx){
            for(e2 += dy, eY = y1; e2 < ed*wd && (y2 != eY || dx > dy); e2 += dx){
                // drawPixel(x1, y2 += sy, max(0,255*(Math.abs(e2)/ed-wd+1)));
                drawPixel(x1, eY += sy, rgba);
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
                drawPixel(eX += sx, y1, rgba);
            }
            if(y1 == y2){
                break;
            } 
            err += dx; 
            y1 += sy;
        }
    }
}

function factorial(n){
    let product = 1;
    for(let i = 1; i <= n; i++){
        product *= i;
    }

    return product;
}

function pixelToPoint(x, y, width, height){
    let px = (x - width / 2.0) * (4.0 / width) * (1.0 / scale) + cenX;
    let py = (y - height / 2.0) * (4.0 / height) * (1.0 / scale) + cenY;

    return [px, py];
}

// Explicit definition
function drawBezierCurve2(t, points){
    let pX = 0; 
    let pY = 0;
    let pointsL;
    let n = points.length;
    
    let NI = 0;
    for(let i = 0; i < n; i++){
        let nI = factorial(n) / (factorial(i) * factorial(n - i));
        console.log(nI);
        NI += nI;
        let Px = points[i][0];
        let Py = points[i][1];
        let x = map(Px, 0, 400, -2, 2);
        let y = map(Py, 0, 400, 2, -2);
        //console.log(x, y);
        pX += (nI) * Math.pow(1 - t, n - i) * Math.pow(t, i) * x;
        pY += (nI) * Math.pow(1 - t, n - i) * Math.pow(t, i) * y;
    }
    
    console.log(`NI ${NI}`);

    let x = map(pX, -2, 2, 0, 400);
    let y = map(pY, 2, -2, 0, 400);

    drawPixel(x, y);
}

let colors = [[255, 0, 0, 255], [0, 255, 0, 255], [0, 0, 255, 255], [125, 125, 125, 255], [0, 255, 255, 255], [255, 0, 255, 255]];

function drawBezierCurve(t, points, boolDrawLines = false){
    if(points.length == 1){
        //drawPixel(points[0][0], points[0][1]);
        return points[0];
    }

    if(boolDrawLines == true){
        //console.log(points);
        drawLines(points, colors[points.length - 2]);
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

let points = [[50, 300], [100, 100], [200, 100], [300, 100], [350, 300]];

function main(){
    clear();
    
    let curvePoints = [];
    for(let _t = 0; _t < tValue; _t += 0.1){
        curvePoints.push(drawBezierCurve(_t, points));
    }
    let lastPoint = drawBezierCurve(tValue, points, true);
    curvePoints.push(lastPoint);
    drawPoint(lastPoint[0], lastPoint[1], [255, 0, 0, 255]);
    // drawLinesWidth(curvePoints, 1);
    drawLines(curvePoints, [255, 0, 0, 255]);
    // plotLineWidth(0, 0, 100, 100, 10);

    swapBuffer();
}

main();
