const gameBoard = document.getElementById("gameBoard");

const images = {
    "X": "/Images/x.png",
    "O": "/Images/o.png"
};

const EMPTY = -1;

const ONGOING = -1;
const TIE = 2;

let currentTurn = 0;
let charTable = ["X", "O"];

let board = null;
let size = null;
let characterButtons = null;

const refreshButton = document.getElementById("refreshButton");

refreshButton.addEventListener('click', () => { 
    setUp();
}, false);

const winIndicator = document.getElementById("winnnerIndicator");

function setUp(){
    characterButtons = gameBoard.children;
    size = Math.sqrt(gameBoard.children.length);
    board = new Array(size);

    for(let y = 0; y < size; y++){
        board[y] = new Array(size);
        for(let x = 0; x < size; x++){
            let index = y * size + x;
            characterButtons[index].addEventListener('click', () => { move(y, x); }, false);
            board[y][x] = EMPTY;
            // dont add top border on y first line
            if(y != 0){
                characterButtons[index].classList.add("borderTop");
            }
            if(y != size - 1){
                characterButtons[index].classList.add("borderDown");
            }
            if(x != 0){
                characterButtons[index].classList.add("borderLeft");
            }
            if(x != size - 1){
                characterButtons[index].classList.add("borderRight");
            }
        }
    }

    drawCharacter();
}

function moveAi(){
    let bestPosition;
    let currentTurnIn = ((currentTurn) ? 0 : 1);
    bestPosition = (getBestMove(board, 10, currentTurnIn, currentTurn, true))[1];
    if(0 < getFreeSpots()){
        // console.log("moved to", bestPosition);
        board[bestPosition[0]][bestPosition[1]] = currentTurn;
        switchTurn();
        drawCharacter();
    }
}

function getBestMove(board, depth, minPlayer, maxPlayer, maximizing){
    let result = checkIftheGameIsOver();
    if(result != ONGOING || depth <= 0){
        let score = (result == maxPlayer) ? 10 :
            ((result == minPlayer) ? -10 : 0);

        return [depth * score, null];
    }

    let bestScore = (maximizing) ? -Infinity : Infinity;
    let bestPosition = [0, 0];

    for(let y = 0; y < size; y++){
        for(let x = 0; x < size; x++){
            if(board[y][x] == EMPTY){
                board[y][x] = (maximizing) ? maxPlayer : minPlayer;
                let score = (getBestMove(board, depth - 1, minPlayer, maxPlayer, !maximizing))[0];
                board[y][x] = EMPTY;
                if(maximizing){
                    if(bestScore < score){
                        bestScore = score;
                        bestPosition = [y, x];
                    }
                }
                else{
                    if(score < bestScore){
                        bestScore = score
                        bestPosition = [y, x];
                    }
                }
            }
        }
    }

    return [bestScore, bestPosition];
}

function switchTurn(){
    currentTurn = (currentTurn) ? 0 : 1;
}

function move(y, x){
    if(checkIftheGameIsOver() != ONGOING){
        drawWin();
        return;
    }

    if(board[y][x] != EMPTY){
        return;
    }
    
    board[y][x] = currentTurn;
    switchTurn();
    drawCharacter();
    moveAi();
    drawCharacter();
}

function drawCharacter(){
    for(let y = 0; y < size; y++){
        for(let x = 0; x < size; x++){
            // ["", 0, 1] => ["O", "X"][0] => images["0"]
            let index = y * size + x;
            let charIndex = board[y][x];
            if(charIndex !== EMPTY){
                let charName = charTable[charIndex];
                characterButtons[index].style.backgroundImage = `url(${images[charName]})`;
                characterButtons[index].style.backgroundRepeat = "no-repeat";
                characterButtons[index].style.backgroundSize = "100% 100%";
            }
            else{
                characterButtons[index].style.backgroundImage = "none";
            }
        }
    }

    drawWin();
}

function isEquals(a, b, c){
    return a == b && b == c && a !== EMPTY;
}

function getFreeSpots(){
    let freeSpots = 0;
    for(let y = 0; y < size; y++){
        for(let x = 0; x < size; x++){
            if(board[y][x] === EMPTY){
                freeSpots++;
            }
        }
    }

    return freeSpots;
}

function getWinner(){
    for(let y = 0; y < size; y++){
        if(isEquals(board[y][0], board[y][1], board[y][2])){
            return [[0, y], [2, y]];
        }

        if(isEquals(board[0][y], board[1][y], board[2][y])){
            return [[y, 0], [y, 2]];
        }
    }
    
    if(isEquals(board[0][0], board[1][1], board[2][2])){
        return [[0, 0], [2, 2]];
    }

    if(isEquals(board[2][0], board[1][1], board[0][2])){
        return [[0, 2], [2, 0]];
    }
    
    return undefined;
}

function checkIftheGameIsOver(){
    const winner = getWinner();
    if(winner != undefined){
        return board[winner[0][1]][winner[0][0]];
    }

    return (0 < getFreeSpots()) ? ONGOING : TIE;
}

function drawWin(){
    let positions = getWinner();
    // positions = [[2, 0], [0, 2]];
    
    if(positions == undefined){
        winIndicator.style.display = "none";
        return;
    }
    // console.log(positions);

    const tableY = ["calc(100% * (1/6) - 5px)", "calc(50% - 5px)", "calc(100% * (5/6) - 5px)"];
    const tableX = ["calc(100% / -3)", "0", "calc(100% / 3)"];

    winIndicator.style.display = "block";

    winIndicator.style.left = tableX[1];
    winIndicator.style.top = tableY[1];
    
    if(positions[0][1] == positions[1][1]){
        winIndicator.style.transform = "rotate(0deg)";
        winIndicator.style.top = tableY[positions[0][1]];
    }
    else if(positions[0][0] == positions[1][0]){
        winIndicator.style.transform = "rotate(-90deg)";
        winIndicator.style.left = tableX[positions[1][0]];

    }
    else if(positions[0][1] == 0){
        winIndicator.style.transform = "rotate(45deg)";
    }
    else{
        winIndicator.style.transform = "rotate(-45deg)";
    }
}

setUp();
