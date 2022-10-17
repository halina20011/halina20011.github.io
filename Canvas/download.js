var filename = "imagesBase64.json"

export class DOWNLOADER{
    constructor(canvas){
        this.canvas = canvas;
        this.imagesFile = {images: []}
        this.downloading = false;
    }

    timelapse(timelapseInputData, f){
        this.addTimelapseElement(timelapseInputData, f);
    }

    makeInput(data){
        // let j = {
        //     "id": "id",
        //     'class': "class",
        //     "from": 0,
        //     "to": 1,
        //     "value": 0
        // }
        let dataObj = Object.keys(data);
        console.log(data);
        let input = document.createElement("input");
        input.type = "number";

        if(dataObj.indexOf("id") > -1){
            input.id = `${data['id']}`;
        }
        if(dataObj.indexOf("class") > -1){
            input.className = `${data['class']}`;
        }
        if(dataObj.indexOf("from") > -1){
            input.min = `${data['from']}`;
        }
        if(dataObj.indexOf("to") > -1){
            input.max = `${data['to']}`;
        }
        if(dataObj.indexOf("value") > -1){
            input.value = `${data['value']}`;
        }

        return input;
    }

    addTimelapseElement(inputData, f){
        // <div class="timelapse" id="timelapse">
        //     <div class="settingSameLine">
        //         <p>Iterations: </p>
        //         <input id="timelapseIterationsFrom" type="number" min="0" value="0"></input>
        //         <input id="timelapseIterationsTo" type="number" min="1" value="1"></input>
        //     </div>
        //     <div class="timelapseButtons">
        //         <div></div>
        //         <div>
        //             <button class="cancleTimelapse" id="cancleTimelapse">Cancle</button>
        //             <button class="runTimelapse" id="runTimelapse">Run timelapse</button>
        //         </div>
        //     </div>
        // </div>
        let timelapse = document.createElement("div");
        timelapse.className = "timelapse";
        timelapse.id = "timelapse";

        document.body.appendChild(timelapse);
        
        // Setting
        let setting = document.createElement("div");
        setting.className = "settingSameLine";

        let text = document.createElement("p");
        text.innerHTML = inputData["text"];
        let from = this.makeInput(inputData["inputFrom"]);
        let to = this.makeInput(inputData["inputTo"]);

        timelapse.appendChild(setting);
        setting.appendChild(text);
        setting.appendChild(from);
        setting.appendChild(to);
        
        // Buttons
        let timelapseButtons = document.createElement("div");
        timelapseButtons.className = "timelapseButtons";
        
        let cancleTimelapse = document.createElement("button");
        cancleTimelapse.className = "cancleTimelapse";
        cancleTimelapse.id = "cancleTimelapse";
        cancleTimelapse.innerHTML = "Cancle";
        cancleTimelapse.addEventListener("click", () => { timelapse.style.display = "none"}, false);
        
        let runTimelapse = document.createElement("button");
        runTimelapse.className = "runTimelapse";
        runTimelapse.id = "runTimelapse";
        runTimelapse.innerHTML = "Run timelapse";

        runTimelapse.addEventListener("click", () => {
            timelapse.style.setProperty("display", "none");
            let fromV = parseInt(from.value, 10);
            let toV = parseInt(to.value, 10);
            if(fromV * 0 == 0 && toV * 0 == 0){
                // timelapsee(from, to);
                f(fromV, toV);
            }
        }, false);

        timelapse.appendChild(timelapseButtons);
        timelapseButtons.appendChild(document.createElement("div"));
        timelapseButtons.appendChild(cancleTimelapse);
        timelapseButtons.appendChild(runTimelapse);
        
        // <button class="timelapseButton" id="timelapseButton"></button>
        let timelapseButton = document.createElement("button");
        timelapseButton.className = "timelapseButton";
        timelapseButton.id = "timelapseButton";
        timelapseButton.addEventListener("click", () => { timelapse.style.display = "block"; console.log("Clicked")}, false);
        document.getElementById("canvasButtons").appendChild(timelapseButton);
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
