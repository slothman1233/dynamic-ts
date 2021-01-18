import { addClass } from "@stl/tool-ts/src/common/dom/addClass"
import { removeClass } from "@stl/tool-ts/src/common/dom/removeClass"
import { createEl } from "@stl/tool-ts/src/common/dom/createEl"
import { addEvent } from "@stl/tool-ts/src/common/compatible/addEvent"

interface bgParameter{
    parent?:HTMLElement|Element
    time?:number
    closeDom?:HTMLElement|Element
    className:string
    actionClassName:string
    callback?:any
}
export class StlBg{
    parameter:bgParameter
    parent:any
    bg:any = null
    constructor(obj:bgParameter){
        this.parameter = obj;
        this.parent = this.parameter.parent||document.body;
    }
    showBg(box?:HTMLElement|Element,type?:string){
        let that = this;
        this.bg = createEl('<div class="'+this.parameter.className+' stlui-action"></div>')
        let dom = box?box:this.parameter.closeDom  
        this.parent.appendChild(this.bg)   
        setTimeout(function(){
            addClass(that.bg,that.parameter.actionClassName);   
        },0)
        this.addBgEvent(dom,type)
    }
    private addBgEvent(dom:HTMLElement|Element,type?:string){
        let that = this;
        addEvent(this.bg,"click",function(){
            that.closeBgFn();
            that.parameter.callback&&that.parameter.callback(dom,type);
        })
    }
    closeBgFn(){
        let that = this;
        removeClass(this.bg,this.parameter.actionClassName);
        setTimeout(function(){
            try{that.parent.removeChild(that.bg)}catch(e){}
            that.bg = null;
        },that.parameter.time|300)
    }
}