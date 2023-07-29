function createProgram(gl, vertexShader, fragmentShader){
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if(success){
        return program;
    }
    
    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}

function createShader(gl, type, source){
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if(success){
        return shader;
    }

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

function Resize(canvas, size){
    const canvasToDisplaySizeMap = new Map([[canvas, size]]);
    const onResize = (entries) => {
        for(const entry of entries){
            let width, height;
            let dpr = window.devicePixelRatio;
            if(entry.devicePixelContentBoxSize){
                width = entry.devicePixelContentBoxSize[0].inlineSize;
                height = entry.devicePixelContentBoxSize[0].blockSize;
                dpr = 1;
            }
            else if(entry.contentBoxSize){
                const _contentBoxSize = (entry.contentBoxSize[0]) ? entry.contentBoxSize[0] : entry.contentBoxSize;
                width = _contentBoxSize.inlineSize;
                height = _contentBoxSize.blockSize;
            }
            else{
                width = entry.contentRect.width;
                height = entry.contentRect.height;
            }
            const displayWidth = Math.round(width * dpr);
            const displayHeight = Math.round(height * dpr);
            canvasToDisplaySizeMap.set(entry.target, [displayWidth, displayHeight]);
        }
    }

    const resizeCanvasToDisplaySize = (canvas) => {
        const [displayWidth, displayHeight] = canvasToDisplaySizeMap.get(canvas);

        const widthResize = canvas.width != displayWidth;
        const heightResize = canvas.height != displayHeight;
        const needResize = (widthResize || heightResize);
        if(needResize){
            canvas.width = displayWidth;
            canvas.height = displayHeight;
        }

        return needResize;
    }

    const resizeObserver = new ResizeObserver(onResize);
    try{
        resizeObserver.observe(canvas, {box: "device-pixel-content-box"});
    }
    catch(_err){
        resizeObserver.observe(canvas, {box: "content-box"});
    }
    
    return {resizeCanvasToDisplaySize};
}

export {createProgram, createShader, Resize};
