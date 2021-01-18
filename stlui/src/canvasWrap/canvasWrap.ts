import { addClass } from "@stl/tool-ts/src/common/dom/addClass"
import { removeClass } from "@stl/tool-ts/src/common/dom/removeClass"
import { addEvent } from "@stl/tool-ts/src/common/compatible/addEvent"
import { removeEvent } from "@stl/tool-ts/src/common/compatible/removeEvent"
import { setTransformFn,getTransformFn,setTransitionFn } from "../unit"
import { StlBg } from "../bg"

class CanvasWrap{
    parent:any//侧滑功能的最外层元素
    parentClassName:string//外层元素的类名，根据类名判断侧滑类型
    parentWidth:any//外层元素的宽度
    wrapBox:any//内容栏父元素
    wrapDom:any//内容栏和侧滑栏的父元素
    canvesBox:any//侧滑栏父元素
    private motionFn:any//唤起侧滑栏的方法
    private closeFn:any//关闭侧滑栏的方法
    bgObj:any//背景对象
    private bgParameter:any//实例化背景的参数
    private startTime:any//手指按下的时间点
    private endTime:any//手指松开的时间点
    private moveAngle:any//滑动的角度
    private startX:any//手指按下的X轴位置
    private startY:any//手指按下的Y轴位置
    private touchmoveFn:any//滑动事件执行的方法
    private touchendFn:any//滑动事件结束执行的方法
    private moveInFn:any//将侧滑栏滑入的方法
    private moveOutFn:any//将侧滑栏滑出的方法
    private moveKey:any//判断是否是首次触发touchmove事件的锁
    private wrapperKey:any = false//侧滑栏当前是否显示
    private wrapDirection:any//侧滑栏的方位
    private eventKey:any = false//事件执行的锁
    constructor(){
        this.parent = document.getElementsByClassName("stl-off-canvas-wrap")[0]
        this.parentClassName = this.parent.className,this.parentWidth = this.parent.clientWidth;
        this.wrapBox = document.getElementById("stlInnerWrapper");
        this.canvesBox = document.getElementById("stlCanvasSide");
        this.getDirection();
        this.bgParameter = {parent:this.wrapBox,closeDom:this.wrapBox,className:"stl-wrap-backdrop",actionClassName:"stl-wrap-backdrop-active",callback:this.closeBg()}
        this.bgObj = new StlBg(this.bgParameter);
        this.getType();
        this.getMouse();
    }
    private getDirection(){//获取侧滑栏在左边还是右边
        let className = this.canvesBox.className;
        this.wrapDirection = className.split("stl-off-canvas-")[1].split(" ")[0]
    }
    private getMouse(){//判断是否允许滑动
        let that = this;
        if(that.parentClassName.indexOf("stl-warp-mouse")<0)return;
        that.touchendFn = (event:any)=>{
            let len = Math.abs(that.startX - event.changedTouches[0].clientX);//滑动总距离
            let speedScale = len/that.parentWidth;//滑动距离展元素宽度的比例
            that.moveKey = false,that.endTime = new Date().getTime();//滑动总时长
            let duration = that.endTime- that.startTime;//滑动时长
            //console.log(speedScale,duration,len)
            if(speedScale>0.4||(duration<300&&len>20)){
                that.wrapperKey?that.closeFn():that.motionFn(true);
            }else{
                that.wrapperKey?that.motionFn(true):that.closeFn();
            }
            that.closeEventKey();
        }
        that.touchmoveFn = (event:any)=>{
           // console.log("move")
            let changeTouches = event.changedTouches[0];
            let len:any = that.startX - changeTouches.clientX,top:any = that.startY - changeTouches.clientY;
            if(!that.moveKey)that.moveAngle = 180*Math.atan2(Math.abs(top),Math.abs(len))/Math.PI,that.moveKey = true,that.eventKey = true;//根据拖动的角度是否小于45度判断是否唤起侧滑栏
            if(that.moveAngle<=45){//小于45度表明是横向滑动
                addEvent(that.parent,"touchend",that.touchendFn)
                let moveDirection = Math.abs(len)/len;//滑动方向 -1表示往右滑 1表示往左滑
                let openKey = (moveDirection>0&&that.wrapDirection == "right")||(moveDirection<0&&that.wrapDirection == "left");
                let closeKey = (moveDirection>0&&that.wrapDirection == "left")||(moveDirection<0&&that.wrapDirection == "right");
                if(!that.wrapperKey&&openKey){//判断侧滑栏是否已展开
                    addClass(this.parent,"stl-wrap-active");
                    that.moveInFn(-len)
                }else if(that.wrapperKey&&closeKey){
                    that.moveOutFn(-len)
                }else{
                    that.moveKey = false;
                    removeEvent(that.parent,"touchend",that.touchendFn);
                }                
            }else{
                that.moveKey = false;
                removeEvent(that.parent,"touchend",that.touchendFn);
            }
            
        }
        addEvent(that.parent,"touchstart",function(event:any){
            if(that.eventKey)return;
            let changeTouches = event.changedTouches[0];
            that.startTime = new Date().getTime(),that.moveAngle = 90;
            that.startX = changeTouches.clientX,that.startY = changeTouches.clientY;
            addEvent(that.parent,"touchmove",that.touchmoveFn)
        })
    }
    private closeEventKey(){
        let that =this;
        setTimeout(()=>{
            that.eventKey = false;
        },300)
    }
    private getType(){//根据className判断侧滑类型
        if(this.parentClassName.indexOf("stl-wrap-in")>=0)return this.motionFn = this.getWrapIn,this.closeFn = this.closeWrapIn,this.moveInFn = this.getMoveIn,this.moveOutFn = this.closeMoveIn;
        if(this.parentClassName.indexOf("stl-wrap-out")>=0)return this.motionFn = this.getWrapOut,this.closeFn = this.closeWrapOut,this.moveInFn = this.getMoveOut,this.moveOutFn = this.closeMoveOut;
        if(this.parentClassName.indexOf("stl-wrap-all")>=0)return this.motionFn = this.getWrapAll,this.closeFn = this.closeWrapAll,this.moveInFn = this.getMoveAll,this.moveOutFn = this.closeMoveAll;
        if(this.parentClassName.indexOf("stl-wrap-scal")>=0)return this.motionFn = this.getWrapScal,this.closeFn = this.closeWrapScal,this.moveInFn = this.getMoveScal,this.moveOutFn = this.closeMoveScal;
    }
    private getTransformX(dom:any){
        let val = getTransformFn(dom).split(",")[4];
        return val?parseFloat(val):null;
    }
    motionCallback(){//唤起侧滑栏的回调
        if(this.eventKey)return;
        this.eventKey = true;
        this.motionFn();
        this.closeEventKey();
    }
    closeCallback(){//隐藏侧滑栏的回调
        if(this.eventKey)return;
        this.eventKey = true;
        this.closeFn();
        this.closeEventKey();
    }
    private closeBg(){//点击背景侧滑元素划出事件
        let that = this;
        if(this.parentClassName.indexOf("stl-wrap-out")>=0){
            return (box:any)=>{
                box.style.transform = "translate3d(0,0,0)";
                setTimeout(function(){
                    removeClass(that.parent,"stl-wrap-active")
                },300)
            }
        }else if(this.parentClassName.indexOf("stl-wrap-in")>=0){
            return (box:any,type?:string)=>{
                let width = type === "left"?-box.offsetWidth:box.offsetWidth;
                box.style.transform = "translate3d("+width+"px,0,0)";
                setTimeout(function(){
                    removeClass(that.parent,"stl-wrap-active")
                },300)
            }
        }else if(this.parentClassName.indexOf("stl-wrap-all")){
            return (box:any)=>{
                box.style.transform = "translate3d(0,0,0)";
                setTimeout(function(){
                    removeClass(that.parent,"stl-wrap-active")
                },300)
            }
        }
        
    }
    private getMoveIn(val:any){
        let num = this.getTransformX(this.canvesBox)||this.parentWidth;
        setTransitionFn(this.canvesBox);
        console.log(num,val)
        setTransformFn(this.canvesBox,"translate3d("+(num+val)+"px,0,0)");
    }
    private getMoveOut(val:any){
        setTransitionFn(this.wrapBox);
        setTransformFn(this.wrapBox,"translate3d("+val+"px,0,0)");
    }
    private getMoveAll(val:any){

    }
    private getMoveScal(val:any){

    }
    private closeMoveIn(val:any){
        let num = getTransformFn(this.canvesBox).split(",")[4];
        setTransitionFn(this.canvesBox);
        setTransformFn(this.canvesBox,"translate3d("+(val+num)+"px,0,0)");
    }
    private closeMoveOut(val:any){
        let num = parseInt(getTransformFn(this.wrapBox).split(",")[4]);
        setTransitionFn(this.wrapBox);
        setTransformFn(this.wrapBox,"translate3d("+(val+num)+"px,0,0)");
    }
    private closeMoveAll(val:any){

    }
    private closeMoveScal(val:any){

    }
    private addParentClass(box?:any){//获取侧滑列表元素，父元素添加类名
        addClass(this.parent,"stl-wrap-active");
        this.wrapperKey = true;
    }
    private getWrapOut(type?:boolean){
        type||this.addParentClass();
        let width = this.wrapDirection === "left"?this.canvesBox.offsetWidth:-this.canvesBox.offsetWidth;
        setTransitionFn(this.wrapBox,350,"cubic-bezier(.165,.84,.44,1)");
        setTransformFn(this.wrapBox,"translate3d("+width+"px,0,0)");
        if(!this.bgObj.bg)this.bgObj.showBg();
    }
    private getWrapIn(type?:boolean){
        let that = this;
        type||this.addParentClass();
        setTimeout(function(){
            setTransitionFn(that.canvesBox,350,"cubic-bezier(.165,.84,.44,1)");
            setTransformFn(that.canvesBox,"translate3d(0,0,0)");
            if(!that.bgObj.bg)that.bgObj.showBg(that.canvesBox,that.wrapDirection);
        },0)
    }
    private getWrapAll(type?:boolean){
        let that = this;
        type||this.addParentClass();
        let width = this.wrapDirection === "left"?this.canvesBox.offsetWidth:-this.canvesBox.offsetWidth;
        this.wrapDom = this.parent.getElementsByClassName("stl-canvas-wrap")[0];
        setTimeout(function(){
            setTransitionFn(that.wrapDom,350,"cubic-bezier(.165,.84,.44,1)");
            setTransformFn(that.wrapDom,"translate3d"+width+"px,0,0)");
            if(!that.bgObj.bg)that.bgObj.showBg(that.wrapDom,that.wrapDirection);
        },0)
    }
    private getWrapScal(){

    }
    private closeWrap(box:any,val?:string){//侧滑元素划出事件
        let that =this;
        setTransitionFn(box,350,"cubic-bezier(.165,.84,.44,1)");
        setTransformFn(box,val?val:"translate3d(0,0,0)");
        console.log(this.bgObj.bg);
        if(this.bgObj.bg)this.bgObj.closeBgFn();
        that.wrapperKey = false;
        setTimeout(function(){
            removeClass(that.parent,"stl-wrap-active");
        },300)
    }
    private closeWrapIn(){
        let width = this.wrapDirection === "left"?-this.canvesBox.offsetWidth:this.canvesBox.offsetWidth;
        this.closeWrap(this.canvesBox,"translate3d("+width+"px,0,0)")
    }
    private closeWrapOut(){
        this.closeWrap(this.wrapBox)
    }
    private closeWrapAll(){
        this.closeWrap(this.wrapDom)
    }
    private closeWrapScal(){

    }
}

export const canvasWrap = new CanvasWrap();