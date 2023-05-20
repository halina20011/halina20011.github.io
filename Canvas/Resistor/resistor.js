import {CANVAS} from "/Canvas/canvas.js";
import {DOWNLOADER} from "/Canvas/download.js";

let canvasEl = document.getElementById("my-canvas");

let canvas = new CANVAS(canvasEl);
let downloader = new DOWNLOADER(canvasEl);

let downloadImageButton = document.getElementById("downloadImage");
downloadImageButton.addEventListener("click", function() { downloader.downloadImage(); }, false);

let updateButton = document.getElementById("update");
updateButton.addEventListener("click", () => { main(); }, false);

let addButton = document.getElementById("addButton");
addButton.addEventListener("click", () => { createResistorsWindow(); }, false);

let voltageInput = document.getElementById("voltageInput");
let currentInput = document.getElementById("currentInput");

let calculatedValues = document.getElementById("calculatedValues");
let calculatedResistance = calculatedValues.children[0].children[1];
let calculatedVoltage = calculatedValues.children[1].children[1];
let calculatedCurrent = calculatedValues.children[2].children[1];

let valueToUse = document.getElementById("valueToUse");
valueToUse.addEventListener("change", () => {
    updateValueToUse();
}, false);

let resistorsHolder = document.getElementById("resistorsHolder");

function inputValue(input){
    return input.options[input.selectedIndex].value;
}

let updateValueToUse = () => {
    let value = inputValue(valueToUse);
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
    let temp = document.createElement("div");
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
    let resistorWindow = document.createElement("div");
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

    let resistorType            = resistorWindow.children[0].children[0];
    let buttons                 = resistorWindow.children[0].children[1];
    let addResistorButton       = buttons.children[0];
    let removeResistorsButton   = buttons.children[1];
    let resistorHolder          = resistorWindow.children[2];

    let createResistor = () => {
        let resistor = document.createElement("div");
        resistor.className = "resistor";
        
        // let resistorValues = string2Element(

        let resistorValue = string2Element(`<input class="hideInputArrows" type="number" min="1" value="1000">`);

        let removeResistorButton = document.createElement("button");
        removeResistorButton.className = "removeButton";
        removeResistorButton.addEventListener("click", () => {
            let type = resistorType.options[resistorType.selectedIndex].value;
            let min = (type == "series") ? 1 : 2;
            if(min < resistorHolder.children.length){
                removeResistor(resistorHolder, resistor);
            }
        });

        resistor.appendChild(resistorValue);
        resistor.appendChild(removeResistorButton);
        
        addResistor(resistorHolder, resistor);
    };

    let correctResistors = () => {
        let type = resistorType.options[resistorType.selectedIndex].value;
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
    let resistorList = [];
    let ch = resistorsHolder.children;
    // TODO: add number to a resistor
    // let resistorNumber = 1;
    ch.forEach((resistorWindow) => {
        let resistor = {};
        let calculatedResistorValues = resistorWindow.children[1];
        // console.log(calculatedResistorValues);
        let resistorType = resistorWindow.children[0].children[0];

        let resistorsValues = Array.from(resistorWindow.children[2].children).map((resistorHolder) => {
            let parsedInputValue = parseInt(resistorHolder.children[0].value);
            let parsedValue = (parsedInputValue == NaN || parsedInputValue < 1) ? 1 : parsedInputValue;
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
    let resistors = getResistorList();

    for(let i = 0; i < resistors.length; i++){
        let resistor = resistors[i];

        let resistance = calcResistance(resistor.type, resistor.values);
        R += resistance;

        // Resistors share same current when they are connected in series
        resistor.resistance.children[1].innerText = resistance.toFixed(2);
    }

    if(inputValue(valueToUse) == "current"){
        let I = parseInt(currentInput.children[1].value);
        calculatedCurrent.innerHTML = I.toFixed(2);
        calculatedVoltage.innerHTML = (R * I).toFixed(2);
    }
    else{
        let V = parseInt(voltageInput.children[1].value);
        calculatedVoltage.innerHTML = V.toFixed(2);
        calculatedCurrent.innerHTML = (V / R).toFixed(2);
    }
    calculatedResistance.innerHTML = R.toFixed(2);

    drawSchema(resistors);
}

function drawPart(x, y, w, powerSymbol){
    let h = w * powerSymbol.height;
    let w2 = w / 2;
    let h2 = h / 2;
    let [x1, x2] = [x - w2, x + w2];
    let [y1, y2] = [y - h2, y + h2];
    for(let i = 0; i < powerSymbol.lines.length; i++){
        let line = powerSymbol.lines[i];
        let x1 = line[0] * w - w2 + x;
        let x2 = line[2] * w - w2 + x;
        let y1 = line[1] * h - h2 + y;
        let y2 = line[3] * h - h2 + y;
        canvas.drawLine(x1, y1, x2, y2);
    }
}

function map(x, inMin, inMax, outMin, outMax){
    return (x - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

function drawSchema(resistors){
    let length = resistors.length;
    if(!length){
        return;
    }

    canvas.clear();
    let partWidth = canvas.width / resistors.length / 2;
    let partWidth2 = partWidth / 2;

    // Draw power source
    let powerSymbol = {
        'lines': [[0, 0.5, 0.45, 0.5], [0.45, 0.2, 0.45, 0.8], [0.55, 0.3, 0.55, 0.7], [0.55, 0.5, 1, 0.5]],
        'lineWidth': 3,
        'width': 1,
        'height': 0.5,
    };
    let resistorSymbol = {
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
        let resistor = resistors[r];
        let newX = canvas.width/(length+1) * (r + 1);
        if(resistor.type == "parallel"){
            let l = resistor.values.length;
            let w = (powerSymbol.height * partWidth * l) / 2;
            let y = 0;
            for(let i = 0; i < l; i++){
                // TODO: add a circle to indicate that the wires are connected
                let newY = 100 + map(i, 0, l-1, -w, w);
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
