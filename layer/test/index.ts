import { layer } from "../src/index";
/**
 * 绑定方法
 * @param {Element} obj 绑定的元素
 * @param {String} type 方法名称
 * @param {function} fn  绑定的方法
 */
export const addEvent = (obj: any, type: string, fn: any) => {

    if (obj.addEventListener) {
      obj.addEventListener(type, fn, false);
    } else {
      obj['e' + type + fn] = fn;
      obj[type + fn] = function () { obj['e' + type + fn](window.event); }
      obj.attachEvent('on' + type, obj[type + fn]);
    }
  }
let btn = document.getElementById("btn")
let btn1 = document.getElementById("btn1")
let btn2 = document.getElementById("btn2")
let btn3 = document.getElementById("btn3")
let btn4 = document.getElementById("btn4")
let btn5 = document.getElementById("btn5")
let btn6 = document.getElementById("btn6")

addEvent(btn,"click",function(){
    layer.msg("不开心。。。",{icon:11,time:3000})
})

addEvent(btn1,"click",function(){
    layer.alert({
        icon:11,
        className:"abcedf",
        content:"这是一个自定义alert",
        //title:"这是一个标题",
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
addEvent(btn4,"click",function(){
    layer.loading({
        img:"./loading.gif",
        width:60,
        height:60,
        parent:document.getElementById("parent_box")
    })
})
addEvent(btn5,"click",function(){
    layer.tips(this,"这是一条tips这是一条tips这是一条tips这是一条tips这是一条tips",{position:"left"})
})
addEvent(btn6,"click",function(){
    layer.custom({
        content:`<p>523423423423423423423423<p><p>523423423423423423423423<p><p>523423423423423423423423<p><p>523423423423423423423423<p><p>523423423423423423423423<p>`,
        determineBtn:true,
        cancelBtn:true
    })
})