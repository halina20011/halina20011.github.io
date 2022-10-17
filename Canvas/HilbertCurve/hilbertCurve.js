import {DOWNLOADER} from "/Canvas/download.js";

let canvas = document.getElementById("my-canvas");
let context = canvas.getContext("2d");

let image = context.createImageData(canvas.width, canvas.height);
let data = image.data;

let levelNumber = document.getElementById("level");
levelNumber.addEventListener("input", () => {
    level = levelNumber.value;
    main();
}, false);

let showGrid = document.getElementById("showGrid");
showGrid.addEventListener("input", () => {
    main();
}, false);

let downloader = new DOWNLOADER(canvas);

let downloadImageButton = document.getElementById("downloadImage");
downloadImageButton.addEventListener("click", function() { downloader.downloadImage(); }, false);

let updateButton = document.getElementById("update");
updateButton.addEventListener("click", function() { main(); }, false);

function timelapsee(from, to){
    level = from;
    console.log(`Iterations timelapse from: ${from}, to: ${to}.`);
    for(let i = from; i < to - from; i++){
        level++;
        main();
        downloader.addImage();
        console.log(`Number of levels currently running: ${level}.`)
    }
    downloader.downloadAll();
}

let timelapseInputData = {
    "text": "Iterations: ",
    "inputFrom":{"from": 0, "value": 0},
    "inputTo": {"from": 1, "value": 1}
}

let timelapse = downloader.timelapse(timelapseInputData, timelapsee);

function swapBuffer(){
    context.putImageData(image, 0, 0);
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

function swap(i1, i2){
    return [i2, i1];
}

function clear(){
    for(let y = 0; y < canvas.height; y++){
        for(let x = 0; x < canvas.width; x++){
            drawPixel(x, y, 0, 0, 0, 0);
        }
    }
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
        if(steep == true){
            drawPixel(y1, x1, rgba[0], rgba[1], rgba[2], rgba[3]);
        }
        else{
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
//    let dx = Math.abs(x2 - x1), sx = x1 < x2 ? 1 : -1;
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
        if(2*e2 <= dy){
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
    let offset = canvas.width / resolution;
    for(let r = 0; r < resolution - 1; r++){
        let position = offset + offset * r;
        drawLine(position, 0, position, canvas.height);
        drawLine(0, position, canvas.width, position);
    }
}

function rotatePoint(matrix, rotation){
    let newMatrix = generateArray(matrix.length);
    for(let y = 0; y < matrix.length; y++){
        for(let x = 0; x < matrix[y].length; x++){
            // console.log(newMatrix[y][x]);
            for(let pointI = 0; pointI < matrix[y][x].length; pointI++){
                let point = matrix[y][x][pointI];
                if(rotation == 90){
                    if(point == 3){
                        newMatrix[y][x].push(0);
                    }
                    else{
                        newMatrix[y][x].push(point + 1);
                    }
                }
                else{
                    if(point == 0){
                        newMatrix[y][x].push(3);
                    }
                    else{
                        newMatrix[y][x].push(point - 1);
                    }
                }
            }
        }
    }
    // console.log(matrix, newMatrix);
    return newMatrix;
}

// let a = [1, 2, 3];
// let b = [...a];
// b[0] = 111;
// console.log(b, a);

function copyArray(array){
    return [...array];
}

// rotateArray([[1, 2, 3], 
//             [4, 5, 6], 
//             [7, 8, 9]], -90);

// rotateArray([[[1], [2]], [[4, 3], [4, 3]]], -90);

function rotateArray(matrix, rotation){
    if(matrix.length != matrix[0].length){
        return matrix;
    }
    let newMatrix = generateArray(matrix.length);
    if(rotation == 90){
        for(let y = 0; y < matrix.length; y++){
            let layer = matrix[y];
            for(let x = 0; x < matrix.length; x++){
                newMatrix[x][matrix.length - 1 - y] = layer[x];
            }
        }
    }
    else if(rotation == -90){
        for(let y = 0; y < matrix.length; y++){
            let layer = matrix[y];
            for(let x = 0; x < matrix.length; x++){
                newMatrix[matrix.length - 1 - x][y] = layer[x];
            }
        }
    }
    // console.log(JSON.stringify(matrix), JSON.stringify(newMatrix));
    // console.log(matrix, newMatrix);
    return rotatePoint(newMatrix, rotation);
}

function addArrayes(main, toAdd, offsetX = 0, offsetY = 0){
    for(let y = 0; y < toAdd.length; y++){
        for(let x = 0; x < toAdd[y].length; x++){
            main[y + offsetY][x + offsetX] = copyArray(toAdd[y][x]);
        }
    }
    return main;
}

let curveColor = [255, 0, 0, 255];
let wd = 1;

function drawCurve(grid, gridNumber){
    let XOffset = canvas.width / gridNumber;
    let YOffset = canvas.height / gridNumber;
    let xOffset = XOffset / 2;
    let yOffset = YOffset / 2;
    for(let y = 0; y < grid.length; y++){
        let positionY = yOffset + YOffset * y;
        for(let x = 0; x < grid[y].length; x++){
            let positionX = xOffset + XOffset * x;
            grid[y][x].forEach(point => {
                if(point == 0){
                    // plotLineWidth(positionX, positionY - yOffset, positionX, positionY, wd, curveColor);
                    drawLine(positionX, positionY - yOffset, positionX, positionY, curveColor);
                }
                if(point == 1){
                    drawLine(positionX + xOffset, positionY, positionX, positionY, curveColor);
                }
                if(point== 2){
                    drawLine(positionX, positionY + yOffset, positionX, positionY, curveColor);
                }
                if(point == 3){
                    drawLine(positionX - xOffset, positionY, positionX, positionY, curveColor);
                }
            });
        }
    }
}

function generateArray(arrayLength){
    let newArray = [];
    for(let y = 0; y < arrayLength; y++){
        newArray.push([]);
        for(let x = 0; x < arrayLength; x++){
            newArray[y].push([]);
            // newArray[y].push([0, 0]);
        }
    }
    return newArray;
}

// Take curve from level - 1, and place it
// On quadrant III and IV rotate it 
// Connect the curves
function generateCurve(level){
    if(level == 1){
        return [[[1, 2], [2, 3]], [[0], [0]]];
    }
    else{
        let previusCurve = generateCurve(level - 1);
        // console.log(previusCurve);
        let curveOffset = previusCurve.length;
        let _gridNumber = Math.pow(2, level);

        let grid = generateArray(_gridNumber);

        addArrayes(grid, previusCurve, 0, 0);
        addArrayes(grid, previusCurve, curveOffset, 0);
        addArrayes(grid, rotateArray(previusCurve, 90), 0, curveOffset);
        addArrayes(grid, rotateArray(previusCurve, -90), curveOffset, curveOffset);

        // Connect
        grid[_gridNumber / 2 - 1][0].push(2)
        grid[_gridNumber / 2 - 1][_gridNumber / 2 - 1].push(1);
        grid[_gridNumber / 2 - 1][_gridNumber / 2].push(3);
        grid[_gridNumber / 2 - 1][_gridNumber - 1].push(2);
        grid[_gridNumber / 2][0].push(0);
        grid[_gridNumber / 2][_gridNumber - 1].push(0);
        // console.log(JSON.stringify(grid));
        // console.log(JSON.stringify(gridFirstLevel));
        return grid;
    }
}

// 2, 4, 8
let level = levelNumber.value;

const gridFirstLevel = [[[1, 2], [2, 3]], [[0], [0]]];
// console.log(rotateArray(gridFirstLevel, 90))

function main(){
    clear();
    let gridNumber = Math.pow(2, level);
    let curveLength = Math.pow(2, level) - 1 / Math.pow(2, level);
    if(showGrid.checked == true){
        drawGrid(gridNumber);
    }
    let hilbertCurve = generateCurve(level);
    // console.log(gridNumber);
    drawCurve(hilbertCurve, gridNumber);
    swapBuffer();
}

main();