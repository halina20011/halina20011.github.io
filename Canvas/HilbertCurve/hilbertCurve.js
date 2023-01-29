import {CANVAS} from "/Canvas/canvas.js";
import {DOWNLOADER} from "/Canvas/download.js";

let canvasEl = document.getElementById("my-canvas");

let canvas = new CANVAS(canvasEl);
let downloader = new DOWNLOADER(canvasEl);

let levelNumber = document.getElementById("level");
levelNumber.addEventListener("input", () => {
    level = levelNumber.value;
    main();
}, false);

let showGrid = document.getElementById("showGrid");
showGrid.addEventListener("input", () => {
    main();
}, false);

let downloadImageButton = document.getElementById("downloadImage");
downloadImageButton.addEventListener("click", function() { downloader.downloadImage(); }, false);

let updateButton = document.getElementById("update");
updateButton.addEventListener("click", function() { main(); }, false);

function timelapsee(fArguments){
    let from = parseInt(fArguments[0].value);
    let to = parseInt(fArguments[1].value);
    if(from * 0 == 0 && to * 0 == 0){
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
}

let timelapseInputData = {
    "function": timelapsee,
    "arguments": [{
            "text": {"element": "p", "innerHTML": "Iterations: "},
            "inputFrom": {"element": "input", "type": "number", "from": 0, "value": 0},
            "inputTo": {"element": "input", "type": "number", "from": 1, "value": 1}
        }
    ]
}

let timelapse = downloader.timelapse(timelapseInputData);

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
                    canvas.drawLine(positionX, positionY - yOffset, positionX, positionY, curveColor);
                }
                if(point == 1){
                    canvas.drawLine(positionX + xOffset, positionY, positionX, positionY, curveColor);
                }
                if(point== 2){
                    canvas.drawLine(positionX, positionY + yOffset, positionX, positionY, curveColor);
                }
                if(point == 3){
                    canvas.drawLine(positionX - xOffset, positionY, positionX, positionY, curveColor);
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
    canvas.clear();
    let gridNumber = Math.pow(2, level);
    let curveLength = Math.pow(2, level) - 1 / Math.pow(2, level);

    if(showGrid.checked == true){
        canvas.drawGrid(gridNumber);
    }

    let hilbertCurve = generateCurve(level);
    // console.log(gridNumber);
    drawCurve(hilbertCurve, gridNumber);
    canvas.swapBuffer();
}

main();
