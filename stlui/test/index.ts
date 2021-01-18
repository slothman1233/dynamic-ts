//import { actionsheet } from "../src/actionsheet"
 import { canvasWrap } from "../src/canvasWrap/canvasWrap"

// let box = document.getElementById("open");
// box.addEventListener("click",function(){
//     actionsheet.showPopover(document.getElementById("actionsheet"))
// })


let box=document.getElementById("canvasWrap");
box.addEventListener("click",function(){
    canvasWrap.motionCallback()
})
let close=document.getElementById("close-canvas-right");
close.addEventListener("click",function(){
    canvasWrap.closeCallback()
 })
