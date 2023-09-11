import types from "./types.js"
import {Functions} from "./functions.js"

import func from "../../../Tools/func.js";
import {Vec2} from "../../../Tools/func.js";

import {createProgram, createShader, Resize} from "../glFunc.js";
import {drawLine} from "../glMath.js";

import {shader as vertexShaderSource} from "../Shaders/vertexShader.js";
import {shader as fragmentShaderSource} from "../Shaders/fragmentShader.js";

const canvas = document.querySelector(".glCanvas");
const gl = canvas.getContext("webgl2");

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

const nodes = {};
const outputs = {};

let id = 0;
let mouse = false;
let focuse = null;
let offset = null;

let selected = null;
let shift = false;

let connectorFocuse = null;
let firstConnector = null, secondConnector = null;

const width = 1, height = 1;
let colorLocation, resolutionUniformLocation, translationUniformLocation, scaleUniformLocation;

function glInit(){
    if(gl === null){
        alert("unable to initialize webgl");
        return;
    }

    // initinitialization code
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    const program = createProgram(gl, vertexShader, fragmentShader);

    const positionAttribureLocation = gl.getAttribLocation(program, "a_position");
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    colorLocation = gl.getUniformLocation(program, "uColor");
    resolutionUniformLocation = gl.getUniformLocation(program, "uResolution");
    translationUniformLocation = gl.getUniformLocation(program, "uTranslation");
    scaleUniformLocation = gl.getUniformLocation(program, "uScale");

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.enableVertexAttribArray(positionAttribureLocation);

    // rendering code
    resize.resizeCanvasToDisplaySize(canvas);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    // console.log(gl.canvas.width, gl.canvas.height);

    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(program);

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const size = 2;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.vertexAttribPointer(positionAttribureLocation, size, type, normalize, stride, offset);

    gl.uniform4f(colorLocation, 0, 0, 0, 1.0);
    gl.uniform2f(translationUniformLocation, 0, 0);
    gl.uniform2f(scaleUniformLocation, 1, 1);
    gl.uniform2f(resolutionUniformLocation, width, height);

    // drawLine(gl, 0, 0, 0.1, 0.1, 0.010);
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
    if(e.button != 0){
        return;
    }
    mouse = true;
    if(focuse){
        const elementRect = focuse.node.getBoundingClientRect();
        const mousePos = new Vec2(e.x, e.y);
        const elementOffset = new Vec2(elementRect.x, elementRect.y);

        offset = mousePos.subtract(elementOffset);

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
});

// TODO: scale
// TODO: move
// TODO: clipping
document.addEventListener("mousemove", (e) => {
    const mousePos = new Vec2(e.clientX, e.clientY);
    const elementHolderRect = elementHolder.getBoundingClientRect();
    const elementHolderOffset = new Vec2(elementHolderRect.left, elementHolderRect.top);

    if(mouse && focuse){
        mousePos.subtractVal(elementHolderOffset);
        mousePos.subtractVal(offset);
        
        focuse.node.style.top = `${mousePos.y}px`;
        focuse.node.style.left = `${mousePos.x}px`;
        updateLines();
    }
    else if(mouse && firstConnector){
        console.log("drawing");
        firstConnector.draw(mousePos);
        updateLines();
    }
}, false);

// TODO: contextmenu
// document.addEventListener("contextmenu", (e) => {
//     const [x, y] = [e.x, e.y];
//     const rect = elementHolder.getBoundingClientRect();
//     if(rect.left < x && x < rect.left + rect.width && rect.top < y && y < rect.top + rect.height){
//         console.log(e);
//         e.preventDefault();
//     }
// });

HTMLElement.prototype.appendAllChildren = function(arrayOfElement){
    for(let i = 0; i < arrayOfElement.length; i++){
        this.appendChild(arrayOfElement[i]);
    }
}

function updateLines(){
    let linesDrawn = 0;
    Object.keys(nodes).forEach(key => {
        const node = nodes[key]
        node.connectionRight.forEach(connection => {
            if(connection.connectedTo){
                linesDrawn++;
                connection.draw(null);
            }
        });
    });
    if(linesDrawn == 0 && !firstConnector){
        gl.clearColor(0.0, 0.0, 0.0, 0.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }
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
        console.log(orientation);
        
        this.connectedTo = null;
        this.lineConnection = null;
        
        this.element = func.createElement(`<div class="connection ${this.orientationClass}"><div class="body"></div></div>`);
        this.body = this.element.children[0];
        this.inputNode = inputNode;
        this.type = type;

        const parent = (orientation == types.LEFT_CONNECTION) ? node.left : node.right;
        parent.appendChild(this.element);
        
        this.element.addEventListener("mouseenter", () => {
            if(!focuse){
                connectorFocuse = this;
                if(firstConnector && firstConnector.node.id != this.node.id){
                    console.log(`${firstConnector.node.id} => ${this.node.id}`);
                    secondConnector = this;
                }
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
                    this.inputNode.classList.add("hidden");
                }
            }
            else{
                this.inputNode.classList.remove("hidden");
            }
        }

        if(this.connectedTo && repeat){
            this.connectedTo.connectorListener(false);
        }

        console.log(`connection has changed`);
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

        const xScale = 1 / elementHolderRect.width;
        const yScale = 1 / elementHolderRect.height;

        from.subtractVal(elementHolderOffset)
        to.subtractVal(elementHolderOffset);
        from.scale(xScale, yScale);
        to.scale(xScale, yScale);

        drawLine(gl, from.x, from.y, to.x, to.y, 8 * xScale);
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
        this.x = (x == null) ? 0 : x;
        this.y = (y == null) ? 0 : y;
    }
    
    // node
    //  - left
    //  - element
    //    - name
    //    - body
    //  - right
    init(type, elementName){
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
        this.node.style.top = `${this.y}px`;
        this.node.style.left = `${this.x}px`;
    }

    addEvents(){
        this.element.addEventListener("mouseenter", () => { 
            if(!focuse && !firstConnector){ 
                focuse = this;
                // console.log(`focuse ${focuse}`);
            }
        });
        this.element.addEventListener("mouseleave", () => { 
            if(!mouse){
                focuse = null; 
                // console.log(`focuse end`);
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
        console.log(name);
        this.init(types.ELEMENT_NODE_FUNCTION_TYPE, this.name);
    }

    create(){
        const args = functions.info[this.name].args;
        const argsTypes = functions.info[this.name].argsTypes;
        this.functionInputs = [];
        for(let i = 0; i < args.length; i++){
            const line = document.createElement("div");
            const inputName = func.createElement(`<p>${args[i]}</p>`);
            const inputNode = func.createElement(`<input type="text">}`);
            this.connectionLeft.push(new Connection(types.LEFT_CONNECTION, this, inputNode, argsTypes[i]));
            this.inputNodes.push(inputNode);
            this.functionInputs.push(inputName);

            this.body.appendChild(line);

            line.appendChild(inputName);
            line.appendChild(inputNode);
        }

        this.connectionRight.push(new Connection(types.RIGHT_CONNECTION, this));
    }

    getOutput(){
        const func = functions.table[this.name];
        const args = functions.info[this.name].args;
        const fArgs = [];
        for(let i = 0; i < args.length; i++){
            fArgs.push(this.connectionLeft[i].getOutput());
            // if(this.connectionLeft[i] && this.connectionLeft[i].connectedTo){
            //     fArgs.push(this.connectionLeft[i].connectedTo.node.getOutput());
            // }
            // else{
            //     if(this.type == types.INPUT_INT_TYPE){
            //         return fArgs.push(this.input.value);
            //     }
            //     else if(this.type == types.INPUT_FLOAT_TYPE){
            //         return fArgs.push(this.input.value);
            //     }
            //     else if(this.type == types.INPUT_ARRAY_TYPE){
            //         return fArgs.push(this.input.value);
            //     }
            //     else{
            //
            //         return this.input.value;
            //     }
            //
            //     fArgs.push(this.inputNodes[i].getOutput());
            // }
        }
        // console.log(fArgs);
        const fOutput = func.apply(null, fArgs);
        console.log(`${this.name} => ${fOutput}`);
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

const resize = new Resize(canvas, [1000, 1000]);
glInit();


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

window.self.addEventListener("resize", updateLines);

function generate(){
    generatedOutput.value = "";
    Object.keys(outputs).forEach(key => {
        const str = outputs[key].getOutput();
        console.log(str);
        generatedOutput.value += `${str}\n`;
    });
}
