// import {calculateNumberOfSpaces, split, getCurrentHtmlFileName, createElement} from "/Tools/func.js";
import func from "../func.js";
import {downloadText, copyTextToClipboard} from "../download.js";
import {Trie} from "../trie.js"

const codeSettings = document.querySelector("codeSettings");
const defaultLanguage = codeSettings.attributes["codeLanguage"].nodeValue;

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
    const listOfCharacters = text.split(""); // Get Strign split by ""
    listOfCharacters.push(" "); // Add " " to end
    const listOfWords = []; // Make list
    let words = ""; // Make value to hold current word
    for(let i = 0; i < listOfCharacters.length; i++){
        const letter = listOfCharacters[i];
        if(letter == "/" && listOfCharacters.length != i + 1 && listOfCharacters[i + 1] == "/"){
            if(words != ""){
                listOfWords.push(words);
                words = "";
            }
            const comment = text.substring(i, listOfCharacters.length);
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

function changeTextColor(text, languageTrie){
    let newElements = "";
    const syntaxList = stringToList(text); // convert String to List
    for(let i = 0; i < syntaxList.length; i++){
        const word = syntaxList[i];

        // check if syntax is comment
        if(2 < word.length && word.substring(0, 2) == "//"){
            newElements += `<div class="comment">${escapeHtmlFromUnsafe(word)}</div>`;
            continue;
        }

        if(syntaxList[i] == "TAB"){
            newElements += "    ";
            continue;
        }
        const data = languageTrie.search(word);
        if(data != undefined){
            newElements += `<span style="color: ${data};">${escapeHtmlFromUnsafe(word)}</span>`;
        }
        else{
            newElements += escapeHtmlFromUnsafe(syntaxList[i]);
        }
    }

    return newElements;
}

// <div class="codeScrollWindow">
//     <div class="copyText" id="copyText">The text has been copied.</div>
//     <div></div>
//     <div class="codeSettings">
//         <button class="copyCodeWindowButton"></button>
//         <button class="downloadCodeWindowButton"></button>
//     </div>
//     <div class="codeLine">
//         <div class="number"><div>0</div>1</div>
//         <div class="code"></div>
//     </div>
// </div>
function makeCodeWindow(parentWindow, rawCode, fileName, languageTrie){
    const listOfLines = rawCode.split("\n");

    const codeScrollWindow = document.createElement("div");
    codeScrollWindow.className = "codeScrollWindow";
    parentWindow.appendChild(codeScrollWindow);
    
    // copy text message
    const copyText = func.createElement(`<p class="copyText">The text has been copied</p>`);
    
    codeScrollWindow.appendChild(copyText);
    
    // code settings
    const codeSettingsText = `
        <div class="codeSettings">
            <button class="copyCodeWindowButton"></button>
            <button class="downloadCodeWindowButton"></button>
        </div>
    `;

    const codeSettings = func.createElement(codeSettingsText);
    codeSettings.children[0].addEventListener("click", () => { copyTextToClipboard(rawCode, copyText); }, false);
    codeSettings.children[1].addEventListener("click", () => { downloadText(fileName, rawCode); }, false);
    codeScrollWindow.appendChild(codeSettings);
    
    for(let i = 0; i < listOfLines.length; i++){
        const text = listOfLines[i];
        // <div class="number"><div>0</div>1</div>
        // <div class="code">text</div>
        // Make invisible numbers
        const stringLength = func.calculateNumberOfSpaces(i + 1, listOfLines.length);
        const spaces = "0".repeat(stringLength);

        const coloredText = changeTextColor(text, languageTrie);
        
        const numberElementText = `<div class="number"><div class="invisible">${spaces}</div><div>${i + 1}</div></div>`;
        const codeElementText = `<div class="code">${coloredText}</div>`;
        const a = `<div class="codeLine">${numberElementText}${codeElementText}</div>`;
        
        codeScrollWindow.appendChild(func.createElement(a));
    }
}

function createCodeWindow(codeWindow, languageTrie){
    let src = codeWindow.dataset["src"];
    let fileName = codeWindow.dataset["fileName"];

    if(src == "innerText"){
        let rawCode = "";
        const linesOfCode = [];
        for(let i = 0; i < codeWindow.childElementCount; i++){
            linesOfCode.push(escapeHtmlFromSafe(codeWindow.children[i].innerHTML));
        }
        // console.log(linesOfCode);

        rawCode = linesOfCode.join("\n");
        fileName = (fileName == undefined) ? "codeExplanation.ino" : fileName;
        codeWindow.innerText = "";
        makeCodeWindow(codeWindow, rawCode, fileName, languageTrie);
    }
    else{
        const htmlFilename = func.getCurrentHtmlFileName(window);

        fileName = (fileName == undefined) ? `${htmlFilename}.ino` : fileName;
        src = (src == "URL") ? `/Codes/${htmlFilename}.ino` : src;
        const callback = (rawCode) => {
            makeCodeWindow(codeWindow, rawCode, fileName, languageTrie);
        }
        func.importFile(src, callback);
    }
}

async function main(){
    const codeWindows = document.querySelectorAll("codeWindow");
    
    // create set of all languages
    const setOflanguagesToLoad = {};
    const languages = Array.from(codeWindows).map(codeWindow => {
        const codeLanguageAttribute = codeWindow.attributes["codeLanguage"];
        const codeLanguage = (codeLanguageAttribute) ? codeLanguageAttribute.nodeValue : defaultLanguage;
        setOflanguagesToLoad[codeLanguage] = true;
        return codeLanguage;
    });
    
    const languagesToLoad = Object.keys(setOflanguagesToLoad).map(language => language);

    // request all languages
    const promises = languagesToLoad.map(language => {
        return fetch(`/Tools/Code/${language}.json`);
    });
    const responses = await Promise.all(promises);
    const responseTexts = await Promise.all(responses.map(response => response.text()));

    responseTexts.forEach((responseText, i) => {
        const nameOfLanguage = languagesToLoad[i];
        const languageSyntax = JSON.parse(responseText);
        // create highlight map
        const languageTrie = new Trie();
        Object.keys(languageSyntax).forEach(itemName => {
            const item = languageSyntax[itemName];
            for(const key of item.keywords){
                languageTrie.add(key, item.color);
            }
        });
        
        // console.log(languageTrie.toString());
        setOflanguagesToLoad[nameOfLanguage] = languageTrie;
    });

    for(let i = 0; i < codeWindows.length; i++){
        createCodeWindow(codeWindows[i], setOflanguagesToLoad[languages[i]]);
    }
}

main();
