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
    let graphs = document.getElementsByClassName('race-bar');
    let graphs_items = [];
    for (let graph of graphs) {
        let node = document.createElement("div");

        for (i = 0; i < 15; i++) {
            let l = document.createElement("div");
            l.className = "bar";
            let width = 0;// ((Math.random() * 100 * SCALE) + 100);
            l.style.width = width;
            l.style.top = i*20;
            l.setAttribute("size", width);
            l.setAttribute("name", getName(4));

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
            sortable_bars = graph.children;
            for (let i = 0; i < graph.children.length; i++) {
                let ele = graph.children[i];
                animateLifespan(ele);
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
    //  console.debug(gradient);
    return gradient;
}


async function bubbleSort(delay = 100) {
    if (delay && typeof delay !== "number") {
      alert("sort: First argument must be a typeof Number");
      return;
    }
    let blocks = document.querySelectorAll(".bar");
    for (let i = 0; i < blocks.length - 1; i += 1) {
      for (let j = 0; j < blocks.length - i - 1; j += 1) {  
        await new Promise(resolve =>
          setTimeout(() => {
            resolve();
          }, delay)
        );
  
        const value1 = Number(blocks[j].getAttribute('size'));//.childNodes[0].innerHTML);
        const value2 = Number(blocks[j + 1].getAttribute('size'));//.childNodes[0].innerHTML);
  
        if (value1 > value2) {
          await swap(blocks[j], blocks[j + 1]);
          blocks = document.querySelectorAll(".bar");
        }
  
        blocks[j].style.backgroundColor = "#58B7FF";
        blocks[j + 1].style.backgroundColor = "#58B7FF";
      }
  
      blocks[blocks.length - i - 1].style.backgroundColor = "#13CE66";
    }
  }




async function temp(ele1,ele2){
   let f1 = ele1.style.top;
   let f2 = ele2.style.top;
   let width1 = ele1.getAttribute('size');
   let width2 = ele2.getAttribute('size');

   let animationLength = 1000;   
   ele1.style.transition = `top ${animationLength}ms`;
   ele2.style.transition = `top ${animationLength}ms`;  
   ele1.style.top =f2;//
   ele2.style.top =f1;// 
 
}

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
            }, 5);
        });
    });
}


let framesPerSecond = 120;

async function sort() {
    let elements = document.getElementsByClassName("race-bar");
    for (let elment of elements) {
        console.log(elements);
        console.log("sorting");
        for (let box of elment.children) {
            for (let ele1 of box.children) {
                let name1 = ele1.getAttribute("name");
                for (let ele2 of box.children) {
                    let name2 = ele2.getAttribute("name");
                    let width1 = parseInt(ele1.getAttribute("size"));
                    let width2 = parseInt(ele2.getAttribute("size"));
                    if (width1 < width2) {
                        console.log("Swapping", name1, name2, width1, width2);
                        await temp(ele1, ele2);
                    }
                }
            }
        }
    }
}
async function animateLifespan(ele) {
    return new Promise(async (resolve) => {
        let width = parseInt(ele.getAttribute("size"));
        let maxVal = parseInt(ele.getAttribute("max-value"));
        let name = ele.getAttribute("name");
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
                    ele.innerHTML = `<strong>${name} ▶</strong>: ${width}/${maxVal}`;
                    if (width == maxVal) {
                        console.log("Stopping ", tId);
                        running = false;
                        clearTimeout(tId);
                        return resolve();
                    }
                }, 1000 / framesPerSecond);
            }
        }
        let s = async function sortAnim() {
            if (running) {
                requestAnimationFrame(sortAnim);
                await sort(ele.parentNode);
            }
        }

        f();
        // s();
    });


    
function swap(el1, el2) {
    return new Promise(resolve => {
      const style1 = window.getComputedStyle(el1);
      const style2 = window.getComputedStyle(el2);
  
      const transform1 = style1.getPropertyValue("transform");
      const transform2 = style2.getPropertyValue("transform");
  
      el1.style.transform = transform2;
      el2.style.transform = transform1;
  
      // Wait for the transition to end!
      window.requestAnimationFrame(function() {
        setTimeout(() => {
          container.insertBefore(el2, el1);
          resolve();
        }, 250);
      });
    });
  }
}