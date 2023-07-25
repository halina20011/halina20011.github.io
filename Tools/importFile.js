import {createScript} from "./import.js";
import {headHtml} from "../Menu/head.js";

const columnUp = document.getElementById("columnUp");
// createScript("/Menu/head.js", columnUp, "module");

columnUp.innerHTML += headHtml;

createScript("/Tools/codeLink.js", columnUp);
createScript("/Menu/dropDownMenu.js", columnUp);
createScript("/Menu/headScroll.js", columnUp);
