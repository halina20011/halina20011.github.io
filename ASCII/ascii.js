import {startLoadingAnimation, stopLoadingAnimation} from '/tools/loading/toggleLoading.js'

stopLoadingAnimation();
// startLoadingAnimation();

const imageInput = document.getElementById("imgInput");
const imageInputLisener = imageInput.addEventListener('input', function() {load();}, false);

var imgInputValue = document.getElementById("imgInputValue");

var sourceParent = document.getElementById("sourceParent");

var originalImageHolder = document.getElementById("originalImageHolder");
var originalImage = document.getElementById("originalImage");

var generatedImageHolder = document.getElementById("generatedImageHolder");

var generatedTextUrl = null;
var generatedImageUrl = ""

var buttonDonwloadText = document.getElementById("downloadText");
var buttonDonwloadImage = document.getElementById("downloadImage");
var linkToImage = document.getElementById("linkToImage");

buttonDonwloadText.addEventListener("click", function() {download(generatedTextUrl, "ascii.txt");}, false);
buttonDonwloadImage.addEventListener("click", function() {download(generatedImageUrl, "ascii.png");}, false);

const colorPalet = document.getElementById("colorPalet");

const maxPixels = 430;
const listOfASCII =  ["W", "A", "H", "D", "L", "@", "I", "#", "/", "_"];
//                     0                                           255
// console.log(listOfASCII.slice(0).reverse())

var img = new Image();

function load(){
    var _canvas = document.getElementById("originalImage");
    startLoadingAnimation();
    
    img.onload = function(){
        var imgWidth = this.width;
        var imgHeight = this.height;
        
        var _bigger = null;
        if(imgWidth > imgHeight){ _bigger = "width"; }
        else if(imgWidth < imgHeight) { _bigger = "height"}
        if(imgWidth == imgHeight) { _bigger = "none"}
        
        var biggerNumber = null;
        var smallerNumber = null;
        switch(_bigger){
            case "width":
                biggerNumber = imgWidth;
                smallerNumber = imgHeight;
            case "height":
                biggerNumber = imgHeight;
                smallerNumber = imgWidth;
            case "none":
                biggerNumber = imgWidth;
                smallerNumber = imgHeight;
        }
            
        var newImageWidth, newImageHeight;
        if(biggerNumber > maxPixels){
            console.log(_bigger, biggerNumber, `Image ${_bigger} is more then ${maxPixels}!`)
            var scaleBiggerSide = maxPixels;
            var scale  = (biggerNumber / maxPixels);
            var scaleSmallerSide = Math.round(smallerNumber / scale)
            if(imgWidth > imgHeight || imgWidth == imgHeight){ 
                newImageWidth  = scaleBiggerSide;
                newImageHeight = scaleSmallerSide;
            }
            else if(imgWidth < imgHeight) { 
                newImageHeight  = scaleBiggerSide;
                newImageWidth = scaleSmallerSide;
            }
        }
        else{
            newImageWidth  = imgWidth;
            newImageHeight = imgHeight;
        }
        
        originalImageHolder.style.width = newImageWidth + 'px';
        originalImageHolder.style.height = newImageHeight + 'px';
        
        var _context = _canvas.getContext('2d');
        
        //Resize canvas image and canvas to have same value as image
        _context.canvas.width = newImageWidth;
        _context.canvas.height = newImageHeight;
        _context.drawImage(img, 0, 0, newImageWidth, newImageHeight);

        //Hide none text;
        document.getElementById("noneTextOriginal").style.display = "none";
        
        var asciiText = generateAsciiText(newImageWidth, newImageHeight, _context);
        drawText(asciiText);
        generatedTextUrl = generateTextFileUrl(asciiText);             //Generate url for generated text ^
        drawTextImage(asciiText, newImageWidth, newImageHeight);    //Show text on canvas as png
        // download(generatedTextUrl, "ascii.txt");                        //Download file as .txt
        stopLoadingAnimation();
    }
    var fileName = imageInput.value.split("\\").pop(); //Split array and return last element.
    imgInputValue.innerHTML = fileName;
    var fileUrl = URL.createObjectURL(imageInput.files[0]); //Converts img to url object
    img.src = fileUrl; //Set image to has same source as 
}

function getGrayscale(rgba){
    if(rgba[3] == 0) return 255;
    return (rgba[0] + rgba[1] + rgba[2]) / 3
}

function asciiCharacter(grayscale){
    var p = grayscale / 255
    var index = (listOfASCII.length - 1) * p;
    index = Math.round(index)
    return listOfASCII[index];
}

function generateAsciiText(xMax, yMax, _context){
    var fileText = "";
    for(var y = 0; y < yMax; y++){
        for(var x = 0; x < xMax; x++){
            var rgba = _context.getImageData(x, y, 1, 1).data;
            var ASCII = asciiCharacter(getGrayscale(rgba))
            // if(ASCII == undefined){
            //     console.log(rgba);
            // }
            fileText+=ASCII
        }
        fileText+= "\n";
    }
    return fileText;
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

function createCanvas(parrent, width, height){

    // var canvasElement = document.createElement("canvas");
    // canvasElement.className = "newCanvas";
    // canvasElement.id = "newCanvas";
    var canvasElement = document.getElementById("newCanvas");
    canvasElement.width = width;
    canvasElement.height = height;

    canvasElement.style.display = "none";
    
    parrent.appendChild(canvasElement)

    var _canvas = document.getElementById('newCanvas');
    return _canvas;
}

function drawTextImage(text, xMax, yMax){
    const canavsMultiple = 25;
    
    var canvasWidth = xMax * canavsMultiple;
    var canvasHeight = yMax * canavsMultiple;

    var canvas = createCanvas(generatedImageHolder, canvasWidth, canvasHeight);
    var context = canvas.getContext('2d');


    //Get position in pixels (x = 400px / 64 words)
    var addPositionX = canvasWidth / xMax;
    var addPositionY = canvasHeight / yMax;

    var textSplit = text.split("\n");

    var listOfASCII = [];
    console.log(`Canvas width: ${canvasWidth}`);
    for (var i = 0; i < textSplit.length; i++){
        listOfASCII.push(textSplit[i].split(''));
    }
    
    // context.font = `${x * textM}px Roboto sans-serif`;
    // context.font = `100 ${addPositionX}px Roboto, sans-serif`;
    context.font = `100 ${addPositionX}px Roboto, sans-serif`;
    context.textAlign = "left"; 
    context.fillStyle = colorPalet.value;
    for(var _y = 0; _y < yMax; _y++){
        for(var _x = 0; _x < xMax; _x++){
            var xPos = addPositionX * _x;
            var yPos = addPositionY * _y
            context.fillText(listOfASCII[_y][_x].toUpperCase(), xPos, yPos);
        }
    }
    changeTextSize();
    generatedImageUrl = canvas.toDataURL("image/png", 1.0);                     //Convert canvas image to url
    
    //Make Link generated image
    // var link = document.createElement("a");
    // link.href = imageUrl; //Set url
    // link.innerHTML = "Adress to image";
    // generatedContentHolder.appendChild(link);
    
    linkToImage.setAttribute("onclick", `location.href = '${generatedImageUrl}';`)   //Hide none text
    document.getElementById("noneTextGenerated").style.display = "none";
    
    // var contextGeneratedImage = document.getElementById("generatedImage").getContext("2d");
    var generatedImage = document.getElementById("generatedImage");
    
    var scale = 1;
    var canvasNewWidth, canvasNewHeight;
    var middleColumn = document.getElementById("column-middle").clientWidth;

    if(middleColumn * 2/3 < canvasWidth){
        scale = canvasWidth / (middleColumn * 2/3);
        canvasNewWidth  = canvasWidth / scale;
        canvasNewHeight  = canvasHeight / scale;
    }
    else{
        canvasNewWidth  = canvasWidth;
        canvasNewHeight = canvasHeight;
    }

    generatedImageHolder.style.width = canvasNewWidth + 'px';
    generatedImageHolder.style.height = canvasNewHeight + 'px';

    generatedImage.style.width = canvasNewWidth + 'px';
    generatedImage.style.height = canvasNewHeight + 'px';

    generatedImage.style.backgroundColor = backgroundColor(hexToRgb(colorPalet.value))

    var scaledImage = new Image()
    scaledImage.src = generatedImageUrl;
    
    scaledImage.width = canvasNewWidth;
    scaledImage.height = canvasNewHeight;
    
    //Remove old image if is:
    var childrenC = generatedImage.childElementCount;
    for(var i = 0; i < childrenC; i++){
        generatedImage.children[0].remove();
    }

    generatedImage.appendChild(scaledImage);
    generatedImageHolder.onload = function() {
        console.log("Shown")
    }
}

function download(data, filename = 'untitled.txt') {
    if(data == null || data == ""){
        console.error("No images was processed yet. First you need to choose image.")
        return -1;
    }
    var a = document.createElement('a');
    a.href = data;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
}

var generatedTextHoldder = document.getElementById("generatedTextHolder");

function drawText(text){
    var y = text.split('\n')
    // Remove all element's children
    var childrenC = generatedTextHoldder.childElementCount;
    // console.log("Text: " + childrenC);
    for(var childIndex = 0; childIndex < childrenC; childIndex++){
        generatedTextHoldder.children[0].remove();
    }
    // Append text
    for(var lineIndex = 0; lineIndex < y.length; lineIndex++){
        var p = document.createElement("p");
        p.className = "generatedText"
        p.innerHTML = y[lineIndex];
        generatedTextHoldder.appendChild(p);
    }
}

var textSizeSlider = document.getElementById("textSizeSlider");
var textSizeSliderValue = document.getElementById("textSizeSliderValue");

textSizeSliderValue.innerHTML = textSizeSlider.value

textSizeSlider.addEventListener("input", () => {changeTextSize();}, true)

function changeTextSize(){
    var generatedText = document.getElementsByClassName("generatedText")
    textSizeSliderValue.innerHTML = textSizeSlider.value
    for(var i = 0; i < generatedText.length; i++){
        generatedText.item(i).style.fontSize = textSizeSlider.value + "px";
    }
}

function hexToRgb(hex){
    // #ffffff
    var r = parseInt(hex.substr(1, 2), 16);
    var g = parseInt(hex.substr(3, 2), 16);
    var b = parseInt(hex.substr(5, 2), 16);

    return [r, g, b]
}

function backgroundColor(rgb){
    var r = rgb[0];
    var g = rgb[1];
    var b = rgb[2];
    // https://www.w3.org/TR/AERT/#color-contrast
    var brigthness = ((r * 299) + (g * 587) + (b * 144)) / 1000
    return (brigthness > 125) ? "rgba(0, 0, 0, 1)" : "rgba(255, 255, 255, 1)";
}

backgroundColor(hexToRgb(colorPalet.value))

function removeAllChildren(){

}