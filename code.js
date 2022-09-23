import {getText} from "/Tools/import.js";

const codeExplain = document.getElementsByClassName("codeExplain");

const variables = ["void", "OUTPUT", "INPUT", "HIGH", "LOW", "int", "char", "String", "float", "const", "long"];
const logicalOperators = ["#include", "#define", "while", "loop", "setup", "if", "else"];
const functions = ["Serial", "begin", "print", "println", "pinMode", "digitalWrite", "delayMicroseconds", "analogWrite", "delay", "pulseIn", "available", "readString", "toInt", "millis"];
const other = ["for"];

let listOfHighlightedWords = [variables, logicalOperators, functions, other];
let listOfHighlightedWordsClassName = ["variables", "logicalOperators", "functions", "other"];

// Get filename
var Url = window.location.href;
var urls = Url.split("/");
for(var i = 0; i < urls.length; i++){
    if(urls[i] == ''){
        urls.splice(i, 1);
    }
}

var htmlName = urls[urls.length - 1];
htmlName = htmlName.split("#")[0];
htmlName = htmlName.replace(".html", "");

let codeUrl = "/Codes/" + htmlName + ".ino";

function listOfLinesToText(listOfLines){
    let returnText = "";
    listOfLines.forEach(line =>{
        returnText += line + "\n";
    })
    return returnText;
}

function getListOfLines(filePath){
    var textFromFile = getText(filePath);
    var listOfLines = textFromFile.split("\n"); // Get text from file in format "one line one index of array"

    for (var i = 0; i < listOfLines.length; i++){
        listOfLines[i] = listOfLines[i].replace("\r", "");
    }
    return listOfLines
}

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

function escapeHtmlFromUnsafe(unsafe){
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function escapeHtmlFromSafe(unsafe) {
    return unsafe
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, "\"")
        .replace(/&#039;/g, "'");
}

function makeCodeWindow(parentWindow){
    // <div class="codeScrollWindow">
    //     <div class="copyText" id="copyText">The text has been copied.</div>
    //     <div></div>
    //     <div class="codeSettings">
    //         <button class="copyCodeWindowButton1" id="copyCodeWindowButton1"></button>
    //         <button class="downloadCodeWindowButton1" id="downloadCodeWindowButton1"></button>
    //     </div>
    //     <div class="number"><div>0</div>1</div>
    //     <div class="code">aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</div>
    //     <div class="number"><div>0</div>2</div>
    //     <div class="code">aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</div>
    // </div>

    // Make list of code lines
    var listOfLines = [];
    let rawText = "";
    let name = "";
    let src = parentWindow.dataset["src"];
    console.log(src);

    if(src == "URL"){
        listOfLines = getListOfLines(codeUrl);
        name = `${htmlName}.ino`;
    }
    else if(src == "innerText"){
        for(let i = 0; i < parentWindow.childElementCount; i++){
            listOfLines.push(escapeHtmlFromSafe(parentWindow.children[i].innerHTML));
        }
        name = "codeExplanation.ino";
        parentWindow.innerText = "";
    }

    let codeScrollWindow = document.createElement("div");
    codeScrollWindow.className = "codeScrollWindow";
    parentWindow.appendChild(codeScrollWindow);

    rawText = listOfLinesToText(listOfLines);
    
    var copyText = document.createElement("div");
    copyText.className = "copyText";
    copyText.id = "copyText";
    copyText.innerHTML = "The text has been copied.";
    
    codeScrollWindow.appendChild(copyText);
    
    // CODE SETTINGS
    var emptyNumber = document.createElement("div");
    var codeSettings = document.createElement("div");
    codeSettings.className = "codeSettings"
    codeScrollWindow.appendChild(emptyNumber);
    codeScrollWindow.appendChild(codeSettings);
    
    // COPY BUTTON
    let copyButton = document.createElement("button");
    copyButton.className = "copyCodeWindowButton1";
    copyButton.id =        "copyCodeWindowButton1";
    // copyButton.setAttribute("onclick", `copyTextToClipboard(${htmlName})`);
    copyButton.addEventListener('click', function() {copyTextToClipboard(rawText, copyText);}, false);
    codeSettings.appendChild(copyButton);
    
    // DONWLOAD BUTTON
    let downloadButton = document.createElement("button");
    downloadButton.className = "downloadCodeWindowButton1";
    downloadButton.id =        "downloadCodeWindowButton1";
    downloadButton.addEventListener('click', function() {downloadText(name, rawText);}, false);
    codeSettings.appendChild(downloadButton);
    
    for(var i = 0; i < listOfLines.length; i++){
        let text = listOfLines[i];
        // <div class="number"><div>0</div>1</div>
        // <div class="code">text</div>
     
        let lineNumber = document.createElement("div");
        lineNumber.className = "number"; //Asing Id

        let number = document.createElement("div");

        // Make invisible numbers
        var stringLength = calculateNumberOfSpaces(i + 1, listOfLines.length);
        var spaces = "0".repeat(stringLength);

        let spaceElement = document.createElement("div");
        spaceElement.innerHTML = spaces;
        // spaceElement.style.display = "inline-block";
        spaceElement.style.color = "rgba(0, 0, 0, 0)";

        lineNumber.appendChild(spaceElement);
        number.innerHTML = i + 1;        
        lineNumber.appendChild(number);

        codeScrollWindow.appendChild(lineNumber);
        
        var codeText = document.createElement("div"); //Make <code>
        codeText.className = "code";
        codeScrollWindow.appendChild(codeText);

        // 1 is added to i, because there is allready "codeSettings" with evenBackgroundColor
        if((i + 1)% 2 == 0){
            lineNumber.style.backgroundColor = "var(--evenBackgroundColor)";
            codeText.style.backgroundColor = "var(--evenBackgroundColor)";
        }
        else{
            lineNumber.style.backgroundColor = "var(--oddBackgroundColor)";
            codeText.style.backgroundColor = "var(--oddBackgroundColor)";
        }
        
        let chnagedT = changeTextColor(text);
        codeText.innerHTML = chnagedT;
    }
}

function split(text){
    return [...text]; //Or text.split('')
}

function stringToList(text){
    text = text.replace(/    /g, "TAB ");
    var listOfCharacters = split(text); //Get Strign split by ""
    listOfCharacters.push(" "); //Add " " to end
    var listOfWords = []; //Make list
    var words = ""; //Make value to hold current word
    for (let i = 0; i < listOfCharacters.length; i++) {
        var letter = listOfCharacters[i];
        if(letter == "/" && listOfCharacters.length != i + 1 && listOfCharacters[i + 1] == "/"){
            if(words != ""){
                listOfWords.push(words);
                words = "";
            }
            let comment = text.substring(i, listOfCharacters.length);
            if(i != 0){
                listOfWords.push(" ");
            }
            listOfWords.push(comment);
            break;
        }
        else if(letter != " " && letter != ";" && letter != "(" && letter != ")" && letter != "."){
            words += letter;
        }
        else if(letter == " "){
            if(words != ""){
                listOfWords.push(words);
                if(words != "TAB"){
                    listOfWords.push(" ");
                }
            }
            words = "";
        }
        else if(letter == ";" || letter == "(" || letter == ")" || letter == "."){
            listOfWords.push(words);
            listOfWords.push(letter);
            words = "";
        }
    }
    // console.log(listOfWords);
    return listOfWords;
}

function changeTextColor(text){
    let newElements = "";
    var syntaxList = stringToList(text); //Convert String to List
    for(var i = 0; i < syntaxList.length; i++){
        var word = syntaxList[i];
        let checked = false;
        // Check if syntax is comment
        if(word.length > 2 && word.substring(0, 2) == "//"){
            newElements += `<div class="comment">${escapeHtmlFromUnsafe(word)}</div>`;
            continue;
        }
        // Go through the list with all highlighted words
        for(let _i = 0; _i < listOfHighlightedWords.length; _i++){
            for(let _x = 0; _x < listOfHighlightedWords[_i].length; _x++){
                if(word == listOfHighlightedWords[_i][_x]){
                    // Change color
                    newElements += `<div class="${listOfHighlightedWordsClassName[_i]}">${escapeHtmlFromUnsafe(word)}</div>`;
                    checked = true;
                    break;
                }
            }
        }
        if(syntaxList[i] == "TAB"){
            newElements += "    ";
        }
        else if (checked == false){
            newElements += escapeHtmlFromUnsafe(syntaxList[i]);
        }
    }
    console.log(newElements);
    return newElements;
}

function downloadText(name, text){
    let textFileUrl = null;
    let fileData = new Blob([text], {type: 'text/plain'});
    if (textFileUrl !== null) {
        window.URL.revokeObjectURL(textFile);
    }
    textFileUrl = window.URL.createObjectURL(fileData);

    var a = document.createElement('a');
    a.href = textFileUrl;
    a.download = name;
    document.body.appendChild(a);
    a.click();
}

function copyTextToClipboard(text, copyTextElement){
    navigator.clipboard.writeText(text);
    showCopyText(copyTextElement);
}

function showCopyText(copyTextElement){
    copyTextElement.style.display = 'block';
    copyTextElement.style.animation = 'showAnimation 2s linear'
    setTimeout(function() {
        copyTextElement.style.display = 'none';
    }, 2000)
}

function makeAllCodeWindows(){
    let codeWindows = document.querySelectorAll("codeWindow");
    console.log(codeWindows);
    codeWindows.forEach(element => {
        makeCodeWindow(element);
    });
}

makeAllCodeWindows();