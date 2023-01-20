let codeLink = document.getElementById("codeLink");

function getCodeLink(){
    let filePath = document.location.pathname;
    console.log(filePath);
    filePath = (filePath != "/") ? filePath : "/index.html";
    codeLink.href = `https://github.com/halina20011/halina20011.github.io/blob/main${filePath}`;
}

getCodeLink();
