import {loadJSON} from "/Tools/import.js"

const textInput = document.getElementById("search");
const searchDropDown = document.getElementsByClassName("searchDropDown")[0];

var data = loadJSON('/Tools/search.json');
var searchOptions = []
getSearchOptions()

textInput.addEventListener("input", function(event){updateSearch(event);}, false)

function getSearchOptions(){
    var dataLength = Object.keys(data).length;
    for(var i = 0; i < dataLength; i++){
        var objData = data[Object.keys(data)[i]];
        var name = objData[Object.keys(objData)[0]];
        var about = objData[Object.keys(objData)[1]];
        var img = objData[Object.keys(objData)[2]];
        var path = objData[Object.keys(objData)[3]];
        
        searchOptions.push([name, about, img, path]);
    }
}

function removeResult(list){
    var name = list[0];
    for(var x = 0; x < searchDropDown.childElementCount; x++){
        if(searchDropDown.children[x].className == name){
            var div = document.getElementsByClassName(name)[0];
            if(div != null){
                searchDropDown.removeChild(div);
            }
        }
    }
}

function createResult(list){
    var name = list[0];
    var about = list[1];
    var imgPath = list[2];
    for(var x = 0; x < searchDropDown.childElementCount; x++){
        if(searchDropDown.children[x].className == name){
            // console.log(searchDropDown.children[x].className);
            return;
        }
    }

    var div = document.createElement("div");
    div.className = list[0];
    div.setAttribute("onClick", 'location.href =\'' + list[3] +'\';');
    
    searchDropDown.appendChild(div);

    var imageIconHolder = document.createElement("div");
    imageIconHolder.className = "imageIconHolder";
    div.appendChild(imageIconHolder);

    var projectTextInfo = document.createElement("div");
    projectTextInfo.className = "projectTextInfo";
    div.appendChild(projectTextInfo);

    var imageIcon = document.createElement("div");
    imageIcon.className = "imageIcon"
    imageIcon.style.backgroundImage = "url(" + imgPath + ")";
    imageIconHolder.appendChild(imageIcon);

    var nameText = document.createElement("p");
    nameText.innerHTML = name;
    projectTextInfo.appendChild(nameText);
    
    var aboutText = document.createElement("p");
    aboutText.innerHTML = about;
    projectTextInfo.appendChild(aboutText);

    // var textName = document.createElement("p");
    // textName.innerHTML = name;
    // div.appendChild(textName);

    // var textAbout = document.createElement("p");
    // textAbout.innerHTML = about;
    // div.appendChild(textAbout);
}

function updateSearch(event){
    var filterVal = textInput.value.toLowerCase();
    var resultsToAdd = []
    var resultsToRemove = []
    if(filterVal == ""){
        for(var i = 0; i < searchOptions.length; i++){
            resultsToRemove.push(searchOptions[i]);
            // console.log(resultsToRemove)
        }
    }
    else{
        for(var i = 0; i < searchOptions.length; i++){
            for(var x = 0; x < searchOptions[i].length; x++){
                if(x != 2){
                    var textValue = searchOptions[i][0] + " " + searchOptions[i][1];
                    if(textValue.toLowerCase().indexOf(filterVal) > -1){
                        resultsToAdd.push(searchOptions[i]);
                    }
                    else{
                        resultsToRemove.push(searchOptions[i]);
                    }
                }
            }
        }
    }
    
    for(var i = 0; i < resultsToAdd.length; i++){
        createResult(resultsToAdd[i]);
    }
    for(var i = 0; i < resultsToRemove.length; i++){
        removeResult(resultsToRemove[i]);
    }
}

// window.onclick = function(event) {
//     console.log(event.target);
//     var search = document.getElementsByClassName("Search")[0]
//     if(event.target.matches("#search")){
//         search.classList.add("searchHover");
//     }
//     else{
//         search.classList.remove("searchHover");
//     }
// }
