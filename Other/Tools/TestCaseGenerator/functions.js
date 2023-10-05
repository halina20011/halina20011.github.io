import types from "./types.js";

function random(min, max){
    return Math.floor(Math.random() * (max - min) + min);
}

const StringFunctions = {
    fromRegExp(regex){
        let letters = "";
        for(let i = 32; i < 127; i++){
            letters += String.fromCharCode(i);
        }
        const r = new RegExp(regex, "g");
        const m = letters.match(r);
        return m;
    }
}

const ArrayFunctions = {
    array(val_INT, len_INT){
        return Array.from({length: len_INT}, () => val_INT);
    },

    join(array_ARRAY){
        return array_ARRAY.join("");
    },

    randomArray(min_INT, max_INT, len_INT){
        return Array.from({length: len_INT}, () => random(min_INT, max_INT));
    },

    randomBinArray(len_INT){
        return Array.from({length: len_INT}, () => Math.round(Math.random()));
    }
}

const Array2DFunctions = {
    new(m_INT, n_INT, val_INT){
        return Array.from({length: m_INT}, () => {
            return Array.from({length: n_INT}, () => val_INT);
        });
    },

    fill(array_ARRAY, val_INT){
        return array_ARRAY.map(row => row.map(_ => val_INT));
    },

    randomFill(array_ARRAY, min_INT, max_INT){
        return array_ARRAY.map(row => row.map(_ => random(min_INT, max_INT)));
    },

    randomNSize(m_INT, minN_INT, maxN_INT, val_INT){
        minN_INT = Math.max(minN_INT, 0);
        return Array.from({length: m_INT}, () => {
            return Array.from({length: random(minN_INT, maxN_INT)}, () => val_INT);
        });
    },
}

const RandomFunctions = {
    random(min_INT, max_INT){
        return Math.floor(Math.random() * (max_INT - min_INT) + min_INT);
    },

    randomBin(){
        return Math.round(Math.random());
    },

    randomFromArray(array_ARRAY, len_INT){
        return Array.from({length: len_INT}, () => {
            return array_ARRAY[Math.floor(Math.random() * array_ARRAY.length)];
        });
    }
}

class FunctionButton{
    constructor(buttonText, func){
        this.button = document.createElement("button");
        this.button.innerHTML = buttonText;
        this.button.addEventListener("click", func);
    }
}

const addDropdownContext = document.querySelector(".addDropdownContext");

function functionArguments(func){
    const str = func.toString();
    const start = str.indexOf('(') + 1;
    const end = str.indexOf(')');
    const result = str.slice(start, end).match(/([^\s,]+)/g);
    
    if(result === null){
        return [];
    }

    return result;
}

class Function{
    constructor(func){
        this.name = func.name;
        this.args = functionArguments(func);
        this.argsTypes = this.args.map((arg, i) => {
            // console.log(arg, i, this.args[i]);
            // INT, FLOAT, ARRAY
            const intEnd = arg.length - 4;
            const floatEnd = arg.length - 6;
            const arrayEnd = arg.length - 6;
            if(arg.substring(intEnd) == "_INT"){
                this.args[i] = this.args[i].substring(0, intEnd);
                return types.INPUT_INT_TYPE;
            }
            else if(arg.substring(floatEnd) == "_FLOAT"){
                this.args[i] = this.args[i].substring(0, floatEnd);
                return types.INPUT_FLOAT_TYPE;
            }
            else if(arg.substring(arrayEnd) == "_ARRAY"){
                this.args[i] = this.args[i].substring(0, arrayEnd);
                return types.INPUT_ARRAY_TYPE;
            }

            return types.INPUT_TEXT_TYPE;
        });
    }
}

class Functions{
    constructor(NodeInput, NodeFunction, NodeOutput){
        const functions = {RandomFunctions, StringFunctions, ArrayFunctions, Array2DFunctions};
        const buttonMenu = {
            "Input": [
                new FunctionButton("text",      () => { new NodeInput(types.INPUT_TEXT_TYPE); }),
                new FunctionButton("long text", () => { new NodeInput(types.INPUT_LONG_TEXT_TYPE); }),
                new FunctionButton("int",    () => { new NodeInput(types.INPUT_INT_TYPE); }),
                new FunctionButton("float",    () => { new NodeInput(types.INPUT_FLOAT_TYPE); }),
                new FunctionButton("array",    () => { new NodeInput(types.INPUT_ARRAY_TYPE); }),
            ],
            "Output":[
                new FunctionButton("new", () => { new NodeOutput(); } )
            ],
        }
        this.table = {};
        this.info = {};
        
        Object.keys(functions).forEach(classKey => {
            const funcClass = functions[classKey];
            const classKeyName = classKey.slice(0, -9);
            const buttons = [];

            Object.keys(funcClass).forEach(functionKey => {
                const func = funcClass[functionKey];
                this.table[func.name] = func;
                this.info[func.name] = new Function(func);
                buttons.push(new FunctionButton(func.name, () => { new NodeFunction(func.name); }));
            });
            buttonMenu[classKeyName] = buttons;
        });

        Object.keys(buttonMenu).forEach(key => {
            // <ul>
            //     <button>input</button>
            //     <li>
            //         <button>text</button>
            //         <button>long text</button>
            //         <button>number</button>
            //     </li>
            // </ul>
            const functions = buttonMenu[key];
            const parent = document.createElement("ul");
            const button = document.createElement("button");
            button.innerHTML = key.toLowerCase();

            const items = document.createElement("li");
            for(let i = 0; i < functions.length; i++){
                items.appendChild(functions[i].button);
            }
            parent.appendChild(button);
            parent.appendChild(items);

            addDropdownContext.appendChild(parent);
        });
    }
}

export {Functions, Function};
