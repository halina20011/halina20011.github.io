var filename = "imagesBase64.json"

export class DOWNLOADER{
    constructor(canvas){
        this.canvas = canvas;
        this.imagesFile = {images: []}
        this.downloading = false;
    }

    timelapse(timelapseInputData){
        this.addTimelapseElement(timelapseInputData);
    }

    makeElement(parent, data){
        // let j = {
        //     "element": input
        //     "id": "id",
        //     'class': "class",
        //     'type': number,
        //     "from": 0,
        //     "to": 1,
        //     "value": 0
        // }
        // console.log(data);
        let dataObj = Object.keys(data);
        let element;
        let type;
        // console.log(dataObj);
        if(dataObj.indexOf("element") > -1){
            type = data['element'];
            element = document.createElement(type);
        }

        if(dataObj.indexOf("type") > -1){
            element.type = data["type"];
        }

        if(dataObj.indexOf("id") > -1){
            element.id = `${data['id']}`;
        }
        if(dataObj.indexOf("class") > -1){
            element.className = `${data['class']}`;
        }

        if(dataObj.indexOf("innerHTML") > -1){
            element.innerHTML = `${data['innerHTML']}`;
        }
        if(dataObj.indexOf("from") > -1){
            element.min = `${data['from']}`;
        }
        if(dataObj.indexOf("to") > -1){
            element.max = `${data['to']}`;
        }
        if(dataObj.indexOf("value") > -1){
            element.value = `${data['value']}`;
        }
        parent.appendChild(element);
        return [type, element];
    }

    addTimelapseElement(inputData){
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
        let f = inputData["function"];

        let timelapse = document.createElement("div");
        timelapse.className = "timelapse";
        timelapse.id = "timelapse";
        
        document.body.appendChild(timelapse);
        
        // Setting
        let _arguments = inputData["arguments"];
        let fArguments = [];
        _arguments.forEach(__argument => {
            let setting = document.createElement("div");
            setting.className = "settingSameLine";
            timelapse.appendChild(setting);

            let elementToMake = Object.keys(__argument);
            // console.log(elementToMake);
            elementToMake.forEach(elementName => {
                // console.log(elementName);
                let type, element;
                [type, element] = this.makeElement(setting, __argument[elementName]);
                if(type == "input"){
                    fArguments.push(element);
                }
            });
        })
        
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
            f(fArguments);
        }, false);

        timelapse.appendChild(timelapseButtons);
        timelapseButtons.appendChild(document.createElement("div"));
        timelapseButtons.appendChild(cancleTimelapse);
        timelapseButtons.appendChild(runTimelapse);
        
        // <button class="timelapseButton" id="timelapseButton"></button>
        let timelapseButton = document.createElement("button");
        timelapseButton.className = "timelapseButton";
        timelapseButton.id = "timelapseButton";
        timelapseButton.addEventListener("click", () => { timelapse.style.display = "block"; console.log("Clicked");}, false);
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
