var c = 0

// console.log(screen.width)
// console.log(screen.height)

// console.log(window.location.href)

// console.log(window.innerWidth)
// console.log(window.innerHeight)

// var x = screen.width / 2;
// document.getElementById('square').style.width = x;

function myFunction(){
    // console.log("sum")
    var a = document.getElementById('lname').value
    document.getElementById('lname').value = ""
    console.log(a)
};

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function changeC(){
    // document.getElementById("btn").style.color = "#ccccff";
    // document.getElementById("btn").style.color = "#ccccff";
    var r = Math.floor(Math.random() * 255) + 1
    var g = Math.floor(Math.random() * 255) + 1
    var b = Math.floor(Math.random() * 255) + 1
    document.getElementById("btn").style.background = rgbToHex(r, g, b);
};

function confirmFunction(){
    var txt;
    if (confirm("Press a button!")) {
        txt = "You pressed OK!";
    }     else {
        txt = "You pressed Cancel!";
    }
    console.log(txt)
}