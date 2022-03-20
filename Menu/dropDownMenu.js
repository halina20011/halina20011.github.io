// const 

function roll(dropDowncontent, plusIndex = 0) {
    // var name = dropDowncontent.substring(dropDowncontent.length - 16)
    // console.log(dropDowncontent)
    var name = dropDowncontent.slice(0, -16 - plusIndex) + "ImgState";
    // var name = dropDowncontent - "Dropdown-content"
    // console.log(name)
    // document.getElementById(dropdown).classList.toggle("show");//arduinoDropdown
    document.getElementsByClassName(dropDowncontent)[0].classList.toggle("show");//arduinoDropdown
    var arrow = document.getElementById(name);
    if(document.getElementsByClassName(dropDowncontent)[0].classList.contains("show") == true){
        arrow.style.borderTop = "none";
        arrow.style.borderBottom = "12px solid rgb(0, 0, 0)";
    }
    else{
        arrow.style.borderTop = "12px solid rgb(0, 0, 0)";
        arrow.style.borderBottom = "none";
    }
}

function rollDiv(dropDowncontent) {
    document.getElementsByClassName(dropDowncontent)[0].classList.toggle("show");//arduinoDropdown
    // var arrow = document.getElementById(name);
    // if(document.getElementsByClassName(dropDowncontent)[0].classList.contains("show") == true){
    //     arrow.style.borderTop = "none";
    //     arrow.style.borderBottom = "12px solid rgb(0, 0, 0)";
    // }
    // else{
    //     arrow.style.borderTop = "12px solid rgb(0, 0, 0)";
    //     arrow.style.borderBottom = "none";
    // }
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
    return
    // if(!event.target.matches('.arduinoDropdown-button') && !event.target.matches('.htmlDropdown-button') && !event.target.matches('.unityDropdown-button') && !event.target.matches('.kaliLinuxDropdown-button') && !event.target.matches('.otherDropdown-button')){
    //     if(event.target.matches('#arduinoImgState') || event.target.matches('#htmlImgState') || event.target.matches('#kaliLinuxImgState') || event.target.matches('#otherImgState')){
    //         return;
    //     }
    //     else{
    //         close('arduinoDropdown-content');
    //         close('htmlDropdown-content');
    //         close('kaliLinuxDropdown-content');
    //         close('unityDropdown-content');
    //         close('otherDropdown-content');
    //     }
    // }
    // if (!event.target.matches('.arduinoDr')) { //ArduinoDr
    //     close('arduinoDropdown-content');
    // }
    // else if (!event.target.matches('.htmlDr')) { 
    //     close('htmlDropdown-content');
    // }
    // else if (!event.target.matches('.unityDr')) { 
    //     close('unityDropdown-content');
    // }
}

function close(Dropdown){
    var dropdowns = document.getElementsByClassName(Dropdown);
    var arrow = document.getElementById(getIdName(Dropdown));
    for (var i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
            openDropdown.classList.remove('show');
        }
    }
    arrow.style.borderTop = "12px solid rgb(0, 0, 0)";
    arrow.style.borderBottom = "none";
}

function getIdName(dropDowncontent){
    var name = dropDowncontent.slice(0, -16) + "ImgState";
    return name;
}