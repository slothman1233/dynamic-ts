import { IsFirefox,addObj } from "./util";
import { mousewheelFn,mouseMoveFn,clickScrollX,clickScrollY } from "./scroll";

declare let window:any

function bindMouseMove(type:string,dom:any):void{//绑定鼠标拖动事件和鼠标松开事件
    const that = this;
    const documentDom:HTMLElement = document.documentElement;
    const mousemoveCallback:(evn:any)=>void = function(evn:any){//拖动鼠标执行的方法
        const event:any = evn||window.event;
        mouseMoveFn(event,that,type)
    };
    const mouseupCallback:(evn:any)=>void = function(evn:any){//鼠标松开执行的方法
        const event:any = evn||window.event;
        if(dom.className.indexOf("stl_scroll_move_box")>=0){//取消按下滚动条样式
            dom.className = dom.className.replace(" stl_scroll_move_box","");
        }
        that.startClient = {"x":0,"y":0};
        that.isScrollMove = 0;
        addObj.removeEvent(documentDom,"mousemove",mousemoveCallback)//鼠标松开取消mousemove和mouseup事件绑定
        addObj.removeEvent(documentDom,"mouseup",mouseupCallback)
        if(IsFirefox()){
            dom.parentElement.parentElement.className = dom.parentElement.parentElement.className.replace(" stl_scroll_unselect","");//防止选中内容兼容firefox
        }else{
            dom.parentElement.parentElement.onselectstart = function(){//防止选中内容
                return true;
            }
        }
    };
    addObj.addEvent(documentDom,"mousemove",mousemoveCallback)
    addObj.addEvent(documentDom,"mouseup",mouseupCallback)
}

function bindMouseDown(type:string,dom:any):void{//绑定鼠标按下事件
    const that:any = this;
    addObj.addEvent(dom,"mousedown",function(evn:any){
        const event:any = evn||window.event;
        if(IsFirefox()){
            dom.parentElement.parentElement.className = dom.parentElement.parentElement.className+" stl_scroll_unselect";//防止选中内容兼容firefox
        }else{
            dom.parentElement.parentElement.onselectstart = function(){//防止选中内容
                return false;
            }
        }
        if(dom.className.indexOf("stl_scroll_move_box")<0){//按下滚动条添加样式
            dom.className = dom.className+" stl_scroll_move_box";
        }
        that.startClient[type] = type==="y"?event.clientY:event.clientX;//鼠标按下的初始位置
        bindMouseMove.call(that,type,dom)//按下鼠标绑定拖动和松开鼠标事件
    });
}

export function boundEventFn(type:string):void{//绑定点击滚动条和鼠标滚轮事件
    const that:any = this;
    const mouseScrollKey:string = IsFirefox()?"DOMMouseScroll":"mousewheel";//鼠标滚轮滚动事件兼容firefox浏览器
    if(type ==="y"||(this.options.direction ==="x"&&this.options.xMousewheel)){//滚动鼠标滚轮事件绑定
        addObj.addEvent(that.scrollBox,mouseScrollKey,function(){
            const ev:any = event || window.event;
            mousewheelFn.call(this,ev,that,type);
        });
        addObj.addEvent(that.scrollDom[type],mouseScrollKey,function(){
            const ev:any = event || window.event;
            mousewheelFn.call(this,ev,that,type);
        });
    };
    addObj.addEvent(that.scrollDom[type],"click",function(){//点击滚动条事件绑定
        const ev:any = event || window.event;
        if(type === "y"){
            clickScrollY.call(this,ev,that,type);
        }else{
            clickScrollX.call(this,ev,that,type);
        }
        
    });
    bindMouseDown.call(this,type,this.sliderDom[type]);//拖动滚动条事件绑定
}

