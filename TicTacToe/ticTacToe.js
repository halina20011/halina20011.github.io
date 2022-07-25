var x = "/images/x.png";
var o = "/images/o.png";

var currentTurn = "X";

var human = "X";
var ai = "O";

let board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
];

const chracterButton1 = document.getElementById('chracterButton1')
const characterSpot1 = document.getElementById('characterSpot1');

const chracterButton2 = document.getElementById('chracterButton2')
const characterSpot2 = document.getElementById('characterSpot2');

const chracterButton3 = document.getElementById('chracterButton3')
const characterSpot3 = document.getElementById('characterSpot3');

const chracterButton4 = document.getElementById('chracterButton4')
const characterSpot4 = document.getElementById('characterSpot4');

const chracterButton5 = document.getElementById('chracterButton5')
const characterSpot5 = document.getElementById('characterSpot5');

const chracterButton6 = document.getElementById('chracterButton6')
const characterSpot6 = document.getElementById('characterSpot6');

const chracterButton7 = document.getElementById('chracterButton7')
const characterSpot7 = document.getElementById('characterSpot7');

const chracterButton8 = document.getElementById('chracterButton8')
const characterSpot8 = document.getElementById('characterSpot8');

const chracterButton9 = document.getElementById('chracterButton9')
const characterSpot9 = document.getElementById('characterSpot9');

const winIndicator = document.getElementsByClassName("winIndicator")[0]
const refreshButton = document.getElementById("refresh");

chracterButton1.addEventListener('click', function() {move(0,0);}, false)
chracterButton2.addEventListener('click', function() {move(0,1);}, false)
chracterButton3.addEventListener('click', function() {move(0,2);}, false)
chracterButton4.addEventListener('click', function() {move(1,0);}, false)
chracterButton5.addEventListener('click', function() {move(1,1);}, false)
chracterButton6.addEventListener('click', function() {move(1,2);}, false)
chracterButton7.addEventListener('click', function() {move(2,0);}, false)
chracterButton8.addEventListener('click', function() {move(2,1);}, false)
chracterButton9.addEventListener('click', function() {move(2,2);}, false)

refreshButton.addEventListener('click', function() {location.reload();}, false)
// var images = [
//     [characterSpot1, characterSpot2, characterSpot3],
//     [characterSpot4, characterSpot5, characterSpot6],
//     [characterSpot7, characterSpot8, characterSpot9]
// ];

// console.log(winIndicator.style.display)
winIndicator.style.display = "none"

var buttons = [
    [chracterButton1, chracterButton2, chracterButton3],
    [chracterButton4, chracterButton5, chracterButton6],
    [chracterButton7, chracterButton8, chracterButton9]
]

var spots = [
    [characterSpot1, characterSpot2, characterSpot3],
    [characterSpot4, characterSpot5, characterSpot6],
    [characterSpot7, characterSpot8, characterSpot9]
];

drawCharacter();

function turn(s = false){
    if(s == true){
        return currentTurn == "X" ? ai : human;
    }
    return currentTurn == "X" ? x : o;
}

function moveAi(){
    // var bestScore = -Infinity;
    var bestScore = Infinity;
    var move = [0, 0];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if(board[i][j] == ''){
                board[i][j] = ai;
                var score = getBestMove(board, 10, true);
                board[i][j] = '';
                if(score < bestScore){
                    bestScore = score;
                    move = {i, j};
                }
            }
        }
    }
    if(getFreeSpots() != 0){
        board[move.i][move.j] = ai;
        currentTurn = turn(true);
        drawCharacter();
    }
}

var scores = {
    X: 10,
    O: -10,
    tie: 0
};

function getBestMove(board, depth, maxmizingPlayer){
    var resurlt = checkIftheGameIsOver();
    if(resurlt != null){
        // console.log(score("x"), score[O], score[tie]);
        // console.log(scores[resurlt]);
        return scores[resurlt] * depth;
    }
    
    if(maxmizingPlayer){
        var bestScore = -Infinity;
        for(var i = 0; i < 3; i++){
            for(var j = 0; j < 3; j++){
                if(board[i][j] == ''){
                    // board[i][j] = ai;
                    board[i][j] = human;
                    var score = getBestMove(board, depth - 1, false);
                    board[i][j] = '';
                    // bestScore = max(score, bestScore);
                    if(score > bestScore){
                        bestScore = score;
                    }
                }
            }
        }
        return bestScore;
    }
    else{
        var bestScore = +Infinity;
        for(var i = 0; i < 3; i++){
            for(var j = 0; j < 3; j++){
                if(board[i][j] == ''){
                    // board[i][j] = human;
                    board[i][j] = ai;
                    var score = getBestMove(board, depth - 1, true);
                    board[i][j] = '';
                    if(score < bestScore){
                        bestScore = score;
                    }
                }
            }
        }
        return bestScore;
    }
}

function move(line, column){
    if(checkIftheGameIsOver() != null){
        drawWin()
        console.log(checkIftheGameIsOver());
        return;
    }
    if(board[line][column] != ''){
        return;
    }
    board[line][column] = currentTurn;
    currentTurn = turn(true);
    drawCharacter();
    moveAi();
    drawWin()
}

function drawCharacter(){
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if(board[i][j] == "X"){
                buttons[i][j].style.backgroundImage = `url( ${x} )`;
                buttons[i][j].style.backgroundRepeat = "no-repeat";
                buttons[i][j].style.backgroundSize = "100% 100%";
            }
            else if(board[i][j] == "O"){
                buttons[i][j].style.backgroundImage = `url( ${o} )`;
                buttons[i][j].style.backgroundRepeat = "no-repeat";
                buttons[i][j].style.backgroundSize = "100% 100%";
            }
            // else{
            //     spots[i][j].src = "/images/none.png";
            // }
        }
    }
}

function isEquals(a, b, c){
    return a == b && b == c && a != '';
}

function getFreeSpots(){
    var freeSpots = 0;
    for(var i = 0; i < 3; i++){
        for (let j = 0; j < 3; j++) {
            if(board[i][j] == ''){
                freeSpots++;
            }
        }
    }
    return freeSpots;
}

function checkIftheGameIsOver(){
    let winner = null;
    var position = [[null][null],[null][null],[null][null]]
    for (let i = 0; i < 3; i++) {
        if(isEquals(board[i][0], board[i][1], board[i][2])){
            winner = board[i][0];
        }
    }
    
    for (let i = 0; i < 3; i++) {
        if(isEquals(board[0][i], board[1][i], board[2][i])){
            winner = board[0][i];
            position = [i, 1, 2]
        }
    }
    
    if(isEquals(board[0][0], board[1][1], board[2][2])){
        winner = board[0][0];
    }
    if(isEquals(board[2][0], board[1][1], board[0][2])){
        winner = board[2][0];
    }
    
    var freeSpots = 0;
    for(var i = 0; i < 3; i++){ //Make for loop to check all positions
        for (let j = 0; j < 3; j++) {
            if(board[i][j] == ''){
                freeSpots++;
            }
        }
    }
    
    if(winner == null && freeSpots == 0){
        return "tie";
    }
    else{
        return winner;
    }
}

function drawWin(){
    let winner = null;
    var position = []
    xPositions = [-30, 0, 30]
    yPositions = [-30, 0, 30]
    for (let i = 0; i < 3; i++) {
        if(isEquals(board[i][0], board[i][1], board[i][2])){
            winIndicator.style.display = "block"
            winIndicator.style.transform = "rotate(90deg)"
            pos = xPositions[i]
            winIndicator.style.top = pos+"%"
        }
    }
    
    for (let i = 0; i < 3; i++) {
        if(isEquals(board[0][i], board[1][i], board[2][i])){
            winIndicator.style.display = "block"
            pos = yPositions[i]
            winIndicator.style.left = pos+"%"
        }
    }
    
    if(isEquals(board[0][0], board[1][1], board[2][2])){
        winIndicator.style.display = "block"
        winIndicator.style.transform = "rotate(135deg)"
    }
    if(isEquals(board[2][0], board[1][1], board[0][2])){
        winIndicator.style.display = "block"
        winIndicator.style.transform = "rotate(45deg)"
    }
}