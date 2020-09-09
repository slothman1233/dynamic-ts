
export interface domSize{//元素的尺寸
    width:number
    height:number
}

export interface option{
    ele:Element//需要裁剪的图片元素
    src?:string//初始化裁剪框内显示的图片地址
    inputBox?:HTMLElement//上传图片的input框 （必须设置type="file"）
    addStyle?:boolean//是否需要添加样式  true：通过js的方式添加style标签，false:不会通过js的方式添加样式   需要手动引入css文件
    previewBox?:Element|HTMLCollectionOf<Element>//预览的元素（列表）
    zoomMultiple?:number//图片可缩放的倍数  默认20倍
    zoomScale?:number//每次缩放的比例  默认0.05
    cropperBoxWidth?:number//裁剪框初始宽度  默认200
    cropperBoxHeight?:number//裁剪框初始高度  默认200
    fixedCropSize?:boolean//是否固定裁剪框尺寸  默认false
    moveStep?:number//点击移动裁剪框按钮每次移动的距离  默认为10
    magnifyBtn?:HTMLElement//点击放大图片的按钮
    shrinkBtn?:HTMLElement//点击缩小图片的按钮
    moveLeftBtn?:HTMLElement//点击向左移动裁剪框的按钮
    moveRightBtn?:HTMLElement//点击向右移动裁剪框的按钮
    moveUpBtn?:HTMLElement//点击向上移动裁剪框的按钮
    moveDownBtn?:HTMLElement//点击向下移动裁剪框的按钮
    getImgBtn?:HTMLElement//点击获取裁剪后图片的按钮
    cropInitComplete?:()=>void//裁剪框dom初始化完成的回调
    inputImgComplete?:(this:any)=>void//添加本地图片完成的回调
    getImgCallback?:(src:string|object)=>void//获取裁剪后图片成功的回调
}

export interface dragValue {//拖拽值对象
    x:number,
    y:number,
}



























export interface proportionModel {
    imageUrl: string //图片地址
    parentEle?: Element //容器元素
    thumbnailSize?: Array<number> //缩略图片的尺寸 已宽为准 默认[120, 80, 40]
    InterceptWidth?: number //裁剪区域的宽            默认400
    InterceptHeight?: number //裁剪区域的高            默认400
    VirtualEdge?: number //半透明的大小        默认50 最高100
    BrokerRadius?: boolean //是否需要圆角的蒙版  默认false
    Isthumbnail?: boolean //是否需要缩略图      默认true
    narrowDom?: Element //点击执行缩小的元素
    enlargeDom?: Element //点击执行放大的元素
    Wheel?: number //点击放大缩小每次的大小  默认10px
    mousemoveCallback?: Function//拖动中的回调 mousemoveCallback(data)
    zoomCallback?: Function //缩放或者拖动后的回调 zoomCallback(data)
    //data {imageUrl:图片地址,width:缩略图的宽,height:缩略图的高,x:截取的X坐标,y:截取的Y坐标,CoordinateWidth:截取的宽,CoordinateHeight:截取的高}

}

export interface proportionsModel extends proportionModel {
    allWidth?: number //上传头像框的总宽  
    allHeight?: number //上传头像框的总高   
    ImageWidth?: number //原图片的宽
    ImageHeight?: number //原图片的高
}

