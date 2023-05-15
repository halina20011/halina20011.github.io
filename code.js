import {calculateNumberOfSpaces, split, getCurrentHtmlFileName} from "/Tools/func.js";
import {importFile, getText, createScript} from "/Tools/import.js";
import {downloadText, copyTextToClipboard} from "/Tools/download.js";

const codeExplain = document.getElementsByClassName("codeExplain");

const variables = ["void", "OUTPUT", "INPUT", "HIGH", "LOW", "int", "char", "String", "float", "const", "long", "INPUT_PULLUP"];
const logicalOperators = ["#include", "#define", "while", "loop", "setup", "if", "else"];
const functions = ["Serial", "begin", "print", "println", "pinMode", "digitalWrite", "delayMicroseconds", "analogWrite", "delay", "pulseIn", "available", "readString", "toInt", "millis"];
const other = ["for"];

let listOfHighlightedWords = [variables, logicalOperators, functions, other];
let listOfHighlightedWordsClassName = ["variables", "logicalOperators", "functions", "other"];

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

function stringToList(text){
    text = text.replace(/    /g, "TAB ");
    let listOfCharacters = split(text); // Get Strign split by ""
    listOfCharacters.push(" "); // Add " " to end
    let listOfWords = []; // Make list
    let words = ""; // Make value to hold current word
    for (let i = 0; i < listOfCharacters.length; i++) {
        let letter = listOfCharacters[i];
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
    let syntaxList = stringToList(text); // Convert String to List
    for(let i = 0; i < syntaxList.length; i++){
        let word = syntaxList[i];
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
                    newElements += `<span class="${listOfHighlightedWordsClassName[_i]}">${escapeHtmlFromUnsafe(word)}</span>`;
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

    return newElements;
}

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
function makeCodeWindow(parentWindow, rawCode, fileName){
    let listOfLines = rawCode.split("\n");

    let codeScrollWindow = document.createElement("div");
    codeScrollWindow.className = "codeScrollWindow";
    parentWindow.appendChild(codeScrollWindow);
    
    // Copy text message
    let copyText = document.createElement("p");
    copyText.className = "copyText";
    copyText.id = "copyText";
    copyText.innerHTML = "The text has been copied.";
    
    codeScrollWindow.appendChild(copyText);
    
    // CODE SETTINGS
    let emptyNumber = document.createElement("div");
    let codeSettings = document.createElement("div");
    codeSettings.className = "codeSettings";
    codeScrollWindow.appendChild(emptyNumber);
    codeScrollWindow.appendChild(codeSettings);
    
    // COPY BUTTON
    let copyButton = document.createElement("button");
    copyButton.className = "copyCodeWindowButton1";
    copyButton.id =        "copyCodeWindowButton1";
    copyButton.addEventListener('click', () => { copyTextToClipboard(rawCode, copyText); }, false);
    codeSettings.appendChild(copyButton);

    // DOWNLOAD BUTTON
    let downloadButton = document.createElement("button");
    downloadButton.className = "downloadCodeWindowButton1";
    downloadButton.id =        "downloadCodeWindowButton1";
    downloadButton.addEventListener('click', () => { downloadText(fileName, rawCode); }, false);
    codeSettings.appendChild(downloadButton);
    
    for(let i = 0; i < listOfLines.length; i++){
        let text = listOfLines[i];
        // <div class="number"><div>0</div>1</div>
        // <div class="code">text</div>
     
        let lineNumber = document.createElement("div");
        lineNumber.className = "number";

        let number = document.createElement("div");

        // Make invisible numbers
        let stringLength = calculateNumberOfSpaces(i + 1, listOfLines.length);
        let spaces = "0".repeat(stringLength);

        let spaceElement = document.createElement("div");
        spaceElement.innerHTML = spaces;
        spaceElement.style.color = "rgba(0, 0, 0, 0)";

        lineNumber.appendChild(spaceElement);
        number.innerHTML = i + 1;
        lineNumber.appendChild(number);

        codeScrollWindow.appendChild(lineNumber);
        
        let codeText = document.createElement("div"); //Make <code>
        codeText.className = "code";
        codeScrollWindow.appendChild(codeText);

        // 1 is added to i, because there is allready "codeSettings" with evenBackgroundColor
        if((i + 1) % 2 == 0){
            lineNumber.style.backgroundColor = "var(--evenBackgroundColor)";
            codeText.style.backgroundColor = "var(--evenBackgroundColor)";
        }
        else{
            lineNumber.style.backgroundColor = "var(--oddBackgroundColor)";
            codeText.style.backgroundColor = "var(--oddBackgroundColor)";
        }
        
        // let chnagedT = changeTextColor(text);
        // codeText.innerHTML = chnagedT;
        codeText.innerHTML = text;
    }
}

function makeAllCodeWindows(){
    let codeWindows = document.querySelectorAll("codeWindow");

    codeWindows.forEach(codeWindow => {
        let src = codeWindow.dataset["src"];
        let fileName = codeWindow.dataset["fileName"];

        if(src == "innerText"){
            let rawCode = "";
            let linesOfCode = [];
            for(let i = 0; i < codeWindow.childElementCount; i++){
                linesOfCode.push(escapeHtmlFromSafe(codeWindow.children[i].innerHTML));
            }
            // console.log(linesOfCode);

            rawCode = linesOfCode.join("\n");
            fileName = (fileName == undefined) ? "codeExplanation.ino" : fileName;
            codeWindow.innerText = "";

            makeCodeWindow(codeWindow, rawCode, fileName);
        }
        else{
            src = (src == "URL") ? `/Codes/${getCurrentHtmlFileName(window)}.ino` : src;
            let fallback = (rawCode) => {
                makeCodeWindow(codeWindow, rawCode, fileName);
            }
            importFile(src, fallback);
        }
    });
}

makeAllCodeWindows();
