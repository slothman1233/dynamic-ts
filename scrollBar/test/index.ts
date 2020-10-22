import { scrollBar } from "../src/index"
var ScrollBar2 = new scrollBar({id:"box6",direction:"y",className:"scroll_class"})

let btn = document.getElementById("btn");

btn.addEventListener("click",function(){
    ScrollBar2.fixedPointScroll({top:1000})
})