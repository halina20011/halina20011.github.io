class WindowSelector{
    constructor(parent, updateFunc){
        this.activeWindow = 0;
        this.parent = document.querySelector(parent);
        this.parent.classList.add("windowSelectors");
    
        this.children = this.parent.children;
        this.windows = Array.from(this.children).map(element => {
            const window = document.querySelector(`.${element.className}Window`);
            window.classList.add("windowWindows");
            window.classList.add("hidden");
            return window;
        });

        for(let i = this.children.length - 1; i >= 0; i--){
            this.children[i].$("click", () => {
                // console.log(this.children[i], i);
                this.windows[this.activeWindow].classList.add("hidden");
                this.children[this.activeWindow].classList.remove("selected");
                this.activeWindow = i;

                this.windows[this.activeWindow].classList.remove("hidden");
                this.children[this.activeWindow].classList.add("selected");
                updateFunc(i);
            }, false);
        }

        this.children[0].click();
    }
}

export default WindowSelector;
