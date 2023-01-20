export function getText(url){
    var xmlhttp;
    var send = false;
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            send = true;
        }
    }
    
    xmlhttp.open("GET", url, false);
    xmlhttp.send();
    var t = xmlhttp.responseText;
    if(send == true){
        return t;
    }
}

export function createLink(path, parent){
    var sheet = document.createElement("link");
    sheet.rel = "stylesheet";
    sheet.type = "text/css";
    sheet.href = path;
    parent.appendChild(sheet);
}

export function createScript(path, parent){
    let script = document.createElement("script");
    script.type = "text/javascript";
    script.src = path;
    parent.appendChild(script);
}

export function loadJSON(url) {
    var xmlhttp;
    var send = false;

    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xmlhttp.onreadystatechange = function(){
        if (xmlhttp.readyState == 4 && xmlhttp.status === 200) {
            send = true;
        }
    };

    xmlhttp.open("GET", url, false);
    xmlhttp.send();
    var t = JSON.parse(xmlhttp.responseText);
    if(send == true){
        return t;
    }
}
// console.log(getText("http://127.0.0.1:5500/Codes/ArduinoBlinkLed.txt"));
