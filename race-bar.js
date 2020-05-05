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
async function init() {
    let graphs = document.getElementsByClassName('race-bar');
    let graphs_items = [];
    for (let graph of graphs) {
        let node = document.createElement("div");

        for (i = 0; i < 15; i++) {
            let l = document.createElement("div");
            l.className = "bar";
            let width = 0;// ((Math.random() * 100 * SCALE) + 100);
            l.style.width = width;
            l.setAttribute("size", width);

            l.style.background = getColor();
            let text = document.createTextNode((i + 1) + "# Node");
            l.appendChild(text);

            let randomMaxValue = (Math.random() * 100 * SCALE) + 100;
            l.setAttribute("max-value", randomMaxValue);
            node.append(l);
        }
        graph.appendChild(node);
        graphs_items.push(graph);
    }

    for (let item of graphs_items) {
        let safe_counter = 10000;
        for (let graph of item.childNodes) {
            for (let i = 0; i < graph.children.length; i++) {
                let ele = graph.children[i];
                let maxVal = parseInt(ele.getAttribute("max-value"));

                animateLifespan(ele);
                // for (let j = 0; j < graph.children.length; j++) {
                //     for (let k = 0; k < graph.children.length; k++) {
                //     let ele1 = graph.children[j];
                //     let ele2 = graph.children[k];
                //     let width1 = parseInt(ele1.getAttribute("max-value"));
                //     let width2 = parseInt(ele2.getAttribute("max-value"));
                //         if(width1<width2){
                //             swap(ele1,ele2,graph);
                //         }
                //     }
                // }
            }
        }
    }
}

function getColor() {
    let colorValue1 = Math.floor(Math.random() * 16777215);
    let colorValue2 = Math.floor(Math.random() * 16777215);

    let firstColor = colorValue1.toString(16);
    let secondColor = colorValue2.toString(16);
    let gradient = `linear-gradient(to left,#${firstColor},#${secondColor})`;
    //  console.debug(gradient);
    return gradient;
}
// Credit for swapping function: https://codesandbox.io/s/zen-minsky-bwyr9?from-embed=&file=/src/index.js:688-1248
function swap(el1, el2, container) {
    return new Promise(resolve => {
        const style1 = window.getComputedStyle(el1);
        const style2 = window.getComputedStyle(el2);

        const transform1 = style1.getPropertyValue("transform");
        const transform2 = style2.getPropertyValue("transform");

        el1.style.transform = transform2;
        el2.style.transform = transform1;

        // Wait for the transition to end!
        window.requestAnimationFrame(function () {
            setTimeout(() => {
                container.insertBefore(el2, el1);
                resolve();
            }, 250);
        });
    });
}


let framesPerSecond = 90;


async function animateLifespan(ele) {

    return new Promise(async (resolve) => {
        let width = parseInt(ele.getAttribute("size"));
        let maxVal = parseInt(ele.getAttribute("max-value"));
        let running = true;
        let f = function animate() {
            if (running) {
                let tId = setTimeout(function () {
                    requestAnimationFrame(animate);
                    if (width < maxVal) {
                        width++;
                    } else if (width > maxVal) {
                        width--;
                    }
                    ele.setAttribute("size", width);
                    ele.style.width = width;
                    ele.innerText = `${width}/${maxVal}`
                    if (width == maxVal) {
                        console.log("Stopping ", tId);
                        running = false;
                        clearTimeout(tId);
                        return resolve();
                    }



                }, 1000 / framesPerSecond);
            }
        }
        f();

    });
}