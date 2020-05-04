function docReady(fn) {
    // see if DOM is already available
    if (document.readyState === "complete" || document.readyState === "interactive") {
        // call on next available tick
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}  
docReady(function() {
    // DOM is loaded and ready for manipulation here
    console.log("started");
    init();

});

function init(){
    let elements = document.getElementsByClassName('race-bar');
    for (let element of elements){
        let node = document.createElement("div");
        
        for(i=0;i<10;i++){
            let l = document.createElement("div");
            l.className="bar";
            l.style.width=Math.random()*100;
            node.append(l);
        }
        element.appendChild(node);
    }
}