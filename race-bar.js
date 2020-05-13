
function docReady(fn) {
    // see if DOM is already available
    if (document.readyState === "complete" || document.readyState === "interactive") {
        // call on next available tick
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}
docReady(function () {
    // DOM is loaded and ready for manipulation here
    console.log("started");
    init();

});
const SCALE = 6;
function sleep(miliseconds) {
    var currentTime = new Date().getTime();

    while (currentTime + miliseconds >= new Date().getTime()) {
    }
}

sortable_bars = [];
async function init() {
    let numberOfbars= 20;
    let barHeight=24;

    let graphs = document.getElementsByClassName('race-bar');
    let graphs_items = [];
    for (let graph of graphs) {
        let node = document.createElement("div");
        node.style.position='absolute';
        let background = document.createElement('div');
        background.style.height=numberOfbars*barHeight;
        background.className='race-bar-background';
 
        //top ticks
        for(let i=0;i<numberOfbars;i++){            
            let line = document.createElement("div");
            line.className='top-tick';
             line.style.left = i * barHeight;
            background.appendChild(line);
        }
        //left ticks
        for(let i=0;i<numberOfbars;i++){            
            let line = document.createElement("div");
            line.className='left-tick';
             line.style.top = i * barHeight;
            background.appendChild(line);
        }

        for(let i=0;i<numberOfbars;i++){            
        let line = document.createElement("div");
        line.className='line-v';
        line.style.top = i * barHeight;
        background.appendChild(line);
        }

        for(let i=0;i<numberOfbars;i++){            
            let line = document.createElement("div");
            line.className='line-h';
            line.style.left = i * barHeight;
            background.appendChild(line);
        }

        graph.appendChild(background);
        for (let i = 0; i < numberOfbars; i++) {
            let l = document.createElement("div");
            l.className = "bar";
            let width = 0;// ((Math.random() * 100 * SCALE) + 100);
            l.style.width = width;
            l.style.top = i*barHeight;
            l.setAttribute("size", width);
            l.setAttribute("name", getName(4));

            l.style.background = getColor();
            let text = document.createTextNode((i + 1) + "# Node");
            l.appendChild(text);

            let randomMaxValue =(i*10)+ ((0.1+Math.random()) * 100);// * SCALE) + 100;
            l.setAttribute("max-value", randomMaxValue);
            node.append(l);
        }
        node.setAttribute('data',true);
        graph.appendChild(node);
        graphs_items.push(graph);
    }

    for (let item of graphs_items) {
        for (let graph of item.childNodes) {
            let dt = graph.getAttribute('data');
            if(!dt){continue;}
            sortable_bars = graph.children;
            for (let i = 0; i < graph.children.length; i++) { 
                let ele = graph.children[i];               
                animateLifespan(ele,graph.children);                
            }
        }
    }
}
function getName(length) {
    let name = '';
    for (let i = 0; i < length; i++) {
        let char = String.fromCharCode(65 + parseInt(Math.random() * 24));
        name += char;
    }
    return name;
}
function getColor() {
    let colorValue1 = Math.floor(Math.random() * 16777215);
    let colorValue2 = Math.floor(Math.random() * 16777215);

    let firstColor = colorValue1.toString(16);
    let secondColor = colorValue2.toString(16);
    let gradient = `linear-gradient(to left,#${firstColor},#${secondColor})`;
    return gradient;
}


let framesPerSecond = 120;

async function sort() {
    let elements = document.getElementsByClassName("race-bar");
    for (let elment of elements) {
        console.log(elements);
        console.log("sorting");
        for (let box of elment.children){
        insertionSort(box.children);
        }
    }
}


async function insertionSort(arr){
    let beginningIndex = 0;
    let currentIndex = 1;
    //while the start of the unsorted portion doesnt not start at the after the end of the array
    while(currentIndex < arr.length){
        //while the currentIndex does not reach the end of the sorted section or the array (index of -1)
        while(currentIndex > 0){
            let ele1 = arr[currentIndex];
            let ele2 = arr[currentIndex - 1];
            //get currentValue(value to be sorted)
            let currentVal1 = parseInt(ele1.getAttribute("size"));
            let currentVal2 = parseInt(ele2.getAttribute("size"));
            //if it is lesser than the last value, swap the two values, otherwise, break out of the loop
            if(currentVal1 > currentVal2){
                await temp(ele1, ele2, arr);
                currentIndex--;
            } else{
                break;
            }
        
        }
        //add 1 to beginningIndex to account for newly sorted section
        beginningIndex++;
        //start sorting from index after beginning
        currentIndex = beginningIndex + 1;

    }
    return arr;
}

async function temp(ele1,ele2){
    let f1 = ele1.style.top;
    let f2 = ele2.style.top;
 
    let animationLength = 1000;   
    ele1.style.transition = `top ${animationLength}ms`;
    ele2.style.transition = `top ${animationLength}ms`;  
    ele1.style.top =f2;
    ele2.style.top =f1;
    ele2.parentNode.insertBefore(ele1,ele2);
}


async function animateLifespan(ele,allelements) {
    return new Promise((resolve) => {
        let width = parseInt(ele.getAttribute("size"));
        let maxVal = parseInt(ele.getAttribute("max-value"));
        let name = ele.getAttribute("name");
        let running = true;
        let f =async function animate() {
            if (running) {
                let tId = setTimeout(async function () {
                    requestAnimationFrame(animate);
                    if (width < maxVal) {
                        width++;
                    } else if (width > maxVal) {
                        width--;
                    }
                    ele.setAttribute("size", width);
                    ele.style.width = width;
                    ele.innerHTML = `<span class="label-inside">${name} ▶</span> <span  class="label-outside">${width}/${maxVal}</span>`;
                    if (width == maxVal) {
                        console.log("Stopping ", tId);
                        running = false;
                        clearTimeout(tId);
                        
                        insertionSort(allelements);
                        return resolve();
                    }
                    
                }, 1000 / framesPerSecond);

              
            }
        }        
       f();        

    });

}