let canvas = document.getElementById("my-canvas");
let context = canvas.getContext("2d");

let image = context.createImageData(canvas.width, canvas.height);
let data = image.data;

let addButton = document.getElementById("addButton");
addButton.addEventListener("click", function() {add(); update();}, false);

let removeButton = document.getElementById("removeButton");
removeButton.addEventListener("click", function() {remove(waveInfo.length - 1); update();}, false);

let downloadImageButton = document.getElementById("downloadImage")
downloadImageButton.addEventListener("click", () => {downloadImage();}, false);

function update(){
    waveBuffer = [];

    drawPoint = 0;
    for(let i = 0; i < waveInfo.length; i++){
        let _i = i * 2 + 1;
        drawPoint += multiply * (4 / (Math.PI * _i));
    }

    drawPoint += 5;
}

let waveHolder = document.getElementById("waveHolder");

let waveInfo = [];
let waveBuffer = [];

let multiply = canvas.width / 10; 
let drawPoint = 0;

let angle = Math.PI;
let angleAdd = 0.025;

function swapBuffer(){
    context.putImageData(image, 0, 0);
}

let xOffset = 0; let yOffset = 0;

function drawPixel(x, y, r, g, b, a){
    let xRounded = Math.round(x + xOffset);
    let yRounded = Math.round(y + yOffset);
    
    if(xRounded < canvas.width && yRounded < canvas.height){
        let index = 4 * (canvas.width * yRounded + xRounded);
        data[index + 0] = r;
        data[index + 1] = g;
        data[index + 2] = b;
        data[index + 3] = a;
    }
}

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
    for (let a = 0; x1 <= x2; x1++){
        if (steep == true){
            drawPixel(y1, x1, rgba[0], rgba[1], rgba[2], rgba[3]);
        }
        else {
            drawPixel(x1, y1, rgba[0], rgba[1], rgba[2], rgba[3]);
        }
        err -= dy;
        if (err < 0){
            y1 += ystep;
            err += dx;
        }
    }
}

function drawCircle(x, y, radius, rgba = [255, 255, 255, 255]){
    let resoluton = 0.1;
    let x1, y1;
    for(let angle = 0; angle < 360; angle += resoluton){
        x1 = radius * Math.cos(angle * Math.PI / 180);
        y1 = radius * Math.sin(angle * Math.PI / 180);
        drawPixel(x + x1, y + y1, rgba[0], rgba[1], rgba[2], rgba[3]);
    }
}

function translate(_xOffset, _yOffset){
    xOffset = _xOffset
    yOffset = _yOffset
}

function clear(){
    translate(0, 0);
    for (let x = 0; x < canvas.width; x++) {
        for (let y = 0; y < canvas.height; y++) {
            drawPixel(x, y, 0, 0, 0, 0);
        }
    }
}

function loop(){
    clear();
    let prevX = 0;
    let prevY = 0;

    let x = 0;
    let y = 0;

    translate(canvas.width / 4, canvas.height / 2);

    for (let i = 0; i < waveInfo.length; i++) {
        let _i = i * 2 + 1;
        let r = multiply * (4 / (Math.PI * _i));

        if(waveInfo[i].wasUpdated == false){
            waveInfo[i].radius = r;
            waveInfo[i].update();
        }

        drawCircle(prevX, prevY, r);
        
        x += r * Math.cos(angle * _i);
        y += r * Math.sin(angle * _i);
        drawLine(prevX, prevY, x, y);

        // Draw Point that is on the circle
        let pointR = 4;
        // if it is last circle then drow a point
        if(i == waveInfo.length - 1){
            for(let i = 1; i < pointR; i++){
                drawCircle(x, y, i);
            }
            drawLine(x, y, drawPoint, y);
            waveBuffer.unshift(y);
        }

        prevX = x;
        prevY = y;
    }
    if(waveBuffer.length > canvas.width){
        waveBuffer.pop();
    }
    for(let i = 0; i < waveBuffer.length - 1; i++){
        drawLine(i + drawPoint, waveBuffer[i], i + drawPoint + 1, waveBuffer[i + 1]);
    }

    angle += angleAdd;
}

let donwloaded = false;

setInterval(() => {
    loop(); 
    swapBuffer();
    downloadImages();
}, 10)
    
/* ############################################################################################### */
/* ####################################        Settings       #################################### */
/* ############################################################################################### */
    
class WAVESETTING {
    constructor(index, radiusElement){
        this.index = index;
        this.radius = null;

        this.radiusElement = radiusElement
        this.wasUpdated = false;
    }
    
    update(){
        this.radiusElement.innerHTML = this.radius;
        this.wasUpdated == true;
    }
}

add();
update();

function add(){
    let newIndex = waveInfo.length;

    let waveSettingsElement = document.createElement("div");
    waveSettingsElement.className = "waveInfo";
    waveSettingsElement.id = "waveSettings1"

    let row1 = document.createElement("div");
    row1.className = "row1"
    let row2 = document.createElement("div");
    row2.className = "row2"
    let row3 = document.createElement("div");
    row3.className = "row3"

    waveSettingsElement.appendChild(row1);
    waveSettingsElement.appendChild(row2);
    waveSettingsElement.appendChild(row3);

    let indexName = document.createElement("p");
    indexName.innerHTML = `Circle: ${newIndex}`;
    row1.appendChild(indexName);

    // Radius
    let radiusHolder = document.createElement("div");
    radiusHolder.className = "radiusHolder";
    row2.appendChild(radiusHolder);
    
    // Radius Text
    let radiusText = document.createElement("div");
    radiusText.innerHTML = "Radius: "
    
    // Radius value
    let radius = document.createElement("div");
    radius.innerHTML = 10;

    // Append 
    radiusHolder.appendChild(radiusText);
    radiusHolder.appendChild(radius);

    waveHolder.appendChild(waveSettingsElement);

    waveInfo.push(new WAVESETTING(newIndex, radius));
}

function remove(index){
    waveHolder.children[index].remove()
    waveInfo.splice(index, 1);
}

/* ############################################################################################### */
/* ##################################    Downloading    ########################################## */
/* ############################################################################################### */

let toggleDownload = document.getElementById("toggleDownload");

toggleDownload.addEventListener("click", () => {
    downloading = !downloading;
    if(downloading){
        toggleDownload.className = "pauseButton";
    }
    else{
        toggleDownload.className = "playButton";
    }
}, false);

var imagesFile = {imagesBase64: []}

var downloading = false;

var filename = "imagesBase64.json"

function downloadAll(){
    stringJsonImagesFile =  JSON.stringify(imagesFile);
    download(generateTextFileUrl(stringJsonImagesFile), filename);
    imagesFile.imagesBase64 = [];
}

function downloadImages(){
    if(downloading == true){
        console.log("");
        var dataURL = canvas.toDataURL("image/jpeg", 1.0);
        imagesFile.imagesBase64.push(dataURL);
    }
}

function downloadImage(){
    var dataURL = canvas.toDataURL("image/jpeg", 1.0);
    downloadFile(dataURL, `fourierSeries_${Date.now()}.jpeg`);
}

function generateTextFileUrl(txt) {
    var textFileUrl = null;
    let fileData = new Blob([txt], {type: 'text/plain'});
    if (textFileUrl !== null) {
        window.URL.revokeObjectURL(textFile);
    }
    textFileUrl = window.URL.createObjectURL(fileData);
    return textFileUrl;
};


function downloadFile(data, filename = 'untitled.jpeg') {
    var a = document.createElement('a');
    a.href = data;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
}