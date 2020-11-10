import { NoticeRemind } from "../src/index"
import { addEvent } from "@stl/tool-ts/src/common/compatible"

let stlNoticeRemind:any = new NoticeRemind({});

let dom:any = document.getElementById("btn");
let index:number = 0;
let obj:any = {
    contentStr:"内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容",
    headStr:"标题标题标题标题标题标题标题标题标题标题"+index,
};
// addEvent(dom,"click",function(){
//     stlNoticeRemind.addNewNotice(obj);
//     index++;
// })

dom.addEventListener("click",function(){
    stlNoticeRemind.addNewNotice(obj);
    index++;
})
