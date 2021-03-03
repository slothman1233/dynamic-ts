import "./index.less"
import { addEvent } from "@stl/tool-ts/src/common/compatible/addEvent"
import { removeEvent } from "@stl/tool-ts/src/common/compatible/removeEvent"
import { addClass } from "@stl/tool-ts/src/common/dom/addClass"
import { removeClass } from "@stl/tool-ts/src/common/dom/removeClass"
import { mergeOptions } from "@stl/tool-ts/src/common/compatible/mergeOptions"
import { on } from "@stl/tool-ts/src/common/event/on"
import { NodeListToArray } from "@stl/tool-ts/src/common/obj/NodeListToArray"
import { createEl } from "@stl/tool-ts/src/common/dom/createEl"
import { setTransitionFn,setTransformFn,getTransformFn } from "./unit"
interface scrollBar{
    el?:HTMLElement
    dragSize?:string

    
    hide?:boolean//未实现
}
interface autoplay{
    delay?:number
    
}
interface thumbs{
    list:Array<string>
    thumbsPerview?:number
    clickCallback?:()=>void
}
interface pagination{
    ele?:HTMLElement|Element
}

interface navigation{
    nextEl?:HTMLElement|Element
    prevEl?:HTMLElement|Element
    autoHide?:boolean
    // outCallback?:(item:number,that:any)=>void
}

interface parameter{
    watchOverflow?:boolean//未实现
    slidesPerGroup?:number//未实现

    loop?:boolean//是否循环切换
    slidesPerView?:number|string
    autoHeight?:boolean
    speed?:number

    autoplay?:autoplay
    scrollBar?:scrollBar
    thumbs?:thumbs
    pagination?:pagination
    navigation?:navigation
    
    sliderStart?:any
    sliderEnd?:any
}

export class stlSwiper{
    parameter:parameter
    startLeft:number//初始left值
    startTop:number//初始top值
    startTransform:any//初始transform值
    parentWidth:number//父元素的宽度
    parentScrollWidth:number
    movekey:boolean = false//move事件的锁
    item:number = 0//当前显示的下标
    parent:HTMLElement
    touchmoveFn:(event:any)=>void
    touchendFn:(event:any)=>void
    wrapperClassName:string = "stl-switch-wrapper"
    sliderClassName:string = "stl-switch-slider"
    thumbsClassName:string = "stl-switch-thumbs"
    wrapperDom:any
    sliderList:NodeListOf<Element>
    startTime:number
    endTime:number
    length:number
    scrollBox:HTMLElement = null
    scrollNav:Element = null
    scrollClassName:string = "stl-switch-scroll"
    scrollWidth:number
    scrollTransform:any
    scrollNavWidth:number
    moveAngle:any
    thumbsBox:any
    thumbsDom:any
    thumbsList:any
    thumbsStartLeft:any
    thumbsStartTop:any
    thumbsMoveFn:any
    thumbsEndFn:any
    thumbsStartTransform:any=0
    thumbsMaxScroll:any
    thumbsMoveKey:boolean = false
    thumbsMoveStart:any
    thumbsMoveEnd:any
    autoPlayKey:boolean = true
    autoPlayTimeout:any = null
    motionKey:boolean = false
    paginationBox:any
    paginationList:any
    navigatorLeftDom:any
    navigatorRightDom:any
    initParameter:parameter = {slidesPerView:1,autoHeight:false,speed:300,loop:false,}

    constructor(parent:HTMLElement,obj?:parameter){
        this.parent = parent;
        this.parameter = mergeOptions(this.initParameter,obj);//初始化参数
        this.parentWidth = this.parent.clientWidth;//获取父元素的宽度
        this.parentScrollWidth = this.parent.scrollWidth;//获取父元素内容的宽度
        this.wrapperDom = this.parent.getElementsByClassName(this.wrapperClassName)[0];//获取滚动元素
        this.sliderList = NodeListToArray(this.parent.querySelectorAll("."+this.sliderClassName));//获取table切换元素列表
        this.length = this.sliderList.length;
        if(this.parameter.loop){this.loopInit();}else{addClass(this.sliderList[0],"stl-switch-slider-active");}//判断是否允许循环切换
        if(obj){
            if(obj.autoHeight)addClass(this.parent,"stl-switch-autoheight"),this.wrapperDom.style.height = (<any>this.sliderList[this.item]).offsetHeight+"px";
            if(obj.scrollBar)this.getScrollBar(obj.scrollBar);
            if(obj.autoplay&&this.parameter.slidesPerView<this.length)this.autoPlayFn(obj.autoplay);
        };
        if(obj.thumbs&&this.parent.getElementsByClassName(this.thumbsClassName).length>0){
            this.thumbsBox = this.parent.getElementsByClassName(this.thumbsClassName)[0];
            this.getThumbsFn(obj.thumbs);
        }
        if(obj.pagination)this.getPagination(obj.pagination);
        if(obj.navigation)this.getNavigation(obj.navigation,this.parameter.loop);
        if(this.parameter.slidesPerView<this.length)this.addTouchFn();
    }
    private loopInit(){
        let sliderList = this.parent.getElementsByClassName(this.sliderClassName);
        let width = (<any>sliderList[sliderList.length-1]).offsetWidth;
        let firstNode = sliderList[0].cloneNode(true);
        let laseNode = sliderList[sliderList.length-1].cloneNode(true);
        addClass(this.sliderList[0],"stl-switch-slider-active");
        this.wrapperDom.appendChild(firstNode);
        this.wrapperDom.insertBefore(laseNode,sliderList[0]);
        this.wrapperDom.style.left = -width+"px";
    }
    private updateItem(item:number,move:boolean){
        removeClass(this.sliderList[this.item],"stl-switch-slider-active")
        let items = item<0?(move&&!this.parameter.loop?0:this.length-1):item>this.length-1?(move&&!this.parameter.loop?this.length-1:0):item;
        if(this.parameter.thumbs){this.updateThumbsItem(items);}else{this.item = items} 
        addClass(this.sliderList[this.item],"stl-switch-slider-active")
        let index:number = this.item;
        if(this.parameter.loop){
            let start = -1,end = this.length;
            index = item<start?this.length-1:item>end?0:item;
        };
        if(move&&this.parameter.thumbs&&this.parameter.thumbs.thumbsPerview&&this.parameter.thumbs.thumbsPerview<this.length)this.updateThumbsPosition();
        if(this.parameter.pagination)this.updatePagination()
        return -index*this.parentWidth;
    }
    private addTouchFn(){
        let that:any = this;
        this.touchmoveFn = (event:any)=>{
            let len:any = this.startLeft - event.changedTouches[0].clientX;
            let top:number = this.startTop - event.changedTouches[0].clientY;
            if(!that.moveKey)that.moveAngle = 180*Math.atan2(Math.abs(top),Math.abs(len))/Math.PI,that.moveKey = true;//根据拖动的角度是否小于45度判断是否为切换table
            if(that.moveAngle<=45){
                event.preventDefault();
                setTransformFn(that.wrapperDom,"translate3d("+(-len+JSON.parse(that.startTransform))+"px,0px,0px)");
                if(that.scrollBox){
                    let val = len*that.scrollWidth/that.parentScrollWidth+JSON.parse(that.scrollTransform);
                    let num = val<0?0:val>that.scrollWidth-that.scrollNavWidth?that.scrollWidth-that.scrollNavWidth:val;
                    setTransformFn(that.scrollNav,"translate3d("+num+"px,0px,0px)");
                }
            }
        }
        this.touchendFn = (event:any)=>{

            that.moveKey = false;
            if(that.moveAngle<=45){
                let len = this.startLeft - event.changedTouches[0].clientX;
                if(that.parameter.slidesPerView === 1){
                    that.endTime = new Date().getTime();
                    let num = len===0?0:Math.round(Math.abs(len)/that.parentWidth)*(Math.abs(len)/len);//四舍五入取切换值 当切换距离大于一个table的50%时 则切换到上（下）一张
                    if((that.endTime - that.startTime < 300)&&num<1&&(len>20||len<-20))num = Math.abs(len)/len;//时间小于300ms且移动距离大于20px则切换到下（上）一张
                    let item = that.item+num;
                   let number = that.updateItem.call(that,item,true);
                   that.updatePosition.call(that,number);
                   that.updateScroll();
                }else{
                    let step = -len+JSON.parse(that.startTransform);
                    let val = step>0?0:step<-that.parentScrollWidth+that.parentWidth?-that.parentScrollWidth+that.parentWidth:step;
                    that.updatePosition.call(that,val);
                }  
            }
            if(that.parameter.autoplay)this.autoPlayFn(that.parameter.autoplay);
            removeEvent(that.wrapperDom,"touchmove",that.touchmoveFn);
            removeEvent(that.wrapperDom,"touchend",that.touchendFn);
        }
        addEvent(that.wrapperDom,"touchstart",function(event:any){
            if(that.motionKey)return;
            that.autoPlayTimeout&&(clearTimeout(that.autoPlayTimeout),that.autoPlayTimeout = null);//如果开启了自动切换则关闭自动切换
            that.parameter.sliderStart&&that.parameter.sliderStart();//初始化的回调
            that.startTime = new Date().getTime();
            that.moveAngle = 90;
            that.startLeft= event.changedTouches[0].clientX;
            that.startTop = event.changedTouches[0].clientY;
            that.startTransform = getTransformFn(that.wrapperDom).split(",")[4];
            if(that.scrollBox)that.scrollTransform = getTransformFn(that.scrollNav).split(",")[4];//是否进度条
            addEvent(that.wrapperDom,"touchmove",that.touchmoveFn);
            addEvent(that.wrapperDom,"touchend",that.touchendFn);
        })
    }
    private updatePosition(number:number){
        let that = this;
        that.motionKey = true;
        setTransitionFn(that.wrapperDom,that.parameter.speed);
        setTransformFn(that.wrapperDom,"translate3d("+number+"px,0px,0px)");
        setTimeout(function(){
            that.motionKey = false;
            if(that.parameter.loop){
                let max = -that.parentWidth*(that.length-1);
                if(number>0)setTransformFn(that.wrapperDom,"translate3d("+max+"px,0px,0px)");
                if(number<max)setTransformFn(that.wrapperDom,"translate3d("+0+"px,0px,0px)");
            }
            setTransitionFn(that.wrapperDom);
        },that.parameter.speed);
        if(that.parameter.autoHeight)this.wrapperDom.style.height = (<any>this.sliderList[this.item]).offsetHeight+"px";
        this.parameter.sliderEnd&&this.parameter.sliderEnd.call(this);
    }
    private updateScroll(){
        let that = this;
        if(that.scrollBox){
            setTransitionFn(that.scrollNav,that.parameter.speed);
            let val = that.item*that.scrollNavWidth;
            setTransformFn(that.scrollNav,"translate3d("+val+"px,0px,0px)");
            setTimeout(function(){
                setTransitionFn(that.scrollNav);
            },300);
        }
    }
    private getScrollBar(obj:scrollBar){
        this.scrollBox = obj.el?obj.el:this.scrollBox = document.createElement("div");
        addClass(this.scrollBox,this.scrollClassName);
        let scrollStr:string = `<div class="stl-switch-scroll-bar" style="width:${100/this.length}%"><span style="width:${obj.dragSize?obj.dragSize:"100%"}"></span></div>`;
        this.scrollBox.innerHTML = scrollStr;
        this.parent.appendChild(this.scrollBox);
        this.scrollNav = this.scrollBox.getElementsByClassName("stl-switch-scroll-bar")[0];
        this.scrollWidth = this.scrollBox.scrollWidth;
        this.scrollNavWidth = this.scrollNav.clientWidth;
    }
    private autoPlayFn(obj:autoplay){
        let that = this;
        that.autoPlayTimeout&&(clearTimeout(that.autoPlayTimeout),that.autoPlayTimeout = null);
        that.autoPlayTimeout = setTimeout(function(){
            let index = that.item+1;
            let number = that.updateItem.call(that,index,false)
            that.updatePosition.call(that,number)
            that.updateScroll();
            that.autoPlayFn(obj);
        },obj.delay||3000)
    }
    private getThumbsFn(obj:thumbs){
        let str:string = "";
        for(let i=0;i<this.length;i++){
            str += `<div class="stl-switch-thumbs-slider ${i===0?"stl-switch-thumbs-active":""}" data-item="${i}" style="width:${(obj.thumbsPerview?100/obj.thumbsPerview:100/this.length)+"%"}">${obj.list[i]?obj.list[i]:""}</div>`;
        }
        let domStr:string = `<div class="stl-switch-thumbs-list">${str}</div>`;
        this.thumbsBox.innerHTML = domStr;
        this.thumbsDom = this.thumbsBox.getElementsByClassName("stl-switch-thumbs-list")[0]
        this.thumbsList = this.thumbsDom.getElementsByClassName("stl-switch-thumbs-slider");
        this.addThumbsEvent(obj)
        if(obj.thumbsPerview&&!this.parameter.autoplay&&obj.thumbsPerview<this.length){
            this.thumbsMaxScroll = this.thumbsDom.scrollWidth - this.thumbsBox.clientWidth;
            this.addThumbsSwitch()
        }
    }
    private updateThumbsItem(val:any){
        removeClass(this.thumbsList[this.item],"stl-switch-thumbs-active")
        this.item = val;
        addClass(this.thumbsList[this.item],"stl-switch-thumbs-active")
        
    }
    private updateThumbsPosition(){
        let width = this.thumbsList[0].offsetWidth;
        if(this.thumbsStartTransform-width>-width*this.item){
            this.thumbsStartTransform = -width*(this.item-this.parameter.thumbs.thumbsPerview+1);
            this.updateThumbsTransform.call(this,this.parameter.speed,"ease")
        }else if(this.thumbsStartTransform<-width*this.item){
            this.thumbsStartTransform = -width*(this.item>0?this.item-1:0);
            this.updateThumbsTransform.call(this,this.parameter.speed,"ease")
        }
    }
    private addThumbsEvent(obj:thumbs){
        let that =this;
        on({
            agent:that.thumbsBox,
            events:"click",
            ele:".stl-switch-thumbs-slider",
            fn:function(event:any){
                that.motionKey = true;
                let item = JSON.parse(event.getAttribute("data-item"))
                that.updateThumbsItem.call(that,item)
                let number = -that.item*that.parentWidth;
                that.updatePosition(number);
                that.updateScroll();
                obj.clickCallback&&obj.clickCallback.call(that);
            }
        })
    }
    private updateThumbsTransform(time:number,timing:string){
        let that = this;
        setTransitionFn(this.thumbsDom,time,timing);
        setTransformFn(this.thumbsDom,"translate3d("+this.thumbsStartTransform+"px,0px,0px)");
        setTimeout(function(){
            setTransitionFn(that.thumbsDom);
        },time);
    }
    private addThumbsSwitch(){
        let that = this;
        that.thumbsMoveFn = (event:any)=>{
            if(!that.thumbsMoveKey)that.thumbsMoveStart = new Date().getTime(),that.thumbsMoveKey = true;
            let len:any = this.thumbsStartLeft - event.changedTouches[0].clientX;
            let top:number = this.thumbsStartTop - event.changedTouches[0].clientY;
            let moveAngle = 180*Math.atan2(Math.abs(top),Math.abs(len))/Math.PI;
            if(moveAngle<=45){
                event.preventDefault();
                setTransformFn(that.thumbsDom,"translate3d("+(that.thumbsStartTransform-len)+"px,0px,0px)");
            }else{
                removeEvent(that.thumbsBox,"touchend",that.thumbsEndFn);
            }
        };
        that.thumbsEndFn = (event:any)=>{
            that.thumbsMoveKey = false;
            that.thumbsMoveEnd = new Date().getTime();
            let times = (that.thumbsMoveEnd-that.thumbsMoveStart)/1000;
            let time = times>1?1:times;
            let len = this.thumbsStartLeft - event.changedTouches[0].clientX;
            let speed = Math.abs(len)/time;
            let step = -(len+len*speed*0.0015)+that.thumbsStartTransform;
            that.thumbsStartTransform = step>0?0:step<-that.thumbsMaxScroll?-that.thumbsMaxScroll:step;
            that.updateThumbsTransform.call(that,500,"cubic-bezier(0,0.58,0.58,1)")
            removeEvent(that.thumbsBox,"touchmove",that.thumbsMoveFn);
            removeEvent(that.thumbsBox,"touchend",that.thumbsEndFn);
        };
        
        addEvent(that.thumbsBox,"touchstart",function(event:any){
            that.thumbsStartLeft= event.changedTouches[0].clientX;
            that.thumbsStartTop = event.changedTouches[0].clientY;
            that.startTransform = getTransformFn(that.thumbsDom).split(",")[4];
            addEvent(that.thumbsBox,"touchmove",that.thumbsMoveFn);
            addEvent(that.thumbsBox,"touchend",that.thumbsEndFn);
        })
    }
    private getPagination(obj:pagination){
        let str:string = "";
        for(let i=0;i<this.length;i++){
            str += `<em class="stl-switch-pagination-item ${i==0?"stl-switch-pagination-active":""}"></em>`
        };
        this.paginationBox = obj.ele?obj.ele:createEl("div",{className:"stl-switch-pagination"});
        this.paginationBox.innerHTML = str;
        if(!obj.ele)this.parent.appendChild(this.paginationBox);
        this.paginationList = this.paginationBox.getElementsByClassName("stl-switch-pagination-item");
    }
    private updatePagination(){
        removeClass(this.paginationBox.querySelector(".stl-switch-pagination-active"),"stl-switch-pagination-active");
        addClass(this.paginationList[this.item],"stl-switch-pagination-active")
    }
    private getNavigation(obj:navigation,loop:boolean){
        let that = this;
        let leftClassName = obj.autoHide?"stl_swiper_prev_btn stl_swiper_hide_btn":"stl_swiper_prev_btn";
        this.navigatorLeftDom = obj.prevEl?obj.prevEl:createEl("div",{className:leftClassName,innerHTML:"〈"})
        this.navigatorRightDom = obj.nextEl?obj.nextEl:createEl("div",{className:"stl_swiper_next_btn",innerHTML:"〉"})
        this.parent.appendChild(this.navigatorLeftDom)
        this.parent.appendChild(this.navigatorRightDom)
        this.navigationClickFn(obj,loop)
    }
    private navigationClickFn(obj:navigation,loop:boolean){
        let that = this;
        addEvent(that.navigatorLeftDom,"click",()=>{
            let item:any
            if(!loop){
                if(that.item == 0)return;
                item = that.item-1<0?0:that.item-1;
                if(item == 0){
                    if(obj.autoHide)addClass(that.navigatorLeftDom,"stl_swiper_hide_btn")
                }
            }else{
                item = that.item-1;
            }
            that.autoPlayTimeout&&(clearTimeout(that.autoPlayTimeout),that.autoPlayTimeout = null);//如果开启了自动切换则关闭自动切换
            let number = that.updateItem.call(that,item,true);
            that.updatePosition.call(that,number);
            that.updateScroll();
            removeClass(that.navigatorRightDom,"stl_swiper_hide_btn")
        })
        addEvent(that.navigatorRightDom,"click",()=>{
            let item:any
            if(!loop){
                if(that.item == that.length-1)return;
                item = that.item+1>that.length-1?that.length-1:that.item+1;
                if(item == that.length-1){
                    if(obj.autoHide)addClass(that.navigatorRightDom,"stl_swiper_hide_btn")
                }
            }else{
                item = that.item+1;
            }
            that.autoPlayTimeout&&(clearTimeout(that.autoPlayTimeout),that.autoPlayTimeout = null);//如果开启了自动切换则关闭自动切换
            let number = that.updateItem.call(that,item,true);
            that.updatePosition.call(that,number);
            that.updateScroll();
            removeClass(that.navigatorLeftDom,"stl_swiper_hide_btn")
        })
    }
}