var filename = "imagesBase64.json"

export class DOWNLOADER{
    constructor(canvas){
        this.canvas = canvas;
        this.imagesFile = {images: []}
        this.downloading = false;
    }

    makeTimelapse(_function, toChange, change, max){
        console.log(toChange);
        while(toChange < max){
            console.log(toChange);
            _function();
            toChange += change;
            this.addImage();
        }
        this.downloadAll();
    }

    downloadAll(){
        console.log(`Downloading ${this.imagesFile["images"].length} image/s.`)
        let stringJsonImagesFile = JSON.stringify(this.imagesFile);
        this.downloadFile(this.generateTextFileUrl(stringJsonImagesFile), filename);
        this.imagesFile.images = [];
    }
    
    addImage(){
        let dataURL = this.canvas.toDataURL("image/jpeg", 1.0);
        this.imagesFile.images.push(dataURL);
    }

    downloadImage(){
        let dataURL = this.canvas.toDataURL("image/jpeg", 1.0);
        let url = document.URL.split("/");
        let name = url[url.length - 1];
        name = name.split(".")[0];
        this.downloadFile(dataURL, `${name}_${Date.now()}.jpeg`);
    }
    
    generateTextFileUrl(txt) {
        let textFileUrl = null;
        let fileData = new Blob([txt], {type: 'text/plain'});
        if (textFileUrl !== null) {
            window.URL.revokeObjectURL(textFile);
        }
        textFileUrl = window.URL.createObjectURL(fileData);
        return textFileUrl;
    };
    
    downloadFile(data, filename = 'untitled.jpeg') {
        var a = document.createElement('a');
        a.href = data;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
    }
}
