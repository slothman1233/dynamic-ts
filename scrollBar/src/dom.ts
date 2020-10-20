import {boundEventFn} from "./boundEvent"

function initAddScrollJudgment(type:string,domAttr:string,scrollAttr:string):void{//初始化滚动条判断是否需要初始化生成滚动条
    getScrollContentHeight.call(this,type,domAttr,scrollAttr);//获取滚动框的高度/宽度 及滚动内容的高度/宽度
    if(this.contentDomScrollSize[type]>this.contentDomSize[type]){//内容超出才生成滚动条
        createScrollDom.call(this,type);//添加滚动条dom
        getScrollDomSize.call(this,type,domAttr);//设置滚动条尺寸
    }
}

function refreshAddScrollJudgment(type:string,domAttr:string,scrollAttr:string):void{//刷新滚动条判断是否生成滚动条
    // getScrollContentHeight.call(this,type,domAttr,scrollAttr);//获取滚动框的高度/宽度 及滚动内容的高度/宽度
    if(this.contentDomScrollSize[type]<=this.contentDomSize[type]){//内容未超出
        if(this.scrollDom[type]){//已有滚动条则隐藏
            this.scrollDom[type].style.display = "none";
        }
        return;
    }
    if(this.contentDomSize[type]){//已有滚动条则刷新滚动条高度
        getScrollDomSize.call(this,type,domAttr);
    }else{//没有滚动条则添加滚动条
        createScrollDom.call(this,type);//添加滚动条dom
        getScrollDomSize.call(this,type,domAttr);//设置滚动条尺寸
    }
}

function getScrollContentHeight(type:string,domAttr:string,scrollAttr:string):void{//获取滚动框的高度/宽度 及滚动内容的高度/宽度
    this.contentDomSize[type] = this.scrollBox[domAttr];
    this.contentDomScrollSize[type] = this.scrollBox[scrollAttr];
}

function createScrollDom(type:string):void{//根据类型添加滚动条
    let className:string = "stl_"+type+"scroll_box";
    this.scrollDom[type] = document.createElement("div");
    this.sliderDom[type] = document.createElement("div");
    this.scrollDom[type].className = this.options.className=== "" ?className:className+" "+this.options.className;//添加类名
    if(type==="y"){//设置滚动条的宽度/高度
        this.scrollDom[type].style.width = this.options.size+"px";
    }else{
        this.scrollDom[type].style.height = this.options.size+"px";
    }
    this.scrollDom[type].appendChild(this.sliderDom[type]);
    this.scrollParent.appendChild(this.scrollDom[type]);
    boundEventFn.call(this,type)//绑定事件
}

function getScrollDomSize(type:string,domAttr:string):void{//设置滚动条的高度/宽度
    this.scrollDomSize[type] = this.scrollDom[type][domAttr];
    let scrollDomSize:number = this.contentDomSize[type]*this.scrollDomSize[type]/this.contentDomScrollSize[type];
    this.sliderDomSize[type] = scrollDomSize>this.options.smallSize?scrollDomSize:this.options.smallSize;
    if(type==="x"){
        this.sliderDom[type].style.width = this.sliderDomSize[type]+"px";
    }else{
        this.sliderDom[type].style.height = this.sliderDomSize[type]+"px";
    }
}

export function addStyle():void{//给元素添加样式
    const parentStyle:any = getComputedStyle(this.scrollParent,null);
    if(parentStyle.position!=="relative"){//父元素设置样式
        this.scrollParent.style.position = "relative";
    };
    // const scrollStyle:any = getComputedStyle(this.scrollBox,null)
    // if(scrollStyle.overflow!=="hidden"){
    //     this.scrollBox.style.overflow = "hidden";
    // };
}

export function initScrollDom(){//初始化添加滚动条元素
    switch(this.options.direction){
        case "x":
             initAddScrollJudgment.call(this,"x","clientWidth","scrollWidth");
            break;
        case "y":
            initAddScrollJudgment.call(this,"y","clientHeight","scrollHeight");
            break;
        case "xy":
            initAddScrollJudgment.call(this,"x","clientWidth","scrollWidth");
            initAddScrollJudgment.call(this,"y","clientHeight","scrollHeight");
            break;
        default:
            initAddScrollJudgment.call(this,"y","clientHeight","scrollHeight");
    }
}

export function refreshScrollDom(){//触发刷新滚动条
    switch(this.options.direction){
        case "x":
            this.contentDomScrollSize["x"] = this.scrollBox.scrollWidth;//重新获取滚动内容的高度
            refreshAddScrollJudgment.call(this,"x","clientWidth","scrollWidth");
            break;
        case "y":
            this.contentDomScrollSize["y"] = this.scrollBox.scrollHeight;
            refreshAddScrollJudgment.call(this,"y","clientHeight","scrollHeight");
            break;
        case "xy":
            this.contentDomScrollSize["x"] = this.scrollBox.scrollWidth;
            this.contentDomScrollSize["y"] = this.scrollBox.scrollHeight;
            refreshAddScrollJudgment.call(this,"x","clientWidth","scrollWidth");
            refreshAddScrollJudgment.call(this,"y","clientHeight","scrollHeight");
            break;
        default:
            this.contentDomScrollSize["y"] = this.scrollBox.scrollHeight;
            refreshAddScrollJudgment.call(this,"y","clientHeight","scrollHeight");
    }
}

