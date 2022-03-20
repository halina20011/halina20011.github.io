import {getText} from "/tools/import.js";

const copyB = document.getElementById('copy');
// copyB.addEventListener('click', function() {copyText();}, false)
const downloadB = document.getElementById('downloadCodeWindowButton1');
// downloadB.addEventListener('click', function() {downloadFile();}, false)

getElements(0, 100, "")

function getElements(from, to, baseName){
    var codeWindows = document.querySelectorAll("[class^=codeWindow]")
    console.log(codeWindows[0])
}

var index = 2;

// Get filename
var Url = window.location.href
var urls = Url.split("/");
for(var i = 0; i < urls.length; i++){
    if(urls[i] == ''){
        urls.splice(i, 1)
    }
}

var html = urls[urls.length - 1]
html = html.replace(".html", "")

function getFullFileUrl(fileNumber){
    return "/Codes/" + html + fileNumber +".ino";
}

function getListOfLines(filePath){
    var textFromFile = getText(filePath);
    var listOfLines = textFromFile.split("\n"); // Get text from file in format "one line one index of array"

    for (var i = 0; i < listOfLines.length; i++){
        listOfLines[i] = listOfLines[i].replace("\r", "") // Remove "\n"
    }
    return listOfLines
}

var listOfCodeWindows = []
for(var i = 0; i < Infinity; i++){
    var codeWindow = document.getElementById('code' + i);
    // console.log(i);
    if(codeWindow != null){
        console.log(codeWindow)
    }
    if(i >= 100){
        break;
    }
}

var codeWindow = document.getElementById('codeWindow1');

function getA(number, current){
    var answer = number/ current;
    if(answer < 10){
        return current;
    }
    else{
        var a = getA(number, current * 10);
        return a;
    }
}

function getSpace(number, max){
    var number = getA(number, 1);
    var stringLength = 0;
    if(max < 10){
        stringLength = 0 * index;
    }
    else if(max < 100){
        if(number < 10){
            stringLength = 1 * index;
        }
        else{
            stringLength = 0 * index;
        }
    }
    else if(max < 1000){
        stringLength = 2 * index;
    }
    else if(max < 10000){
        stringLength = 3 * index;
    }
    return stringLength;
}

function makeCodeHeader(parent){
    // <p class="copyText" id="copyText">The text has been copied.</p>
    // <div class="codeSettings">
    //     <div class="copyButton">
    //         <button class="copy" id="copy">
    //             <img src="/images/Icons/copy.png" alt="copy">
    //         </button>
    //     </div>
    //     <div class="downloadButton" id="downloadButton">
    //         <button class="download">
    //             <img src="/images/Icons/download.png" alt="download">
    //         </button>
    //     </div>
    // </div> 
    return
    var copyText = document.createElement("p");
    copyText.className = "copyText";
    copyText.id = "copyText";
    copyText.innerHTML = "The text has been copied.";

    parent.appendChild(copyText);

    // CODE SETTINGS
    var codeSettings = document.createElement("div");
    codeSettings.className = "codeSettings"
    parent.appendChild(codeSettings);

    var copyButtonClass = document.createElement("div");
    copyButtonClass.className = "copyButton"
    codeSettings.appendChild(copyButtonClass);

    var copyButton = document.createElement("button");
    copyButton.className = "copy";
    copyButton.id = "copy";
    copyButtonClass.appendChild(copyButton);

    var copyImg = document.createElement("img")
    copyImg.src = "/images/Icons/copy.png"
    copyImg.alt = "copy";
    copyButton.appendChild(copyImg);
}

function makeElements(_code, listOfLines){
    for(var i = 0; i < listOfLines.length; i++){
        var text = listOfLines[i];
        // <div><p id="number">1</p><code id="codeText"> text </code></div>
        var div = document.createElement("div"); //Make <div>
        _code.appendChild(div);
     
        var element = document.createElement("p"); //Make <p>
        element.id = "number"; //Asing Id
        div.appendChild(element); //Add
        
        var codeText = document.createElement("code"); //Make <code>
        codeText.id = "codeText"
        codeText.innerHTML = text;
        div.appendChild(codeText);
    }

    var countOfChilds = _code.childElementCount;
    for(var i = 0; i < countOfChilds; i++){
        if(i > 1){
            var stringLength = getSpace(i - 1, countOfChilds);
            
            var string = "";
            if(stringLength >= 1){
                for(var x = 0; x < stringLength; x++){
                    string += " ";
                }
            }
            _code.children[i].children[0].innerText = i - 1 + " " + string;
            _code.children[i].children[0].style.fontFamily = 'Roboto,sans-serif';
        }
    }
}

// window.addEventListener("click", function(event) {
//     if(event.target.tagName == "IMG"){
//         return
//     }
//     for(var i = 0; i < code.childElementCount; i++){
//         if(i > 1){
//             if(code.children[i].children[1].style.backgroundColor != "rgba(0, 0, 0, 0)"){
//                 code.children[i].children[1].style.backgroundColor = "rgba(255, 0, 0, 0)";
//             }
//         }
//     }
// });

function drawLines(_code){
    for(var i = 0; i < _code.childElementCount; i++){
        if(i != 0){
            if(i % 2){
                _code.children[i].style.backgroundColor = "rgba(0, 132, 255, 0.1)"
            }
            else{
                _code.children[i].style.backgroundColor = "rgba(0, 90, 170, 0.1)"
            }
        }
    }
}

const codeExplain = document.getElementsByClassName("codeExplain");
for(var i = 0; i < codeExplain.length; i++){
    var el = codeExplain[i]
    for(var x = 0; x < el.childElementCount; x++){
        if(x != 0){
            if(x % 2){
                codeExplain[i].children[x].style.backgroundColor = "rgba(0, 132, 255, 0.1)"
            }
            else{
                codeExplain[i].children[x].style.backgroundColor = "rgba(0, 90, 170, 0.1)"
            }
        }
    }
}

function split(text){
    return [...text]; //Or text.split('')
}

function stringToList(text){
    var listOfCharacters = split(text); //Get Strign split by ""
    listOfCharacters.push(" "); //Add " " to end
    var listOfWords = []; //Make list
    var words = "" //Make value to hold current word
    var spaces = 0;
    for (let i = 0; i < listOfCharacters.length; i++) {
        var letter = listOfCharacters[i]
        if(spaces >= 4){
            listOfWords.push("TAB");
            listOfWords.push(" ");
            spaces = 0;
        }
        if(letter != " " && letter != ";" && letter != "(" && letter != ")"){
            words += letter;
            spaces = 0;
        }
        else if(letter == " "){
            if(words != ""){
                listOfWords.push(words);
                listOfWords.push(" ");
            }
            spaces += 1;
            words = "";
        }
        else if(letter == ";" || letter == "(" || letter == ")"){
            spaces = 0;
            listOfWords.push(words);
            listOfWords.push(letter);
            words = "";
        }
    }
    // console.log(listOfWords);
    return listOfWords;
}

const variables = ["void", "OUTPUT","HIGH", "LOW", "int", "String", "char", "const"];
const logicalOperators = ["#include", "#define", "while", "loop", "setup", "if", "else"];
const functions = ["Serial", "begin", "pinMode", "digitalWrite", "delay", "available", "readString", "toInt", "millis"];

function changeTextColor(parent, skipElement){
    // var parent = document.getElementsByClassName('code');
    // var parent = document.getElementById('code');

    // console.log(parent.childElementCount);
    for(var x = 0; x < parent.childElementCount; x++){
        var code = parent.children[x].children[1]
        if(x > skipElement){
            var text = code.innerHTML; //Get text in line
            code.innerHTML = ""; //Remove Text
            var list = stringToList(text); //Convert String to List
            for(var i = 0; i < list.length; i++){
                var word = list[i];
                var checked = false
                for(var z = 0; z < variables.length; z++){
                    if(word == variables[z]){
                        changeColor(code, word, 'variables');
                        checked = true;
                        break;
                    }
                }
                for(var z = 0; z < logicalOperators.length; z++){
                    if(word == logicalOperators[z]){
                        changeColor(code, word, 'logicalOperators');
                        checked = true;
                        break;
                    }
                }
                for(var z = 0; z < functions.length; z++){
                    if(word == functions[z]){
                        changeColor(code, word, 'functions');
                        checked = true;
                        break;
                    }
                }
                if(list[i] == "TAB"){
                    code.innerHTML += "    ";
                }
                else if (checked == false){
                    code.innerHTML += list[i];
                }
            }
        }
    }
}

function changeColor(parent, text, className){
    var div = document.createElement('div');
    div.innerHTML = text
    div.className = className
    parent.appendChild(div);
}

function downloadFile(name){
    getFullFileUrl(name);
}

function download(link){
    var element = document.createElement('a');
    element.setAttribute('href', link);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();
    document.body.removeChild(element);
}

function copyTextFromFile(name){
    var textFromFile = getText(getFullFileUrl(""));
    showCopyText();
}

function showCopyText(){
    var parent = document.getElementById('copyText');
    parent.style.display = 'block';
    parent.style.animation = 'showAnimation 2s linear'
    setTimeout(function() {
        parent.style.display = 'none';
    }, 2000)
}

// download('/Codes/ArduinoBlinkLed.ino')
for(var i = 0; i < codeExplain.length; i++){
    changeTextColor(codeExplain[i], 0);
}

function makeCodeWindow(className){
    var code = className

    var url = getFullFileUrl("");

    var listOfLines = getListOfLines(url);
    
    makeCodeHeader(code);
    makeElements(code, listOfLines); // Make lines by file text

    drawLines(code);
    changeTextColor(code, 1);
}

makeCodeWindow(codeWindow)