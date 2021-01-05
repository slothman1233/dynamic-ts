interface mousewheelObj {
    scrollNumber:number,
    sliderScale:number,
}

interface scaleObj {
    scrollRange:number,
    sliderRange:number,
    scrollNumber:number,
    scrollType:string,
    transformType:string,
}
interface positionScroll {
    left?:number,
    top?:number,
}

function addTransformFn(dom:any,val:string){//设置滚动条的transform样式兼容性写法
    dom.style.transform = val;
    dom.style.webkitTransform = val;
    dom.style.msTransform = val;
    dom.style.mozTransform = val;
    dom.style.oTransform = val;
}

function scrollScale(that:any,type:any):scaleObj{//获取计算滚动位置所需的参数
    let scrollObj:scaleObj = {
        scrollRange:that.contentDomScrollSize[type] - that.contentDomSize[type],
        sliderRange:that.scrollDomSize[type]-that.sliderDomSize[type],
        scrollNumber:that.scrollBox.scrollTop,
        scrollType:"scrollTop",
        transformType:"translateY"
    }
    if(type==="x"){
        scrollObj.scrollNumber = that.scrollBox.scrollLeft;
        scrollObj.scrollType = "scrollLeft";
        scrollObj.transformType = "translateX"
    }
    return scrollObj;
}

function getScrollValue(event:any,that:any,scrollNumber:number,scrollRange:number,sliderRange:number):mousewheelObj{//每次滚动位置计算
    let key:boolean = event.wheelDelta?event.wheelDelta>0:event.detail<0;//兼容性处理判断是向上滚动还是向下滚动  true向上滚动  false向下滚动   
    let sliderScale:number;
    if(key){
        if(scrollNumber<=0)return null;
        try { event.preventDefault(); } catch (e) { }
        scrollNumber -= that.options.wheelDis;
    }else{
        if(scrollNumber>=scrollRange)return null;
        try { event.preventDefault(); } catch (e) { }
        scrollNumber += that.options.wheelDis;
    }
    scrollNumber = scrollNumber<0?0:scrollNumber>scrollRange?scrollRange:scrollNumber;
    return {
        scrollNumber:scrollNumber,
        sliderScale:scrollNumber*sliderRange/scrollRange
    }
}

function getMoveValue(event:any,moveNumber:number,scrollNumber:number,scrollRange:number,sliderRange:number):mousewheelObj{//每次拖动位置计算
    try { event.preventDefault(); } catch (e) { }
    if((scrollNumber<=0&&moveNumber<0)||(scrollNumber>=scrollRange&&moveNumber>0))return null;
    scrollNumber += moveNumber*scrollRange/sliderRange;
    scrollNumber = scrollNumber<0?0:scrollNumber>scrollRange?scrollRange:scrollNumber;
    return {
        scrollNumber:scrollNumber,
        sliderScale:scrollNumber*sliderRange/scrollRange
    };
}

export function mousewheelFn(event:any,that:any,type:string):void{//滚动滚轮更新滚动位置
    if(that.contentDomScrollSize[type]<=that.contentDomSize[type]){return}//当内容高度小于滚动元素的高度则返回
    let scaleObj:scaleObj = scrollScale(that,type);
    let scrollNumberObj:mousewheelObj = getScrollValue(event,that,scaleObj.scrollNumber,scaleObj.scrollRange,scaleObj.sliderRange);
    if(scrollNumberObj){
        that.scrollBox[scaleObj.scrollType] = scrollNumberObj.scrollNumber;//更新滚动内容的滚动位置
        addTransformFn(that.sliderDom[type],scaleObj.transformType+"("+scrollNumberObj.sliderScale*100/that.sliderDomSize[type]+"%)");//更新滚动条的滚动位置
    }
}

export function mouseMoveFn(event:any,that:any,type:string){//拖动滚动条更新滚动位置
    let clientNumber:number = type === "y"?event.clientY:event.clientX;
    let moveNumber:number = clientNumber - that.startClient[type];//获取拖动距离
    that.startClient[type] = clientNumber;//更新初始值
    let scaleObj:scaleObj = scrollScale(that,type);
    let scrollNumberObj:mousewheelObj = getMoveValue(event,moveNumber,scaleObj.scrollNumber,scaleObj.scrollRange,scaleObj.sliderRange);
    if(scrollNumberObj){
        that.scrollBox[scaleObj.scrollType] = scrollNumberObj.scrollNumber;
        addTransformFn(that.sliderDom[type],scaleObj.transformType+"("+scrollNumberObj.sliderScale*100/that.sliderDomSize[type]+"%)");
    }
}

export function clickScrollY(event:any,that:any){//点击竖向滚动条
    if(event.target.className.indexOf("stl_yscroll_box")<0){return};
    let clickOffset:number = event.offsetY - that.sliderDomSize["y"]/2
    clickOffset = clickOffset <0?0:clickOffset >(that.scrollDomSize["y"]-that.sliderDomSize["y"])?(that.scrollDomSize["y"]-that.sliderDomSize["y"]):clickOffset;
    let clickScroll:number = (that.contentDomScrollSize["y"] - that.contentDomSize["y"])*clickOffset/(that.scrollDomSize["y"]-that.sliderDomSize["y"]);
    that.scrollBox.scrollTop = clickScroll;
    addTransformFn(that.sliderDom["y"],"translateY("+clickOffset*100/that.sliderDomSize["y"]+"%)");
}

export function clickScrollX(event:any,that:any){//点击横向滚动条
    if(event.target.className.indexOf("stl_xscroll_box")<0){return};
    let clickOffset:number = event.offsetX - that.sliderDomSize["x"]/2;
    clickOffset = clickOffset <0?0:clickOffset >(that.scrollDomSize["x"]-that.sliderDomSize["x"])?(that.scrollDomSize["x"]-that.sliderDomSize["x"]):clickOffset;
    let clickScroll:number = (that.contentDomScrollSize["x"] - that.contentDomSize["x"])*clickOffset/(that.scrollDomSize["x"]-that.sliderDomSize["x"]);
    that.scrollBox.scrollLeft = clickScroll;
    addTransformFn(that.sliderDom["x"],"translateX("+clickOffset*100/that.sliderDomSize["x"]+"%)");
}
export function scrollSpecifiedPosition(obj:positionScroll){
    if(obj.hasOwnProperty("left")){
        let maxLeft = this.contentDomScrollSize.x - this.contentDomSize.x;
        this.scrollBox.scrollLeft = obj.left>maxLeft?maxLeft:obj.left;
        let clickOffset = this.scrollBox.scrollLeft*(this.scrollDomSize["x"]-this.sliderDomSize["x"])/(this.contentDomScrollSize["x"] - this.contentDomSize["x"]);
        addTransformFn(this.sliderDom["x"],"translateX("+clickOffset*100/this.sliderDomSize["x"]+"%)");
    }
    if(obj.hasOwnProperty("top")){
        let maxTop = this.contentDomScrollSize.y - this.contentDomSize.y;
        this.scrollBox.scrollTop = obj.top>maxTop?maxTop:obj.top;
        let clickOffset = this.scrollBox.scrollTop*(this.scrollDomSize["y"]-this.sliderDomSize["y"])/(this.contentDomScrollSize["y"] - this.contentDomSize["y"]);
        addTransformFn(this.sliderDom["y"],"translateY("+clickOffset*100/this.sliderDomSize["y"]+"%)");
    }
}