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
}

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

HTMLElement.prototype.appendAllChildren = function(arrayOfElement){
    for(let i = 0; i < arrayOfElement.length; i++){
        this.appendChild(arrayOfElement[i]);
    }
}

const functionInstance = new Func();
export default functionInstance;
export {Vec2, Random};
