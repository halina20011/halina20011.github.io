export function getUrl(window){
    let currentUrl = window.location.href;
    let url = currentUrl.split("/");
    for(let i = 0; i < url.length; i++){
        if(url[i] == ''){
            url.splice(i, 1);
        }
    }

    return url;
}

export function getCurrentHtmlFileName(window){
    let url = getUrl(window);

    let htmlName = url[url.length - 1];
    htmlName = htmlName.split("#")[0];
    htmlName = htmlName.replace(".html", "");

    return htmlName;
}

export function split(text){
    return [...text]; // Or text.split('')
}

export function getListOfLines(filePath){
    let textFromFile = getText(filePath);
    let listOfLines = textFromFile.split("\n");

    for(let i = 0; i < listOfLines.length; i++){
        listOfLines[i] = listOfLines[i].replace("\r", "");
    }

    return listOfLines
}

export function getMultitplyOfTen(number){
    if(number == 0){
        return 1;
    }
    return Math.floor(Math.log10(number) + 1);
}


export function calculateNumberOfSpaces(number, max){
    let spacesToAdd = 0;
    let numberPower = getMultitplyOfTen(number, 1);
    let numberMaxPower = getMultitplyOfTen(max, 1);
    spacesToAdd = numberMaxPower - numberPower;
    return spacesToAdd;
}

