let canvas = document.getElementById('my-canvas');
let context = canvas.getContext('2d');

let image = context.createImageData(canvas.width, canvas.height);
let data = image.data;

let resolution = 0;

let red, green, blue;

let generateButton = document.getElementById('generate');
generateButton.addEventListener('click', () => { main(); }, false);

let selectSize = document.getElementById("selectSize");
selectSize.addEventListener('change', () => { changeResolution(); }, false);

let colorOfLine = document.getElementById("colorOfLine");
colorOfLine.addEventListener("change", () => { main(); }, false);

let downloadButton = document.getElementById("downloadImage");
downloadButton.addEventListener("click", () => { downloadImage(); }, false);

let autoRefreshButton = document.getElementById("autoRefresh")
let intervalSettings = document.getElementById("intervalSettings");

let interval = 100;

autoRefreshButton.addEventListener("click", () => {
    autoRefreshButton.classList.toggle("unchecked");
    intervalSettings.classList.toggle("hidden");
    a = function(){
        if(autoRefreshButton.classList.contains("unchecked") == true){
            main();
            let intervalInput = document.getElementById("intervalInput");
            interval = intervalInput.value;
            if(!interval){
                interval = intervalInput.min;
            }
            console.log(interval);
            setTimeout(a, interval);
        }
    }
    setTimeout(a, interval);
});

function getPrimeFactors(number, list = []){
    if(number == 0 || number == 1){
        return list;
    }
    for(let i = 2; i < number / 2; i++){
        if(number % i == 0){
            list.push(i);
            // console.log(number / i, list);
            return getPrimeFactors(number / i, list);
        }
    }
    list.push(number)
    return list;
}

function getIndex(list, value){
    for(let i = 0; i < list.length; i++){
        if(list[i] == value){
            return i;
        }
    }
    return -1;
}

function calculateAllPosiableSizes(){
    let primeF = getPrimeFactors(canvas.width, []);
    let sizes = []
    let last;
    console.log(primeF);
    for (let i = 0; i < primeF.length; i++) {
        for (let x = 0; x < primeF.length; x++) {
            if(i != x){
                last = primeF[i] * primeF[x]
                if(getIndex(sizes, last) == -1){
                    sizes.push(last);
                }
                if(getIndex(sizes, last * primeF[x]) == -1 && canvas.width % (last * primeF[x]) == 0){
                    sizes.push(last * primeF[x]);
                }
            }
        }
    }
    return sizes;
}

function showAllSizes(sizes){
    for (let i = 0; i < sizes.length; i++) {
        let option = document.createElement("option");
        option.innerHTML = sizes[i]
        selectSize.appendChild(option);
    }
}

let sizes = calculateAllPosiableSizes();
showAllSizes(sizes);

showSize();

function showSize(){
    let widthText = document.getElementById("widthText");
    let heightText = document.getElementById("heightText");
    widthText.innerHTML = "Width: " + canvas.width;
    heightText.innerHTML = "Height: " + canvas.height;
}

changeResolution();

function changeResolution(){
    // let empty = "&nbsp;".repeat(3 - String(resolution).length);
    resolution = parseInt(selectSize.value);
    main();
}

function swapBuffer() {
    context.putImageData(image, 0, 0);
}

function clear(){
    for(let x = 0; x < canvas.width; x++){
        for(let y = 0; y < canvas.height; y++){
            drawPixel(x, y, 0, 0, 0, 0);
        }
    }
}

function drawPixel(x, y, r, g, b, a){
    let roundedX = Math.round(x);
    let roundedY = Math.round(y);

    let index = 4 * (canvas.width * roundedY + roundedX);

    data[index + 0] = r;
    data[index + 1] = g;
    data[index + 2] = b;
    data[index + 3] = a;
}

function hexToRgb(hex){
    r = parseInt(hex.substr(1, 2), 16);
    g = parseInt(hex.substr(3, 2), 16);
    b = parseInt(hex.substr(5, 2), 16);
    return [r, g, b];
}

function drawLine(x1, y1, x2, y2) {
    if(x1 == x2){
        if(y2 - y1 < 0){
            let x = x1;
            x1 = x2;
            x2 = x;
            
            let y = y1;
            y1 = y2;
            y2 = y;
        }
        
        let dx = x2 - x1;
        let dy = y2 - y1;

        for(let y = y1; y < y2; y++){
            let x = x1 + dx * (y - y1) / dy;
            drawPixel(x, y, red, green, blue, 255);
        }
    }
    if(x2 - x1 < 0){
        let x = x1;
        x1 = x2;
        x2 = x;
        
        let y = y1;
        y1 = y2;
        y2 = y;
    }

    let dx = x2 - x1;
    let dy = y2 - y1;
    for(let x = x1; x < x2; x++){
        let y = y1 + dy * (x - x1) / dx;
        drawPixel(x, y, red, green, blue, 255);
    }
}

function drawPoints(Field, resolution, columns, rows){
    for(let i = 0; i < columns; i++){
        for(let j = 0; j < rows; j++){
            if(Field[i][j] == 1){
                console.log(i, j);
                drawPixel(j * resolution, i * resolution, 255, 0, 0, 255);
                drawPixel(j * resolution + 1, i * resolution, 255, 0, 0, 255);
                drawPixel(j * resolution - 1, i * resolution, 255, 0, 0, 255);
                drawPixel(j * resolution, i * resolution + 2, 255, 0, 0, 255);
                drawPixel(j * resolution, i * resolution - 2, 255, 0, 0, 255);
            }
        }
    }
}

function drawIsolines(Field, resolution, columns, rows){
    for(let i = 0; i < columns - 1; i++){
        for(let j = 0; j < rows - 1; j++){
            let x = j * resolution;
            let y = i * resolution;

            let a = [x + resolution / 2 , y];
            let b = [x + resolution     , y + resolution / 2];
            let c = [x + resolution / 2 , y + resolution];
            let d = [x                  , y + resolution / 2];

            let A = Field[i][j];
            let B = Field[i][j + 1];
            let C = Field[i + 1][j + 1];
            let D = Field[i + 1][j];

            let state = D * 1 + C * 2 + B * 4 + A * 8;
            // console.log(A, B, C, D, state);color = colorOfLine.value;
            switch (state){
                case 1:
                    drawLine(c[0], c[1], d[0], d[1]);
                    break;
                case 2:
                    drawLine(b[0], b[1], c[0], c[1]);
                    break;
                case 3:
                    drawLine(b[0], b[1], d[0], d[1]);
                    break;
                case 4:
                    drawLine(a[0], a[1], b[0], b[1]);
                    break;
                case 5:
                    drawLine(a[0], a[1], d[0], d[1]);
                    drawLine(b[0], b[1], c[0], c[1]);
                    break;
                case 6:
                    drawLine(a[0], a[1], c[0], c[1]);
                    break;
                case 7:
                    drawLine(a[0], a[1], d[0], d[1]);
                    break;
                case 8:
                    drawLine(a[0], a[1], d[0], d[1]);
                    break;
                case 9:
                    drawLine(a[0], a[1], c[0], c[1]);
                    break;
                case 10:
                    drawLine(a[0], a[1], b[0], b[1]);
                    drawLine(c[0], c[1], d[0], d[1]);
                    break;
                case 11:
                    drawLine(a[0], a[1], b[0], b[1]);
                    break;
                case 12:
                    drawLine(b[0], b[1], d[0], d[1]);
                    break;
                case 13:
                    drawLine(b[0], b[1], c[0], c[1]);
                    break;
                case 14:
                    drawLine(c[0], c[1], d[0], d[1]);
                    break;
            }
        }
    }
}

function main(){
    let columns = 1 + canvas.height / resolution;
    let rows = 1 + canvas.width / resolution;
    console.log(`Columns: ${columns}, Rows: ${rows}`);
    
    console.log("Generating");
    let field = [[]];

    let color = colorOfLine.value;
    let colorRgba = hexToRgb(color);
    red = colorRgba[0]
    green = colorRgba[1]
    blue = colorRgba[2]
    console.log(red, green, blue);
    for(let i = 0; i < columns; i++){
        field.push([]);
        for(let j = 0; j < rows; j++){
            let r = Math.round(Math.random());
            // console.log(r);
            field[i].push(r);
        }
        // console.log(field[i])
    }
    // console.log()
    
    clear();
    drawIsolines(field, resolution, columns, rows);
    // drawPoints(field, resolution, columns, rows);

    swapBuffer();
}

function downloadImage(){
    var dataURL = canvas.toDataURL("image/jpeg", 1.0);
    download(dataURL, "marchingSquares.png");
}

function download(data, filename = 'untitled.jpeg') {
    var a = document.createElement('a');
    a.href = data;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
}