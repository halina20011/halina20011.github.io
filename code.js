import {getText} from "/tools/import.js";

// Get filename
var Url = window.location.href;
var urls = Url.split("/");
for(var i = 0; i < urls.length; i++){
    if(urls[i] == ''){
        urls.splice(i, 1)
    }
}

var htmlName = urls[urls.length - 1]
htmlName = htmlName.split("#")[0];
htmlName = htmlName.replace(".html", "")

let codeUrl = "/Codes/" + htmlName + ".ino";

// function getFullFileUrl(fileNumber){
//     return "/Codes/" + htmlName + fileNumber + ".ino";
// }

function getListOfLines(filePath){
    var textFromFile = getText(filePath);
    var listOfLines = textFromFile.split("\n"); // Get text from file in format "one line one index of array"

    for (var i = 0; i < listOfLines.length; i++){
        listOfLines[i] = listOfLines[i].replace("\r", "") // Remove "\n"
    }
    return listOfLines
}

// for(var i = 0; i < Infinity; i++){
//     var codeWindow = document.getElementById('code' + i);
//     // console.log(i);
//     if(codeWindow != null){
//         console.log(codeWindow)
//     }
//     if(i >= 100){
//         break;
//     }
// }

function getMultitplyOfTen(number, current = 1){
    var answer = number / Math.pow(10, current);
    if(answer < 1) { 
        return current; 
    }
    return getMultitplyOfTen(number, current += 1);
}

function calculateNumberOfSpaces(number, max){
    let spacesToAdd = 0;
    let numberPower = getMultitplyOfTen(number, 1);
    let numberMaxPower = getMultitplyOfTen(max, 1);
    spacesToAdd = numberMaxPower - numberPower;
    return spacesToAdd;
}

function makeCodeHeader(parent){
    // <p class="copyText" id="copyText">The text has been copied.</p>
    // <div class="codeSettings">
    //     <button class="copyCodeWindowButton1" id="copyCodeWindowButton1"></button>
    //     <button class="downloadCodeWindowButton1" id="downloadCodeWindowButton1"></button>
    // </div> 

    var copyText = document.createElement("p");
    copyText.className = "copyText";
    copyText.id = "copyText";
    copyText.innerHTML = "The text has been copied.";

    parent.appendChild(copyText);

    // CODE SETTINGS
    var codeSettings = document.createElement("div");
    codeSettings.className = "codeSettings"
    parent.appendChild(codeSettings);

    // COPY BUTTON
    let copyButton = document.createElement("button");
    copyButton.className = "copyCodeWindowButton1";
    copyButton.id =        "copyCodeWindowButton1";
    codeSettings.appendChild(copyButton);

    // DONWLOAD BUTTON
    let downloadButton = document.createElement("button");
    downloadButton.className = "downloadCodeWindowButton1";
    downloadButton.id =        "downloadCodeWindowButton1";
    codeSettings.appendChild(downloadButton);
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
            var stringLength = calculateNumberOfSpaces(i - 1, countOfChilds);
            var spaces = "0".repeat(stringLength);
            // _code.children[i].children[0].innerText = i - 1 + " " + spaces;

            let spaceElement = document.createElement("p");
            spaceElement.innerHTML = spaces;
            spaceElement.style.display = "inline-block";
            spaceElement.style.color = "rgba(0, 0, 0, 0)"

            _code.children[i].children[0].appendChild(spaceElement);
            _code.children[i].children[0].innerHTML += i - 1;
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
    // console.log(listOfWords)
    return listOfWords;
}

const variables = ["void", "OUTPUT", "HIGH", "LOW", "int", "char", "String", "float", "const"];
const logicalOperators = ["#include", "#define", "while", "loop", "setup", "if", "else"];
const functions = ["Serial", "begin", "pinMode", "digitalWrite", "analogWrite", "delay", "available", "readString", "toInt", "millis"];
const other = ["for"]

let listOfHighlightedWords = [variables, logicalOperators, functions, other]
let listOfHighlightedWordsClassName = ["variables", "logicalOperators", "functions", "other"]

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
                let checked = false;
                // List through all highlighted words list
                for(let _i = 0; _i < listOfHighlightedWords.length; _i++){
                    for(let _x = 0; _x < listOfHighlightedWords[_i].length; _x++){
                        if(word == listOfHighlightedWords[_i][_x]){
                            changeColor(code, word, listOfHighlightedWordsClassName[_i]);
                            checked = true;
                            break;
                        }
                    }
                }
                // if(list[i] == " "){
                //     code.innerHTML += " ";
                // }
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

function download(link){
    var element = document.createElement('a');
    element.setAttribute('href', link);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();
    document.body.removeChild(element);
}

function copyTextFromFile(name){
    var textFromFile = getText(codeUrl);
    navigator.clipboard.writeText(textFromFile);
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

function makeCodeWindow(className){
    var code = className;

    var listOfLines = getListOfLines(codeUrl);
    
    makeCodeHeader(code);
    makeElements(code, listOfLines); // Make lines by file text

    drawLines(code);
    changeTextColor(code, 1);
}

let codeWindow = document.getElementById('codeWindow1');
makeCodeWindow(codeWindow);

const copyButton = document.getElementById('copyCodeWindowButton1');
copyButton.addEventListener('click', function() {copyTextFromFile(htmlName);}, false);
const downloadButton = document.getElementById('downloadCodeWindowButton1');
downloadButton.addEventListener('click', function() {download(codeUrl);}, false);

const codeExplain = document.getElementsByClassName("codeExplain");

for(var i = 0; i < codeExplain.length; i++){
    var el = codeExplain[i]
    for(var x = 0; x < el.childElementCount; x++){
        if(x % 2){
            codeExplain[i].children[x].style.backgroundColor = "rgba(0, 132, 255, 0.1)"
        }
        else{
            codeExplain[i].children[x].style.backgroundColor = "rgba(0, 90, 170, 0.1)"
        }
    }
}

// download('/Codes/ArduinoBlinkLed.ino')
for(var i = 0; i < codeExplain.length; i++){
    changeTextColor(codeExplain[i], -1);
}