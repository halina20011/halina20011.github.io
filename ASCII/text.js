var canvas = document.getElementById("canvas");
var context = canvas.getContext('2d');

canvas.style.width = "100%"

var image = context.createImageData(canvas.width, canvas.height);
var data = image.data;

context.font = `100 10px Roboto, sans-serif`;
context.textAlign = "left"; 

function drawPixel(x, y, r, g, b, a) {
    var roundedX = Math.round(x);
    var roundedY = Math.round(y);
    
    var index = 4 * (canvas.width * roundedY + roundedX);
    
    data[index + 0] = r;
    data[index + 1] = g;
    data[index + 2] = b;
    data[index + 3] = a;
}

context.fillText("A", 5, 5);