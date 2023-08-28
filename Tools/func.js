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
}

class Vec2{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
    
    addVal(b){
        this.x += b.x; 
        this.y += b.y;
    }

    subtractVal(b){
        this.x -= b.x; 
        this.y -= b.y;
    }

    subtract(b){
        return new Vec2(this.x - b.x, this.y - b.y);
    }
}

HTMLElement.prototype.appendAllChildren = function(arrayOfElement){
    for(let i = 0; i < arrayOfElement.length; i++){
        this.appendChild(arrayOfElement[i]);
    }
}

const functionInstance = new Func();
export default functionInstance;
export {Vec2};
