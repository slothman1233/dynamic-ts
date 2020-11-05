import { layer } from "../src/index";
import { addEvent } from "@stl/tool-ts/src/common/compatible"
let btn = document.getElementById("btn")
let btn1 = document.getElementById("btn1")
let btn2 = document.getElementById("btn2")
let btn3 = document.getElementById("btn3")

addEvent(btn,"click",function(){
    layer.msg("不开心。。。",{icon:11,time:3000})
})

addEvent(btn1,"click",function(){
    layer.alert({
        content:"这是一个自定义alert",
        title:"这是一个标题",
        autoClose:true,
        btnStr:"<p data-link='https://www.baidu.com' style='padding:0;margin:0'>查看详情</p>",
        btnCallback:function(e:any){
            console.log(e.target)
        }
    })
})
addEvent(btn2,"click",function(){
    layer.open({
        title:"这是一个标题",
        content:"这是一段内容这是一段内容这是一段内容这是一段内容这是一段内容这是一段内容这是一段内容",
        icon:11,
        iconColor:"#00ff00",
        determineBtn:true,
        type:2,
        cancelBtn:true,
        determineFn:()=>{
            console.log("点击了确定")
        },
        cancelFn:()=>{
            console.log("点击了取消")
        }
    })
})
addEvent(btn3,"click",function(){
    layer.modal({
        title:"这是一个标题",
        content:"这是一段内容这是一段内容这是一段内容这是一段内容这是一段内容这是一段内容这是一段内容",
        determineFn:()=>{
            console.log("点击了确定")
        },
        cancelFn:()=>{
            console.log("点击了取消")
        }
    })
})