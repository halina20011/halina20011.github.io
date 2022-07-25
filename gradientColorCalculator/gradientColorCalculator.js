let canvas = document.getElementById("my-canvas");
let context = canvas.getContext("2d");

let image = context.createImageData(canvas.height, canvas.height);
let data = image.data;

let colorHolder = document.getElementById("colorHolder");

function drawPixel(x, y, r, g, b, a){
    let roundedX = Math.round(x);
    let roundedY = Math.round(y);

    let index = 4 * (canvas.width * roundedY + roundedX);

    data[index + 0] = r;
    data[index + 1] = g;
    data[index + 2] = b;
    data[index + 3] = a;
}

function swapBuffer(){
    context.putImageData(image, 0, 0);
}

function main(){
    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            drawPixel(x, y, x, y, 0, 255);
        }        
    }
    swapBuffer();
}

main();