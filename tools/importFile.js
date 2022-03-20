import {getText} from "/tools/import.js";
import {createLink} from "/tools/import.js";
// import {resizeInfoText} from "/size.js";

var text = getText("/Menu/dropDownMenu.html")
var word = "<body>"
var word2 = "<!-- Code injected by live-server -->"
var word3 = "</body>"
var output = text.match(word); 
var output2 = text.match(word2);
if(output2 != null){
    text = text.slice(output.index + 6, output2.index);
}
else{
    output2 = text.match(word3);
    text = text.slice(output.index + 6, output2.index);
}

var lines = text.split("\n");

for(var i = 0; i < lines.length; i++){
    lines[i] = lines[i].slice(8, -1);
}
// console.log(lines);
for(var i = 0; i < lines.length; i++){
    var copy = lines[i].replaceAll(" ", "");
    if(copy == ""){
        // console.log(copy);
        lines.splice(i, 1);
    }
}
function listToString(list){
    var st = "";
    for(let i = 0; i < list.length; i++){
        st = st + list[i];
    }
    return st
}

var code = listToString(lines)
var columnUp = document.getElementById('column-up');
createLink("/Menu/dropDownMenu.css", columnUp);
columnUp.innerHTML += code;
// resizeInfoText();
// console.log("Complete")