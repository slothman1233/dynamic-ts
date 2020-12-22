import { NoticeRemind } from "../src/index"
import { addEvent } from "@stl/tool-ts/src/common/compatible"

let stlNoticeRemind:any = new NoticeRemind({number:3,autoClose:false,left:50,bottom:50,showCallback:(obj:any)=>{console.log(obj)}});

let dom:any = document.getElementById("btn");
let doms:any = document.getElementById("btns");
let index:number = 0;

// addEvent(dom,"click",function(){
//     stlNoticeRemind.addNewNotice(obj);
//     index++;
// })
dom.addEventListener("click",function(){
    let obj:any = {
        contentStr:"内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容",
        headStr:"标题标题标题标题标题标题标题标题标题标题"+index,
        id:index
    };
    stlNoticeRemind.addNewNotice(obj);
    index++;
})

doms.addEventListener("click",function(){
    let arr:any = [{
        contentStr:"内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容",
        headStr:"标题标题标题标题标题标题标题标题标题标题11",
        id:11
    },{
        contentStr:"内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容",
        headStr:"标题标题标题标题标题标题标题标题标题标题12",
        id:12
    },{
         contentStr:"内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容",
        headStr:"标题标题标题标题标题标题标题标题标题标题13",
        id:13
    },{
        contentStr:"内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容",
        headStr:"标题标题标题标题标题标题标题标题标题标题14",
        id:14
    }];
    stlNoticeRemind.addNewNotice(arr);
})
