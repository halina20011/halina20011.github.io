const AlphabetSize = 122;

class Node{
    constructor(){
        this.children = new Array(AlphabetSize).fill(undefined);
        this.data = undefined;
    }
}

export class Trie{
    constructor(){
        this.head = new Node();
    }
    
    addWords(words){
        Object.keys(words).forEach(word => this.add(word, words[word]));
    }

    add(word, data){
        // [NULL, NULL, [NULL, NULL, [NULL, NULL, NULL]]]
        // get array of letters of this level
        let node = this.head;
        for(let i = 0; i < word.length; i++){
            const char = word.charCodeAt(i);
            // console.log(char);
            // if we use index and its undefined we have to create another Trie for the letter
            if(node.children[char] == undefined){
                node.children[char] = new Node();
            }
            node = node.children[char];
        }
        // console.log(node);
        node.data = data;
    }

    search(word){
        let node = this.head;
        for(let i = 0; i < word.length; i++){
            const index = word[i].charCodeAt(0); 
            node = node.children[index];
            if(node == undefined){
                return undefined;
            }
        }
        
        return node.data;
    }
}

Node.prototype.toString = function(){
    let letters = "";
    for(let i = 0; i < AlphabetSize; i++){
        if(this.children[i] != undefined){
            letters += `${String.fromCharCode(i)} `;
        }
    }

    return letters;
}

Trie.prototype.toString = function(){
    return this.head.toString();
}

// const words = {"abc": 10, "Uhhhh": "123", "UwU":"lol"};
// const keywords = new Trie();
// // console.log(keywords.toString());
// keywords.addWords(words);
// console.log(keywords.toString());
// console.log("data: " , keywords.search("UwU"));
// console.log("data: " , keywords.search("Uwu"));
