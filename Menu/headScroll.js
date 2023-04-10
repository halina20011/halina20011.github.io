let columnUp = document.getElementById("columnUp");
let contentTable = document.getElementById("pageContentContainer");

window.addEventListener('scroll', () => { scroll(); }, false);

let newValue = 0;
let oldValue = 0;

let height = 36;

function scroll(){
    newValue = window.pageYOffset;
    if(oldValue > newValue){
        moveHead("Up");
    }
    else{
        moveHead("Down");
    }
    oldValue = newValue;
}

function moveHead(direction){
    if(direction == "Down"){ 
        columnUp.style.top = `-${height}px`;
        if(contentTable){ // If contentTable is in document then move it too
            contentTable.style.top = `${height}px`;
        }
    } 
    else if(direction == "Up"){
        columnUp.style.top = "0px"; 
        if(contentTable){
            contentTable.style.top = `${height * 2}px`;
            
        } 
    }
}