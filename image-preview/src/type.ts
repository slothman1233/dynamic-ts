export interface imgMagnificationModel{
    parentEle:any;//图片集合的父元素或者元素字符串
    key?:string;//生成预览框的类型  "simg":简单图片预览框，"img":带缩放功能的图片预览框（默认），"video":视频预览框
    prevBgImg?:string;//上一张按钮图片 默认有图片
    nextBgImg?:string;//下一张按钮图片 默认有图片
    closeBgImg?:string;//关闭按钮图片 默认有图片
    bigBgImg?:string;//放大按钮图片  默认有图片
    smallBgImg?:string;//缩小按钮图片 默认有图片
    IsBox?:boolean;//是否需要显示背景 默认true
    isPaging?:boolean;//是否需要翻页 默认true
    titleUp?:boolean;//是否需要收起标题按钮  默认false
    titlePosition?:number;//标题层的位置   1表示在图片底部，2表示在页面底部   默认是1
    videoWdith?:number;//视频预览的宽度
    clickCallback?:(dom:any,ev:any)=>boolean;//点击小图显示预览框前的回调
}