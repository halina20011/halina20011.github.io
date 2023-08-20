import {data} from "./searchData.js";

const textInput = document.getElementById("search");
const searchDropDownItems = document.getElementsByClassName("searchDropDownItems")[0];

const searchOptions = []
getSearchOptions()

textInput.addEventListener("input", function(event){updateSearch(event);}, false)

function getSearchOptions(){
    const dataLength = Object.keys(data).length;
    for(let i = 0; i < dataLength; i++){
        const objData = data[Object.keys(data)[i]];
        const name = objData[Object.keys(objData)[0]];
        const about = objData[Object.keys(objData)[1]];
        const img = objData[Object.keys(objData)[2]];
        const path = objData[Object.keys(objData)[3]];
        
        searchOptions.push([name, about, img, path]);
    }
}

function removeResult(list){
    const name = list[0];
    for(let x = 0; x < searchDropDownItems.childElementCount; x++){
        if(searchDropDownItems.children[x].className == name){
            const div = document.getElementsByClassName(name)[0];
            if(div != null){
                searchDropDownItems.removeChild(div);
            }
        }
    }
}

function createResult(list){
    const name = list[0];
    const about = list[1];
    const imgPath = list[2];
    for(let x = 0; x < searchDropDownItems.childElementCount; x++){
        if(searchDropDownItems.children[x].className == name){
            // console.log(searchDropDownItems.children[x].className);
            return;
        }
    }

    const div = document.createElement("div");
    div.className = list[0];
    div.setAttribute("onClick", 'location.href =\'' + list[3] +'\';');
    
    searchDropDownItems.appendChild(div);

    const imageIcon = document.createElement("div");
    imageIcon.className = "imageIcon";
    imageIcon.style.backgroundImage = "url(" + imgPath + ")";
    div.appendChild(imageIcon);

    const projectTextInfo = document.createElement("div");
    projectTextInfo.className = "projectTextInfo";
    div.appendChild(projectTextInfo);

    const nameText = document.createElement("p");
    nameText.innerHTML = name;
    projectTextInfo.appendChild(nameText);
    
    const aboutText = document.createElement("p");
    aboutText.innerHTML = about;
    projectTextInfo.appendChild(aboutText);

    // let textName = document.createElement("p");
    // textName.innerHTML = name;
    // div.appendChild(textName);

    // let textAbout = document.createElement("p");
    // textAbout.innerHTML = about;
    // div.appendChild(textAbout);
}

function updateSearch(){
    const filterVal = textInput.value.toLowerCase();
    const resultsToAdd = []
    const resultsToRemove = []
    if(filterVal == ""){
        for(let i = 0; i < searchOptions.length; i++){
            resultsToRemove.push(searchOptions[i]);
            // console.log(resultsToRemove)
        }
    }
    else{
        for(let i = 0; i < searchOptions.length; i++){
            for(let x = 0; x < searchOptions[i].length; x++){
                if(x != 2){
                    const textValue = searchOptions[i][0] + " " + searchOptions[i][1];
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
    
    for(let i = 0; i < resultsToAdd.length; i++){
        createResult(resultsToAdd[i]);
    }
    for(let i = 0; i < resultsToRemove.length; i++){
        removeResult(resultsToRemove[i]);
    }
}

// window.onclick = function(event) {
//     console.log(event.target);
//     let search = document.getElementsByClassName("search")[0]
//     if(event.target.matches("#search")){
//         search.classList.add("searchHover");
//     }
//     else{
//         search.classList.remove("searchHover");
//     }
// }
