import func from "../../Tools/func.js";

document.querySelector(".solve").onclick = solve;
document.querySelector(".clear").onclick = clear;

const sudoku = document.querySelector(".sudoku");
const inputs = [];
const board = [];

let shift = false;
document.addEventListener("keydown", (e) => {
    if(e.key == "Shift"){
        shift = true;
    }
}, false);

document.addEventListener("keyup", (e) => {
    if(e.key == "Shift"){
        shift = false;
    }
}, false);

for(let y = 0; y < 9; y++){
    board.push([]);
    inputs.push([]);
    for(let x = 0; x < 9; x++){
        const input = func.createElement(`<input type="text"></input>`);
        if((y + 1) % 3 == 0){
            input.classList.add("borderDown");
        }
        const update = () => {
            if(1 < input.value.length){
                input.value = input.value[0];
            }
            const val = parseInt(input.value);
            if(!isNaN(val)){
                if(!check(val, x, y)){
                    inputs[y][x].classList.add("invalid");
                }
                else{
                    inputs[y][x].classList.remove("invalid");
                }
                board[y][x] = val;
            }
            else{
                board[y][x] = "";
                inputs[y][x].classList.remove("invalid");
            }
            input.value = board[y][x];
        };
        input.onclick = () => {
            if(shift){
                input.classList.toggle("dontClear");
            }
        }
        board[y][x] = 0;
        inputs[y][x] = input;
        input.oninput = update;
        sudoku.appendChild(input);
    }
}

function getFreeSpot(){
    for(let y = 0; y < 9; y++){
        for(let x = 0; x < 9; x++){
            if(board[y][x] == 0){
                return [x,y];
            }
        }
    }

    return [null, null];
}

function check(char, x, y){
    if(char === 0){
        return true;
    }
    // check all rows and columns
    for(let i = 0; i < 9; i++){
        if(board[y][i] == char || board[i][x] == char){
            return false;
        }
    }

    const startX = Math.floor(x / 3) * 3;
    const startY = Math.floor(y / 3) * 3;
    for(let y = 0; y < 3; y++){
        for(let x = 0; x < 3; x++){
            if(board[startY + y][startX + x] == char){
                return false;
            }
        }
    }

    return true;
}

const createTable = () => {
    return [0,0,0,0,0,0,0,0,0,0];
}

function valid(){
    for(let j = 0; j < 9; j++){
        const tableX = createTable();
        const tableY = createTable();
        for(let i = 0; i < 9; i++){
            const xV = board[j][i];
            const yV = board[i][j];
            if((xV != 0 && tableX[xV] != 0) || (yV != 0 && tableY[yV])){
                return false;
            }
            tableX[xV]++;
            tableY[yV]++;
        }

        const startX = Math.floor(j % 3);
        const startY = Math.floor(j / 3) * 3;
        const tableB = createTable();
        for(let y = 0; y < 3; y++){
            for(let x = 0; x < 3; x++){
                const bV = board[startY + y][startX + x];
                if(bV != 0 && tableB[bV] != 0){
                    return false;
                }
                tableB[bV]++;
            }
        }
    }

    return true;
}

function solver(){
    const [x, y] = getFreeSpot();
    if(x == null && y == null){
        return true;
    }
    for(let i = 1; i <= 9; i++){
        if(check(i, x, y)){
            board[y][x] = i;
            if(solver()){
                return true;
            }
            board[y][x] = 0;
        }
    }

    return false;
}

function clear(){
    for(let y = 0; y < 9; y++){
        for(let x = 0; x < 9; x++){
            if(!inputs[y][x].classList.contains("dontClear")){
                inputs[y][x].value = "";
                board[y][x] = 0;
            }
        }
    }
}

function solve(){
    if(!valid()){
        alert("invalid sudoku board");
        return;
    }
    if(solver()){
        for(let y = 0; y < 9; y++){
            for(let x = 0; x < 9; x++){
                inputs[y][x].value = board[y][x];
            }
        }
    }
}

console.log(getFreeSpot());
