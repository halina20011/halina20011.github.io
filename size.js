// window.addEventListener('resize', function(event) {resize(event);}, false)
function resize(event = ""){
    // console.log(event.innerWidth);
    // console.log(event.innerHeight);
    console.log("Width  :", window.innerWidth);
    console.log("Height :", window.innerHeight);
    // console.log("Width", event.target.innerWidth);
    // console.log("Hight", event.target.innerHeight);
    // resizeInfoText();
}
resize();

function resizeInfoText(){
    var menuHead = document.getElementsByClassName("menuHead")[0];
    var text = document.getElementsByClassName("textInfo")[0];
    var button = document.getElementById("extend-reduceButton");
    var menuWidth = menuHead.getBoundingClientRect().width;
    var widthB = button.getBoundingClientRect().width;
    var widthT = text.getBoundingClientRect().width;
    // console.log(menuWidth, widthB, widthT);
    var value = menuWidth - widthB;
    // text.style.width = +value+'px';
}

// const wCT = document.getElementById('copyText');
// console.log(document.getElementById('copyText').getBoundingClientRect().width)
// codeText();
function codeText(){
    // window.innerWidth;
    wCT.style.width = "100px"
    console.log(wCT.style.width);
}