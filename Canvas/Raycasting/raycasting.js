import {CANVAS} from "../canvas.js";
import {DOWNLOADER} from "../download.js";
import func from "../../Tools/func.js"
import {Vec2, MoveListener, Movable, VertexValue} from "../../Tools/func.js"

const canvasEl = document.getElementById("my-canvas");

const canvas = new CANVAS(canvasEl);
const downloader = new DOWNLOADER(canvasEl);

const downloadImageButton = document.getElementById("downloadImage");
downloadImageButton.addEventListener("click", () => { downloader.downloadImage(); }, false);

const addButton = document.querySelector("#addButton");
addButton.$("click", () => {
    new Wall( canvas.width * 0.25, canvas.height / 2, canvas.width * 0.75, canvas.height / 2, WALL);
    main();
});

const pointsValues = document.querySelector(".pointsValues");
const pointsHolder = document.querySelector(".pointsHolder");
const moveListener = new MoveListener(canvasEl);

const WALL = 0;
const BOUNDARY = 1;

let mouseMode = false;
let windowBounds = false;
const boundaries = document.querySelector("#boundaries");
const mouseModeEl = document.querySelector("#mouseMode");
const rayNumber = document.querySelector("#rayNumber");

let wallId = 0;

class Wall{
    constructor(x1, y1, x2, y2, type){
        this.id = wallId++;
        walls[this.id] = this;
        this.start = new Vec2(x1, y1);
        this.end = new Vec2(x2, y2);
        this.type = type;
        
        if(this.type == WALL){
            const p1 = new Movable(canvasEl, pointsHolder, moveListener, this.start);
            const p2 = new Movable(canvasEl, pointsHolder, moveListener, this.end);

            const v = new VertexValue(pointsValues, this.start, this.end);

            p1.externalUpdateFunc = () => {
                v.update();
                main();
            };

            p2.externalUpdateFunc = () => {
                v.update();
                main();
            };

            v.externalUpdateFunc = () => {
                p1.update();
                p2.update();
                main();
            };

            v.delFunc = () => {
                delete walls[this.id];
                p1.delete();
                p2.delete();
                main();
            };
        }

        this.draw();
        canvas.swapBuffer();
    }

    draw(){
        if(this.type == WALL){
            canvas.drawLine(this.start.x, this.start.y, this.end.x, this.end.y);
        }
    }
}

function inside(i){
    return (0 <= i && i <= 1);
}

// "light"
class Light{
    constructor(x, y, moveListener){
        this.pos = new Vec2(x, y);
        this.rays = [];
        this.mRay = new Ray(this, 0, true);

        this.m = new Movable(canvasEl, pointsHolder, moveListener, this.pos);
        this.m.externalUpdateFunc = () => {
            main();
        };
    }

    updateAngle(count){
        const step = 360/count;
        this.rays = [];
        for(let angle = 0; angle < 360; angle += step){
            this.rays.push(new Ray(this, angle, false));
        }
    }

    draw(){
        if(!mouseMode){
            for(let i = 0; i < this.rays.length; i++){
                this.rays[i].drawIntersect(this.pos);
            }
        }
    }
}

class Ray{
    constructor(parrent, angle, enableMouse){
        this.angle = angle;
        this.length = 10;
        this.parrent = parrent;
        const y2 = Math.sin(func.toRad(this.angle)) * this.length;
        const x2 = Math.cos(func.toRad(this.angle)) * this.length;
        this.end = new Vec2(x2, y2);
        if(enableMouse){
            moveListener.addFollower(this.updateFunc);
        }
    }

    updateFunc = (x, y) =>{
        if(mouseMode){
            const cl = canvasEl.getBoundingClientRect();
            const [width, height] = [cl.width, cl.height];
            const mx = func.map(x, 0, width, 0, canvas.width); 
            const my = func.map(y, 0, height, 0, canvas.height);
            this.end.x = mx - this.parrent.pos.x;
            this.end.y = my - this.parrent.pos.y;

            main();

            for(const kWall of Object.keys(walls)){
                const wall = walls[kWall];
                const p = this.intersection(wall);
                if(p){
                    const [px, py] = [p[0], p[1]];
                    canvas.drawPoint(px, py);
                }
            }

            canvas.swapBuffer();
        }
    }

    draw(){
        // y => sin(a) = a/1;
        // y => sin(a);
        // x => cos(a) = b/1;
        // x => cos(a);
        
        canvas.drawCircle(this.start.x, this.start.y, 2);
        canvas.drawLine(this.start.x, this.start.y, this.end.x, this.end.y);
    }
    
    minIntersect(pos){
        let mp = null;
        for(const kWall of Object.keys(walls)){
            const wall = walls[kWall];
            if(wall.type == BOUNDARY && !windowBounds){
                continue;
            }
            const p = this.intersection(wall);
            if(p){
                mp = pos.min(mp, new Vec2(p[0], p[1]));
            }
        }

        return mp;
    }

    intersection(line){
        // const x1 = this.start.x;
        // const y1 = this.start.y;
        const x1 = this.parrent.pos.x;
        const y1 = this.parrent.pos.y;
        const x2 = this.end.x + x1;
        const y2 = this.end.y + y1;

        const x3 = line.start.x;
        const y3 = line.start.y;
        const x4 = line.end.x;
        const y4 = line.end.y;

        const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
        if(denominator == 0){
            return null;
        }

        const tNumerator = (x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4);
        const uNumerator = (x1 - x3) * (y1 - y2) - (y1 - y3) * (x1 - x2);
        
        const t = tNumerator / denominator;
        const u = uNumerator / denominator;
        
        // point will be only on the line between the start and the end
        // other point that would be behind the line ray will be hidden
        if(!inside(u) || t < 0){
            return null;
        }

        const px = x1 + t * (x2 - x1);
        const py = y1 + t * (y2 - y1);
        return [px, py];
    }

    drawIntersect(pos){
        const mp = this.minIntersect(pos);
        if(mp){
            canvas.drawLine(pos.x, pos.y, mp.x, mp.y);
        }
    }
}

const walls = {};
function main(){
    canvas.clear();
    for(const kWall of Object.keys(walls)){
        walls[kWall].draw();
    }
    
    light.draw();

    canvas.swapBuffer();
}

new Wall(0, 0, 0, canvas.width, BOUNDARY); // top
new Wall(0, canvas.width, canvas.height, canvas.width, BOUNDARY); // left
new Wall(0, 0, canvas.height, 0, BOUNDARY); // left
new Wall(canvas.height, 0, canvas.height, canvas.width, BOUNDARY); // bottom

new Wall(150, 50, 50, 300, WALL);
new Wall(130, 350, 330, 300, WALL);

const light = new Light(250, 180, moveListener);

boundaries.$("change", () => {
    windowBounds = boundaries.checked;
    main();
}, true);

mouseModeEl.$("change", () => {
    mouseMode = mouseModeEl.checked;
    main();
}, true);

rayNumber.$("input", () => {
    const n = parseInt(rayNumber.value);
    light.updateAngle(n);
    main();
}, true);
