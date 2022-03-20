var canvas = document.querySelector('#my-canvas');
var context = canvas.getContext('2d');

var image = context.createImageData(canvas.width, canvas.height);
var data = image.data;

class BALL {
    constructor(x, y, radius, velocityX, velocityY){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
    }
    move() {
        var mRadius = this.radius
        if(this.x > (canvas.width - mRadius) || (this.x < 0 + mRadius)){
            this.velocityX *= -1;
        }
        if(this.y > (canvas.height - mRadius) || (this.y < 0 + mRadius)){
            this.velocityY *= -1;
            // this.velocityX += Math.random()
        }
        // Update position
        this.x += this.velocityX;
        this.y += this.velocityY;
        drawCircle(this.x, this.y, this.radius);
        // console.log(this.x, this.y, this.radius);
    }
}


function drawCircle(x, y, radius){
    var resoluton = 10;
    var angle, x1, y1
    // for(var r = 10; r >= 0; r--){}
    for(i = 0; i < 360; i += resoluton){
        angle = i;
        x1 = radius * Math.cos(angle * Math.PI / 180);
        y1 = radius * Math.sin(angle * Math.PI / 180);
        drawPixel(x + x1, y + y1, {r:0, g:0, b:0, a:255});
    }
    // swapBuffer();
}

function swapBuffer() {
    context.putImageData(image, 0, 0);
}

function drawRandomPixelsOnScreen(){
    var t1 = new Date();
    var min = Math.ceil(0);
    var max = Math.floor(colors.length - 1);
    console.log(max)
    for(var x = 0; x < canvas.width; x++){
        for(var y = 0; y < canvas.height; y++){
            var n = Math.floor(Math.random() * (max - min + 1)) + min;
            var color = colors[n];
            drawPixel(x, y, color);
        }
    }
    // for(var i = 0; i < 10000; ++i) {
    //     var x = canvas.width * Math.random();
    //     var y = canvas.height * Math.random();
    //     var color = colors[i % colors.length];
    
    //     drawPixel(x, y, color);
    //     console
    // }

    swapBuffer();

    var t2 = new Date();
    var dt = t2 - t1;

    console.log('elapsed time = ' + dt + ' ms');
}

var colors = [
    {r: 255, g:   0, b:   0, a: 255}, // red
    {r:   0, g: 255, b:   0, a: 255}, // green
    {r:   0, g:   0, b: 255, a: 255}, // blue
    {r:   0, g:   0, b: 188, a: 0}, // None
];

function clear(){
    for(var x = 0; x < canvas.width; x++){
        for(var y = 0; y < canvas.height; y++){
            drawPixel(x, y, {r: 0, g:   0, b:   0, a: 0});
        }
    }
}

function drawPixel(x, y, color) {

    var roundedX = Math.round(x);
    var roundedY = Math.round(y);

    var index = 4 * (canvas.width * roundedY + roundedX);

    data[index + 0] = color.r;
    data[index + 1] = color.g;
    data[index + 2] = color.b;
    data[index + 3] = color.a;
}

// drawRandomPixelsOnScreen()
ball1 = new BALL(50, 50, 50, 0, 1)
ball2 = new BALL(50, 120, 50, 2, 1)

// var interval = setInterval(function () {
//     main();
// }, 1000);

// ball1.velocityX = 0
// ball1.velocityY = 0
// ball2.velocityX = 0
// ball2.velocityY = 0

// function metaBall(){

// }

function dist(x1, y1, x2, y2){
    a = Math.pow(x2 - x1, 2)
    b = Math.pow(y2 - y1, 2)
    return Math.sqrt(a + b)
}

function map(min1, max1, min2, max2, number){
    a = number / (max1 - min1)
    // console.log((number / min1) * min2)
    r = (a * (max2 - min2) + min2);
    // console.log(r)
    return r;
}

function fillScreen(){
    for(var x = 0; x < canvas.width; x++){
        for(var y = 0; y < canvas.height; y++){
            drawPixel(x, y, {r: x, g:   y, b:   y, a: 255});
            d = dist(x, y, canvas.width / 2, canvas.height / 2);
            // console.log(d)
            // drawPixel(x, y, {r: x, g:   0, b:   y, a: 255});
        }
    }
}

function drawC(){
    for(var x = 0; x < canvas.width; x++){
        for(var y = 0; y < canvas.height; y++){
            d = dist(x, y, canvas.width / 2, canvas.height / 2);
            c = map(0, canvas.width / 2, 0, 255, d);
            // console.log(d)
            drawPixel(x, y, {r: c, g: c, b: c, a: 255});
        }
    }
}

function drawLine(x1, y1, x2, y2){
    var dx = x2 - x1
    var dy = y2 - y1

    for(var i = x1; i < x2; i++){
        y = y1 + dy * (i - x1) / dx
        console.log(i,y)
        drawPixel(i, y, {r: 0, g:   0, b:   0, a: 255})
    }
}

function metaBalls(balls){
    for(var x = 0; x < canvas.width; x++){
        for(var y = 0; y < canvas.height; y++){
            var sum = 0;
            for(var i = 0; i < balls.length; i++){
                ball = balls[i]
                if(x == ball.x && y == ball.y){
                    sum += 255;
                }
                else{
                    d = dist(x, y, ball.x, ball.y -1);
                    // console.log(x, y, ball.x, ball.y -1)
                    // c = map(0, canvas.width / 2, 0, 255, d);
                    // c = ball.radius / d * 100;
                    sum += ball.radius / d * 100;
                }
            }
            drawPixel(x, y, {r: sum, g: sum, b: sum, a: 255});
        }
    }
}

var lOfB = [ball1, ball2]

function main(){
    var t1 = new Date();
    clear();
    drawLine(10, 100, 120, 120);
    // ball1.move();
    // ball2.move();
    // metaBalls(lOfB);
     
    swapBuffer();

    var t2 = new Date();
    var dt = t2 - t1;

    // console.log('elapsed time = ' + dt + ' ms');
}

main();
// console.log(dist(10, 10, 12, 12));
// map(0, 100, 0, 1, 100);
// console.log(map(0, 10, 10, 100, 10));