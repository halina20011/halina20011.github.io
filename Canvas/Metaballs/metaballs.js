import {CANVAS} from "/Canvas/canvas.js";
import {DOWNLOADER} from "/Canvas/download.js";

const canvasEl = document.getElementById("my-canvas");

const canvas = new CANVAS(canvasEl);
const downloader = new DOWNLOADER(canvasEl);

const downloadImageButton = document.getElementById("downloadImage");
downloadImageButton.addEventListener("click", function() { downloader.downloadImage(); }, false);

let play = true;
const buttonStart = document.getElementById("pauseButton");
buttonStart.addEventListener("click", () => { changeStateOfPlayPauseButton() }, false);

function changeStateOfPlayPauseButton(){
    play = !play;
    if(play == true){
        buttonStart.style.backgroundImage = "url(\"/Images/Icons/pause.png\")";
    }
    else{
        buttonStart.style.backgroundImage = "url(\"/Images/Icons/play.png\")";
    }
}

class BALL{
    constructor(x, y, radius, velocityX, velocityY){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
    }

    move(){
        if((canvas.width - this.radius) < this.x || this.x < (0 + this.radius)){
            this.velocityX = -this.velocityX;
            if(this.velocityY == 0){this.velocityY = Math.random();}
        }

        if((canvas.height - this.radius) < this.y || this.y < (0 + this.radius)){
            this.velocityY = -this.velocityY;
            if(this.velocityX == 0){this.velocityX = Math.random();}
        }

        this.x += this.velocityX;
        this.y += this.velocityY;
        // canvas.drawCircle(this.x, this.y, this.radius)
    }
}

function dist(x1, y1, x2, y2){
    const a = Math.pow(x2 - x1, 2);
    const b = Math.pow(y2 - y1, 2);
    return Math.sqrt(a + b);
}

function random(min, max){
    // Math.random() returns a float between 0 (inclusive) and 1 (exclusive) => <0; 1)
    // x = Math.random(), 0.0 <= x < 1.0
    // Calculate range between min and max. 
    // Multiply `range` with random float.
    // Add min to result to number in correct interval.
    return (Math.random() * (max - min + 1) + min);
}

// let ball1 = new BALL(50, 50, 50, 0, 1);
// let ball2 = new BALL(50, 50, 50, 1, 0);
// let ball3 = new BALL(50, 50, 50, 1, 1);
// let metaBallsList = [ball1];

const metaBallsList = []
const balls = 2;

for(let i = 1; i <= balls; i++){
    metaBallsList.push(new BALL(50, 50, 50, random(1, 2.5), random(1, 2.5)))
}

function drawMetaBalls(metaBalls){
    for(let y = 0; y < canvas.height; y++){
        for(let x = 0; x < canvas.width; x++){
            let sum = 0;
            for(let i = 0; i < metaBalls.length; i++){
                const ball = metaBalls[i];
                const d = dist(x, y, ball.x, ball.y);
                sum += ball.radius / d * 150;
            }

            canvas.drawPixel(x, y, sum, sum, sum, 255);
        }
    }
}

function main(){
    if(play == true){
        drawMetaBalls(metaBallsList);

        for(let i = 0; i < metaBallsList.length; i++){
            metaBallsList[i].move();
        }

        canvas.swapBuffer();
    }
}

main();

setInterval(() => {
    main();
}, 10);
