function downloadFile(name){
    getFullFileUrl(name);
}

function download(link){
    var element = document.createElement('a');
    element.setAttribute('href', link);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();
    document.body.removeChild(element);
}

function copyTextFromFile(name){
    var textFromFile = getText(getFullFileUrl(""));
    console.log("l[kpjiohfy")
    showCopyText();
}

function showCopyText(){
    var parent = document.getElementById('copyText');
    parent.style.display = 'block';
    parent.style.animation = 'showAnimation 2s linear'
    setTimeout(function() {
        parent.style.display = 'none';
    }, 2000)
}