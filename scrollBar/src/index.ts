/**/
import "./index.less"

import { addStyle,initScrollDom,refreshScrollDom } from "./dom"
import { domResize } from "./resize"
import { scrollSpecifiedPosition } from "./scroll"
interface option {
    id:string//需要滚动的元素的id
    direction?:string//滚动条方向  默认y
    size?:Number//滚动条的尺寸   默认值5
    smallSize?:number//滚动滑块的最小高度/宽度   默认值20  如果不需要设置最小高度则传0
    wheelDis?:number//每次滚动的距离   默认值40
    autoRefresh?:boolean//是否自动监听滚动高度变化  默认为true
    xMousewheel?:boolean//横向滚动条是否允许滚动鼠标滚轮滚动  只有在direction值为"x"时此参数才有效
    className?:string//滚动条需要添加的类名
}

interface domObj {
    "x":HTMLElement,
    "y":HTMLElement,
}

interface domSize {
    "x":number,
    "y":number,
}
interface positionScroll {
    left?:number,
    top?:number,
}
export class scrollBar{
    options:option//参数列表
    scrollParent:any//滚动元素的父元素 滚动条的位置将以此元素定位
    scrollBox:HTMLElement//需要滚动的元素
    scrollContentBox:HTMLElement//需要滚动的内容元素  设置自动兼容滚动内容变化时必须添加此元素
    contentDomSize:domSize = {"x":0,"y":0}//滚动元素的高度(y)/宽度(x)
    contentDomScrollSize:domSize = {"x":0,"y":0}//滚动元素的scrollHeight(y)/scrollWidth(x)
    scrollDom:domObj = {"x":null,"y":null}//滚动条元素对象
    sliderDom:domObj = {"x":null,"y":null}//滚动滑块元素对象
    scrollDomSize:domSize = {"x":0,"y":0}//滚动条的尺寸
    sliderDomSize:domSize = {"x":0,"y":0}//滚动画框的尺寸
    // isScrollMove:number = 0//是否正在拖动滚动条 0表示没有拖动  1表示
    startClient:domSize = {"x":0,"y":0}//鼠标按下的起始位置

    constructor(options:option){
        this.initOption(options);//初始化参数
        addStyle.call(this);//给需要添加滚动条的元素添加样式
        initScrollDom.call(this);//添加滚动元素
        if(this.options.autoRefresh){//自动监听内容变化
            domResize.call(this,this.options.id,refreshScrollDom)
        }
    }

    private initOption(options:option){//初始化参数
        this.options={
            id:options.id,
            autoRefresh:options.autoRefresh===undefined?true:options.autoRefresh,
            size:options.size||5,
            direction:options.direction||"y",
            className:options.className||"",
            smallSize:options.smallSize===undefined?20:options.smallSize,
            xMousewheel:options.xMousewheel===undefined?true:options.xMousewheel,
            wheelDis:options.wheelDis||40,
        };
        this.scrollBox = document.getElementById(options.id);
        this.scrollParent = this.scrollBox.parentNode;
    }

    refresh(){//手动刷新滚动条的方法
        refreshScrollDom.call(this,true)
    }
    fixedPointScroll(obj:positionScroll){
        scrollSpecifiedPosition.call(this,obj)
    }
}


//  let ScrollBar:any = new scrollBar({id:"box2",smallSize:40,wheelDis:20,autoRefresh:false})
//  let index:number = 20;
//  let domObj:any = document.getElementById("box2");


//  let timer = setInterval(function(){
//     index--;
//     let childDom:any = document.createElement("p");
//     childDom.innerText = "新加元素"+index;
//     domObj.appendChild(childDom)
//     if(index<0){
//         clearInterval(timer);
//         ScrollBar.refresh();
//     }
//  },500)
//   let ScrollBar1:any = new scrollBar({id:"box4",direction:"x",size:10,xMousewheel:false})
//  let ScrollBar2:any = new scrollBar({id:"box6",direction:"xy",className:"scroll_class"})