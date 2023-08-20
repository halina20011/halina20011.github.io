import {CANVAS} from "../../Canvas/canvas.js";
import {DOWNLOADER} from "../../Canvas/download.js";

import {} from "../Tools/glFunc.js";

const  canvasEl = document.getElementById("my-canvas");

const canvas = new CANVAS(canvasEl);
const downloader = new DOWNLOADER(canvasEl);

const downloadImageButton = document.getElementById("downloadImage");
downloadImageButton.addEventListener("click", function() { downloader.downloadImage(); }, false);

const updateButton = document.getElementById("update");
updateButton.addEventListener("click", () => { main(); }, false);

const addButton = document.getElementById("addButton");
addButton.addEventListener("click", () => { createResistorsWindow(); }, false);

const voltageInput = document.getElementById("voltageInput");
const currentInput = document.getElementById("currentInput");

const calculatedValues = document.getElementById("calculatedValues");
const calculatedResistance = calculatedValues.children[0].children[1];
const calculatedVoltage = calculatedValues.children[1].children[1];
const calculatedCurrent = calculatedValues.children[2].children[1];

const valueToUse = document.getElementById("valueToUse");
valueToUse.addEventListener("change", () => {
    updateValueToUse();
}, false);

const resistorsHolder = document.getElementById("resistorsHolder");

function inputValue(input){
    return input.options[input.selectedIndex].value;
}

const updateValueToUse = () => {
    const value = inputValue(valueToUse);
    if(value == "current"){
        currentInput.classList.remove("hidden");
        voltageInput.classList.add("hidden");
    }
    else{
        currentInput.classList.add("hidden");
        voltageInput.classList.remove("hidden");
    }
};

HTMLCollection.prototype.forEach = Array.prototype.forEach;

function string2Element(string){
    const temp = document.createElement("div");
    temp.innerHTML = string;
    return temp.firstChild;
}

let individualResistors = [];

function addResistor(resistorHolder, add){
    individualResistors.push(add);
    resistorHolder.appendChild(add);

    main();
}

function removeResistor(resistorHolder, remove){
    individualResistors = individualResistors.filter((element) => {
        return element !== remove;
    });

    resistorHolder.removeChild(remove);

    main();
}

function createResistorsWindow(){
    const resistorWindow = document.createElement("div");
    resistorWindow.className = "resistorWindow";

    resistorWindow.innerHTML = `
    <div class="sameLine">
        <select class="resistorType" id="resistorType">
            <option>series</option>
            <option>parallel</option>
        </select>
        <div class="buttons">
            <button class="addButton buttonMedium">
            <button class="removeButton buttonMedium">
        </div>
    </div>
    <div class="calculatedResistorValues" id="calculatedResistorValues">
        <div><p>R = </p><p>50</p><p>Ω</p></div>
    </div>
    <div class="resistorHolder">
    </div>`;
    // TODO: add prefix to a value
    // TODO: add this
    // <div><p>V = </p><p>0</p><p>V</p></div>
    // <div><p>I = </p><p>1</p><p>A</p></div>

    const resistorType            = resistorWindow.children[0].children[0];
    const buttons                 = resistorWindow.children[0].children[1];
    const addResistorButton       = buttons.children[0];
    const removeResistorsButton   = buttons.children[1];
    const resistorHolder          = resistorWindow.children[2];

    const createResistor = () => {
        const resistor = document.createElement("div");
        resistor.className = "resistor";
        
        // let resistorValues = string2Element(

        const resistorValue = string2Element(`<input class="hideInputArrows" type="number" min="1" value="1000">`);
        resistorValue.oninput = () => {
            console.log(resistorValue.value);
            main();
        }
        const removeResistorButton = document.createElement("button");
        removeResistorButton.className = "removeButton";
        removeResistorButton.addEventListener("click", () => {
            const type = resistorType.options[resistorType.selectedIndex].value;
            const min = (type == "series") ? 1 : 2;
            if(min < resistorHolder.children.length){
                removeResistor(resistorHolder, resistor);
            }
        });

        resistor.appendChild(resistorValue);
        resistor.appendChild(removeResistorButton);
        
        addResistor(resistorHolder, resistor);
    };

    const correctResistors = () => {
        const type = resistorType.options[resistorType.selectedIndex].value;
        if(type == "series"){
            buttons.children[0].classList.add("hidden");
            while(resistorHolder.children.length < 1){
                createResistor();
            }
            
            while(1 < resistorHolder.children.length){
                removeResistor(resistorHolder, resistorHolder.children[1]);
            }
        }
        else{
            buttons.children[0].classList.remove("hidden");
            while(resistorHolder.children.length < 2){
                createResistor();
            }
        }

        main();
    }

    correctResistors();
    resistorType.addEventListener("input", () => { correctResistors(); }, false);

    addResistorButton.addEventListener("click", () => {
        createResistor();
    }, false);

    removeResistorsButton.onclick = () => {
        resistorsHolder.removeChild(resistorWindow);
        main();
    };

    resistorsHolder.appendChild(resistorWindow);
    main();
}

function updateResistorNumbers(){
    let ch = resistorsHolder.children;
    let resistorCount = 1;
    ch.forEach((resistorWindow) => {
        let resistorHolder = resistorWindow.children[2];
        let resistors = resistorHolder.children;
        for(let i = 1;  i <= resistors.length; i++){
            // resistors[i].;
        }
        resistorCount += resistors.length;
    });
}

function getResistorList(){
    const resistorList = [];
    const ch = resistorsHolder.children;
    // TODO: add number to a resistor
    // let resistorNumber = 1;
    ch.forEach((resistorWindow) => {
        const calculatedResistorValues = resistorWindow.children[1];
        // console.log(calculatedResistorValues);
        const resistorType = resistorWindow.children[0].children[0];

        const resistorsValues = Array.from(resistorWindow.children[2].children).map((resistorHolder) => {
            const parsedInputValue = parseInt(resistorHolder.children[0].value);
            const parsedValue = (isNaN(parsedInputValue) || parsedInputValue < 1) ? 1 : parsedInputValue;
            resistorHolder.children[0].value = parsedValue;
            return parsedValue;
        });

        resistorList.push({
                "type": `${resistorType.options[resistorType.selectedIndex].value}`,
                "resistance": calculatedResistorValues.children[0],
                // "voltage": calculatedResistorValues.children[1],
                // "curent": calculatedResistorValues.children[2],
                "values" : resistorsValues,
            }
        );
    });

    return resistorList;
}

function calcResistance(type, values){
    let r = 0;
    if(type == "series"){
        // R = R1 + R2
        r = values.reduce((accumulator, value) => {
            return accumulator + value;
        }, 0);
    }
    else{
        // R = 1 / ((1/R1) + (1/R2))
        r = 1 / values.reduce((accumulator, value) => {
            return accumulator + 1 / value;
        }, 0);
    }

    return r;
}

function main(){
    let R = 0;
    const resistors = getResistorList();

    for(let i = 0; i < resistors.length; i++){
        const resistor = resistors[i];

        const resistance = calcResistance(resistor.type, resistor.values);
        R += resistance;

        // Resistors share same current when they are connected in series
        resistor.resistance.children[1].innerText = resistance.toFixed(2);
    }

    if(inputValue(valueToUse) == "current"){
        const I = parseInt(currentInput.children[1].value);
        calculatedCurrent.innerHTML = I.toFixed(2);
        calculatedVoltage.innerHTML = (R * I).toFixed(2);
    }
    else{
        const V = parseInt(voltageInput.children[1].value);
        calculatedVoltage.innerHTML = V.toFixed(2);
        calculatedCurrent.innerHTML = (V / R).toFixed(2);
    }
    calculatedResistance.innerHTML = R.toFixed(2);

    drawSchema(resistors);
}

function drawPart(x, y, w, powerSymbol){
    const h = w * powerSymbol.height;
    const w2 = w / 2;
    const h2 = h / 2;
    for(let i = 0; i < powerSymbol.lines.length; i++){
        const line = powerSymbol.lines[i];
        const x1 = line[0] * w - w2 + x;
        const x2 = line[2] * w - w2 + x;
        const y1 = line[1] * h - h2 + y;
        const y2 = line[3] * h - h2 + y;
        canvas.drawLine(x1, y1, x2, y2);
    }
}

function map(x, inMin, inMax, outMin, outMax){
    return (x - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

function drawSchema(resistors){
    const length = resistors.length;
    if(!length){
        return;
    }

    canvas.clear();
    const partWidth = canvas.width / resistors.length / 2;
    const partWidth2 = partWidth / 2;

    // Draw power source
    const powerSymbol = {
        'lines': [[0, 0.5, 0.45, 0.5], [0.45, 0.2, 0.45, 0.8], [0.55, 0.3, 0.55, 0.7], [0.55, 0.5, 1, 0.5]],
        'lineWidth': 3,
        'width': 1,
        'height': 0.5,
    };
    const resistorSymbol = {
        'lines': [[0, 0.5, 0.2, 0.5], [0.8, 0.5, 1, 0.5], [0.2, 0, 0.2, 1], [0.8, 0, 0.8, 1], [0.2, 0, 0.8, 0], [0.2, 1, 0.8, 1]],
        'lineWidth': 3,
        'width': 1,
        'height': 0.25,
    };
    drawPart(200, 300, partWidth, powerSymbol);
    canvas.drawLine(partWidth2, 300, canvas.width / 2 - partWidth2, 300);
    canvas.drawLine(canvas.width / 2 + partWidth2, 300, canvas.width-partWidth2);
    canvas.drawLine(partWidth2, 100, partWidth2, 300);
    canvas.drawLine(canvas.width - partWidth2, 100, canvas.width - partWidth2, 300);
    
    let x = 0;
    for(let r = 0; r < resistors.length; r++){
        const resistor = resistors[r];
        const newX = canvas.width/(length+1) * (r + 1);
        if(resistor.type == "parallel"){
            const l = resistor.values.length;
            const w = (powerSymbol.height * partWidth * l) / 2;
            let y = 0;
            for(let i = 0; i < l; i++){
                // TODO: add a circle to indicate that the wires are connected
                const newY = 100 + map(i, 0, l-1, -w, w);
                drawPart(newX, newY, partWidth, resistorSymbol);
                if(0 < i){
                    canvas.drawLine(newX - partWidth2, y, newX - partWidth2, newY);
                    canvas.drawLine(newX + partWidth2, y, newX + partWidth2, newY);
                }
                y = newY;
            }
        }
        else{
            drawPart(newX, 100, partWidth, resistorSymbol);
        }
        canvas.drawLine(x + partWidth2, 100, newX - partWidth2, 100);
        x = newX;
    }
    canvas.drawLine(x + partWidth2, 100, canvas.width - partWidth2, 100);

    canvas.swapBuffer();
}

createResistorsWindow();
updateValueToUse();

main();
