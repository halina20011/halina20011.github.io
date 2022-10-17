import {loadJSON} from "/Tools/import.js"

const importSpot = document.getElementById("importSpot");
let dataToImport = importSpot.dataset["src"].replace(/ /g, "")
let makeTitle = importSpot.dataset["title"].replace(/ /g, "")
dataToImport = dataToImport.split(",");
makeTitle = makeTitle.split(",");
console.log(dataToImport)

var data = loadJSON('/Tools/data.json'); //Get file data.json
// console.log(data);

var sheet = document.createElement("link");
sheet.rel = "stylesheet"
sheet.type = "text/css"
sheet.href = "/Tools/importImagesLinks.css"
importSpot.appendChild(sheet);  //Import css style

// Object.keys(nameOfObject)[index]; --> return name of key
// nameOfObject[Object.keys(nameOfObject)[index]]; --> return data in key
function getKey(object, index){
    return object[Object.keys(object)[index]];
}

function parseData(data){
    // console.log(data);
    var className = getKey(data, 0);
    var path = getKey(data, 1);
    var imgPath = getKey(data, 2);
    var name = getKey(data, 3);
    var projectTextInfo = getKey(data, 4);
    var addAdicionalThings = getKey(data, 5);
    // console.log(addAdicionalThings);
    var addScript = getKey(data, 6);
    var addCss = getKey(data, 7);
    
    // console.log(className);
    // console.log(path);
    // console.log(imgPath);
    // console.log(name);
    // console.log(projectTextInfo);
    // console.log(addAdicionalThings);
    // console.log(addScript);
    // date []
    return [className, path, imgPath, name, projectTextInfo, addAdicionalThings, addScript, addCss]
}

//Make elements
function createImageLink(parrent, dataList){
    if(dataList.length != 8){
        console.error("Data has wrong size. Size ", dataList.length)
    }
    var className = dataList[0];
    var path = dataList[1];
    var imgPath = dataList[2];
    var name = dataList[3];
    var projectTextInfo = dataList[4];
    var addAdicionalThings = dataList[5];
    var addScript = dataList[6];
    var addCss = dataList[7];
    
    var classBackgroundImg;
    var classProjectTextInfo;
    var classImg;
    var classInfoText;
    var projectName;

    var button;

    if(className != null && path != null && imgPath != null && name != null && projectTextInfo != null){
        button = document.createElement("button"); //Create button
        button.className = className;
        // console.log(path);
        button.setAttribute("onClick", 'location.href =\'' + path +'\';');
        parrent.appendChild(button);

        classBackgroundImg = document.createElement("div");
        classBackgroundImg.className = "backgroundImg";
        button.appendChild(classBackgroundImg);

        var classProjectTextInfo = document.createElement("div");
        classProjectTextInfo.className = "projectTextInfo"
        classBackgroundImg.appendChild(classProjectTextInfo);

        for(var i = 0; i< projectTextInfo.length; i++){
            var text = document.createElement("p");
            text.innerHTML = projectTextInfo[i]
            classProjectTextInfo.appendChild(text);
        }

        // Set img background
        classImg = document.createElement("div");
        classImg.className = "img"
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
                let element = classBackgroundImg.appendChild(newElement)
                for(let x = 0; x < addAdicionalThings[i][1].length; x++){
                    if(addAdicionalThings[i][1][x].length == 2 && addAdicionalThings[i][1][x][0] == "class"){
                        newElement.className = addAdicionalThings[i][1][x][1];
                    }
                    else{
                        element.style.cssText += addAdicionalThings[i][1][x][0]
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
        // console.log(addCss.length);
        if(addCss.length > 0){
            let css = [];
            let style = document.createElement('style');
            style.type = 'text/css';
            //[["text", [["type", "value"]]]]
            for(let i = 0; i< addCss.length;i++){
                console.log(addCss[i][1][0])
                console.log(addCss[i][0])
                if(addCss[i][0].indexOf("img") > -1 && addCss[i][0].indexOf(":") == -1){
                    classImg.style.cssText += addCss[i][1];
                }
                else if(addCss[i][0].indexOf(classImg.className) > -1){
                    if(addCss[i][0].indexOf("hover") > -1){
                        console.log("HOVER")
                        console.log(addCss[i][1][0].length)
                        for(let x = 0; x < addCss[i][1][0].length; x++){
                            css.push(document.createTextNode(`${addCss[i][0]}{${addCss[i][1][0][x]}}`));
                            console.log(css)
                        }
                    }
                }
            }
            if (style.styleSheet) {
                style.styleSheet.cssText = declarations.nodeValue;
                console.log("B")
            } 
            else {
                console.log("A")
                console.log(css.length)
                for(var i = 0; i < css.length; i++){
                    style.appendChild(css[i]);

                }
            }
            document.getElementsByTagName('head')[0].appendChild(style);
        }
    }
}

function importImageLink(parent, name){
    var pageData = data[name];
    var pageDataCount = Object.keys(pageData).length; //Get number of all window to add

    //Convert json to list of info
    var pageDataList = []
    for(var i = 0; i < pageDataCount; i++){
        //append = push
        pageDataList.push(parseData(getKey(pageData, i)));
    }

    console.log(pageDataList);
    for(var i = 0; i < pageDataList.length; i++){
        createImageLink(parent, pageDataList[i]);
    }
}

function importAllImagesLinks(parent){
    for(let i = 0; i < dataToImport.length; i++){
        let name = dataToImport[i];

        if(makeTitle[i] == "True"){
            //Make title
            let title = document.createElement("h2");
            title.innerHTML = name;
            parent.appendChild(title);
        }
        
        let parentElement = document.createElement("div");
        parentElement.className = "projects";
        parent.appendChild(parentElement);
        
        console.log(name);
        importImageLink(parentElement, name);

    }
}

importAllImagesLinks(importSpot)