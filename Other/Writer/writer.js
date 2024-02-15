import Keyboard from "./keyboard.js"
import func from "../../Tools/func.js";
import {Random} from "../../Tools/func.js";
import WindowSelector from "../../Tools/windows.js";

let words = [];

let generateFunc = generateFromRandom;
let index = 0, mistakesMade = 0, yOffset = 0;
let prevInput = "";

let timeStarted = null;

const keyaboard = new Keyboard(document.querySelector(".keyboard"));

keyaboard.toggleLine(2);

const timer = document.getElementById("timer");
// const mistakes = document.getElementById("mistakes");
// const wpm = document.querySelector(".wpm");
document.getElementById("input").addEventListener("input", (e) => { update(e.target.value); });
const progressBar = document.querySelector(".progressBar");

const numberOfLetters = document.getElementById("numberOfLetters");

const savedTexts = new Map();
const savedTextWindow = document.querySelector(".savedTextWindow");
document.querySelector(".saveText").addEventListener("click", () => {
    const name = prompt("Name: ");
    // console.log(name);
    if(name != null){
        new Text(savedTextWindow, name, wordsInput.value);
    }
});

const screen = document.querySelector(".screen");
const playScreen = document.querySelector(".playScreen");

const correct = document.querySelector(".correct");
const currentCorrect = document.querySelector(".currentCorrect");
const currentIncorrect = document.querySelector(".currentIncorrect");
const current = document.querySelector(".current");
const afterIncorrect = document.querySelector(".afterIncorrect");
const after = document.querySelector(".after");

document.getElementById("restart").addEventListener("click", function() { setUp(); }, false);

const wordsInput = document.getElementById("wordsInput"); 

const endScreen = document.querySelector(".endScreen");
const timerEnd = document.querySelector(".timerEnd");
const mistakesEnd = document.querySelector(".mistakesEnd");
const wpmEnd = document.querySelector(".wpmEnd");

// settings buttons
document.querySelector(`.toggleNumbers`).addEventListener("click", () => keyaboard.toggleAllNumbers(), false);
document.querySelector(`.toggleAllLetters`).addEventListener("click", () => keyaboard.toggleAllLetters(), false);
document.querySelector(`.toggleAlphanumeric`).addEventListener("click", () => keyaboard.toggleAlphaNumeric(), false);
for(let n = 1; n < 4; n++){
    document.querySelector(`.toggleLine${n}`).addEventListener("click", () => keyaboard.toggleLine(n), false);
}

// Random words
const removeDuplicates = document.querySelector("#removeDuplicates");
const toLowerCase = document.querySelector("#toLowerCase");
const randomCase = document.querySelector("#randomCase");
const numberOfWords = document.querySelector("#numberOfWords");

const settings = document.querySelector(".settings");
func.toggle(".moreSettings", true, [settings], [false], "hidden");

function clearInput(){
    input.value = "";
}

window.self.addEventListener("resize", () => { moveLines() }, false);

function moveLines(){
    const item = current.getBoundingClientRect().y;
    const parent = screen.getBoundingClientRect().y;
    if(item == parent){
        return;
    }

    yOffset += parent - item;
    playScreen.style.top = `${yOffset}px`;
}

function loadSavedTexts(){
    savedTextWindow.innerHTML = "";
    savedTexts.clear();
    const items = window.localStorage;
    Object.keys(items).forEach(key => {
        new Text(savedTextWindow, key, items[key]);
    });

}

function convertTime(time){
    let _numberOfLetters = "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = time - minutes * 60;
    const minutesText = minutes;
    const secondsText = seconds < 10 ? "0" + seconds : seconds;
    _numberOfLetters = minutesText + ":" + secondsText;
    return _numberOfLetters;
}

const timerDuration = () => {
    const duration = Math.ceil((Date.now() - timeStarted) / 1000);
    // console.log(`Duration ${duration}`);
    return convertTime(duration);
}

const WPM = () => {
    const duration = ((Date.now() - timeStarted) / 1000 / 60);
    return (index / duration).toFixed(0);
}

function showWorld(){
    if(words[index] == undefined){
        endScreen.style.display = "flex";
        mistakesEnd.innerHTML = `${mistakesMade} mistakes`;
        wpmEnd.innerHTML = `${WPM()}WPM`;
        
        timerEnd.innerHTML = timerDuration();
        timeStarted = null;
        progressBar.style.width = "100%";
    }
    else{
        highlightWord();
    }
}

function update(input){
    if(timeStarted == undefined){
        timeStarted = Date.now();
    }

    const correctWord = words[index].content;
    // console.log(correctWord);
    const lastWord = (index + 1 < words.length);
    const endMatch = correctWord + ((lastWord) ? " " : "");

    // console.log(input.length, input, endMatch.substring(0, input.length));
    if(prevInput.length < input.length && input != endMatch.substring(0, input.length)){
        mistakesMade++;
        // mistakes.innerHTML = mistakesMade;
    }
    // if the input matches the correctWord and there is an space at the end if needed 
    // move to the next word
    else if(input == endMatch){
        index++;
        clearInput();
        prevInput = "";
        showWorld();
        return;
    }
    
    highlightWord();
    prevInput = input;
}

function substring(str, len){
    let end = 0;
    while(0 < len){
        if(str[end] == "<" && end + 3 < str.length && str.substring(end, end + 4) == "<br>"){
            end += 4;
        }
        else{
            len--;
        }
        end++;
    }

    return end;
}

function highlightWord(){
    // "one w|ord two words"
    // correctStr = "one"
    // after = "two words"
    const correctStr = Object.keys(words).filter((_, i) => { return i < index; }).map(key => words[key].value(true)).join(" ");
    const afterStr = Object.keys(words).filter((_, i) => { return index < i; }).map(key => words[key].value(true)).join(" ");
    
    const word = words[index].value();
    const match = word.substring(0, input.value.length);
    let correctEnd = 0;
    for(; correctEnd < match.length; correctEnd++){
        if(input.value[correctEnd] != match[correctEnd]){
            break;
        }
    }

    const spaceBefore = (correctStr == "") ? "" : " ";
    const spaceAfter = (afterStr == "") ? "" : " ";
    
    let afterText = `${spaceAfter}${afterStr}`;
    
    const currentWord = words[index].value();

    currentCorrect.innerHTML = currentWord.substring(0, correctEnd);

    currentIncorrect.innerHTML = "";
    afterIncorrect.innerHTML = "";
    if(correctEnd == match.length && input.value.length == match.length){
        current.innerHTML = currentWord.substring(correctEnd);
    }
    else{
        const incorrectEnd = input.value.length;
        const overflowLength = input.value.length - match.length;
        // console.log(`overflowLength: ${overflowLength}`);
        
        currentIncorrect.innerHTML = currentWord.substring(correctEnd, incorrectEnd);
        current.innerHTML = currentWord.substring(incorrectEnd);

        const overflowEnd = substring(afterText, overflowLength);
        // console.log(`overflowEnd ${overflowEnd}`);
        afterIncorrect.innerHTML = afterText.substring(0, overflowEnd);
        afterText = afterText.substring(overflowEnd);
        // console.log(`>${afterIncorrect.innerHTML}<>${afterText}<`);

        // console.log(index);
        // console.log(end);
    }
    current.innerHTML += (words[index].newLine) ? "<br>" : "";

    correct.innerHTML = `${correctStr}${spaceBefore}`;
    after.innerHTML = afterText;

    progressBar.style.width = `${index/words.length * 100}%`
    moveLines();
}

class Text{
    constructor(parent, key, value){
        this.key = key;
        this.value = value;
        this.element = func.createElement(`<div class="savedText sameLine">
                <div>
                    <p>${key}</p>
                </div>
                <div>
                    <button class="useText">use</button>
                    <button class="removeText">remove</button>
                    <input type="checkbox" checked="">
                </div>
            </div>`);

        this.element.querySelector(".useText").$("click", () => {
            selectedText = key;
            setUp();
        }, false);
        this.checkbox = this.element.querySelector("input");
        this.element.querySelector(".removeText").$("click", ()=> {
            window.localStorage.removeItem(key);
            savedTexts.delete(this.key);
            if(selectedText == key){
                selectedText = null;
            }

            this.delete();
        }, false);

        parent.appendChild(this.element);

        savedTexts.set(key, this);
    }

    delete(){
        this.element.remove();
    }
}

class Word{
    constructor(content, newLine){
        this.content = content;
        this.newLine = newLine;
    }

    value(add){
        return `${this.content}${(this.newLine && add) ? "<br>" : ""}`
    }
}

function lettersToWords(letters){
    letters = letters.replace(/ +/g, " ").replace(/ \n/g, '\n');
    // console.log(JSON.stringify(letters));
    let word = "";
    words = [];
    for(let i = 0; i < letters.length; i++){
        if(letters[i] == " " || letters[i] == "\n" || i == letters.length - 1){
            if(word != ""){
                if(i == letters.length - 1 && letters[i] != "\n"){
                    word += letters[i];
                }
                
                words.push(new Word(word, letters[i] == "\n"));
            }
            word = "";
        }
        else{
            word += letters[i];
        }
    }

    // console.log(words);
}

const wordLengthProbabability = [[2, 2], [3,3], [4,7], [5,9], [6,2], [7,1]];
const random = new Random(wordLengthProbabability);

function generateFromRandom(){
    // get list of selected letters that can be used
    const keys = keyaboard.getLetters();
    const letters = [];

    const maxTextLength = numberOfLetters.value;
    const maxWordIndex = keys.length; // get lenght of keys to know what is top number for random

    while(letters.length < maxTextLength){
        // generate next length of the word
        const maxWLength = maxTextLength - letters.length;
        let wordLength = random.random();
        // console.log(`Word length: ${wordLength}`);

        // check if the word length would overflow
        wordLength = (wordLength <= maxWLength) ? wordLength : maxWLength;
        for(let i = 0; i < wordLength; i++){
            const random = func.random(0, maxWordIndex);    // generate random number
            const keyaboard = keys[random];                     // get key with random index
            letters.push(keyaboard);
        }

        // add space
        if(letters.length + 1 < maxTextLength){
            letters.push(" ");
        }
        else if(letters.length + 1 == maxTextLength){
            letters.push(keys[0]);
        }
    }
    
    return letters.join("");
}

function generateFromCustom(){
    return wordsInput.value;
}

let selectedText = null;

function generateFromSaved(){
    const content = window.localStorage[selectedText];
    return (content) ? content : "not selected";
}

function setUp(){
    words = [];
    index = 0;
    prevInput = "";

    yOffset = 0;
    playScreen.style.top = "0px";

    endScreen.style.display = "none";
    mistakesMade = 0;
    // mistakes.innerHTML = mistakesMade;
    timeStarted = null;
    timer.innerHTML = "0:00";

    clearInput();                   // clear word input
    const letters = generateFunc();     // generate list of letter
    // console.log(letters);
    lettersToWords(letters);
    showWorld();
}

function generateWords(){
    let words = [];
    const set = new Set();
    savedTexts.forEach(item => {
        if(item.checkbox.checked){
            const itemstr = item.value.split(/[ \n,]/g).filter(str => (0 < str.length));
            words = [...words, ...itemstr];
        }
    });

    if(removeDuplicates.checked){
        words.forEach(set.add, set);
        words = Array.from(set);
    }

    if(toLowerCase.checked){
        words = words.map(str => str.toLowerCase());
    }

    const size = parseInt(numberOfWords.value);
    if(words.length == 0){
        return "zero saved and enabled texts"
    }

    return Array.from({length: size}, () => {
        const w = words[func.random(0, words.length)];
        if(randomCase.checked && func.random(0, 5) == 0){
            return w.capitalizeFirst();
        }
        return w;
    }).join(" ");
}

const generateList = [generateFromRandom, generateWords, generateFromCustom, generateFromSaved];

new WindowSelector(".windows", (i) => {
    generateFunc = generateList[i];
});

loadSavedTexts();
setUp();

// update
setInterval(() => {
    if(timeStarted != undefined){
        timer.innerHTML = timerDuration();
        // wpm.innerHTML = `${WPM()}WPM`;
    }
}, 500);
