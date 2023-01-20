// import {printText, setText} from '/Writer/key.js'
import getLetters from '/Writer/key.js'
import {toggleLine} from '/Writer/key.js'

let keys = [];
let listOfLetters = [];
let listOfWords = [];
let listOfWordsStartEnd = [];

// toggleLine(1);
toggleLine(2);
// toggleLine(3);

let order = 0;
let mistakesMade = 0;

const input = document.getElementById("input");
input.addEventListener("input", function() {onChnageInput(input.value)}, false);

const mistakes = document.getElementById('mistakes');
const numberOfLetters = document.getElementById('numberOfLetters');
const numberOfLettersClass = document.getElementsByClassName('numberOfLetters');

const randomizeCheckbox = document.getElementById('checkbox');

const words = document.getElementById('words');
const refresh = document.getElementById('restart'); //refreshButton
refresh.addEventListener('click', function() { setUp(); }, false);

const wordsInput = document.getElementById("wordsInput"); 

const wordsInputClass = document.getElementsByClassName("wordsInput"); 

const endScreen = document.getElementById("endScreen")
const timerText = document.getElementById("timerText");
const mistakesText = document.getElementById("mistakesText");

randomizeCheckbox.addEventListener('change', function() {checkMode(randomizeCheckbox.checked)});

function checkMode(value){
    if(value){
        // console.log("Randomize Checkbox is checked..");
        displayNone(wordsInputClass, 'block');
        displayNone(numberOfLettersClass, 'none')
    } 
    else{
        // console.log("Randomize Checkbox is not checked..");
        displayNone(wordsInputClass, 'none');
        displayNone(numberOfLettersClass, 'block')
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
};

function listToString(list){
    let st = "";

    for(let i = 0; i < list.length; i++){
        st += list[i];
    }

    return st;
}

function clearInput(){
    input.value = "";
}

function showWorld(){
    if(listOfWords[order] == undefined){
        end();
    }
    else{
        highlightWord(words, "highlight", listToString(listOfLetters), listOfWordsStartEnd[order][0], listOfWordsStartEnd[order][1]);
    }
}


function onChnageInput(_value){
    // Compare
    // console.log(_value.substring(0, _value.length - 1), listOfWords[order].substring(0, _value.length - 1))
    // If strings are same
    let answer = listOfWords[order];
    let mistakesCount = 0;

    for(let i = 0; i < _value.length; i++){
        if(_value.length == answer.length + 1 && _value.substring(_value.length - 1, _value.length) == " "){
            if(_value[i] != answer[i] && answer[i] != undefined){
                mistakesCount++
                mistakesMade += 1;
            }
        }
        else if(_value[i] != answer[i]){
            mistakesCount++
            mistakesMade += 1;
        }
    }

    if(mistakesCount > 0){
        highlightWord(words, "highlightWorongWord", listToString(listOfLetters), listOfWordsStartEnd[order][0], listOfWordsStartEnd[order][1]);
    }
    else{
        highlightWord(words, "highlight", listToString(listOfLetters), listOfWordsStartEnd[order][0], listOfWordsStartEnd[order][1]);
    }

    if(_value.length == answer.length && mistakesCount == 0){
        console.log("Word is correct.");
    }

    console.log(_value.length, answer.length + 1);

    if(_value.length == answer.length + 1 && mistakesCount == 0){
        console.log("Word is correct and has space on end.");
        order++;
        clearInput();
        showWorld();
    }

    console.log("Mistakes: " + mistakesCount);
    
    mistakes.innerHTML = "Mistake: " + mistakesMade;

    // if(_value != listOfWords[wordOrder][indexOfLetter]){
    //     mistakesMade = makedMistakes + 1;
    //     if(makedMistakes < 2){
    //         mistakes.innerHTML = "Mistake: " + makedMistakes;
    //     }
    // }
    // else{
    //     indexOfLetter++;
    // }
}

// randomizeCheckbox.addEventListener("mousemove", function() {re();}, false);
function convertTime(time){
    let _numberOfLetters = "0:00"
    let minutes = Math.floor(time / 60);
    let seconds = time - minutes * 60;
    let minutesText = minutes
    let secondsText = seconds < 10 ? "0" + seconds : seconds;
    _numberOfLetters = minutesText + ":" + secondsText;
    return _numberOfLetters;
}

// Timer
const currentRoundText = document.getElementsByClassName("timer")[0];
let counting = false;
let currentRound = 0;

let interval = 1000;
let expected = Date.now() + interval;
// setTimeout(timer, interval);

function timer() {
    if(counting == true){
        let dt = Date.now() - expected; // the drift (positive for overshooting)
        if(dt > interval){
            // Something really bad happened. Maybe the browser (tab) was inactive?
            console.error("Time");
        }
        // console.log(currentRound);
        currentRound += 1;
        expected += interval;
        currentRoundText.innerHTML = convertTime(currentRound);
    }

    setTimeout(timer, Math.max(0, interval - dt)); // Take into account drift
}

function displayNone(Class, state){
    for(let i = 0; i < Class.length; i++){
        // console.log(Class.childElementCount);
        Class[i].style.display = state;
    }
}

function end(){
    words.innerHTML = "End"; 
    endScreen.style.display = "block";
    timerText.innerHTML = convertTime(currentRound);
    mistakesText.innerHTML = mistakesMade +" mistakes";
    counting = false;
}

function highlightWord(textBox, _class, text, from, to) {
    let indexOf = text.length;
    if(from < to){ 
        text = text.substring(0, from) + '<span class=\"' + _class + '\">' + text.substring(from, to) + "</span>" + text.substring(to, indexOf);
        // console.log(text);
        textBox.innerHTML = text;
    }
}

function lettersToWords(){
    let word = "";
    let list = [];
    for(let i = 0; i < listOfLetters.length; i++){
        if(word == ""){ //If word is empty add to list first
            list.push(i);
        }

        if(listOfLetters[i] == " " || i == listOfLetters.length - 1){
            let index = i;
            if(i == listOfLetters.length - 1){
                console.log(i, listOfLetters.length - 1);
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

//                               1, 2, 3, 4, 5, 6, 7, 8, 9
let wordLengthProbabability =   [0, 2, 3, 7, 9, 2, 1, 0, 0];

function generateList(){
    if(randomizeCheckbox.checked == false){
        let maxTextLength = numberOfLetters.value;
        let maxWordIndex = keys.length; // Get lenght of keys to know what is top number for Random.

        // Calculate max range for word length probabability
        let maxRange = 0;
        for(let i = 0; i < wordLengthProbabability.length; i++){
            maxRange += wordLengthProbabability[i];
        }
        console.log(`Max range: ${maxRange}`);

        // Generate wordLengthProbababilityList
        let wordLengthProbababilityList = [];
        for(let i = 0; i < wordLengthProbabability.length; i++){
            let wordLengthProb = wordLengthProbabability[i];
            for(let x = 0; x < wordLengthProb; x++){
                wordLengthProbababilityList.push(i + 1);
            }
        }
        console.log(`Word length probabability list:`, wordLengthProbababilityList);
        
        let listOfLettersIndex = 0;
        while(listOfLetters.length < maxTextLength){
            // Generate length of word
            let maxWLength = maxTextLength - listOfLetters.length;
            let wordLength = wordLengthProbababilityList[getRandomInt(maxRange)];
            console.log(`Word length: ${wordLength}`);

            // Generate random words
            wordLength = (wordLength <= maxWLength) ? wordLength: maxWLength;
            for(let i = 0; i < wordLength; i++){
                let random = getRandomInt(maxWordIndex); // Generate random number
                let key = keys[random]; // Get key with random index
                listOfLetters.push(key);
            }

            // Add space
            if(listOfLetters.length < maxTextLength){
                listOfLetters.push(" ");
            }
            //listOfLetters.push(" ");
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

    endScreen.style.display = "none";
    mistakesMade = 0;
    currentRound = 0;

    // Get list of selected letters that can be used
    keys = getLetters();

    clearInput();                                   // Clear word input
    generateList();                                 // Generate list of letter
    words.innerHTML = listToString(listOfLetters);  // Show all letters (in String not list)
    showWorld();
}

checkMode(randomizeCheckbox.checked);
setUp();
