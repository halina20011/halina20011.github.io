import {createLink} from "/Tools/import.js";
import {imagesLinksData} from "/Tools/data.js";

const importSpot = document.getElementById("importSpot");

let dataToImport = importSpot.dataset["src"].replace(/ /g, "");
let makeTitle = importSpot.dataset["title"].replace(/ /g, "");

dataToImport = dataToImport.split(",");
makeTitle = makeTitle.split(",");
// console.log(dataToImport);

let data = imagesLinksData;
// console.log(data);

createLink("/Tools/importImagesLinks.css", importSpot);

// Object.keys(nameOfObject)[index]; --> return name of key
// nameOfObject[Object.keys(nameOfObject)[index]]; --> return data in key
function getKey(object, index){
    return object[Object.keys(object)[index]];
}

function parseData(data){
    // console.log(data);
    let className = getKey(data, 0);
    let path = getKey(data, 1);
    let imgPath = getKey(data, 2);
    let name = getKey(data, 3);
    let projectTextInfo = getKey(data, 4);
    let addAdicionalThings = getKey(data, 5);
    // console.log(addAdicionalThings);
    let addScript = getKey(data, 6);
    let addCss = getKey(data, 7);
    
    // console.log(className);
    // console.log(path);
    // console.log(imgPath);
    // console.log(name);
    // console.log(projectTextInfo);
    // console.log(addAdicionalThings);
    // console.log(addScript);
    // date []
    return [className, path, imgPath, name, projectTextInfo, addAdicionalThings, addScript, addCss];
}

//Make elements
function createImageLink(parrent, dataList){
    if(dataList.length != 8){
        console.error("Data has wrong size. Size ", dataList.length);
    }

    let className = dataList[0];
    let path = dataList[1];
    let imgPath = dataList[2];
    let name = dataList[3];
    let projectTextInfo = dataList[4];
    let addAdicionalThings = dataList[5];
    let addScript = dataList[6];
    let addCss = dataList[7];
    
    let classBackgroundImg;
    let classProjectTextInfo;
    let classImg;
    let classInfoText;
    let projectName;

    let button;

    if(className != null && path != null && imgPath != null && name != null && projectTextInfo != null){
        button = document.createElement("button"); //Create button
        button.className = className;
        // console.log(path);
        button.setAttribute("onClick", 'location.href =\'' + path +'\';');
        parrent.appendChild(button);

        classBackgroundImg = document.createElement("div");
        classBackgroundImg.className = "backgroundImg";
        button.appendChild(classBackgroundImg);

        let classProjectTextInfo = document.createElement("div");
        classProjectTextInfo.className = "projectTextInfo"
        classBackgroundImg.appendChild(classProjectTextInfo);

        for(let i = 0; i< projectTextInfo.length; i++){
            let text = document.createElement("p");
            text.innerHTML = projectTextInfo[i];
            classProjectTextInfo.appendChild(text);
        }

        // Set img background
        classImg = document.createElement("div");
        classImg.className = "img";
        classImg.style.backgroundImage = "url(" + imgPath + ")";
        classBackgroundImg.appendChild(classImg);

        classInfoText = document.createElement("div");
        classInfoText.className = "infoText";
        classBackgroundImg.appendChild(classInfoText);

        projectName = document.createElement("p");
        projectName.innerHTML = name;
        classInfoText.appendChild(projectName);
    }

    if(addAdicionalThings != null){
        // console.log(addAdicionalThings);
        if(addAdicionalThings.length > 0){
            // console.log(addAdicionalThings)
            //[["text", [["type", "value"]]]]
            for(let i = 0; i< addAdicionalThings.length;i++){
                let newElement = document.createElement(addAdicionalThings[i][0]);
                let element = classBackgroundImg.appendChild(newElement);
                for(let x = 0; x < addAdicionalThings[i][1].length; x++){
                    if(addAdicionalThings[i][1][x].length == 2 && addAdicionalThings[i][1][x][0] == "class"){
                        newElement.className = addAdicionalThings[i][1][x][1];
                    }
                    else{
                        element.style.cssText += addAdicionalThings[i][1][x][0];
                    }
                }
            }
        }
    }

    if(addScript != null){
        let script = document.createElement("script");
        script.src = addScript;
        classBackgroundImg.appendChild(script);
    }

    if(addCss != null){
        if(addCss.length > 0){
            let css = [];
            let style = document.createElement('style');
            style.type = 'text/css';
            //[["text", [["type", "value"]]]]
            for(let i = 0; i< addCss.length; i++){
                // console.log(addCss[i][1][0]);
                // console.log(addCss[i][0]);
                if(addCss[i][0].indexOf("img") > -1 && addCss[i][0].indexOf(":") == -1){
                    classImg.style.cssText += addCss[i][1];
                }
                else if(addCss[i][0].indexOf(classImg.className) > -1){
                    if(addCss[i][0].indexOf("hover") > -1){
                        // console.log("HOVER");
                        // console.log(addCss[i][1][0].length);
                        for(let x = 0; x < addCss[i][1][0].length; x++){
                            css.push(document.createTextNode(`${addCss[i][0]}{${addCss[i][1][0][x]}}`));
                            // console.log(css);
                        }
                    }
                }
            }
            if(style.styleSheet){
                style.styleSheet.cssText = declarations.nodeValue;
            } 
            else{
                // console.log(css.length);
                for(let i = 0; i < css.length; i++){
                    style.appendChild(css[i]);
                }
            }

            document.getElementsByTagName('head')[0].appendChild(style);
        }
    }
}

function importImageLink(parent, name){
    let pageData = data[name];
    // Get number of all window to add
    let pageDataCount = Object.keys(pageData).length;

    // Convert json to list of info
    let pageDataList = [];
    for(let i = 0; i < pageDataCount; i++){
        pageDataList.push(parseData(getKey(pageData, i)));
    }

    // console.log(pageDataList);
    for(let i = 0; i < pageDataList.length; i++){
        createImageLink(parent, pageDataList[i]);
    }
}

function importAllImagesLinks(parent){
    for(let i = 0; i < dataToImport.length; i++){
        let name = dataToImport[i];

        if(makeTitle[i] == "True"){
            // Make title
            let title = document.createElement("h2");
            title.innerHTML = name;
            parent.appendChild(title);
        }
        
        let parentElement = document.createElement("div");
        parentElement.className = "projects";
        parent.appendChild(parentElement);
        
        // console.log(name);
        importImageLink(parentElement, name);
    }
}

importAllImagesLinks(importSpot);
