class Func{
    tryJsonParse(data){
        try{
            return JSON.parse(data);
        }
        catch(_error){
            return undefined;
        }
    }

    importFile(url, fallback){
        fetch(url)
            .then(response => response.text())
            .then(data => { fallback(data); });
    }

    textSize(text){
        const t = document.createElement("div");
        t.innerHTML = text
        t.style.width = "fit-content";
        textCanvas.appendChild(t);
        const tSize = t.getBoundingClientRect();
        t.remove();
        return [tSize.width, tSize.height];
    }

    getUrl(window){
        const currentUrl = window.location.href;
        const url = currentUrl.split("/");
        for(let i = 0; i < url.length; i++){
            if(url[i] == ''){
                url.splice(i, 1);
            }
        }

        return url;
    }

    getCurrentHtmlFileName(window){
        const url = this.getUrl(window);

        let htmlName = url[url.length - 1];
        htmlName = htmlName.split("#")[0];
        htmlName = htmlName.replace(".html", "");

        return htmlName;
    }

    createElement(html){
        const temp = document.createElement("div");
        temp.innerHTML = html;

        const element = temp.children[0];
        temp.remove();

        return element;
    }

    getMultitplyOfTen(n){
        if(n < 0){
            n = -n;
        }

        if(n < 10){
            return 1;
        }

        return Math.floor(Math.log10(n)) + 1;
    }

    // if we have min and max eg min = 0, max = 100
    // min will need 2 spaces to be added
    calculateNumberOfSpaces(number, max){
        const numberPower = this.getMultitplyOfTen(number);
        const numberMaxPower = this.getMultitplyOfTen(max);
        return numberMaxPower - numberPower;
    }

    random(min, max){
        return Math.floor(Math.random() * (max - min) + min);
    }
    
    // math functions
    min(a, b){
        return (a < b) ? a : b;
    }

    max(a, b){
        return (a < b) ? b : a;
    }

    map(x, inMin, inMax, outMin, outMax){
        return (x - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
    }

    idDigit(char){
        if(char.length != 1){
            return false;
        }
        const v = char.charCodeAt(0);
        // 0 - 48
        // 9 - 57
        return (47 < v && v < 58);
    }

    toggle(query, defaultValue, elements, defaultClass, actionClass){
        const element = document.querySelector(query);
        element.checked = defaultValue;

        elements.forEach((element, i) => {
            if(defaultClass[i]){
                element.classList.add(actionClass);
            }
            else{
                element.classList.remove(actionClass);
            }
        });

        element.addEventListener("click", () => {
            elements.forEach(element => {
                element.classList.toggle(actionClass);
            });
        });
    }

    toProc(val, max){
        return (val / max) * 100;
    }

    toRad(radius){
        return (Math.PI * radius) / 180;
    }

    toDeg(rad){
        return (rad * 180) / Math.PI;
    }

    shuffle(arr){
        for(let i = 0; i < arr.length; i++){
            const rIndex = this.random(0, arr.length);
            const t = arr[i];
            arr[i] = arr[rIndex]
            arr[rIndex] = t;
        }

        return arr;
    }

}

const func = new Func();

class Vec2{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
    
    set(vec){
        this.x = vec.x;
        this.y = vec.y
    }

    addVal(b){
        this.x += b.x; 
        this.y += b.y;
    }

    subtractVal(b){
        this.x -= b.x; 
        this.y -= b.y;
    }

    add(b){
        return new Vec2(this.x + b.x, this.y + b.y);
    }

    subtract(b){
        return new Vec2(this.x - b.x, this.y - b.y);
    }

    scale(sX, sY){
        this.x *= sX;
        this.y *= sY;
    }

    copy(){
        return new Vec2(this.x, this.y);
    }
    
    dist(){
        return (this.x * this.x) + (this.y * this.y);
    }

    min(v1, v2){
        if(!v1 || !v2){
            return (!v1) ? v2 : v1;
        }
        const d1 = v1.subtract(this).dist();
        const d2 = v2.subtract(this).dist();
        return (d1 < d2) ? v1 : v2;
    }

    max(v1, v2){
        if(!v1 || !v2){
            return (!v1) ? v2 : v1;
        }
        const d1 = v1.dist();
        const d2 = v2.dist();
        return (d1 < d2) ? v2 : v1;
    }
}

class Random{
    // [[key, value],...]
    constructor(arr){
        // arr => [value_1, value_1, value_2,...]
        this.table = arr.map((_, i) => {
            return Array.from({length: arr[i][1]}, () => arr[i][0]);
        }).flat();

        this.length = this.table.length;
    }

    random(){
        return this.table[Math.floor(Math.random() * this.length)];
    }
}

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

class MoveListener{
    constructor(canvas){
        this.focuse = null;
        this.canvas = canvas;
        this.down = false;
        this.prevX = null;
        this.prevY = null;
        this.followers = [];
        window.self.addEventListener("mousemove", (e) => {
            const m = mouseEvent(e, this.canvas);
            const x = m.clickPos.x;
            const y = m.clickPos.y;
            if(this.focuse != null && this.down == true && m.inside){
                this.focuse.f(x, y, this.prevX - x, this.prevY - y);
            }
            for(const follower of this.followers){
                follower.func(x, y);
            }
            this.prevX = x;
            this.prevY = y;
        });
        
        window.self.addEventListener("mousedown", () => {
            this.down = true;
            // console.log("down");
        });

        window.self.addEventListener("mouseup", () => {
            this.prevX = null;
            this.prevY = null;
            this.down = false;
            // console.log("up");
        });

    }

    add(element, f){
        new Move(this, element, f);
    }

    addFollower(updateFunc){
        this.followers.push(new Follower(updateFunc));
    }
}

class Move{
    constructor(moveListener, element, f){
        this.x;
        this.y;
        this.element = element;
        this.f = f;
        this.element.addEventListener("pointerenter", () => { moveListener.focuse = this; });
        this.element.addEventListener("pointerleave", () => { 
            if(moveListener.down == false){
                moveListener.focuse = null; 
            }
        });
    }
}

// const updateFunc = (x, y) => {
//     this.x = x;
//     this.y = y;
//     update();
// }
class Follower{
    constructor(updateFunc){
        this.func = updateFunc;
    }
}

class ValueElement{
    constructor(holder, min, max){
        this.holder = holder;
        
        this.invisibleEl = func.createElement(`<p id="invisible"></p>`);
        this.valueEl = func.createElement(`<p></p>`);

        this.holder.appendAllChildren([this.invisibleEl, this.valueEl]);

        this.min = min;
        this.max = max;
        this.minusPrefix = (min < 0);
        this.dotPrefix = (!Number.isInteger(min) || !Number.isInteger(max));
        this.maxSpacesSize = func.max(this.getMultitplyOfTen(min), this.getMultitplyOfTen(max));
        // console.log(this.getMultitplyOfTen(min), this.getMultitplyOfTen(max));
        // console.log(this.maxSpacesSize);
        
        this.externalUpdateFunc = null;
    }

    getMultitplyOfTen(number){
        let answer = 0;
        
        if(!Number.isInteger(number)){
            answer++;
        }

        if(number < 0){
            number = -number;
            answer++;
        }
        else if(number == 0){
            return 1;
        }

        answer += Math.abs(Math.floor(Math.log10(number) + 1));
        return answer;
    }

    calculateNumberOfSpaces(number){
        const numberPower = getMultitplyOfTen(number);
        const numberMaxPower = getMultitplyOfTen(max);

        return numberMaxPower - numberPower;
    }

    update(value){
        let spacesSize = 0;
        // if min is negative 
        //  add every time minus to the positive values
        const minus = (this.minusPrefix && 0 <= number) ? "-" : "";
        const dot = (this.dotPrefix && Number.isInteger(value)) ? "0." : "";
        spacesSize += this.maxSpacesSize - this.getMultitplyOfTen(value);
        
        // make invisible numbers
        const spaces = minus + dot + "0".repeat(spacesSize);

        this.invisibleEl.innerHTML = spaces;
        this.valueEl.innerHTML = value;
        if(this.externalUpdateFunc){
            this.externalUpdateFunc();
        }
    }
}

class Movable{
    constructor(canvas, pointsHolder, moveListener, pos){
        this.pos = pos;

        this.canvas = canvas;
        this.sheetPoint = func.createElement(`<div style="position: absolute;"></div>`);
        this.externalUpdateFunc = null;

        pointsHolder.appendChild(this.sheetPoint);
        
        moveListener.add(this.sheetPoint, (x, y) => {
            const cl = canvas.getBoundingClientRect();
            const [width, height] = [cl.width, cl.height];
            this.pos.y = Math.floor(func.map(y, 0, height, 0, canvas.height));
            this.pos.x = Math.floor(func.map(x, 0, width, 0, canvas.width)); 
            this.update();
            if(this.externalUpdateFunc){
                this.externalUpdateFunc();
            }
        });

        this.update();
    }

    delete(){
        this.sheetPoint.remove();
    }

    update(){
        this.sheetPoint.style.left = `${func.toProc(this.pos.x, this.canvas.width)}%`;
        this.sheetPoint.style.top = `${func.toProc(this.pos.y, this.canvas.height)}%`;
    }
}

function createPoint(minX, minY, maxX, maxY){
    const pointEl = func.createElement(`<div class="settingSameLine">
            <p>X: </p>
            <input type="number" min="${minX}" max="${maxX}" value="0"></input>
            <p>Y: </p>
            <input type="number" min="${minY}" max="${maxY}" value="0"></input>
        </div>`);

    return [
        pointEl,
        pointEl.children[1],
        pointEl.children[3],
    ];
}

class PointValue{
    constructor(holder, pos){
        this.pos = pos;
        this.create(holder);

        this.externalUpdateFunc = null;
        this.delFunc = null;
        this.xInput.$("input", () => {
            this.pos.x = parseInt(this.xInput.value);
            if(this.externalUpdateFunc){
                this.externalUpdateFunc();
            }
        });

        this.yInput.$("input", () => {
            this.pos.y = parseInt(this.yInput.value);
            if(this.externalUpdateFunc){
                this.externalUpdateFunc();
            }
        });
    }

    create(holder, minX, minY){
        [this.pointEl, this.xInput, this.yInput] = createPoint(minX, minY);
        
        this.element = func.createElement(`<div class="pointValue">
                <div class="fS8"></div>
                <div style="display: flex; justify-content: flex-end;">
                    <button class="removeButton"></button>
                </div>
            </div>
        `);
        
        this.removeButton = this.element.children[1].children[0];
        this.element.insertBefore(this.pointEl, this.element.children[0]);
        this.removeButton.$("click", () => {
            if(this.delFunc){
                this.delFunc();
            }
            this.delete();
        });

        holder.appendChild(this.element);
    }
    
    update(){
        this.xInput.value = this.pos.x;
        this.yInput.value = this.pos.y;
    }

    delete(){
        this.element.remove();
    }
}

class VertexValue{
    constructor(holder, p1, p2){
        this.p1 = p1;
        this.p2 = p2;
        this.create(holder);

        this.externalUpdateFunc = null;
        this.delFunc = null;
        
        const val = [
            (n) => this.p1.x = n, 
            (n) => this.p1.y = n, 
            (n) => this.p2.x = n, 
            (n) => this.p2.y = n
        ];

        [this.xInput1, this.yInput1, this.xInput2, this.yInput2].forEach((input, i) => {
            input.$("input", () => {
                val[i](parseInt(input.value));
                if(this.externalUpdateFunc){
                    this.externalUpdateFunc();
                }
            });
        });

        this.update();
    }

    create(holder, minX, minY){
        [this.point1El, this.xInput1, this.yInput1] = createPoint(minX, minY);
        [this.point2El, this.xInput2, this.yInput2] = createPoint(minX, minY);
        
        this.element = func.createElement(`<div class="vertexValue">
                <div class="fS8"></div>
                <div style="display: flex; justify-content: flex-end;">
                    <button class="removeButton"></button>
                </div>
            </div>
        `);
        
        this.removeButton = this.element.children[1].children[0];
        this.element.insertBefore(this.point2El, this.element.children[0]);
        this.element.insertBefore(this.point1El, this.point2El);
        this.removeButton.$("click", () => {
            if(this.delFunc){
                this.delFunc();
            }
            this.delete();
        });

        holder.appendChild(this.element);
    }
    
    update(){
        this.xInput1.value = this.p1.x;
        this.yInput1.value = this.p1.y;
        this.xInput2.value = this.p2.x;
        this.yInput2.value = this.p2.y;
    }

    delete(){
        this.element.remove();
    }
}

HTMLElement.prototype.$ = function(name, f, run){
    if(run == true && f){
        f();
    }

    this.addEventListener(name, () => { f(); }, false);
}

HTMLElement.prototype.appendAllChildren = function(arrayOfElement){
    for(let i = 0; i < arrayOfElement.length; i++){
        this.appendChild(arrayOfElement[i]);
    }
}

String.prototype.capitalizeFirst = function(){
    return this.charAt(0).toUpperCase() + this.slice(1);
}

export default func;
export {Vec2, Random, MoveListener, ValueElement, Movable, PointValue, VertexValue};
