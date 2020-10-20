export interface option {
    sliderWindowId:string//轮播框元素id
    sliderDomId?:string//需要轮播的元素id 如果不传则默认找轮播框元素的第一个子元素
    sliderListName?:string//轮播元素列表 "li"、".list" 如果不传则默认找需要轮播元素的所有子元素
    direction?:string//移动方向。"left"：默认值  向左，"right":向右，"top":向上，"bottom":向下
    intervals?:number//间隔时间 不传则为无缝滚动

    step?:number//每次移动的步长 决定移动的速度(无缝滚动时有用) 默认为5

    distance?:string|number//轮播一张图片运动的距离（intervals不为0时有用）"auto":默认值 每次移动距离为轮播框父元素的宽度，当传入数字时移动距离为传入的数字      
    time?:number//轮播单张图片需要的时间 （轮播时有用） 默认500ms
    item?:boolean//是否显示下标 （轮播时有用）  默认为true
    switch?:boolean//是都显示左右切换按钮 （轮播时有用） 默认为true
    auto?:boolean//是否自动移动 （轮播时有用）  默认为true
    hover?:boolean//hover时是否停止运动 （auto值为true时有用）默认为true
    switchType?:string//左右切换按钮显示方式  "auto" ：一直显示（默认值），"hover":鼠标移入时显示
    switchCallback?:(type:any,distance:any,clickDom:HTMLElement,showDom:HTMLElement)=>void//点击切换后的回调
}