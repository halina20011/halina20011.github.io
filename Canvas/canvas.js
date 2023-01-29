export class CANVAS{
    constructor(canvas){
        this.canvas = canvas;
        this.context = this.canvas.getContext("2d");

        this.width = canvas.width;
        this.height = canvas.height;

        this.xOffset = 0; 
        this.yOffset = 0;

        this.image = this.context.createImageData(this.width, this.height);
        this.data = this.image.data;

        this.cenX = 0;
        this.cenY = 0;
        this.scale = 1;

    }

    swapBuffer(){
        this.context.putImageData(this.image, 0, 0);
    }

    pixelToPoint(x, y, width, height){
        let px = (x - width / 2.0) * (4.0 / width) * (1.0 / scale) + cenX;
        let py = (y - height / 2.0) * (4.0 / height) * (1.0 / scale) + cenY;

        return [px, py]
    }

    translate(_xOffset, _yOffset){
        this.xOffset = _xOffset
        this.yOffset = _yOffset
    }

    // clear(){
    //     this.context.clearRect(0, 0, this.width, this.height);
    // }

    clear(){
        for(let y = 0; y < this.height; y++){
            for(let x = 0; x < this.width; x++){
                let index = 4 * (this.width * y + x);

                this.data[index + 0] = 0;
                this.data[index + 1] = 0;
                this.data[index + 2] = 0;
                this.data[index + 3] = 0;
            }
        }
    }


    drawPixel(x, y, r = 255, g = 255, b = 255, a = 255){
        x += this.xOffset;
        y += this.yOffset;
        if(x < 0 || this.width <= x || y < 0 || this.height <= y){
            return;
        }

        let roundedX = Math.round(x);
        let roundedY = Math.round(y);

        let index = 4 * (this.width * roundedY + roundedX);

        this.data[index + 0] = r;
        this.data[index + 1] = g;
        this.data[index + 2] = b;
        this.data[index + 3] = a;
    }

    drawPoint(x, y){
        let radius = 5;
        for(let r = 0; r < radius; r++){
            this.drawCircle(x, y, r);
        }
    }

    drawLine(x1, y1, x2, y2, rgba = [255, 255, 255, 255]){
        if(Math.abs(y2 - y1) == Infinity || Math.abs(x2 - x1) == Infinity){
            return;
        }
        let steep = Math.abs(y2 - y1) > Math.abs(x2 - x1);
        if (steep == true){
            [x1, y1] = swap(x1, y1);
            [x2, y2] = swap(x2, y2);
        }
        if(x1 > x2){
            [x1, x2] = swap(x1, x2);
            [y1, y2] = swap(y1, y2);
        }

        let dx, dy;
        dx = x2 - x1;
        dy = Math.abs(y2 - y1);

        let err = dx / 2;
        let ystep;

        if (y1 < y2){
            ystep = 1;
        }
        else{
            ystep = -1;
        }
        for (let a = 0; x1 <= x2; x1++){
            if (steep == true){
                this.drawPixel(y1, x1, rgba[0], rgba[1], rgba[2], rgba[3]);
            }
            else {
                this.drawPixel(x1, y1, rgba[0], rgba[1], rgba[2], rgba[3]);
            }
            err -= dy;
            if (err < 0){
                y1 += ystep;
                err += dx;
            }
        }
    }

    plotLineWidth(x1, y1, x2, y2, wd, rgba=[255, 255, 255, 255]){ 
        // let dx = Math.abs(x2 - x1), sx = x1 < x2 ? 1 : -1;
        let dx = Math.abs(x2 - x1);
        let sx = x1 < x2 ? 1 : -1;
        let dy = Math.abs(y2 - y1);
        let sy = y1 < y2 ? 1 : -1;
        let err = dx - dy
        let e2, eX, eY;
        let ed = dx + dy == 0 ? 1 : Math.sqrt(dx * dx + dy * dy);
        
        for(wd = (wd+1)/2; ;){
            // drawPixel(x1, y1, max(0,255*(Math.abs(err-dx+dy)/ed-wd+1)));
            drawPixel(x1, y1, rgba[0], rgba[1], rgba[2], rgba[3]);
            e2 = err; 
            eX = x1;
            if(2*e2 >= -dx){
                for(e2 += dy, eY = y1; e2 < ed*wd && (y2 != eY || dx > dy); e2 += dx){
                    // drawPixel(x1, y2 += sy, max(0,255*(Math.abs(e2)/ed-wd+1)));
                    drawPixel(x1, eY += sy, rgba[0], rgba[1], rgba[2], rgba[3]);
                }
                if(x1 == x2){
                    break;
                } 
                e2 = err;
                err -= dy;
                x1 += sx;
            } 
            if(2 * e2 <= dy){
                for (e2 = dx-e2; e2 < ed*wd && (x2 != eX || dx < dy); e2 += dy){
                    // drawPixel(x2 += sx, y1, max(0,255*(Math.abs(e2)/ed-wd+1)));
                    drawPixel(eX += sx, y1, rgba[0], rgba[1], rgba[2], rgba[3]);
                }
                if(y1 == y2){
                    break;
                } 
                err += dx; 
                y1 += sy;
            }
        }
    }

    drawGrid(resolution, rgba = [255, 255, 255, 255]){
        let offset = this.width / (resolution + 1);
        for(let r = 0; r < resolution; r++){
            let x = offset + offset * r;
            this.drawLine(x, 0, x, this.height, rgba);
        }
        for(let r = 0; r < resolution; r++){
            let y = offset + offset * r;
            this.drawLine(0, y, this.width, y, rgba);
        }
    }
    
    calculateResolution(radius){
        return 360 / (2 * Math.abs(radius) * Math.PI);
    }

    drawCircle(x, y, radius, resolution = 10){
        resolution = this.calculateResolution(radius);
        for(let i = 0; i < 360; i += resolution){
            let angle = i;
            let x1 = radius * Math.cos(angle * Math.PI / 180);
            let y1 = radius * Math.sin(angle * Math.PI / 180);
            this.drawPixel(x + x1, y + y1);
        }
    }
}


function swap(i1, i2){
    return [i2, i1];
}
