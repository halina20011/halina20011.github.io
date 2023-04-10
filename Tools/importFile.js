import {createScript} from "/Tools/import.js";

let columnUp = document.getElementById("columnUp");
// createScript("/Menu/head.js", columnUp, "module");

import {headHtml} from "/Menu/head.js";

columnUp.innerHTML += headHtml;

createScript("/Tools/codeLink.js", columnUp);
createScript("/Menu/dropDownMenu.js", columnUp);
createScript("/Menu/headScroll.js", columnUp);
