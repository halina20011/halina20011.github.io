// import {printText, setText} from '/Writer/key.js'
import getLetters from '/Writer/key.js'
import {setText} from '/Writer/key.js'

// var keys = ["a", "s", "d", "f", "g", "h", "j", "k", "l", "t", "y", " "];
var keys = ["a", "s", " "];
var listOfLetters = [];
var listOfWords = [];
var listOfWordsStartEnd = [];

var order = 0;
var makedMistakes = 0;

const input = document.getElementById("input");
input.addEventListener("input", function() {onChnageInput(input.value)}, false);

const mistakes = document.getElementById('mistakes');
const numberOfLetters = document.getElementById('numberOfLetters');
const numberOfLettersClass = document.getElementsByClassName('numberOfLetters');

const randomizeCheckbox = document.getElementById('checkbox');

const words = document.getElementById('words');
const refresh = document.getElementById('restart'); //refreshButton
const wordsInput = document.getElementById("wordsInput"); 

const wordsInputClass = document.getElementsByClassName("wordsInput"); 

const endScreen = document.getElementById("endScreen")
const timerText = document.getElementById("timerText");
const mistakesText = document.getElementById("mistakesText");

randomizeCheckbox.addEventListener('change', function() {checkeMode(randomizeCheckbox.checked)});
checkeMode(randomizeCheckbox.checked);

function setUp(){
    listOfLetters = [];
    listOfWords = [];
    listOfWordsStartEnd = [];
    order = 0;

    endScreen.style.display = "none";
    makedMistakes = 0;
    currentRound = 0;

    clearInput(); //Clear word nput
    generateList(); //Generate list of letter
    words.innerHTML = listToString(listOfLetters); //Show all letters (in String not list)
    showWorld();
    // showKey(listOfLetters, order); //Show first letter
    
    // wordsInput.style.visibility = "hidden" //Hide text input forn non random text.
    
    // displayNone(wordsInput, 'none');
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

setText(keys); //Set begiginning letter to be at start choose.
setUp();

function onChnageInput(_value){
    // Compare
    // console.log(_value.substring(0, _value.length - 1), listOfWords[order].substring(0, _value.length - 1))
    // If strings are same
    var answer = listOfWords[order];
    var mistakesCount = 0;

    for(var i = 0; i < _value.length; i++){
        if(_value.length == answer.length + 1 && _value.substring(_value.length - 1, _value.length) == " "){
            if(_value[i] != answer[i] && answer[i] != undefined) {
                mistakesCount++
            }
        }
        else if(_value[i] != answer[i]) {
            mistakesCount++
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

    // if(_value != listOfWords[wordOrder][indexOfLetter]){
    //     makedMistakes = makedMistakes + 1;
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
    var _numberOfLetters = "0:00"
    var minutes = Math.floor(time / 60);
    var seconds = time - minutes * 60;
    var minutesText = minutes
    var secondsText = seconds < 10 ? "0" + seconds : seconds;
    _numberOfLetters = minutesText + ":" + secondsText;
    return _numberOfLetters;
}

//Timer
const currentRoundText = document.getElementsByClassName("timer")[0];
var counting = false;
var currentRound = 0;

var interval = 1000;
var expected = Date.now() + interval;
// setTimeout(timer, interval);
function timer() {
    if(counting == true){
        var dt = Date.now() - expected; // the drift (positive for overshooting)
        if (dt > interval) {
            console.error("Time");
        //     something really bad happened. Maybe the browser (tab) was inactive?
        //     possibly special handling to avoid futile "catch up" run
        }
        // console.log(currentRound);
        currentRound += 1;
        expected += interval;
        currentRoundText.innerHTML = convertTime(currentRound);
    }
    setTimeout(timer, Math.max(0, interval - dt)); // take into account drift
}

refresh.addEventListener('click', function() {
    keys = getLetters();
    restart();
}, false);

function displayNone(Class, state){
    for(var i = 0; i < Class.length; i++){
        // console.log(Class.childElementCount);
        Class[i].style.display = state;
    }
}

function end(){
    words.innerHTML = "End"; 
    endScreen.style.display = "block";
    timerText.innerHTML = convertTime(currentRound);
    mistakesText.innerHTML = makedMistakes +" mistakes";
    counting = false;
}

function showKey(list, Order) {
    var key = list[Order];
    if(key == undefined){ //Chech if in list is no more letters
        end();
    }
    else{
        showedKey = key;
        endScreen.style.display = "none";
        words.innerHTML = listToString(listOfLetters);
        highlight(words, order);
    }
};

function highlight(textBox, index) {
    var innerHTML = textBox.innerHTML;
    var indexOf = innerHTML.length;
    console.log(innerHTML, indexOf)
    if (index >= 0) { 
        innerHTML = innerHTML.substring(0, index) + "<span class='highlight'>" + innerHTML.substring(index, index + 1) + "</span>" + innerHTML.substring(1 + index, indexOf);
        textBox.innerHTML = innerHTML;
    }
}

function highlightWord(textBox, _class, text, from, to) {
    var indexOf = text.length;
    if (from < to) { 
        text = text.substring(0, from) + '<span class=\"' + _class + '\">' + text.substring(from, to) + "</span>" + text.substring(to, indexOf);
        // console.log(text);
        textBox.innerHTML = text;
    }
}

function lettersToWords(){
    let word = "";
    var list = [];
    for(var i = 0; i < listOfLetters.length; i++){
        if(word == ""){ //If word is empty add to list first
            list.push(i);
        }
        if(listOfLetters[i] == " " || i == listOfLetters.length - 1){
            var index = i;
            if(i == listOfLetters.length - 1){
                console.log(i, listOfLetters.length - 1);
                word += listOfLetters[i];
                index++;
            }
            list.push(index);
            listOfWordsStartEnd.push(list);
            listOfWords.push(word);
            word = "";
            list = []
        }
        else{
            word += listOfLetters[i];
        }
    }
}

function generateList(){
    if(randomizeCheckbox.checked == false){
        var numberOfWords = numberOfLetters.value; //Get how many letters to add.
        var maxWordIndex = keys.length; //Get lenght of keys to know what is top number for Random.
        var lastLetter = ""
        
        for(var i = 0; i < numberOfWords; i++){
            var lastLetterIndex = numberOfWords - 1 //Make variable to store index of last letter (-1 is becauseloop start on 0)
            var random = getRandomInt(maxWordIndex); //Generate random number
            var key = keys[random]; //Get key with random index
            // console.log(key);
            // console.log(i, lastLetterIndex)
            if(key == " " && (i == 0 || i == lastLetterIndex || lastLetter == " ")){ //Add space if
                // console.log(`Space added "a"`);
                listOfLetters.push(keys[0]);
            }
            else{
                listOfLetters.push(key); //Add generatet number to list
            }
            lastLetter = key;
        }
        lettersToWords();
    }
    else{
        for(var i = 0; i < wordsInput.value.length; i++){
            listOfLetters.push(wordsInput.value[i]);
        }
        lettersToWords();
    }
}

function checkeMode(value){
    if (value) {
        // console.log("Randomize Checkbox is checked..");
        displayNone(wordsInputClass, 'block');
        displayNone(numberOfLettersClass, 'none')
    } else {
        // console.log("Randomize Checkbox is not checked..");
        displayNone(wordsInputClass, 'none');
        displayNone(numberOfLettersClass, 'block')
    }
}

// window.addEventListener('keyup', (event) => {
//     if(counting == false){
//         counting = true;
//     }
//     if(event.key == showedKey){
//         order = order + 1;
//         showKey(listOfLetters, order);
//     }
//     else if(event.key == "Space" && showKey == " "){
//         order = order + 1;
//         showKey(text, order);
//     }
//     else if(event.key == "CapsLock" && showKey == " "){
//         order = order + 1;
//         showKey(text, order);
//     }
//     else if(event.key == "F12" || event.key == "F11" || event.key == "Alt" || event.key == "Control"){
//         return;
//     }
//     else{
//         makedMistakes = makedMistakes + 1;
//         if(makedMistakes < 2){
//             mistakes.innerHTML = "Mistake: " + makedMistakes;
//         }
//         else if(makedMistakes > 1){
//             mistakes.innerHTML = "Mistakes: " + makedMistakes;
//         }
//         // console.log(event.key);
//     }
// });

numberOfLetters.addEventListener('change', function() {
    // console.log(numberOfLetters.value);
    if(numberOfLetters.value > 100){
        numberOfLetters.value = 100;
    }
    if(numberOfLetters.value < 10){
        numberOfLetters.value = 10;
    }
});

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
};

function listToString(list){
    var st = "";
    for(let i = 0; i < list.length; i++){
        st = st + list[i];
    }
    return st
}

function restart(){
    setUp();
}