export function showCopyText(copyTextElement){
    copyTextElement.style.display = "block";
    copyTextElement.style.animation = "showAnimation 2s linear";
    setTimeout(() => {
        copyTextElement.style.display = "none";
    }, 2000);
}

export function copyTextToClipboard(text, copyTextElement){
    navigator.clipboard.writeText(text);
    showCopyText(copyTextElement);
}

export function download(link){
    const element = document.createElement("a");
    element.setAttribute("href", link);

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();
    document.body.removeChild(element);
}

export function downloadText(name, text){
    let textFileUrl = null;
    const fileData = new Blob([text], {type: "text/plain"});
    if(textFileUrl !== null){
        window.URL.revokeObjectURL(textFile);
    }
    textFileUrl = window.URL.createObjectURL(fileData);

    const temp = document.createElement("a");

    temp.href = textFileUrl;
    temp.download = name;
    document.body.appendChild(temp);

    temp.click();

    temp.remove();
}
