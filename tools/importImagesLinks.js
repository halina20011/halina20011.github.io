import {loadJSON} from "/tools/import.js"

const importSpot = document.getElementById("importSpot");

var path = window.location.pathname;
var pageName = path.split("/").pop();
pageName = pageName.substring(0, pageName.length - 5); 
if(!pageName){
    pageName = "index";
}

var data = loadJSON('/tools/data.json'); //Get file data.json
// console.log(data);

var sheet = document.createElement("link");
sheet.rel = "stylesheet"
sheet.type = "text/css"
sheet.href = "/tools/importImagesLinks.css"
importSpot.appendChild(sheet);  //Import css style

var pageData = data[pageName]; 
var pageDataCount = Object.keys(pageData).length; //Get number of all window to add

// Object.keys(nameOfObject)[index]; --> return name of key
// nameOfObject[Object.keys(nameOfObject)[index]]; --> return dafa in key
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

function createScript(dataList){
    const s = document.getElementsByClassName("documentScripts")[0]
    var sript = document.createElement("script");
    script.src = dataList[2][5];
    s.appendChild(sr);
}


//Convert json to list of info
var pageDataList = []
for(var i = 0; i < pageDataCount; i++){
    //append = push
    pageDataList.push(parseData(getKey(pageData, i)));
}

//Make elements
function generateElement(dataList){
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
        importSpot.appendChild(button);

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
        classImg.style.backgroundSize = "100%";
        classImg.style.backgroundRepeat = "no-repeat"
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
            for(var i = 0; i< addAdicionalThings.length;i++){
                var newElement = document.createElement(addAdicionalThings[i][0]);
                var element = classBackgroundImg.appendChild(newElement)
                for(var x = 0; x < addAdicionalThings[i][1].length; x++){
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
        var script = document.createElement("script");
        script.src = addScript;
        classBackgroundImg.appendChild(script);
    }

    if(addCss != null){
        console.log(addCss.length);
        if(addCss.length > 0){
            var css = [];
            var style = document.createElement('style');
            style.type = 'text/css';
            //[["text", [["type", "value"]]]]
            for(var i = 0; i< addCss.length;i++){
                console.log(addCss[i][1][0])
                console.log(addCss[i][0])
                if(addCss[i][0].indexOf("img") > -1 && addCss[i][0].indexOf(":") == -1){
                    classImg.style.cssText += addCss[i][1];
                }
                else if(addCss[i][0].indexOf(classImg.className) > -1){
                    if(addCss[i][0].indexOf("hover") > -1){
                        console.log("HOVER")
                        console.log(addCss[i][1][0].length)
                        for(var x = 0; x < addCss[i][1][0].length; x++){
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

for(var i = 0; i < pageDataList.length; i++){
    generateElement(pageDataList[i]);
}
