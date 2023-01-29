let codeLink = document.getElementById("codeLink");

let jsFileVersion = ["/Canvas/"];

function getCodeLink(){
    let filePath = document.location.pathname;
    // console.log(document.location);
    
    filePath = (filePath != "/") ? filePath : "/index.html";

    if(-1 < filePath.search("/Canvas/")){
        let urls = filePath.split("/");
        // console.log(urls);

        for(let i = 0; i < urls.length; i++){
            if(urls[i] == ''){
                urls.splice(i, 1);
            }
        }
        
        let absPath = "";
        let htmlFileName = "";

        for(let i = 0; i < urls.length; i++){
            if(i != (urls.length - 1)){
                absPath += `/${urls[i]}`;
            }
            else{
                htmlFileName = urls[i];
            }
        }

        // console.log(`Path ${absPath} ${htmlFileName}`);
        // console.log(htmlFileName);

        fileName = htmlFileName.split(".")[0];

        codeLink.href = `https://github.com/halina20011/halina20011.github.io/blob/main${absPath}/${fileName}.js`;
    }
    else{
        codeLink.href = `https://github.com/halina20011/halina20011.github.io/blob/main${filePath}`;
    }
}

getCodeLink();
