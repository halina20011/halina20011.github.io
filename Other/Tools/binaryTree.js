"use strict";
import {shader as vertexShaderSource} from "./Shaders/vertexShader.js";
import {shader as fragmentShaderSource} from "./Shaders/fragmentShader.js";

import func from "../../Tools/func.js";
import {createProgram, createShader, Resize} from "./glFunc.js";
import {drawCircle, drawLine} from "./glMath.js";

const canvas = document.querySelector(".glCanvas");
const gl = canvas.getContext("webgl2");

const textCanvas = document.querySelector(".textCanvas");

const binaryTreeInput = document.querySelector(".binaryTreeInput");
document.querySelector(".parse").addEventListener("click", () => { createTree(); }, false);

document.querySelector(".home").addEventListener("click", () => {position = [0, 0]; scale = 0; showBinaryTree()}, false);
document.querySelector(".zoomIn").addEventListener("click", () => { scale++; showBinaryTree(); }, false);
document.querySelector(".zoomOut").addEventListener("click", () => { scale--; showBinaryTree(); }, false);

let colorLocation, resolutionUniformLocation, translationUniformLocation, scaleUniformLocation;

let holding = false;
let prevMove = null;
let shift = false;

let position = [0,0];
let scale = 0;
let calcScale = () => {
    return (scale < 0) ? 1/-scale : scale + 1;
}

const checkShift = (e, action)=>{
    if(e.key == "Shift"){
        shift = action;
    }
}

function overElement(e, element){
    const a = element.getBoundingClientRect();
    const left = a.left, top = a.top, elWidth = a.width, elHeight = a.height;

    const x = e.clientX;
    const y = e.clientY;

    const xAxis = left < x && x < left + elWidth;
    const yAxis = top < y && y < top + elHeight;

    return xAxis && yAxis;
}

window.addEventListener("mouseup", () => {holding = false; prevMove = null}, false);
window.addEventListener("mousedown", (e) => { 
    if(overElement(e, canvas)){
        holding = true; 
    }
}, false);
window.addEventListener("mousemove", (e) => {moveCanvas(e);}, false);

window.addEventListener("keydown", (e)=>{checkShift(e, true)}, false);
window.addEventListener("keyup", (e)=>{checkShift(e, false)}, false);

window.addEventListener("wheel", (e) => {
    if(shift){
        scale += (0 < e.deltaY) ? -1 : 1;
        showBinaryTree();
    }
}, false);

function moveCanvas(e){
    if(holding){
        const a = canvas.getBoundingClientRect();
        const left = a.left, top = a.top, canWidth = a.width, canHeight = a.height;
        const x = e.clientX;
        const y = e.clientY;
        // const xAxis = left < x && x < left + canWidth;
        // const yAxis = top < y && y < top + canHeight;
        // if(xAxis && yAxis){
            const thisX = x - left;
            const thisY = y - top;
            if(prevMove != null){
                const mX = thisX - prevMove[0];
                const mY = thisY - prevMove[1];
                position[0] += mX * width/canWidth / calcScale();
                position[1] += mY * height/canHeight / calcScale();
                showBinaryTree();
            }
            prevMove = [thisX, thisY];
        // }
    }
}

class Node{
    constructor(data){
        this.data = data;
        this.right = undefined;
        this.left = undefined;
    }
}

let tree, width, height, depth, size;
function build(array, size, index){
    if(size <= index || array[index] == null){
        return null;
    }

    const node = new Node(array[index]);
    node.left = build(array, size, 2 * index + 1);
    node.right = build(array, size, 2 * index + 2);

    return node;
}

function createTreeArray(tree, array = [], index = 0){
    if(tree == null){
        return array;
    }

    array[index] = (isNaN(tree.data)) ? 0 : tree.data;
    array = createTreeArray(tree.left, array, 2 * index + 1);
    array = createTreeArray(tree.right, array, 2 * index + 2);

    return array;
}

function maxDepth(tree){
    if(tree == undefined){
        return 0;
    }

    return Math.max(maxDepth(tree.left), maxDepth(tree.right)) + 1;
}

function createTree(){
    const rawText = binaryTreeInput.value;
    const parsedText = func.tryJsonParse(rawText);
    // console.log(parsedText);
    if(parsedText == undefined){
        binaryTreeInput.classList.add("invalid");
        return;
    }
    binaryTreeInput.classList.remove("invalid");

    const treeArray = parsedText.map(value => {
        const parsedValue = parseInt(value); 
        return (!isNaN(parsedValue)) ? parsedValue : null;
    });

    tree = build(treeArray, treeArray.length, 0);
    showBinaryTree(tree);
}

const nodePos = (index) => {
    const level = Math.floor(Math.log2(index + 1));
    const lastNodeOnSameLeve = Math.pow(2, level + 1) - 1;
    const nodeLeveIndex = lastNodeOnSameLeve - index;
    const numberOfNodes = Math.pow(2, level);
    const fractionX = 1 - (nodeLeveIndex / numberOfNodes);
    const fractionY = level / depth;
    const offsetX = width / (numberOfNodes * 2);
    const offsetY = height / (depth * 2);
    const xPos = fractionX * width + offsetX;
    const yPos = fractionY * height + offsetY;

    return [xPos, yPos]
}

const toProc = (pos, max) => {
    return (pos / max) * 100 * calcScale();
}

const addNodeButton = (createFunc, xPos, yPos, side) => {
    const button = document.createElement("button");
    button.classList.add("addNodeButton");
    button.classList.add("addButton");
    const buttonX = toProc(size / 2, width);
    const buttonY = toProc(size / 2, height);
    
    button.style.width = `${buttonX}%`;
    button.style.height = `${buttonY}%`;

    const xOffset = size / 4 * side;
    button.style.left = `${toProc((xPos + xOffset + position[0]), width)}%`;
    button.style.top = `${toProc((yPos + size/4*3 + position[1]), height)}%`;

    button.onclick = () => {
        createFunc();
        const treeArray = createTreeArray(tree);
        binaryTreeInput.value = JSON.stringify(treeArray);
        showBinaryTree();
    }
    
    textCanvas.appendChild(button);
}

function showNode(node, index){
    if(node == null){
        return;
    }
    
    const [xPos, yPos] = nodePos(index);
    const size2 = size/2;

    gl.uniform4f(colorLocation, 0.5, 0.5, 0, 1);

    if(node.left != null){
        gl.uniform4f(colorLocation, 0, 0, 0, 1);
        const [xPos2, yPos2] = nodePos(2 * index + 1);
        drawLine(gl, xPos, yPos + size2, xPos2, yPos2 - size2, size2);
        showNode(node.left, 2 * index + 1);
    }
    else{
        const callback = () => {
            node.left = new Node(0);
        }
        addNodeButton(callback, xPos, yPos, -1);
    }
    if(node.right != null){
        gl.uniform4f(colorLocation, 0, 0, 0, 1);
        const [xPos2, yPos2] = nodePos(2 * index + 2);
        drawLine(gl, xPos, yPos + size2, xPos2, yPos2 - size2, size2);
        showNode(node.right, 2 * index + 2);
    }
    else{
        const createFunc = () => {
            node.right = new Node(0);
        }
        addNodeButton(createFunc, xPos, yPos, 1);
    }

    const input = document.createElement("input");
    input.type = "text";
    input.className = "input";
    
    input.style.left = `${toProc(xPos+position[0], width)}%`;
    input.style.top = `${toProc(yPos+position[1],height)}%`;
    
    const inputWidth = toProc(size * 2, width);
    const inputHeight = toProc(size * 2,height);
    input.style.width = `${inputWidth}%`;
    input.style.height = `${inputHeight}%`;
    input.value = node.data;
    const updateInput = () => {
        node.data = parseInt(input.value);
        const treeArray = createTreeArray(tree);
        binaryTreeInput.value = JSON.stringify(treeArray);
    }

    input.style.fontSize = `${inputHeight}px`;
    input.oninput = updateInput;
    textCanvas.appendChild(input);

    gl.uniform4f(colorLocation, 0, 0, 0, 1);
    drawCircle(gl, xPos, yPos, size, 40);
    gl.uniform4f(colorLocation, 0, 0, 0, 0);
    drawCircle(gl, xPos, yPos, size * 9/10, 40);
}

function showBinaryTree(){
    // 0        1
    // 1    n       2
    // 2  n   n   3   4
    // 3 n n n n 5 6 7 8
    // get depth of the tree
    depth = maxDepth(tree);
    const leafs = Math.pow(2, depth);

    height = 9;
    width = 16;
    // console.log(`h ${height} w ${width}`);

    // first resize the window
    gl.uniform2f(resolutionUniformLocation, width, height);
    size = width / (leafs * 2 - 1);
    
    // apply offset
    gl.uniform2f(translationUniformLocation, position[0], position[1]);
    const s = calcScale();
    gl.uniform2f(scaleUniformLocation, s, s);

    textCanvas.innerHTML = "";
    showNode(tree, 0);
}

function main(){
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

    var size = 2;
    var type = gl.FLOAT;
    var normalize = false;
    var stride = 0;
    var offset = 0;
    gl.vertexAttribPointer(positionAttribureLocation, size, type, normalize, stride, offset);

    gl.uniform4f(colorLocation, 0.5, 0.5, 0.8, 1);
    showBinaryTree();
}

const resize = new Resize(canvas, [1920,1080]);

main();
createTree();
