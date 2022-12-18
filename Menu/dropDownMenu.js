function roll(thisEl, dropdowncontentId, event = 'show'){
    let dropdown = document.getElementById(dropdowncontentId);
    dropdown.classList.toggle(event);
    
    let state = dropdown.classList.contains(event);
    // console.log(state);

    if(state == true){
        thisEl.classList.remove("closed");
        thisEl.classList.add("opened");
    }
    else{
        thisEl.classList.remove("opened");
        thisEl.classList.add("closed");
    }
}

function rollDiv(dropDowncontent) {
    document.getElementsByClassName(dropDowncontent)[0].classList.toggle("show"); //arduinoDropdown
}