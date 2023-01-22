import {CANVAS} from "/Canvas/canvas.js";
import {DOWNLOADER} from "/Canvas/download.js";

let canvasEl = document.getElementById("my-canvas");
// let context = canvas.getContext("2d");
// let image = context.createImageData(canvas.width, canvas.height);
// let data = image.data;

let canvas = new CANVAS(canvasEl);
let downloader = new DOWNLOADER(canvas);

function timelapsee(fArguments){
    let howMenySteps = parseInt(fArguments[0].value);
    let xAxisToAdd = degreeToRadian(parseInt(fArguments[1].value));
    let yAxisToAdd = degreeToRadian(parseInt(fArguments[2].value));
    let zAxisToAdd = degreeToRadian(parseInt(fArguments[3].value));
    console.log(`Run ${howMenySteps} steps.`);
    for(let i = 0; i < howMenySteps; i++){
        main();
        cube.rotation[0] += xAxisToAdd;
        cube.rotation[1] += yAxisToAdd;
        cube.rotation[2] += zAxisToAdd;
        downloader.addImage();
        console.log(`Step currently running: ${i}.`)
    }
    downloader.downloadAll();
}

let timelapseInputData = {
    "function": timelapsee,
    "arguments": [{
            "text": {"element": "p", "innerHTML": "How meny steps to take: "},
            "howMenySteps": {"element": "input", "type": "number", "value": 1, "from": "1"},
        },
        {
            "text": {"element": "p", "innerHTML": "X rotation to to the object each step: "},
            "xAxisToAdd": {"element": "input", "type": "number", "value": 0},
        },
        {
            "text": {"element": "p", "innerHTML": "Y rotation to to the object each step: "},
            "yAxisToAdd": {"element": "input", "type": "number", "value": 0},
        },
        {
            "text": {"element": "p", "innerHTML": "Z rotation to to the object each step: "},
            "zAxisToAdd": {"element": "input", "type": "number", "value": 0},
        }
    ]
}

let timelapse = downloader.timelapse(timelapseInputData);

let downloadImageButton = document.getElementById("downloadImage");
downloadImageButton.addEventListener("click", function() { downloader.downloadImage(); }, false);

let updateButton = document.getElementById("update");
updateButton.addEventListener("click", function() { 
    camera.setDefault(); 
    cube.setDefault();
    animationRotationX.value = 0;
    animationRotationY.value = 0;
    animationRotationZ.value = 0;
}, false);

let timeDelay = document.getElementById("timeDelay");
let perspectiveProjectionCheckbox = document.getElementById("perspectiveProjection");
let aplyAnimationCheckbox = document.getElementById("aplyAnimation");

let screenX = 20;
let screenY = 20;

let focalLength = 25;

let animationRotationX = document.getElementById("animationRotationX");
let animationRotationY = document.getElementById("animationRotationY");
let animationRotationZ = document.getElementById("animationRotationZ");

let orthographicProjection = [
    [1, 0, 0],
    [0, 1, 0]
]

function getMultitplyOfTen(number){
    if(number == 0){
        return 1;
    }
    return Math.floor(Math.log10(number) + 1);
}

function calculateNumberOfSpaces(number, max){
    if(number < 0){
        number *= -1;
    }
    let numberPower = getMultitplyOfTen(number);
    let numberMaxPower = getMultitplyOfTen(max);

    return numberMaxPower - numberPower;
}

function updateText(number, max, numberEl, invisibleNumber){
    // Make invisible numbers
    let stringLength = calculateNumberOfSpaces(number, max);
    let spaces = "0".repeat(stringLength);
    if(number >= 0){
        spaces = "-" + spaces;
    }
    invisibleNumber.innerHTML = spaces;
    numberEl.innerHTML = number;
}

function updatePosition(object, type, value){
    let positionAxis = object.positionAxis[type];
    if(value == null){
        object.position[type] = parseInt(positionAxis.value);
    }
    else{
        object.position[type] = value;
        positionAxis.value = value;
        console.log(value);
    }

    main();
}

function updateRotation(object, type, value){
    // console.log(object);
    let rotationAxis = object.rotationAxis[type];
    // console.log(rotationAxis);
    if(value == null){
        object.rotation[type] = degreeToRadian(parseInt(rotationAxis[0].value));
    }
    else{
        object.rotation[type] = value;
        rotationAxis[0].value = value;
    }
    updateText(parseInt(rotationAxis[0].value), 1000, rotationAxis[1], rotationAxis[2]);

    main();
}

class CAMERA{
    constructor(position = [0, 0, 0], rotation = [0, 0, 0]){
        this.position = position;
        this.rotation = rotation;

        this.default = [[...position], [...rotation]];
        // Camera
        // Position
        this.positionX = document.getElementById("camPositionX");
        this.positionY = document.getElementById("camPositionY");
        this.positionZ = document.getElementById("camPositionZ");

        // Rotation
        this.rotationX = document.getElementById("camRotationX");
        this.rotationY = document.getElementById("camRotationY");
        this.rotationZ = document.getElementById("camRotationZ");

        this.cameraRotationXTextParent = document.getElementById("cameraRotationXText");
        this.cameraRotationXText = this.cameraRotationXTextParent.children[1];
        this.invisibleCameraRotationXText = this.cameraRotationXTextParent.children[0];

        this.cameraRotationYTextParent = document.getElementById("cameraRotationYText");
        this.cameraRotationYText = this.cameraRotationYTextParent.children[1];
        this.invisibleCameraRotationYText = this.cameraRotationYTextParent.children[0];
        
        this.cameraRotationZTextParent = document.getElementById("cameraRotationZText");
        this.cameraRotationZText = this.cameraRotationZTextParent.children[1];
        this.invisibleCameraRotationZText = this.cameraRotationZTextParent.children[0];

        this.positionAxis = [
            this.positionX,
            this.positionY,
            this.positionZ
        ]

        this.rotationAxis = [
            [this.rotationX, this.cameraRotationXText, this.invisibleCameraRotationXText], 
            [this.rotationY, this.cameraRotationYText, this.invisibleCameraRotationYText], 
            [this.rotationZ, this.cameraRotationZText, this.invisibleCameraRotationZText]
        ];

        this.positionX.addEventListener("input", () => {this.updateXPosition();}, false);
        this.positionY.addEventListener("input", () => {this.updateYPosition();}, false);
        this.positionZ.addEventListener("input", () => {this.updateZPosition();}, false);

        this.rotationX.addEventListener("input", () => {this.updateXRotation()}, false);
        this.rotationY.addEventListener("input", () => {this.updateYRotation()}, false);
        this.rotationZ.addEventListener("input", () => {this.updateZRotation()}, false);
    }
    
    xRotationMatrix(angleX){
        let x = [
            [1, 0, 0],
            [0, Math.cos(angleX), Math.sin(angleX)],
            [0, -Math.sin(angleX), Math.cos(angleX)],
        ]
        return x;
    }
    
    yRotationMatrix(angleY){
        let y = [
            [Math.cos(angleY), 0, -Math.sin(angleY)],
            [0, 1, 0],
            [Math.sin(angleY), 0, Math.cos(angleY)]
        ]
        return y;
    }
    
    zRotationMatrix(angleZ){
        let z = [
            [Math.cos(angleZ), Math.sin(angleZ), 0],
            [-Math.sin(angleZ), Math.cos(angleZ), 0],
            [0, 0, 1]
        ]
        return z;
    }

    setDefault(){
        console.log(this.default);
        this.updateXPosition(this.default[0][0]);
        this.updateYPosition(this.default[0][1]);
        this.updateZPosition(this.default[0][2]);
        
        this.updateXRotation(this.default[1][0]);
        this.updateYRotation(this.default[1][1]);
        this.updateZRotation(this.default[1][2]);
    }

    update(){
        this.updateXPosition();
        this.updateYPosition();
        this.updateZPosition();
        
        this.updateXRotation();
        this.updateYRotation();
        this.updateZRotation();
    }

    updateXPosition(value = null){
        updatePosition(this, 0, value);
    }
    
    updateYPosition(value = null){
        updatePosition(this, 1, value);
    }
    
    updateZPosition(value = null){
        updatePosition(this, 2, value);
    }

    updateXRotation(value = null){
        updateRotation(this, 0, value);
    }
    
    updateYRotation(value = null){
        updateRotation(this, 1, value);
    }
    
    updateZRotation(value = null){
        updateRotation(this, 2, value);
    }
}

class OBJECT{
    constructor(faces, position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1]){
        this.position = position;
        this.rotation = rotation;
        this.scale = scale;

        this.faces = faces;
        this.default = [[...position], [...rotation]];

        // Position
        this.positionX = document.getElementById("positionX");
        this.positionY = document.getElementById("positionY");
        this.positionZ = document.getElementById("positionZ");
        
        // Position
        this.rotationX = document.getElementById("rotationX");
        this.rotationY = document.getElementById("rotationY");
        this.rotationZ = document.getElementById("rotationZ");

        this.objectRotationXTextParent = document.getElementById("objectRotationXText");
        this.objectRotationXText = this.objectRotationXTextParent.children[1];
        this.invisibleObjectRotationXText = this.objectRotationXTextParent.children[0];

        this.objectRotationYTextParent = document.getElementById("objectRotationYText");
        this.objectRotationYText = this.objectRotationYTextParent.children[1];
        this.invisibleObjectRotationYText = this.objectRotationYTextParent.children[0];
        
        this.objectRotationZTextParent = document.getElementById("objectRotationZText");
        this.objectRotationZText = this.objectRotationZTextParent.children[1];
        this.invisibleObjectRotationZText = this.objectRotationZTextParent.children[0]; 

        this.positionAxis = [
            positionX,
            positionY,
            positionZ
        ]

        this.rotationAxis = [
            [this.rotationX, this.objectRotationXText, this.invisibleObjectRotationXText], 
            [this.rotationY, this.objectRotationYText, this.invisibleObjectRotationYText], 
            [this.rotationZ, this.objectRotationZText, this.invisibleObjectRotationZText]
        ];


        this.positionX.addEventListener("input", () => {this.updateXPosition();}, false);
        this.positionY.addEventListener("input", () => {this.updateYPosition();}, false);
        this.positionZ.addEventListener("input", () => {this.updateZPosition();}, false);

        this.rotationX.addEventListener("input", () => {this.updateXRotation()}, false);
        this.rotationY.addEventListener("input", () => {this.updateYRotation()}, false);
        this.rotationZ.addEventListener("input", () => {this.updateZRotation()}, false);
    }

    setDefault(){
        console.log(this.default);
        this.updateXPosition(this.default[0][0]);
        this.updateYPosition(this.default[0][1]);
        this.updateZPosition(this.default[0][2]);
        
        this.updateXRotation(this.default[1][0]);
        this.updateYRotation(this.default[1][1]);
        this.updateZRotation(this.default[1][2]);
    }

    update(){
        this.updateXPosition();
        this.updateYPosition();
        this.updateZPosition();

        this.updateXRotation();
        this.updateYRotation();
        this.updateZRotation();
    }

    updateXPosition(value = null){
        updatePosition(this, 0, value);
    }
    
    updateYPosition(value = null){
        updatePosition(this, 1, value);
    }
    
    updateZPosition(value = null){
        updatePosition(this, 2, value);
    }

    updateXRotation(value = null){
        updateRotation(this, 0, value);
    }
    
    updateYRotation(value = null){
        updateRotation(this, 1, value);
    }
    
    updateZRotation(value = null){
        updateRotation(this, 2, value);
    }
}

function map(x, inMin, inMax, outMin, outMax){
    return (x - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

function degreeToRadian(r){
    return (r * Math.PI) / 180;
}

function pointToPixel(x, y){
    x = map(x, -screenX, screenX, 0, canvas.width);
    y = map(y, screenY, -screenY, 0, canvas.height);

    return [x, y];
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
    let result = [];

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
    let result = [];

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

function rotationMatrixZ(angle){
    let _rotationMatrixZ = [
        [Math.cos(angle), -Math.sin(angle), 0],
        [Math.sin(angle), Math.cos(angle), 0],
        [0, 0, 1]
    ]
    return _rotationMatrixZ
}

function rotationMatrixY(angle){
    let _rotationMatrixY = [
        [Math.cos(angle), 0,  -Math.sin(angle)],
        [0, 1, 0],
        [Math.sin(angle), 0, Math.cos(angle)]
    ];
    return _rotationMatrixY;
}

function rotationMatrixX(angle){
    let _rotationMatrixX = [
        [1, 0, 0],
        [0, Math.cos(angle), -Math.sin(angle)],
        [0, Math.sin(angle), Math.cos(angle)]
    ];
    return _rotationMatrixX;
}

function scaleMatrix(x, y, z){
    let _scaleMatrix = [
        [x, 0, 0],
        [0, y, 0],
        [0, 0, z]
    ]
    return _scaleMatrix;
}

function projectPoints(points, position, rotation, scale, perspectiveProjection){
    let scalingMatrix = scaleMatrix(scale[0], scale[1], scale[2]);
    let scaled = multiplyMatrix(scalingMatrix, points);

    let xRotationM = rotationMatrixX(rotation[0]);
    let yRotationM = rotationMatrixY(rotation[1]);
    let zRotationM = rotationMatrixZ(rotation[2]);

    // Rotate cube
    let xRotated = multiplyMatrix(xRotationM, scaled);
    let yRotated = multiplyMatrix(yRotationM, xRotated);
    let zRotated = multiplyMatrix(zRotationM, yRotated);
    
    // Camera
    let cameraXRotationMatrix = camera.xRotationMatrix(camera.rotation[0]);
    let cameraYRotationMatrix = camera.yRotationMatrix(camera.rotation[1]);
    let cameraZRotationMatrix = camera.zRotationMatrix(camera.rotation[2]);

    // Transform position globaly
    let globalObjectPosition = addPosints(position, zRotated);
    let globalPosition = addPosints(camera.position, globalObjectPosition);

    let cameraRX = multiplyMatrix(cameraXRotationMatrix, globalPosition);
    let cameraRY = multiplyMatrix(cameraYRotationMatrix, cameraRX);
    let cameraRZ = multiplyMatrix(cameraZRotationMatrix, cameraRY);
    
    let projected2d;
    if(perspectiveProjection == true){
        let z = focalLength / (focalLength - cameraRZ[2]);
        // let z = screenX / (2 * Math.tan());
        let perspectiveProjection = [
            [-z, 0, 0],
            [0, -z, 0]
        ]
        projected2d = multiplyMatrix(perspectiveProjection, cameraRZ);
    }
    else{
        projected2d = multiplyMatrix(orthographicProjection, cameraRZ);
    }

    return projected2d;
}

function main(){
    canvas.clear();
    let points = [];
    cube.faces.forEach(face => {
        face.forEach(point => {
            let x, y;
            
            // perspectiveProjection.checked = true
            [x, y] = projectPoints(point, cube.position, cube.rotation, cube.scale, perspectiveProjectionCheckbox.checked);
            [x, y] = pointToPixel(x, y);
            
            points.push([x, y]);
            // console.log(x, y);
        });
        for(let pointI = 0; pointI < points.length; pointI++){ 
            let nexPointI = (pointI + 1) % points.length;
            canvas.drawLine(points[nexPointI][0], points[nexPointI][1], points[pointI][0], points[pointI][1]);
            canvas.drawPoint(points[pointI][0], points[pointI][1]);
        }
        points = [];
    });

    canvas.swapBuffer();
}

let loop = () => {
    if(aplyAnimationCheckbox.checked == true){
        cube.rotation[0] += degreeToRadian(parseInt(animationRotationX.value));
        cube.rotation[1] += degreeToRadian(parseInt(animationRotationY.value));
        cube.rotation[2] += degreeToRadian(parseInt(animationRotationZ.value));
    }
    timeout = parseInt(timeDelay.value);
    if(!timeout){
        timeout = timeDelay.min;
        timeDelay.value = timeDelay.min
    }
    main();
    setTimeout(loop, timeout);
}

let camera = new CAMERA([0, 0, -10], [0, 0, 0]);

let cube = new OBJECT(
    // Faces
    [
        // First face
        [
            [ 1, -1,  1],
            [-1, -1,  1],
            [-1, -1, -1],
            [ 1, -1, -1]
        ],
        // Second face
        [
            [ 1, -1,  1],
            [ 1,  1,  1],
            [-1,  1,  1],
            [-1, -1,  1]
        ],
        // Third face
        [
            [ 1, 1,  1],
            [-1, 1,  1],
            [-1, 1, -1],
            [ 1, 1, -1]
        ],
        // Thought face
        [
            [ 1, -1, -1],
            [ 1,  1, -1],
            [-1,  1, -1],
            [-1, -1, -1]
        ],
        // Fifth face
        [
            [ 1, -1,  1],
            [ 1,  1,  1],
            [ 1,  1, -1],
            [ 1, -1, -1],
        ],
        // Sixth
        [
            [-1, -1,  1],
            [-1,  1,  1],
            [-1,  1, -1],
            [-1, -1, -1],
        ]

    ],
    [0, 0, 0], // Global position
    [0, 0, 0], // Rotation
    [10, 10, 10]  // Scale
)

cube.update();

main();
let timeout = parseInt(timeDelay.value);

setTimeout(loop, timeout);
