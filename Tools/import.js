export function importFile(url, fallback){
    console.log(url);
    if(window.fetch){
        fetch(url)
            .then(response => response.text())
            .then(data => { fallback(data); });
    }
    else{
        let xhr = new XMLHttpRequest();
        
        xhr.open("GET", url, true);

        xhr.onload = () => {
            if(xhr.status == 200){
                fallback(xhr.responseText);
            }
            else{
                console.error(`Request to ${url} failed with status ${xhr.status}`);
            }
        }

        xhr.onerror = () => {
            console.error("Request to ${url} failed");
        }

        xhr.send();
    }
}

export function getText(url){
    let xmlhttp;
    let send = false;

    if(window.XMLHttpRequest){
        xmlhttp = new XMLHttpRequest();
    } 
    else{
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    
    xmlhttp.onreadystatechange = function(){
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
            send = true;
        }
    }
    
    xmlhttp.open("GET", url, false);
    xmlhttp.send();
    let t = xmlhttp.responseText;
    if(send == true){
        return t;
    }
}

export function createLink(path, parent){
    let sheet = document.createElement("link");
    sheet.rel = "stylesheet";
    sheet.type = "text/css";
    sheet.href = path;
    parent.appendChild(sheet);
}

export function createScript(path, parent, mode = null){
    let script = document.createElement("script");
    script.type = (mode != null) ? mode : "text/javascript";
    script.src = path;
    parent.appendChild(script);
}

export function loadJSON(url){
    let xmlhttp;
    let send = false;

    if(window.XMLHttpRequest){
        xmlhttp = new XMLHttpRequest();
    } 
    else{
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xmlhttp.onreadystatechange = function(){
        if(xmlhttp.readyState == 4 && xmlhttp.status === 200){
            send = true;
        }
    };

    xmlhttp.open("GET", url, false);
    xmlhttp.send();
    let t = JSON.parse(xmlhttp.responseText);
    if(send == true){
        return t;
    }
}
// console.log(getText("http://127.0.0.1:5500/Codes/ArduinoBlinkLed.txt"));
