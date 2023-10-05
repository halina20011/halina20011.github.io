import types from "./types.js"
import {Functions} from "./functions.js"

import func from "../../../Tools/func.js";
import {Vec2} from "../../../Tools/func.js";

document.querySelector(".generate").addEventListener("click", () => { generate(); });
// document.querySelector(".save").addEventListener("click", () => { save(); });

// const columnUp = document.querySelector(".columnUp");
// const columnDown = document.querySelector(".columnDown");
// const content = document.querySelector(".content");
//
// document.querySelector(".resizeButton").addEventListener("click", () => { 
//     content.classList.toggle("fullScreen");
//     columnUp.classList.toggle("hidden");
//     columnDown.classList.toggle("hidden");
// });

const generatedOutput = document.querySelector(".generatedOutput");
generatedOutput.value = "";

const elementHolder = document.querySelector(".elementHolder");

const autoCopy = document.querySelector(".autoCopy");
autoCopy.addEventListener("click", () => {
    autoCopy.classList.toggle("enabled");
});

const nodes = {};
const outputs = {};

let id = 0;
let mouse = false;
let focuse = null;
let prevPos = null;

const pos = new Vec2(0, 0);
let noSelect = false;

let selected = null;
let shift = false;

let connectorFocuse = null;
let firstConnector = null, secondConnector = null;

const svg = document.querySelector("svg");

function drawLL(x1, y1, x2, y2){
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);

    svg.appendChild(line);
}

document.addEventListener("keydown", (e) => {
    if(e.key == "Shift"){
        shift = true;
    }
});

document.addEventListener("keyup", (e) => {
    if(e.key == "Shift"){
        shift = false;
    }
});

// mouseenter -> down -> move
document.addEventListener("mousedown", (e) => {
    if(!mouseEvent(e, elementHolder).inside){
        return;
    }

    if(e.button != 0){
        return;
    }
    mouse = true;
    const mousePos = new Vec2(e.x, e.y);
    prevPos = mousePos;
    if(focuse){
        if(shift){
            const from = selected;
            const to = focuse;
            if(from.id != to.id){
                console.log(`connecting ${from.id} to ${to.id}`);
                const connectFrom = from.getFirstConnector(types.RIGHT_CONNECTION);
                const connectTo = to.getFirstConnector(types.LEFT_CONNECTION);
                if(connectFrom && connectTo){
                    connectFrom.connect(connectTo);
                }
            }
        }
        else{
            selected = focuse;
        }
    }
    else if(connectorFocuse){
        if(connectorFocuse.connectedTo){
            console.log("disconnecting...");
            firstConnector = connectorFocuse.connectedTo;
            connectorFocuse.disconnect();
        }
        else{
            firstConnector = connectorFocuse;
        }
    }
});

document.addEventListener("mouseup", (e) => { 
    if(e.button != 0){
        return;
    }

    mouse = false;
    if(firstConnector && secondConnector){
        firstConnector.connect(secondConnector);
    }
    else{
        if(firstConnector){
            firstConnector.disconnect();
        }
        if(secondConnector){
            secondConnector.disconnect();
        }
    }

    firstConnector = null;
    secondConnector = null;
    updateLines();
    focuse = null;
    prevPos = null;

    noSelect = true;
    document.body.classList.remove("noSelect");
});

document.addEventListener("mousemove", (e) => {
    const mousePos = new Vec2(e.clientX, e.clientY);
    if(!prevPos){
        prevPos = mousePos;
    }
    
    const dis = mousePos.subtract(prevPos);
    prevPos = mousePos;

    if(mouse && !noSelect){
        noSelect = true;
        document.body.classList.add("noSelect");
    }

    if(mouse && focuse){
        focuse.position.addVal(dis);

        focuse.updatePosition();
        updateLines();
    }
    else if(mouse && firstConnector){
        updateLines();
        firstConnector.draw(mousePos);
    }
    else if(mouse && prevPos){
        pos.addVal(dis);
        
        updatePositions();
        updateLines();
    }
}, false);

const mouseEvent = (e, element) => {
    const [x, y] = [e.x, e.y];
    const rect = element.getBoundingClientRect();
    const click = new Vec2(x - rect.left, y - rect.top);
    let inside = false;
    if(0 <= click.x && 0 <= click.y && click.x < rect.width && click.y < rect.height){
        inside = true;
    }

    return {"clickPos": click, "inside": inside};
}

const contextMenu = document.querySelector(".contextMenu");
const contextMenuRemove = document.querySelector(".contextMenu > .remove");
let contextMenuTarget = null;

const contextMenuExit = () => {
    contextMenuTarget = null;
    contextMenu.classList.add("hidden");
}

// TODO: contextmenu
document.addEventListener("contextmenu", (e) => {
    const click = mouseEvent(e, elementHolder);
    console.log(click);
    if(click.inside == true){
        if(focuse){
            contextMenu.classList.remove("hidden");
            contextMenuTarget = focuse;
            contextMenu.style.left = `${click.clickPos.x}px`;
            contextMenu.style.top = `${click.clickPos.y}px`;
        }
        e.preventDefault();
    }
});

contextMenuRemove.addEventListener("click", () => {
    console.log(Object.keys(nodes).length);
    if(contextMenuTarget){
        contextMenuTarget.connectionLeft.forEach(con => con.disconnect());
        contextMenuTarget.connectionRight.forEach(con => con.disconnect());
        contextMenuTarget.node.remove();
        if(contextMenuTarget.type == types.ELEMENT_NODE_OUTPUT_TYPE){
            delete outputs[contextMenuTarget.id];
        }
        delete nodes[contextMenuTarget.id];

        contextMenuExit();
    }
    // console.log(Object.keys(nodes).length);

    updateLines();
});

contextMenu.addEventListener("pointerleave", () => {
    contextMenuExit();
});

HTMLElement.prototype.appendAllChildren = function(arrayOfElement){
    for(let i = 0; i < arrayOfElement.length; i++){
        this.appendChild(arrayOfElement[i]);
    }
}

function updatePositions(){
    Object.keys(nodes).forEach(key => {
        const node = nodes[key];
        node.updatePosition();
    });
}

function updateLines(){
    svg.innerHTML = "";
    
    // if(firstConnector){
    //     firstConnector.draw(mousePos);
    // }

    Object.keys(nodes).forEach(key => {
        const node = nodes[key];
        node.connectionRight.forEach(connection => {
            if(connection.connectedTo){
                connection.draw(null);
            }
        });
    });
}

// on mouseenter
//  if(connectorFocuse)
//      firstConnector = this
//  if(firstConnector && firstConnector.node.id != this.node.id)
//      secondConnector = this;
//
//  on mousedow && connectorFocuse
//      if firstConnector.connectedTo
//          get the other connector and disconnect it
//      firstConnector = connectorFocuse
//
//  mouseup
//      if(firstConnector && secondConnector)
//          firstConnector.connectedTo = secondConnector;
//          secondConnector.connectedTo = firstConnector;
//      else
//          firstConnector = null;
//          
class Connection{
    constructor(orientation, node, inputNode = null, type = null){
        this.node = node;
        this.id = [this.node.id, this.node.connectorId++];
        this.orientationClass = (orientation == types.LEFT_CONNECTION) ? "left" : "right";
        // console.log(orientation);
        
        this.connectedTo = null;
        this.lineConnection = null;
        
        this.element = func.createElement(`<div class="connection ${this.orientationClass}"><div class="body"></div></div>`);
        this.body = this.element.children[0];
        this.inputNode = inputNode;
        this.type = type;

        const parent = (orientation == types.LEFT_CONNECTION) ? node.left : node.right;
        parent.appendChild(this.element);
        
        this.element.addEventListener("mouseenter", () => {
            connectorFocuse = this;
            if(firstConnector && firstConnector.node.id != this.node.id){
                console.log(`${firstConnector.node.id} => ${this.node.id}`);
                secondConnector = this;
            }
        }, false);
        this.element.addEventListener("mouseleave", () => {
            connectorFocuse = null;
        });
    }

    connect(to){
        this.disconnect();
        to.disconnect();
        this.connectedTo = to;
        to.connectedTo = this;
        this.connectorListener(true);
    }

    connectorListener(repeat){
        if(this.inputNode){
            if(this.connectedTo){
                if(this.orientationClass == "left"){
                    this.inputNode.classList.add("hiddenVis");
                }
            }
            else{
                this.inputNode.classList.remove("hiddenVis");
            }
        }

        if(this.connectedTo && repeat){
            this.connectedTo.connectorListener(false);
        }

        // console.log(`connection has changed`);
    }

    pos(){
        const rect = this.body.getBoundingClientRect();
        return [rect.left + rect.width / 2, rect.top + rect.height / 2];
    }

    disconnect(){
        if(this.connectedTo){
            this.connectedTo.connectedTo = null;
            this.connectedTo.connectorListener(false);

            this.connectedTo = null;
            this.connectorListener(true);
        }
    }

    draw(pos2){
        const [x, y] = this.pos();
        const from  = new Vec2(x, y);
        let to = pos2;

        if(this.connectedTo){
            const [x, y] = this.connectedTo.pos();
            to = new Vec2(x, y);
        }

        const elementHolderRect = elementHolder.getBoundingClientRect();
        const elementHolderOffset = new Vec2(elementHolderRect.left, elementHolderRect.top);

        from.subtractVal(elementHolderOffset);
        to.subtractVal(elementHolderOffset);

        drawLL(from.x, from.y, to.x, to.y);
    }

    getOutput(){
        if(this.connectedTo){
            return this.connectedTo.node.getOutput();
        }
        
        if(this.inputNode == null || this.type == null){
            return null;
        }

        const inputData = this.inputNode.value;

        if(this.type == types.INPUT_INT_TYPE){
            return parseInt(inputData);
        }
        else if(this.type == types.INPUT_FLOAT_TYPE){
            return parseFloat(inputData);
        }
        else if(this.type == types.INPUT_ARRAY_TYPE){
            return JSON.parse(inputData);
        }

        return inputData;
    }
}

const list = ["input", "function", "output"];
class Node{
    constructor(x, y){
        this.id = id++;
        this.connectorId = 0;
        this.position = new Vec2((x == null) ? 0 : x, (y == null) ? 0 : y);
    }
    
    // node
    //  - left
    //  - element
    //    - name
    //    - body
    //  - right
    init(type, elementName){
        this.type = type;
        this.node = func.createElement(`<div class="node ${list[type]}"></div>`);
        this.element = func.createElement(`
        <div class="element">
            <div class="name"><p>${elementName}_${this.id}</p></div>
            <div class="body"></div>
        </div>`);
        this.body = this.element.children[1];
        this.left = func.createElement(`<div class="left"></div>`);
        this.right = func.createElement(`<div class="right"></div>`);
        
        this.connectionLeft = []
        this.connectionRight = [];

        this.create();

        this.addEvents();
        this.addCss();
        
        elementHolder.appendChild(this.node);
        this.node.appendAllChildren([this.left, this.element, this.right]);

        nodes[this.id] = this;
    }

    addCss(){
        this.node.style.top = `${this.position.y}px`;
        this.node.style.left = `${this.position.x}px`;
    }

    addEvents(){
        this.element.addEventListener("pointerenter", () => { 
            if(!focuse && !firstConnector){ 
                focuse = this;
            }
        });
        this.element.addEventListener("pointerleave", (e) => { 
            const click = mouseEvent(e, this.element);
            // console.log(click);
            if(!mouse && click.inside == false){
                focuse = null; 
            }
        });
    }
    
    getFirstConnector(orientation){
        const list = (orientation == types.LEFT_CONNECTION) ? this.connectionLeft : this.connectionRight;
        if(list.length == 0){
            return null;
        }
        for(let i = 0; i < list.length; i++){
            const connector = list[i];
            if(connector.connectedTo == null){
                return connector;
            }
        }

        return list[0];
    }

    updatePosition(){
        this.node.style.top = `${this.position.y + pos.y}px`;
        this.node.style.left = `${this.position.x + pos.x}px`;
    }
}

class NodeOutput extends Node{
    constructor(x, y){
        super(x, y, 120, 50);
        this.init(types.ELEMENT_NODE_OUTPUT_TYPE, "output");
        outputs[this.id] = this;
    }

    create(){
        this.input = new Connection(types.LEFT_CONNECTION, this);
        this.connectionLeft.push(this.input);
    }

    getOutput(){
        if(this.input.connectedTo){
            return JSON.stringify(this.input.connectedTo.node.getOutput());
        }
        return "";
    }
}

class NodeFunction extends Node{
    constructor(name, x, y){
        super(x, y, 100);
        this.name = name;
        this.inputNodes = [];
        // console.log(name);
        this.init(types.ELEMENT_NODE_FUNCTION_TYPE, this.name);
    }

    create(){
        const args = functions.info[this.name].args;
        const argsTypes = functions.info[this.name].argsTypes;
        this.functionInputs = [];
        for(let i = 0; i < args.length; i++){
            const inputName = func.createElement(`<p>${args[i]}</p>`);
            const inputNode = func.createElement(`<input type="text">}`);
            this.connectionLeft.push(new Connection(types.LEFT_CONNECTION, this, inputNode, argsTypes[i]));
            this.inputNodes.push(inputNode);
            this.functionInputs.push(inputName);

            this.body.appendChild(inputName);
            this.body.appendChild(inputNode);
        }

        this.connectionRight.push(new Connection(types.RIGHT_CONNECTION, this));
    }

    getOutput(){
        const func = functions.table[this.name];
        const args = functions.info[this.name].args;
        const fArgs = [];
        for(let i = 0; i < args.length; i++){
            fArgs.push(this.connectionLeft[i].getOutput());
        }

        const fOutput = func.apply(null, fArgs);
        return fOutput;
    }
}

const inputFunctions = [() => {return true}, () => true, (letter) => func.idDigit(letter)];

class NodeInput extends Node{
    constructor(type, x, y){
        super(x, y);
        this.type = type;
        this.init(types.ELEMENT_NODE_INPUT_TYPE, types.INPUT_NAMES[this.type]);
        this.inputValue = "";
        this.filterFunction = inputFunctions[this.type];
        this.filterInput();
    }

    filterInput(){
        this.input.addEventListener("input", () => {
            const value = this.input.value;
            if(value.length){
                if(this.filterFunction(value[value.length - 1])){
                    this.inputValue = value;
                }
                else{
                    this.input.value = this.inputValue;
                }
            }
        });
    }

    create(){
        this.input = func.createElement("<input></input>");
        this.body.appendChild(this.input);
        this.connectionRight.push(new Connection(types.RIGHT_CONNECTION, this));
    }

    getOutput(){
        if(this.type == types.INPUT_INT_TYPE){
            return parseInt(this.input.value);
        }
        else if(this.type == types.INPUT_FLOAT_TYPE){
            return parseFloat(this.input.value);
        }
        else if(this.type == types.INPUT_ARRAY_TYPE){
            return JSON.parse(this.input.value);
        }

        return this.input.value;
    }
}

// TODO: save and load
// function save(){
//     const newData = JSON.stringify(nodes);
//     console.log(window.location.pathname);
// }
//
// function load(){
//     const url = new URL(window.location.href);
//     const data = url.searchParams.get("data");
// }

const functions = new Functions(NodeInput, NodeFunction, NodeOutput);

const a = new NodeFunction("fromRegExp", 50, 50);
const b = new NodeFunction("randomFromArray", 300, 200);
const o = new NodeOutput(525, 300);

a.inputNodes[0].value = "[a-z]";
a.connectionRight[0].connect(b.connectionLeft[0]);
b.inputNodes[1].value = "100";
b.connectionRight[0].connect(o.connectionLeft[0]);

updateLines();
generate();

function generate(){
    let output = ""
    Object.keys(outputs).forEach(key => {
        const str = outputs[key].getOutput();
        output += `${str}\n`;
    });

    generatedOutput.value = output;

    if(autoCopy.classList.contains("enabled")){
        navigator.clipboard.writeText(output);
    }
}
