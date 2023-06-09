import {pi} from "./piDigits.js";

const cardsHolder = document.getElementById("cardsHolder");

let hintLevel = 0;
const hintLevelElement = document.getElementById("hintLevel");
hintLevelElement.addEventListener("change", () => { hintLevel = parseInt(hintLevelElement.value); showCards(); });
hintLevelElement.value = hintLevel;

const showDigit = document.getElementById("showDigit");
showDigit.addEventListener("click", () => {digitState = 2; correctDigitElement.click();});

const answeredDigits = document.getElementById("answeredDigits");

let digitState = 1;
const digitColor = {
    "0": "wrong",
    "1": "correct",
    "2": "shown"
};

let digitIndex = 0;
const digitsOfPi = toArray(pi);

let correctDigit, correctDigitElement, cardsMask;

function toArray(number){
    const digitArray = number.split('');
    return digitArray.map(Number);
}

let colors = {
    0: "#ffffff", // white
    1: "#ffff00", // yellow
    2: "#ff00ff", // magenta
    3: "#00ffff", // cyan
    4: "#808080", // gray
    5: "#000000", // black
    6: "#ff0000", // red
    7: "#0000ff", // blue
    8: "#FFA500", // orange
    9: "#00ff00", // green
};

HTMLCollection.prototype.last = function(){
    return this[this.length - 1];
}

function makeCards(){
    for(let i = 0; i < 10; i++){
        let card = document.createElement("div");
        let number = document.createElement("p");
        number.innerText = i;
        card.style.borderColor = colors[i];

        const clickFunction = () => {
            if(cardsMask[i] != 1) return;

            if(i == correctDigit){
                let length = answeredDigits.children.length;
                let answeredDigitsLast = answeredDigits.children.last();
                // get last answered chunk of digits
                if(answeredDigitsLast != undefined && answeredDigitsLast.className == digitColor[digitState]){
                    answeredDigitsLast.innerText += i.toString(); 
                    digitState = 1;
                }
                else{
                    let text = document.createElement("p");
                    text.className = digitColor[digitState];
                    text.innerText = i.toString() + ((digitIndex == 0) ? "." : "");
                    answeredDigits.appendChild(text);
                    digitState = 1;
                }
                digitIndex++;
                showCards();
            }
            else{
                digitState = 0;
            }
        }
        window.addEventListener("keyup", (e) => {
            if(e.key == i){
                clickFunction();
            }
        }, false);

        card.addEventListener("click", () => { clickFunction() }, false);

        card.appendChild(number);
        cardsHolder.appendChild(card);
    }
}

const random = (max) => {
    return Math.floor(Math.random() * max);
}

function shuffle(array){
    for(let i = 0; i < array.length; i++){
        let rIndex = random(array.length);
        let t = array[i];
        array[i] = array[rIndex]
        array[rIndex] = t;
    } 
}

function showCards(){
    correctDigit = digitsOfPi[digitIndex];
    correctDigitElement = cardsHolder.children[correctDigit];
    
    // console.log(hintLevel);

    // make an array of numbers that doesnt contain the correct digtit
    // just after we will hit the correct digit add one to it this will offset the values
    let usableCards = [...new Array(9)].map((n, i) => {
        return i + ((correctDigit <= i) ? 1 : 0);
    });
    shuffle(usableCards);
    // console.log(usableCards);

    cardsMask = [...new Array(10)].map(() => 0);
    let cardsToUse = [correctDigit];
    usableCards.splice(0, 9 - hintLevel).map(n => cardsToUse.push(n));

    cardsToUse.forEach((n) => {
        cardsMask[n] = 1; 
    });

    for(let i = 0; i < 10; i++){
        if(cardsMask[i] == 0){
            cardsHolder.children[i].classList.add("hidden");
        }
        else{
            cardsHolder.children[i].classList.remove("hidden");
        }
    }

    // console.log(cardsToUse);
    // console.log(cardsMask);

    let cardsMaskLength = 0;
}

makeCards();
showCards();
