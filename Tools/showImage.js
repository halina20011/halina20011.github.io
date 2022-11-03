window.onclick = function(event){
    let existingImageContainer = document.getElementsByClassName("imageContainer");
    if(event.target.tagName == "IMG" && existingImageContainer.length == 0){
        let imageContainer = document.createElement("div");
        let image = document.createElement("img");
        imageContainer.className = "imageContainer";

        image.src = event.target.src;

        document.body.appendChild(imageContainer);
        imageContainer.appendChild(image);
    }
    else if(existingImageContainer.length != 0 && event.target != existingImageContainer[0]){
        window.open(event.target.src);
    }
    else if(existingImageContainer.length != 0 && event.target == existingImageContainer[0]){
        for(let i = existingImageContainer.length - 1; i >= 0; i--){
            document.body.removeChild(existingImageContainer[i]);
        }
    }
}