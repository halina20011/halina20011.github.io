import {cubeData, sphereData, torusData} from "./modeData.js";

import {createProgram, createShader, Resize} from "../../Other/Tools/glFunc.js";
import {drawLine} from "../../Other/Tools/glMath.js";

import {shader as fragmentShaderSource} from "../../Other/Tools/Shaders/fragmentShader.js";

// TODO: add downloader

const vertexShaderSource = `#version 300 es
    in vec2 a_position;
    uniform vec2 uTranslation;
    uniform vec2 uResolution;
    uniform vec2 uScale;

    void main(){
        vec2 position = (a_position + uTranslation)*uScale;
        vec2 zeroToOne = position / uResolution;
        vec2 zeroToTwo = zeroToOne * 2.0;
        vec2 clipSpace = zeroToTwo - 1.0;
        gl_Position = vec4(position, 0, 1);
    }`;

const canvas = document.querySelector(".glCanvas");
const gl = canvas.getContext("webgl2");

let colorLocation, resolutionUniformLocation, translationUniformLocation, scaleUniformLocation;

// const downloadImageButton = document.getElementById("downloadImage");
// downloadImageButton.addEventListener("click", function() { downloader.downloadImage(); }, false);

const setDefault = document.getElementById("setDefault");
setDefault.addEventListener("click", () => { object.setDefault(); camera.setDefault(); });

HTMLSelectElement.prototype.onSelect = function(f, run){
    if(run){
        f(this.value);
    }

    this.addEventListener("change", (e) => { f(this.value, e); }, false);
}

const updateButton = document.getElementById("update");
updateButton.addEventListener("click", function() { 
    main();
}, false);

HTMLElement.prototype.$ = function(name, f, run){
    if(run == true && f){
        f();
    }
    this.addEventListener(name, () => { f(); }, false);
}

HTMLElement.prototype.inputToDeg = function(){
    return parseInt(this.value);
}

let projectionType = false;
const perspectiveProjectionCheckbox = document.querySelector("#perspectiveProjection");
perspectiveProjectionCheckbox.$("input", () => { projectionType = perspectiveProjection.checked; }, true);

let animation = false;
const applyAnimationCheckbox = document.getElementById("applyAnimation");
applyAnimationCheckbox.$("input", () => { animation = applyAnimationCheckbox.checked;}, true);

const timeDelay = document.getElementById("timeDelay");
timeDelay.$("input", () => {
    timeout = parseInt(timeDelay.value);
    if(!timeout){
        timeout = timeDelay.min;
        timeDelay.value = timeDelay.min;
    }
});
let timeout = parseInt(timeDelay.value);

const animationOffset = [0, 0, 0];
const animationRotationX = document.getElementById("animationRotationX");
const animationRotationY = document.getElementById("animationRotationY");
const animationRotationZ = document.getElementById("animationRotationZ");

animationRotationX.$("input", () => {animationOffset[0] = animationRotationX.inputToDeg()}, true);
animationRotationY.$("input", () => {animationOffset[1] = animationRotationY.inputToDeg()}, true);
animationRotationZ.$("input", () => {animationOffset[2] = animationRotationZ.inputToDeg()}, true);

const focalLength = 25;

const orthographicProjection = [
    [-1, 0, 0],
    [0, -1, 0]
];

function getMultitplyOfTen(number){
    let answer = 0;
    if(number < 0){
        number = -number;
        answer = 1;
    }
    else if(number == 0){
        return 1;
    }
    answer += Math.floor(Math.log10(number) + 1);
    return answer;
}

function calculateNumberOfSpaces(number, max){
    if(number < 0){
        number *= -1;
    }

    const numberPower = getMultitplyOfTen(number);
    const numberMaxPower = getMultitplyOfTen(max);

    return numberMaxPower - numberPower;
}

function updateText(number, max, numberEl, invisibleNumber){
    // Make invisible numbers
    const stringLength = calculateNumberOfSpaces(number, max);
    let spaces = "0".repeat(stringLength);
    if(0 < number){
        spaces = "-" + spaces;
    }

    invisibleNumber.innerHTML = spaces;
    numberEl.innerHTML = number;
}


function parseInput(input){
    const val = parseInt(input);
    return (isNaN(val)) ? 0 : val;
}

class Object{
    constructor(data){
        this.data = data.data;
        if(this.data != null){
            this.vertices = data.data[0];
            this.edges = data.data[1];
            this.faces = data.data[2];
            this.transformed = Array.from({length: data.data[0].length}, () => [0,0]);
        } 

        this.position = (data.position != null) ? data.position : [0, 0, 0];
        this.rotation = (data.rotation != null) ? data.rotation : [0, 0, 0];
        this.scale = (data.scale != null) ? data.scale : [1, 1, 1];

        this.default = [[...this.position], [...this.rotation]];

        const names = ["X", "Y", "Z"];
        const namePrefix = (data.prefix != null) ? data.prefix : "object";

        this.positionText = [];
        this.rotationText = [];

        names.forEach((n, i) => {
            const position = document.getElementById(`${namePrefix}Position${n}`);
            this.positionText.push(position);

            position.$("input", () => {
                this.move(parseInput(position.value), i);
                main();
            }, true);

            const rotation = document.getElementById(`${namePrefix}Rotation${n}`);
            const textParent = document.getElementById(`${namePrefix}Rotation${n}Text`);
            const text = textParent.children[1];
            const invisibleObject = textParent.children[0]; 

            this.rotationText.push([text, invisibleObject,rotation]);

            rotation.$("input", () => {
                this.rotate(parseInput(rotation.value), i);
                main();
            }, true);
        });
    }

    setDefault(){
        for(let i = 0; i < 3; i++){
            this.move(this.default[0][i], i);
            this.rotate(this.default[1][i], i);
        }
    }

    move(value, type){
        this.position[type] = value;
        this.positionText[type] = this.position[type];
    }

    rotate(value, type){
        const rot = Math.abs(value);
        const sig = (0 < value);
        if(180 < rot){
            value = (-180 + (rot - 180)) * ((sig) ? 1 : -1);
        }

        this.rotation[type] = value;
        this.rotationText[type][2].value = value;
        updateText(value, -180, this.rotationText[type][0], this.rotationText[type][1]);
    }
}

function degreeToRadian(r){
    return (r * Math.PI) / 180;
}

function printMatrix(matrix){
    let strMatrix = JSON.stringify(matrix);

    if(matrix[0].length > 1){
        strMatrix = strMatrix.slice(1, strMatrix.length - 1);
        console.log(strMatrix);
    }
    else{
        console.log(strMatrix);
    }
}

function multiplyMatrix(a, b){
    const result = [];

    if(a[0].length != b.length){
        console.error("Wrong size");
        console.log(a[0].length, b.length);
        printMatrix(a, b);
        return b;
    }
    
    a.forEach(row => {
        let r = 0;
        for(let i = 0; i < row.length; i++){
            r += row[i] * b[i];
        }
        result.push(r);
    });

    return result;
}

function addPosints(a, b){
    const result = [];

    if(a.length != b.length){
        console.error("Wrong size");
        console.log(a.length, b.length);
        printMatrix(a, b);
        return b;
    }

    for(let i = 0; i < a.length; i++){
        result.push(a[i] + b[i]);
    }

    return result;
}

Number.prototype.inputToDeg

function rotationMatrixZ(angle){
    angle = degreeToRadian(angle);
    const _rotationMatrixZ = [
        [Math.cos(angle), -Math.sin(angle), 0],
        [Math.sin(angle), Math.cos(angle), 0],
        [0, 0, 1]
    ]

    return _rotationMatrixZ;
}

function rotationMatrixY(angle){
    angle = degreeToRadian(angle);
    const _rotationMatrixY = [
        [Math.cos(angle), 0,  -Math.sin(angle)],
        [0, 1, 0],
        [Math.sin(angle), 0, Math.cos(angle)]
    ];

    return _rotationMatrixY;
}

function rotationMatrixX(angle){
    angle = degreeToRadian(angle);
    const _rotationMatrixX = [
        [1, 0, 0],
        [0, Math.cos(angle), -Math.sin(angle)],
        [0, Math.sin(angle), Math.cos(angle)]
    ];

    return _rotationMatrixX;
}

function scaleMatrix(x, y, z){
    const _scaleMatrix = [
        [x, 0, 0],
        [0, y, 0],
        [0, 0, z]
    ]
    return _scaleMatrix;
}

function projectPoints(points, position, rotation, scale, perspectiveProjection){
    // transform position globaly
    const scalingMatrix = scaleMatrix(scale[0], scale[1], scale[2]);
    const scaled = multiplyMatrix(scalingMatrix, points);
    const global = addPosints(camera.position, scaled);

    const xRotationM = rotationMatrixX(rotation[0]);
    const yRotationM = rotationMatrixY(rotation[1]);
    const zRotationM = rotationMatrixZ(rotation[2]);

    // rotate object
    // scaled => xRotated => yRotated => xRotated
    const xRotated = multiplyMatrix(xRotationM, global);
    const yRotated = multiplyMatrix(yRotationM, xRotated);
    const zRotated = multiplyMatrix(zRotationM, yRotated);

    // camera
    const cameraXRotationMatrix = rotationMatrixX(camera.rotation[0]);
    const cameraYRotationMatrix = rotationMatrixY(camera.rotation[1]);
    const cameraZRotationMatrix = rotationMatrixY(camera.rotation[2]);

    const local = addPosints(position, zRotated);

    const cameraRX = multiplyMatrix(cameraXRotationMatrix, local);
    const cameraRY = multiplyMatrix(cameraYRotationMatrix, cameraRX);
    const cameraRZ = multiplyMatrix(cameraZRotationMatrix, cameraRY);
    
    if(perspectiveProjection == true){
        const z = focalLength / (focalLength - cameraRZ[2]);
        // const z = screenX / (2 * Math.tan());
        const perspectiveProjection = [
            [-z, 0, 0],
            [0, -z, 0]
        ];

        return multiplyMatrix(perspectiveProjection, cameraRZ)
    }

    return multiplyMatrix(orthographicProjection, cameraRZ);
}

function glInit(){
    if(gl === null){
        alert("unable to initialize webgl");
        return false;
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

    const width = 10;
    const height = 1;

    gl.uniform2f(resolutionUniformLocation, width, height);
    gl.uniform2f(translationUniformLocation, 0, 0);
    gl.uniform2f(scaleUniformLocation, 0.7, 0.7);

    gl.uniform4f(colorLocation, 0, 0, 0, 1);

    return true;
}

// function drawFace(face){
//     f.forEach(p => {
//         points.push(t[p][0]); 
//         points.push(t[p][1]);
//     });
//
//     const buffer = new Float32Array(points);
//     gl.bufferData(gl.ARRAY_BUFFER, buffer, gl.STATIC_DRAW);
//     // const primitiveType = gl.TRIANGLES;
//     const primitiveType = gl.LINE_LOOP;
//     const offset = 0;
//     const count = points.length/2;
//     gl.drawArrays(primitiveType, offset, count);
// }

function main(){
    if(object == null){
        return;
    }

    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    if(animation){
        for(let i = 0; i < 3; i++){
            object.rotate(object.rotation[i] + animationOffset[i], i);
        }
    }

    object.vertices.forEach((v,i) => {
        object.transformed[i] = projectPoints(v, object.position, object.rotation, object.scale, projectionType);
    });

    object.faces.forEach(f => {
        const t = object.transformed;
        for(let i = 0; i < f.length - 1; i++){
            const p1 = t[f[i]];
            const p2 = t[f[i + 1]];
            drawLine(gl, p1[0], p1[1], p2[0], p2[1], 0.01);
        }

        drawLine(gl, t[f[0]][0], t[f[0]][1], t[f[f.length - 1]][0], t[f[f.length -1]][1], 0.01);

    });
}

const resize = new Resize(canvas, [1000,1000]);
glInit();

const loop = () => {
    main();
    setTimeout(loop, timeout);
}

let object = null;
const camera = new Object({prefix: "camera"});

const scale = 0.8;
const cube = new Object({data: cubeData, scale: [scale, scale, scale]});
const sphere = new Object({data: sphereData, scale: [scale, scale, scale]});
const torus = new Object({data: torusData, scale: [scale, scale, scale]});

const objects = {cube, sphere, torus};

const objectSelect = document.querySelector(".objectSelect");
objectSelect.onSelect((val) => {
    if(objects[val]){
        object = objects[val];
    }
    else{
        object = objects[Object.keys(objects)[0]];
    }

    main();
}, true);

main();

setTimeout(loop, timeout);
