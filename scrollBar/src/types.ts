
export interface option {
    id:string//需要滚动的元素的id
    direction?:string//滚动条方向  默认y
    size?:Number//滚动条的尺寸   默认值5
    smallSize?:number//滚动滑块的最小高度/宽度   默认值20  如果不需要设置最小高度则传0
    wheelDis?:number//每次滚动的距离   默认值40
    autoRefresh?:boolean//是否自动监听滚动高度变化  默认为true
    xMousewheel?:boolean//横向滚动条是否允许滚动鼠标滚轮滚动  只有在direction值为"x"时此参数才有效
    className?:string//滚动条需要添加的类名
}

export interface domObj {
    "x":HTMLElement,
    "y":HTMLElement,
}

export interface domSize {
    "x":number,
    "y":number,
}

export interface mousewheelObj {
    scrollNumber:number,
    sliderScale:number,
}

export interface scaleObj {
    scrollRange:number,
    sliderRange:number,
    scrollNumber:number,
    scrollType:string,
    transformType:string,
}
