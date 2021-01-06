import { scrollBar } from "../src/index"
let scrollBar1 = new scrollBar({id:"box2"});
console.log(scrollBar1);
let btn = document.getElementById("btn");
let btn1 = document.getElementById("btn1");
btn.addEventListener("click",function(){
    scrollBar1.fixedPointScroll({top:3000})
})
btn1.addEventListener("click",function(){
    scrollBar1.fixedPointScroll({top:0})
})

// var ScrollBar2:any;

// let btn = document.getElementById("btn");
// document.getElementById("box6").style.display = "block"
// ScrollBar2 = new scrollBar({id:"box6",direction:"x",className:"scroll_class"})
// btn.addEventListener("click",function(){
//     // ScrollBar2.fixedPointScroll({top:1000})
    
//     if(!ScrollBar2){
        
//     }
// })
// let btn1 = document.getElementById("btn1")
// btn1.addEventListener("click",function(){
//     // ScrollBar2.fixedPointScroll({top:1000})
//     document.getElementById("box6").style.display = "none"
// })