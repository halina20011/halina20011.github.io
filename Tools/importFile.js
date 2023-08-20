import {headHtml} from "../Menu/head.js";

function createScript(path, parent, mode = null){
    const script = document.createElement("script");
    script.type = (mode != null) ? mode : "text/javascript";
    script.src = path;
    parent.appendChild(script);
}
const columnUp = document.getElementById("columnUp");
// createScript("/Menu/head.js", columnUp, "module");

columnUp.innerHTML += headHtml;

createScript("/Tools/codeLink.js", columnUp);
createScript("/Menu/dropDownMenu.js", columnUp);
createScript("/Menu/headScroll.js", columnUp);
