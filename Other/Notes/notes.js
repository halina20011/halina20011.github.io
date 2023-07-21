const noteHolder = document.querySelector(".noteHolder");
const input = document.querySelector(".inputText");

const clefMode = document.querySelector(".clefMode");

// let noteCounter = 0;
// const correctNotes = document.querySelector(".correctNotes");

clefMode.addEventListener("input", () => { prep(); }, false);
const octavesSelectors = [
    document.querySelector(".octave1"),
    document.querySelector(".octave2"),
    document.querySelector(".octave3"),
    document.querySelector(".octave4"),
    document.querySelector(".octave5"),
    document.querySelector(".octave6"),
];

const octavesSelectorsElements = octavesSelectors.map(c => c.parentElement);

Array.from(octavesSelectors).forEach(el => {
    el.addEventListener("change", () => { prep() }, false);
    el.checked = true;
});

const clefs = [
    document.querySelector(".fClef"),
    document.querySelector(".gClef"),
];

const notesImages = [];
let notes = [];
let availableNotes = [];
let note;

function createImage(originalAttributes, originalPath){
    const newSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    Array.from(originalAttributes).forEach(attribute => {
        newSvg.setAttribute(attribute.name, attribute.nodeValue);
    });

    newSvg.appendChild(originalPath);

    return newSvg;
}

async function getNotes(){
    const parseNotes = (svgText) => {
        const parser = new DOMParser();
        const svgFile = parser.parseFromString(svgText, "image/svg+xml");

        // copy the attributes
        const originalAttributes = svgFile.documentElement.attributes;

        const el = svgFile.documentElement;

        // const paths = el.querySelectorAll("path");
        let paths = [];
        const regex = new RegExp(/note*/);
        const notes = [];

        const down = el.querySelector("[*|label^=\"Down\"]");
        const downTransform = down.attributes["transform"];
        Array.from(down.children).forEach(el => {
            el.setAttribute(downTransform.name, downTransform.nodeValue);
        });

        const up = el.querySelector("[*|label^=\"Up\"]");
        const upTransform = down.attributes["transform"];
        Array.from(up.children).forEach(el => {
            el.setAttribute(upTransform.name, upTransform.nodeValue);
        });
        paths = [...down.querySelectorAll("path"), ...up.querySelectorAll("path")];

        Array.from(paths).forEach(path => {
            const labelAttrib = path.attributes["inkscape:label"];
            const label = (labelAttrib) ? labelAttrib.nodeValue : "";
            if(label.match(regex)){
                const num = label.replace(regex, "");
                notes[num] = createImage(originalAttributes, path);
            }
        });

        return notes;
    };  

    const response = await fetch("./Images/notes.svg");
    const t = await response.text();
    return parseNotes(t);
}

const sequenceChars = "cdefgah".split("");
function sequence(from, length){
    const res = [];
    const start = sequenceChars.indexOf(from);
    for(let i = 0; i < length; i++){
        res.push(sequenceChars[(i + start) % sequenceChars.length]);
    }

    return res;
}

Number.prototype.negative = function(){
    return (this == 0) ? 1 : 0;
}

// generate sequence from the first note of the selected clef
// make obj that has style of {index: [keyName, imgForTheNode]}
// then go throw octavesSelectors and remove the ones that are not available

Array.prototype.pushAll = function(array){
    array.forEach(el => this.push(el));
}

function prep(){
    notes = [];
    const selectedClef = parseInt(clefMode.value);
    clefs[selectedClef].classList.remove("hidden");
    clefs[selectedClef.negative()].classList.add("hidden");
    
    const start = (selectedClef === 0) ? "f" : "d";
    const n = sequence(start, 25);
    notes = n.map((noteName, i) => [noteName, notesImages[i]]);

    availableNotes = [];
    if(selectedClef == 0){
        for(let i = 0; i < 4; i++){
            octavesSelectorsElements[i].classList.remove("hidden");
        }
        for(let i = 4; i < 6; i++){
            octavesSelectorsElements[i].classList.add("hidden");
        }

        if(octavesSelectors[0].checked){
            availableNotes.pushAll(notes.slice(0, 4));
        }
        if(octavesSelectors[1].checked){
            availableNotes.pushAll(notes.slice(4, 11));
        }
        if(octavesSelectors[2].checked){
            availableNotes.pushAll(notes.slice(11, 18));
        }
        if(octavesSelectors[3].checked){
            availableNotes.pushAll(notes.slice(18, 25));
        }
    }
    else{
        for(let i = 2; i < 6; i++){
            octavesSelectorsElements[i].classList.remove("hidden");
        }
        for(let i = 0; i < 2; i++){
            octavesSelectorsElements[i].classList.add("hidden");
        }

        if(octavesSelectors[2].checked){
            availableNotes.pushAll(notes.slice(0, 6));
        }
        if(octavesSelectors[3].checked){
            availableNotes.pushAll(notes.slice(6, 13));
        }
        if(octavesSelectors[4].checked){
            availableNotes.pushAll(notes.slice(13, 20));
        }
        if(octavesSelectors[5].checked){
            availableNotes.pushAll(notes.slice(20, 27));
        }
    }

    Array.from(notesImages).forEach(n => {
        n.classList.add("hidden");
    });
    Array.from(availableNotes).forEach(([_, note]) => {note.classList.remove("hidden")});
    newNote();
}

// reques the image, parse it and append it
getNotes().then(notes => {
    const serializer = new XMLSerializer();
    Array.from(notes).forEach(note => {
        // console.log(note);
        const img = document.createElement("img");
        const dataUrl = `data:image/svg+xml;base64,` + btoa(serializer.serializeToString(note));
        img.src = dataUrl;
        img.className = "noteImage";
        noteHolder.appendChild(img);
        notesImages.push(img);
    });

    prep();
});

input.addEventListener("input", () => {
    if(input.value.toLowerCase() == note.toLowerCase()[0]){
        input.value = "";
        newNote();
        // correctNotes.innerHTML = ++noteCounter;
    }
}, false);

function newNote(){
    Array.from(availableNotes).forEach(([_, note]) => {note.classList.add("hidden")});
    const noteIndex = Math.floor(Math.random() * availableNotes.length);
    const _note = availableNotes[noteIndex][0];
    if(_note == note){
        newNote();
        return;
    }
    note = _note;
    availableNotes[noteIndex][1].classList.remove("hidden");
}
