import func from "../../Tools/func.js";
import {elements} from "./keys.js";

const borderColor = "black";

class Button{
    constructor(name, type, position, usable){
        this.id = position;
        this.class = type;
        this.usable = usable;
        this.name = name;
        this.element = func.createElement(`
            <button class="${this.class}" id="${this.id}">
                <p>${name}</p>
            </button>
        `);

        if(usable == null || usable){
            this.element.addEventListener("click", () => this.toggle(), false);
        }
    }

    borderOn(){
        this.element.style.border = "3px solid black";
    }

    borderOff(){
        this.element.style.border = "3px solid transparent";
    }

    toggle(action = 2){
        if(action == 0 || this.element.style.borderColor == borderColor){
            this.borderOff();
        }
        else if(action == 1 || this.element.style.borderColor != borderColor){
            this.borderOn();
        }
    }
}

class Keyboard{
    constructor(parent){
        this.buttons = elements.map(item => new Button(item[0], item[1], item[2], item[3]));
        const sizes = [14, 14, 13, 13, 10];
        let size = 0, sizeIndex = 0;
        let line = document.createElement("div");
        for(let i = 0; i < this.buttons.length; i++){
            line.appendChild(this.buttons[i].element);
            size++;
            if(size == sizes[sizeIndex]){
                size = 0;
                parent.appendChild(line);
                line = document.createElement("div");
                sizeIndex++;
            }
        }

        this.numbers = this.buttons.slice(1, 11);

        this.firstLine = this.buttons.slice(15, 25);
        this.secondLine = this.buttons.slice(29, 38);
        this.thirdLine = this.buttons.slice(42, 49);

        this.lines = [this.firstLine, this.secondLine, this.thirdLine];
    }


    getLetters(){
        const re = [];
        for(let i = 0; i < this.buttons.length; i++){
            const button = this.buttons[i];
            if(button.element.style.borderColor == borderColor){
                re.push(button.name.toLocaleLowerCase());
            }
        }

        return re;
    }

    toggleAllNumbers(action = 2){
        Array.from(this.numbers).forEach(button => {
            button.toggle(action);
        });
    }

    toggleAllLetters(action = 2){
        this.toggleLine(1, action);
        this.toggleLine(2, action);
        this.toggleLine(3, action);
    }
    
    toggleLine(index, action = 2){
        if(0 < index && index < 4){ // 1 2 3
            Array.from(this.lines[index - 1]).forEach(button => {
                button.toggle(action);
            });
        }
    }
    
    toggleAlphaNumeric(action = 2){
        this.toggleAllNumbers(action);
        this.toggleAllLetters(action);
    }
}

export default Keyboard;
