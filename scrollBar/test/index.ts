import { scrollBar } from "../src/index"
var ScrollBar2:any;

let btn = document.getElementById("btn");

btn.addEventListener("click",function(){
    // ScrollBar2.fixedPointScroll({top:1000})
    document.getElementById("box6").style.display = "block"
    if(!ScrollBar2){
        ScrollBar2 = new scrollBar({id:"box6",direction:"y",className:"scroll_class"})
    }
})
let btn1 = document.getElementById("btn1")
btn1.addEventListener("click",function(){
    // ScrollBar2.fixedPointScroll({top:1000})
    document.getElementById("box6").style.display = "none"
})