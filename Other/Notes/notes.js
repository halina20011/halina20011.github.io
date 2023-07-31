import func from "../../Tools/func.js"

const noteHolder = document.querySelector(".noteHolder");
const input = document.querySelector(".inputText");

const clefMode = document.querySelector(".clefMode");

const analysisHolder = document.querySelector(".analysisHolder");

const showAnalysis = document.querySelector(".showAnalysis");
showAnalysis.oninput = () => {
    analysisHolder.classList.toggle("hidden");
}
if(showAnalysis.checked){
    analysisHolder.classList.remove("hidden");
}
else{
    analysisHolder.classList.add("hidden");
}

const analysisHeight = document.querySelector(".analysisHeight");
const analysis = document.querySelector(".analysis");

const chooseInOrder = document.querySelector(".chooseInOrder");

const notesAnalysis = {};
let maxNoteSize = 0;

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
function sequence(fromNote, fromOctave, length){
    const res = [];
    const start = sequenceChars.indexOf(fromNote);
    for(let i = 0; i < length; i++){
        const noteName = sequenceChars[(i + start) % sequenceChars.length];
        const noteOctave = Math.floor((i + start) / sequenceChars.length) + fromOctave;
        const note = `${noteName}${noteOctave}`;
        res.push(note);
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
    
    const [startNote, startOctave] = (selectedClef === 0) ? ["f", 1] : ["d", 3];
    const n = sequence(startNote, startOctave, 25);
    notes = n.map((noteName, i) => [noteName, notesImages[i]]);

    Array.from(notesImages).forEach(n => {
        n.classList.add("hidden");
    });

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

    if(availableNotes.length == 0){
        return;
    }

    maxNoteSize = 0;

    Object.keys(notesAnalysis).forEach(noteName => {
        notesAnalysis[noteName].remove(); 
        delete(notesAnalysis[noteName]);
    });
    analysisHeight.className = "analysisHeight";
    availableNotes.forEach(note => { 
        notesAnalysis[note[0]] = new Note(note[1], note[0]);
    });

    Array.from(analysisHeight.children).forEach(line => line.remove());

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

class Note{
    constructor(noteImage, name){
        this.name = name;
        this.noteImage = noteImage;
        this.correct = 0;
        this.incorrect = 0;
        this.elemen = document.createElement("div");
        this.correctElement = func.createElement(`<div class="correct"></div>`);
        this.incorrectElement = func.createElement(`<div class="incorrect"></div>`);
        this.nameElement = func.createElement(`<div class="name">${this.name}</div>`);
        this.count = func.createElement(`<p class="count"></p>`);
        this.elemen.appendChild(this.count);
        this.correctElement.appendChild(this.incorrectElement);
        this.elemen.appendAllChildren([this.correctElement, this.nameElement]);
        analysis.appendChild(this.elemen);
    }

    updateValue(good, wrong){
        this.correct += good;
        this.incorrect += wrong;
        this.count.innerHTML = this.correct;
        if(maxNoteSize < this.correct){
            maxNoteSize = this.correct;
            if(maxNoteSize == 1){
                analysisHeight.appendChild(func.createElement("<div></div>"));
            }
            analysisHeight.appendChild(func.createElement("<div></div>"));
        }
        if(maxNoteSize == 10){
            analysisHeight.classList.add("hideEverySecond");
        }
        maxNoteSize = Math.max(this.correct, maxNoteSize);
    }

    update(){
        if(maxNoteSize == 0){
            return;
        }
        const heightCorrect = this.correct/maxNoteSize * 100;
        const heightIncorrect = Math.min(100, this.incorrect/this.correct * 100);
        if(!isNaN(heightIncorrect)){
            this.correctElement.style.height = `${heightCorrect}%`;
        }
        if(!isNaN(heightIncorrect)){
            this.incorrectElement.style.height = `${heightIncorrect}%`;
        }
    }
    
    remove(){
        this.elemen.remove();
    }
}

function find(array, firstValue){
    let left = 0, right = array.length - 1;
    while(left < right){
        const m = left + Math.floor((right - left) / 2);
        if(array[m] < firstValue){
            left = m + 1;
        }
        else{
            right = m;
        }
    }

    if(array[left] != firstValue){
        return -1;
    }

    return left;
}

function newNote(){
    Array.from(availableNotes).forEach(([_, note]) => {note.classList.add("hidden")});
    if(chooseInOrder.checked){
        // convert and sort the array so the notes with less correct number will be first
        // => [[0, "c4", img], [0, "d4", img], [1, "h3", img], ...]
        const notesAnalysisArray = Object.keys(notesAnalysis)
            .map(key => {return [notesAnalysis[key].correct, notesAnalysis[key].name, notesAnalysis[key].noteImage]})
            .sort((a, b) => a[0] - b[0]);
        // console.log(notesAnalysisArray);
        // find first occurrence that has bigger correct value then the first item
        const end = find(notesAnalysisArray.map(_note => _note[0]), notesAnalysisArray[0][0] + 1);
        let _note = notesAnalysisArray[0];
        if(end != -1){
            const noteIndex = Math.floor(Math.random() * end);
            _note = notesAnalysisArray[noteIndex];
        }
        else{
            const noteIndex = Math.floor(Math.random() * notesAnalysisArray.length);
            _note = notesAnalysisArray[noteIndex];
        }
        _note[2].classList.remove("hidden");
        note = _note[1];
    }
    else{
        const noteIndex = Math.floor(Math.random() * availableNotes.length);
        const _note = availableNotes[noteIndex];
        if(_note[0] == note){
            newNote();
            return;
        }
        _note[1].classList.remove("hidden");
        note = _note[0];
    }
}

let prevInput = "";

input.addEventListener("input", () => {
    const thisInput = input.value.toLowerCase();
    input.value = "";
    if(thisInput == note.toLowerCase()[0]){
        notesAnalysis[note].updateValue(1, 0);
        newNote();
    }
    else if(prevInput.length < thisInput.length){
        notesAnalysis[note].updateValue(0, 1);
    }
    Object.keys(notesAnalysis).forEach(key => notesAnalysis[key].update());
    prevInput = (input.value == "") ? "" : thisInput;
}, false);
