import Keyboard from "./keyboard.js"
import func from "../../Tools/func.js";

let keys = [];
let listOfLetters = [];
let listOfWords = [];
let text = "";
let listOfWordsStartEnd = [];

const keyaboard = new Keyboard(document.querySelector(".keyboard"));

keyaboard.toggleLine(2);

let order = 0;
let mistakesMade = 0;
let prevInput = "";

let timeStarted = undefined;

let yOffset = 0;

const timer = document.getElementById("timer");
const mistakes = document.getElementById("mistakes");
document.getElementById("input").oninput = (e) => {
    update(e.target.value);
}

const numberOfLetters = document.getElementById("numberOfLetters");
const numberOfLettersClass = document.getElementsByClassName("numberOfLetters");

const randomizeText = document.querySelector("#randomizeText");

const screen = document.querySelector(".screen");
const playScreen = document.querySelector(".playScreen");

const before = document.querySelector(".before");
const selected = document.querySelector(".selected");
const after = document.querySelector(".after");

document.getElementById("restart").addEventListener("click", function() { setUp(); }, false);

const wordsInput = document.getElementById("wordsInput"); 

const wordsInputClass = document.getElementsByClassName("wordsInput"); 

const endScreen = document.querySelector(".endScreen");
const timerEnd = document.querySelector(".timerEnd");
const mistakesEnd = document.querySelector(".mistakesEnd");

randomizeText.addEventListener("change", () => { checkMode(randomizeText.checked); });

const settings = document.querySelector(".settings");
document.querySelector(".moreSettings").addEventListener("click", () => {
    settings.classList.toggle("hidden");
}, false);

// settings buttons
document.querySelector(`.toggleNumbers`).addEventListener("click", () => keyaboard.toggleAllNumbers(), false);
document.querySelector(`.toggleAllLetters`).addEventListener("click", () => keyaboard.toggleAllLetters(), false);
document.querySelector(`.toggleAlphanumeric`).addEventListener("click", () => keyaboard.toggleAlphaNumeric(), false);
for(let n = 1; n < 4; n++){
    document.querySelector(`.toggleLine${n}`).addEventListener("click", () => keyaboard.toggleLine(n), false);
}

function checkMode(value){
    if(value){
        // console.log("Randomize Checkbox is checked..");
        displayNone(wordsInputClass, "block");
        displayNone(numberOfLettersClass, "none");
    } 
    else{
        // console.log("Randomize Checkbox is not checked..");
        displayNone(wordsInputClass, "none");
        displayNone(numberOfLettersClass, "block");
    }
}

function clearInput(){
    input.value = "";
}

window.self.addEventListener("resize", () => { moveLines() }, false);

function moveLines(){
    const item = selected.getClientRects()[0].y;
    const parent = screen.getClientRects()[0].y;
    if(item == parent){
        return;
    }

    yOffset += parent - item;
    playScreen.style.top = `${yOffset}px`;
}

function showWorld(){
    if(listOfWords[order] == undefined){
        end();
    }
    else{
        highlightWord(true);
    }
}

function update(input){
    if(timeStarted == undefined){
        timeStarted = Date.now();
    }

    const correctWord = listOfWords[order];
    const lastWord = (order + 1 < listOfWords.length);
    const endMatch = correctWord + ((lastWord) ? " " : "");

    // console.log(input.length, input, endMatch.substring(0, input.length));
    if(prevInput.length < input.length && input != endMatch.substring(0, input.length)){
        mistakesMade++;
        mistakes.innerHTML = mistakesMade;
        highlightWord(false);
    }
    // if the input matches the correctWord and there is an space at the end if needed 
    // move to the next word
    else if(input == endMatch){
        order++;
        clearInput();
        prevInput = "";
        showWorld();
        return;
    }
    else{
        highlightWord(true);
    }

    prevInput = input;
}

function displayNone(elements, state){
    for(let i = 0; i < elements.length; i++){
        elements[i].style.display = state;
    }
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

function end(){
    endScreen.style.display = "flex";
    mistakesEnd.innerHTML = `${mistakesMade} mistakes`;
    
    timerEnd.innerHTML = timerDuration();
    timeStarted = undefined;
}

function highlightWord(state){
    const from = listOfWordsStartEnd[order][0];
    const to = listOfWordsStartEnd[order][1];

    before.innerHTML = text.substring(0, from);
    selected.innerHTML = text.substring(from, to);
    selected.id = (state) ? "highlight" : "highlightWrongWord";

    after.innerHTML = text.substring(to, text.length);
    moveLines();
}

function lettersToWords(){
    let word = "";
    let list = [];
    for(let i = 0; i < listOfLetters.length; i++){
        // if word is empty add to list first
        if(word == ""){
            list.push(i);
        }

        if(listOfLetters[i] == " " || i == listOfLetters.length - 1){
            let index = i;
            if(i == listOfLetters.length - 1){
                // console.log(i, listOfLetters.length - 1);
                word += listOfLetters[i];
                index++;
            }

            list.push(index);
            listOfWordsStartEnd.push(list);
            listOfWords.push(word);
            word = "";
            list = [];
        }
        else{
            word += listOfLetters[i];
        }
    }
}

//                                 1, 2, 3, 4, 5, 6, 7, 8, 9
const wordLengthProbabability =   [0, 2, 3, 7, 9, 2, 1, 0, 0];

function generateList(){
    if(randomizeText.checked){
        const maxTextLength = numberOfLetters.value;
        const maxWordIndex = keys.length; // get lenght of keys to know what is top number for random

        // calculate max range for word length probabability
        let maxRange = 0;
        for(let i = 0; i < wordLengthProbabability.length; i++){
            maxRange += wordLengthProbabability[i];
        }
        console.log(`Max range: ${maxRange}`);

        // generate wordLengthProbababilityList
        const wordLengthProbababilityList = [];
        for(let i = 0; i < wordLengthProbabability.length; i++){
            const wordLengthProb = wordLengthProbabability[i];
            for(let x = 0; x < wordLengthProb; x++){
                wordLengthProbababilityList.push(i + 1);
            }
        }
        console.log(`Word length probabability list:`, wordLengthProbababilityList);
        
        while(listOfLetters.length < maxTextLength){
            // generate next length of the word
            const maxWLength = maxTextLength - listOfLetters.length;
            let wordLength = wordLengthProbababilityList[func.random(0, maxRange)];
            // console.log(`Word length: ${wordLength}`);

            // check if the word length would overflow
            wordLength = (wordLength <= maxWLength) ? wordLength : maxWLength;
            for(let i = 0; i < wordLength; i++){
                const random = func.random(0, maxWordIndex);    // generate random number
                const keyaboard = keys[random];                     // get key with random index
                listOfLetters.push(keyaboard);
            }

            // add space
            if(listOfLetters.length + 1 < maxTextLength){
                listOfLetters.push(" ");
            }
            else if(listOfLetters.length + 1 == maxTextLength){
                listOfLetters.push(keys[0]);
            }
        }
    }
    else{
        for(let i = 0; i < wordsInput.value.length; i++){
            listOfLetters.push(wordsInput.value[i]);
        }
    }

    console.log(listOfLetters);
    lettersToWords();
}

function setUp(){
    listOfLetters = [];
    listOfWords = [];
    listOfWordsStartEnd = [];
    order = 0;
    prevInput = "";

    yOffset = 0;
    playScreen.style.top = "0px";

    endScreen.style.display = "none";
    mistakesMade = 0;
    timeStarted = undefined;
    timer.innerHTML = "0:00";

    // get list of selected letters that can be used
    keys = keyaboard.getLetters();

    clearInput();                                   // clear word input
    generateList();                                 // generate list of letter
    text = listOfWords.join(" ");
    showWorld();
}

checkMode(randomizeText.checked);
setUp();

// update
setInterval(() => {
    if(timeStarted != undefined){
        timer.innerHTML = timerDuration();
    }
}, 500);
