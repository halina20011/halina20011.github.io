import {getText, createScript} from "/Tools/import.js";

let text = getText("/Menu/head.html")
let word = "<body>"
let word2 = "<!-- Code injected by live-server -->"
let word3 = "</body>"
let output = text.match(word); 
let output2 = text.match(word2);

if(output2 != null){
    text = text.slice(output.index + 6, output2.index);
}
else{
    output2 = text.match(word3);
    text = text.slice(output.index + 6, output2.index);
}

let lines = text.split("\n");

for(let i = 0; i < lines.length; i++){
    lines[i] = lines[i].slice(8, -1);
}

// console.log(lines);
for(let i = 0; i < lines.length; i++){
    let copy = lines[i].replaceAll(" ", "");
    if(copy == ""){
        // console.log(copy);
        lines.splice(i, 1);
    }
}

function listToString(list){
    let st = "";
    for(let i = 0; i < list.length; i++){
        st = st + list[i];
    }
    return st;
}

let code = listToString(lines);
let columnUp = document.getElementById('columnUp');
columnUp.innerHTML += code;

createScript("/Tools/search.js", columnUp, "module");
createScript("/Tools/codeLink.js", columnUp);
