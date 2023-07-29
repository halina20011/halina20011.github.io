const toRad = (radius) => {
    return (Math.PI * radius) / 180;
}

const cPoint = (degree, x, y, radius) => {
    const rad = toRad(degree);
    return [
        Math.sin(rad) * radius + x,
        Math.cos(rad) * radius + y
    ];
}

function drawCircle(gl, x, y, radius, resolution){
    const degreeOffset = 360.0 / resolution;
    let buffer = new Float32Array(2 * 3 * resolution);
    let prevPoint = cPoint(0, x, y, radius);
    for(let i = 1; i <= resolution; i++){
        const thisPoint = cPoint(i * degreeOffset, x, y, radius);
        const index = (i - 1) * 3 * 2;
        buffer[index + 0] = prevPoint[0];
        buffer[index + 1] = prevPoint[1];
        buffer[index + 2] = thisPoint[0];
        buffer[index + 3] = thisPoint[1];
        buffer[index + 4] = x;
        buffer[index + 5] = y;
        prevPoint = thisPoint;
    }
    buffer = buffer.map(v => {
        return v.toFixed(10);
    });
    // console.log(buffer);
    gl.bufferData(gl.ARRAY_BUFFER, buffer, gl.STATIC_DRAW);
    const primitiveType = gl.TRIANGLES;
    const offset = 0;
    const count = 3 * resolution;
    gl.drawArrays(primitiveType, offset, count);
}

function toDeg(rad){
    return (rad * 180) / Math.PI;
}

// dot product
function calcAngle(_x1, _y1, _x2, _y2){
    const x1 = _x2 - _x1;
    const y1 = _y2 - _y1;
    // const x2 = 0;
    // const y2 = 1;
    // const d = Math.sqrt(x1 * x1 + y1 * y1) * Math.sqrt(x2 * x2 + y2 * y2);
    // const n = (x1 * x2 + y1 * y2) / d;
    // const angle = Math.acos(n);
    // return toDeg(angle);
    const aAngle = Math.atan2(x1, y1);
    return toDeg(aAngle);
}

function rotate(angle, r){
    const a = toRad(angle);
    return [
        r * Math.cos(a),
        r * Math.sin(a)
    ];
}

function drawLine(gl, x1, y1, x2, y2, width){
    if(x1 < x2){
        [x1, x2, y1,y2] = [x2, x1,y2,y1];
    }
    const w2 = width / 2;
    const angle = Math.abs(calcAngle(x1, y1, x2, y2));
    const [A,B] = rotate(angle, w2);
    const aX = x1 + A, aY = y1 + B;
    const bX = x2 + A, bY = y2 + B;
    const cX = x2 - A, cY = y2 - B;
    const dX = x1 - A, dY = y1 - B;
    // a           b
    // |-----------|
    // |           |
    // |-----------|
    // d           c
    const buffer = new Float32Array([
        aX, aY,
        dX, dY,
        cX, cY,

        aX, aY,
        bX, bY,
        cX, cY
    ]);
    // debugging
    // console.log(A, B);
    // const points = [[aX, aY], [bX, bY], [cX, cY], [dX, dY]];
    // points.forEach(p => drawCircle(gl, p[0], p[1], 0.1, 20));
    gl.bufferData(gl.ARRAY_BUFFER, buffer, gl.STATIC_DRAW);
    const primitiveType = gl.TRIANGLES;
    const offset = 0;
    const count = 6;
    gl.drawArrays(primitiveType, offset, count);
}

function drawLines(gl, x, y, radius, resolution, steps = resolution){
    const degreeOffset = 360.0 / resolution;
    for(let i = 0; i < steps; i++){
        const [x2,y2] = cPoint(i * degreeOffset, x, y, radius);
        drawLine(gl, x, y, x2, y2, 0.2);
    }
}

export {drawCircle, drawLine, drawLines, calcAngle};
