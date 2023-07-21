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
    let projectTextInfoHolder = getKey(data, 4);
    let addAdicionalThings = getKey(data, 5);
    // console.log(addAdicionalThings);
    let addScript = getKey(data, 6);
    let addCss = getKey(data, 7);
    
    // console.log(className);
    // console.log(path);
    // console.log(imgPath);
    // console.log(name);
    // console.log(projectTextInfoHolder);
    // console.log(addAdicionalThings);
    // console.log(addScript);
    // date []
    return [className, path, imgPath, name, projectTextInfoHolder, addAdicionalThings, addScript, addCss];
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
    let projectTextInfoHolder = dataList[4];
    let addAdicionalThings = dataList[5];
    let addScript = dataList[6];
    let addCss = dataList[7];
    
    let classBackgroundImg;
    let classProjectTextInfoHolder;
    let classProjectTextInfo;
    let classImg;
    let classInfoText;
    let projectName;

    let button;

    if(className != null && path != null && imgPath != null && name != null && projectTextInfoHolder != null){
        button = document.createElement("button"); //Create button
        button.className = className;
        // console.log(path);
        button.setAttribute("onClick", `location.href = "${path}";`);
        parrent.appendChild(button);

        classBackgroundImg = document.createElement("div");
        classBackgroundImg.className = "backgroundImg";
        button.appendChild(classBackgroundImg);

        classProjectTextInfoHolder = document.createElement("div");
        classProjectTextInfoHolder.className = "projectTextInfoHolder";
        classBackgroundImg.appendChild(classProjectTextInfoHolder);

        classProjectTextInfo = document.createElement("div");
        classProjectTextInfo.className = "projectTextInfo";
        classProjectTextInfoHolder.appendChild(classProjectTextInfo);

        for(let i = 0; i< projectTextInfoHolder.length; i++){
            const text = document.createElement("p");
            text.innerHTML = projectTextInfoHolder[i];
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
        const newElement = document.createElement("div");
        newElement.innerHTML = addAdicionalThings;
        classBackgroundImg.appendChild(newElement);
    }

    if(addScript != null){
        const script = document.createElement("script");
        script.src = addScript;
        classBackgroundImg.appendChild(script);
    }

    if(addCss != null){
        const style = document.createElement('style');
        style.innerHTML = addCss;

        document.getElementsByTagName('head')[0].appendChild(style);
    }
}

function importImageLink(parent, name){
    const pageData = data[name];
    // Get number of all window to add
    const pageDataCount = Object.keys(pageData).length;

    // Convert json to list of info
    const pageDataList = [];
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
        const name = dataToImport[i];

        if(makeTitle[i] == "True"){
            // Make title
            const title = document.createElement("h2");
            title.innerHTML = name;
            parent.appendChild(title);
        }
        
        const parentElement = document.createElement("div");
        parentElement.className = "projects";
        parent.appendChild(parentElement);
        
        // console.log(name);
        importImageLink(parentElement, name);
    }
}

importAllImagesLinks(importSpot);
