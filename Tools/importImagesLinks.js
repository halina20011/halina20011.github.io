import {imagesLinksData as data} from "./data.js";
import func from "./func.js";

function createLink(path, parent){
    const sheet = document.createElement("link");
    sheet.rel = "stylesheet";
    sheet.type = "text/css";
    sheet.href = path;

    parent.appendChild(sheet);
}

function createImageLink(item, parent){
    const projectText = item.projectTextInfo.map(text => `<p>${text}</p>`).join("");

    const adicionalThings = (item.addAdicionalThings != null) ? `<div>${item.addAdicionalThings}</div>` : "";
    const css = (item.addCss != null) ? `<style>${item.addCss}</style>` : "";

    const link = func.createElement(`
        <a class="${item.className}" href="${item.path}">
            <div class="backgroundImg">
                <div class="projectTextInfoHolder">
                    <div class="projectTextInfo">
                        ${projectText}
                    </div>
                </div>
                <div class="img" style="background-image: url('${item.imgPath}')"></div>
                <div class="infoText">
                    <p>${item.name}</p>
                </div>
                ${adicionalThings}
                ${css}
            </div>
        </a>
        `);
    parent.appendChild(link);

    if(item.addScript != null){
        const script = document.createElement("script");
        script.src = item.addScript;
        link.appendChild(script);
    }
}

function main(entries, parent){
    for(let i = 0; i < entries.length; i++){
        const entryName = entries[i][0];
        const createName = entries[i][1];

        // make title
        if(createName){
            const title = func.createElement(`<h2>${entryName}</h2>`);
            parent.appendChild(title);
        }
        
        const parentElement = func.createElement(`<div class="projects"></div>`);
        parent.appendChild(parentElement);

        Object.keys(data[entryName]).forEach(itemKey => {
            createImageLink(data[entryName][itemKey], parentElement);
        });
    }
}

const importSpot = document.querySelector(".importSpot");
createLink("/Tools/importImagesLinks.css", importSpot);

const entries = JSON.parse(importSpot.dataset["entries"]);

main(entries, importSpot);
