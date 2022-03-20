const inputImage = document.getElementById('inputImage');
// let c = document.getElementById('canvas');
// let img1 = new Image();
// img1.onload = function () {
//   document.getElementById("image1").remove();
//   w = img1.width;
//   h = img1.height;
//   c.width = w;
//   c.height = h;
//   ctx = c.getContext('2d');
//   ctx.drawImage(img1, 0, 0);
//   //continue the image processing
// };
// img1.src = document.getElementById("image1").src;

inputImage.addEventListener("change", handleFiles, false);

function readImageFile(file) {
    var reader = new FileReader(); // CREATE AN NEW INSTANCE.

    reader.onload = function (e) {
        var img = new Image();      
        img.src = e.target.result;

        img.onload = function () {
            var w = this.width;
            var h = this.height;
            
        }
    };
}
function handleFiles() {
    // console.log(inputImage.value);
    // console.log(inputImage.files);
    
    const reader = new FileReader()
    console.log(reader);
    reader.onload = function () {
        const img = new Image()
        img.style.width = '50%';
        img.style.height = '50%';
        readImageFile(img); 
        img.onload = function () {
            imageWidth = img.width;
            imageHeight = img.height;
            console.log(imageWidth, imageHeight)

            // const canvas = document.createElement('canvas')
            const canvas = document.getElementById('canvas')

            const MAX_WIDTH = 400;
            const scaleSize = MAX_WIDTH / img.width;
            canvas.width = MAX_WIDTH;
            canvas.height = img.height * scaleSize;

            const context = canvas.getContext('2d')
            context.drawImage(img, 0, 0, canvas.width, canvas.height)

            const imageData = context.getImageData(0,0, canvas.width, canvas.height)
            console.log(imageData)
            var data = imageData.data
            
            // data = rgbToAvg(data);

            for(var i = 0; i <= data.length; i += 4){
                var r = data[i];
                var g = data[i + 1];
                var b = data[i + 2];
                var a = data[i + 3];
                if(r == 29 && g == 4 && b == 176){
                    // console.log("mjhg");
                    data[i + 3] = 0;
                }
                if(i < 10){
                    console.log("R", r)
                    console.log("G", g)
                    console.log("B", b)
                    console.log("A", a)
                }
            }

            
            context.putImageData(imageData, 0, 0)
            // document.body.appendChild(canvas)
            // canvas.toDataURL()
        }
        img.src = reader.result
        // document.body.appendChild(img)
    }
    // reader.readAsText(inputImage.files[0])
    reader.readAsDataURL(inputImage.files[0])
}

function rgbToAvg(Data){
    for(var i = 0; i<= Data.length; i += 4){
        const avg = (Data[i] + Data[i + 1] + Data[i + 2]) / 3
        Data[i] = avg
        Data[i + 1] = avg
        Data[i + 2] = avg
    }
    return Data;
}