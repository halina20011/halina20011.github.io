const a96 = document.getElementById('a96'); //`
const a1 = document.getElementById('a1'); //1
const a2 = document.getElementById('a2'); //2
const a3 = document.getElementById('a3'); //3
const a4 = document.getElementById('a4'); //4
const a5 = document.getElementById('a5'); //5
const a6 = document.getElementById('a6'); //6
const a7 = document.getElementById('a7'); //7
const a8 = document.getElementById('a8'); //8
const a9 = document.getElementById('a9'); //9
const a0 = document.getElementById('a0'); //0
const a45 = document.getElementById('a45'); //-
const a61 = document.getElementById('a61'); //=
const backspace = document.getElementById('Backspace'); //Backspace

const tab = document.getElementById('Tab'); //Tab
const q = document.getElementById('Q'); //Q
const w = document.getElementById('W'); //W
const e = document.getElementById('E'); //E
const r = document.getElementById('R'); //R
const t = document.getElementById('T'); //T
const y = document.getElementById('Y'); //Y
const u = document.getElementById('U'); //U
const i = document.getElementById('I'); //I
const o = document.getElementById('O'); //O
const p = document.getElementById('P'); //P
const a91 = document.getElementById('a91'); //[
const a93 = document.getElementById('a93'); //]
const a92 = document.getElementById('a92'); //\

const capsLock = document.getElementById('capsLock'); //CapsLock
const a = document.getElementById('A'); //A
const s = document.getElementById('S'); //S
const d = document.getElementById('D'); //D
const f = document.getElementById('F'); //F
const g = document.getElementById('G'); //G
const h = document.getElementById('H'); //H
const j = document.getElementById('J'); //J
const k = document.getElementById('K'); //K
const l = document.getElementById('L'); //L
const a59 = document.getElementById('a59'); //;
const a39 = document.getElementById('a39'); //'
const enter = document.getElementById('Enter'); //Enter

const shift = document.getElementById('Shift'); //Shift
const z = document.getElementById('Z'); //Z
const x = document.getElementById('X'); //X
const c = document.getElementById('C'); //C
const v = document.getElementById('V'); //V
const b = document.getElementById('B'); //B
const n = document.getElementById('N'); //N
const m = document.getElementById('M'); //M
const a44 = document.getElementById('a44'); //,
const a46 = document.getElementById('a46'); //.
const a47 = document.getElementById('a47'); ///
const shift2 = document.getElementById('Shift2'); //Shift

const ctrl = document.getElementById('Ctrl'); //Ctrl
const space = document.getElementById('Space'); //Space
// const space = document.getElementById('Space'); //Alt
const ctrl2 = document.getElementById('Ctrl2'); //Ctrl2

var borderValue = "2.5px solid rgb(0, 0, 255)";

// a96.addEventListener("click", onClickBorder(a96));
a96.addEventListener("click", function() {onClickBorder(a96);} , false);
a1.addEventListener("click", function() {onClickBorder(a1);} , false);
a2.addEventListener("click", function() {onClickBorder(a2);} , false);
a3.addEventListener("click", function() {onClickBorder(a3);} , false);
a4.addEventListener("click", function() {onClickBorder(a4);} , false);
a5.addEventListener("click", function() {onClickBorder(a5);} , false);
a6.addEventListener("click", function() {onClickBorder(a6);} , false);
a7.addEventListener("click", function() {onClickBorder(a7);} , false);
a8.addEventListener("click", function() {onClickBorder(a8);} , false);
a9.addEventListener("click", function() {onClickBorder(a9);} , false);
a0.addEventListener("click", function() {onClickBorder(a0);} , false);
a45.addEventListener("click", function() {onClickBorder(a45);} , false);
a61.addEventListener("click", function() {onClickBorder(a61);} , false);
backspace.addEventListener("click", function() {onClickBorder(backspace);} , false);

tab.addEventListener("click", function() {onClickBorder(tab);} , false);
q.addEventListener("click", function() {onClickBorder(q);} , false);
w.addEventListener("click", function() {onClickBorder(w);} , false);
e.addEventListener("click", function() {onClickBorder(e);} , false);
r.addEventListener("click", function() {onClickBorder(r);} , false);
t.addEventListener("click", function() {onClickBorder(t);} , false);
y.addEventListener("click", function() {onClickBorder(y);} , false);
u.addEventListener("click", function() {onClickBorder(u);} , false);
i.addEventListener("click", function() {onClickBorder(i);} , false);
o.addEventListener("click", function() {onClickBorder(o);} , false);
p.addEventListener("click", function() {onClickBorder(p);} , false);
a91.addEventListener("click", function() {onClickBorder(a91);} , false);
a93.addEventListener("click", function() {onClickBorder(a93);} , false);
a92.addEventListener("click", function() {onClickBorder(a92);} , false);

capsLock.addEventListener("click", function() {onClickBorder(capsLock);} , false);
a.addEventListener("click", function() {onClickBorder(a);}, false);
s.addEventListener("click", function() {onClickBorder(s);} , false);
d.addEventListener("click", function() {onClickBorder(d);} , false);
f.addEventListener("click", function() {onClickBorder(f);} , false);
g.addEventListener("click", function() {onClickBorder(g);} , false);
h.addEventListener("click", function() {onClickBorder(h);} , false);
j.addEventListener("click", function() {onClickBorder(j);} , false);
k.addEventListener("click", function() {onClickBorder(k);} , false);
l.addEventListener("click", function() {onClickBorder(l);} , false);
a59.addEventListener("click", function() {onClickBorder(a59);} , false);
a39.addEventListener("click", function() {onClickBorder(a39);} , false);
enter.addEventListener("click", function() {onClickBorder(enter);}, false);

shift.addEventListener("click", function() {onClickBorder(shift);}, false);
z.addEventListener("click", function() {onClickBorder(z);}, false);
x.addEventListener("click", function() {onClickBorder(x);}, false);
c.addEventListener("click", function() {onClickBorder(c);}, false);
v.addEventListener("click", function() {onClickBorder(v);}, false);
b.addEventListener("click", function() {onClickBorder(b);}, false);
n.addEventListener("click", function() {onClickBorder(n);}, false);
m.addEventListener("click", function() {onClickBorder(m);}, false);
a44.addEventListener("click", function() {onClickBorder(a44);}, false);
a46.addEventListener("click", function() {onClickBorder(a46);}, false);
a47.addEventListener("click", function() {onClickBorder(a47);}, false);
shift2.addEventListener("click", function() {onClickBorder(shift2);}, false);

space.addEventListener("click", function() {onClickBorder(space);}, false);

var list = [a96, a1, a2, a3, a4, a5, a6, a7, a8, a9, a0, a45, a61, backspace,
            tab, q, w, e, r, t, y, u, i, o, p, a91, a93, a92,
            capsLock, a, s, d, f, g, h, j, k, l, a59, a39, enter,
            shift, z, x, c, v, b, n, m, a44, a46, a47, shift2, 
            space];

var listLetters = ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Backspace", 
                "Tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\",
                "Caps Lock", "A", "S", "D", "F", "G", "H","J", "K", "L", ":", "'" , "Enter", 
                "Shift", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "Shift",
                " "];


export default function getLetters(text) {
    var re = [];
    for(var int = 0; int < list.length; int++){
        if(list[int].style.border == borderValue){
            re.push(listLetters[int].toLocaleLowerCase());
        }
    }
    // console.log(re)
    return re;
}

export function setText(List){
    for(var nu = 0; nu < List.length; nu++){
        var key = List[nu]; //Get
        for(var int = 0; int < listLetters.length; int++){
            if(key == listLetters[int].toLocaleLowerCase()){
                border(list[int])
            }
        }
    }
    // return 0;
}

function onClickBorder(object){
    if(object.style.border != borderValue){
        border(object);
    }
    else{
        object.style.borderStyle = "none";
    }
}

function border(object){
    object.style.border = borderValue;
    object.style.borderRadius  = "2px";
}