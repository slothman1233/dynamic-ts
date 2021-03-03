import { addClass } from "@stl/tool-ts/src/common/dom/addClass"
import { removeClass } from "@stl/tool-ts/src/common/dom/removeClass"
import { show } from "@stl/tool-ts/src/common/dom/show"
import { hide } from "@stl/tool-ts/src/common/dom/hide"
import { on } from "@stl/tool-ts/src/common/event/on"
import { StlBg } from "../bg"


class Actionsheet{
    bgObj:any
    bgParameter:any
    constructor(){
        this.bgParameter = {className:"stl-popover-backdrop",actionClassName:"stl-popover-backdrop-action",callback:this.closePopover}
        this.bgObj = new StlBg(this.bgParameter)
    }
    showPopover(dom:HTMLElement|Element,type:string="bottom"){
        this.bgObj.showBg(dom);
        show(dom)
        setTimeout(function(){
            addClass(dom,"stl-popover-"+type+"-action");
        },0)
        if(!dom.getAttribute("data-click")){
            dom.setAttribute("data-click","true");
            this.addPopoverEvent(dom,type);
        }
    }
    closePopover(dom:HTMLElement|Element,type:string="bottom"){
        removeClass(dom,"stl-popover-"+type+"-action");
        setTimeout(function(){
            hide(dom)
        },300)
    }
    private addPopoverEvent(dom:HTMLElement|Element,type:string){
        let that = this;
        on({
            agent:dom,
            events:"click",
            ele:".stl-table-view-cell",
            fn:()=>{
                that.bgObj.closeBgFn()
                that.closePopover(dom,type)
            }
        })
    }
}

export const actionsheet = new Actionsheet();