import "./index.less";
import { option,domSize,dragValue } from "./type";
import { mergeOptions,addEvent,removeEvent } from "@stl/tool-ts/src/common/compatible";
import { show } from "@stl/tool-ts/src/common/dom/show";
import { hide } from "@stl/tool-ts/src/common/dom/hide";
import { addStyleFn,IE_VERSION,getImageSize,getTransform } from "./util"
import { IMG_CROPPER_INPUT_TEMPLATE,IMG_CROPPER_BOX_TEMPLATE } from "./template"

export class imageCropper {
    private option:option
    private width:number//裁剪框父元素的宽度
    private height:number//裁剪框父元素的高度
    private eleType:string//传入的元素类型
    private fileSrc:string//裁剪的图片地址
    private previewList:Array<HTMLElement>//预览元素数组
    private $inputBox:HTMLElement//上传图片的input框
    private $cropperViewBox:HTMLElement//添加裁剪图片的父元素
    private $cropperContainer:HTMLElement//裁剪部分的父元素
    private $cropperinputBox:HTMLElement//上传图片input框的父元素
    private $cropperCropBox:HTMLElement//裁剪框
    private $cropperCanvasBox:HTMLElement//显示裁剪图片的元素
    private $cropperDragBox:HTMLElement//裁剪框透明背景层
    private $cropperFaceBox:HTMLElement//裁剪框内部元素
    private $cropperLineE:HTMLElement//缩放裁剪框元素
    private $cropperPointE:HTMLElement//缩放裁剪框元素
    private $cropperPointNe:HTMLElement//缩放裁剪框元素
    private $cropperLineN:HTMLElement//缩放裁剪框元素
    private $cropperPointN:HTMLElement//缩放裁剪框元素
    private $cropperPointNw:HTMLElement//缩放裁剪框元素
    private $cropperLineW:HTMLElement//缩放裁剪框元素
    private $cropperPointW:HTMLElement//缩放裁剪框元素
    private $cropperPointSw:HTMLElement//缩放裁剪框元素
    private $cropperLineS:HTMLElement//缩放裁剪框元素
    private $cropperPointS:HTMLElement//缩放裁剪框元素
    private $cropperPointSe:HTMLElement//缩放裁剪框元素

    private cropperScale:number//裁剪框长宽比例
    private dragDom:HTMLElement//当前拖拽的元素
    private dragPosition:dragValue = {x:0,y:0}//拖拽的起始位置
    private zoom:number=1//图片当前缩放比例
    private zoomNumber:number//当前放大或缩小的值
    private imgSize:object = {}//裁剪的图片原尺寸
    private canvasSize:object = {}//图片的尺寸对象
    private initCanvasSize:object = {}//初始的图片尺寸对象
    private cropperSize:object = {}//裁剪框尺寸对象
    private previewObj:Array<object> = []//预览框尺寸对象数组

    magnifyFn:()=>void = ()=>{}//放大图片的回调方法
    shrinkFn:()=>void = ()=>{}//缩小图片的回调方法
    moveLeftFn:()=>void=()=>{}//裁剪框左移的回调方法
    moveRightFn:()=>void=()=>{}//裁剪框右移的回调方法
    moveUpFn:()=>void=()=>{}//裁剪框上移的回调方法
    moveDownFn:()=>void=()=>{}//裁剪框下移的回调方法
    constructor(optionObj:option){
        this.initOption(optionObj)//初始化参数
        if(this.option.addStyle){//通过js的方式添加样式
            addStyleFn();
        }
        this.initFn()//初始化方法
    }
    private initOption(option:option){//初始化参数的方法
        const obj:Object = {
            addStyle:true,
            zoomMultiple:20,
            zoomScale:0.05,
            cropperBoxWidth:200,
            cropperBoxHeight:200,
            fixedCropSize:false,
            moveStep:10,
            getImgCallback:null,
        };
        this.option = mergeOptions({},obj,option);
    }
    private initFn(){//初始化方法
        let that:any = this,type = that.option.fixedCropSize?2:1;
        that.cropperScale = that.option.cropperBoxWidth/that.option.cropperBoxHeight;
        that.option.ele.innerHTML = IMG_CROPPER_BOX_TEMPLATE(type);
        that.getDom()//获取dom及父元素尺寸
        that.getContainerStyle();
        that.option.cropInitComplete&&that.option.cropInitComplete.call(that);//裁剪框元素初始化完成的回调
        if(that.option.src){//如果传入了初始化图片则添加图片
             that.fileSrc = that.option.src;
            //that.getBase64(that.option.src);
             getImageSize.call(that,that.fileSrc,that.inputFn)//获取上传的图片尺寸
        }
        if(that.option.inputBox){//如果传入了上传图片标签则添加上传图片事件
            if(that.option.inputBox.tagName!=="INPUT"||that.option.inputBox.type!=="file")return console.log("上传图片标签不是input标签或者type不为file")
            that.$inputBox = that.option.inputBox;
            that.addInputEvent();
        }
        that.stateCallback();//声明回调方法
    }
    private getBase64(imgUrl:string){
        let that:any = this;
        if(imgUrl.indexOf("http://")>=0||imgUrl.indexOf("https://")>=0){
            window.URL = window.URL || (<any>window).webkitURL;
            var xhr = new XMLHttpRequest();
            xhr.open("get", imgUrl, true);
            // 至关重要
            xhr.responseType = "blob";
            xhr.onload = function () {
              if (this.status == 200) {
                //得到一个blob对象
                var blob = this.response;
                // 至关重要
                let oFileReader = new FileReader();
                oFileReader.onloadend = function (e:any) {
                  // 此处拿到的已经是 base64的图片了
                  that.fileSrc = e.target.result;
                  getImageSize.call(that,that.fileSrc,that.inputFn)//获取上传的图片尺寸
                  //console.log("方式一》》》》》》》》》", base64)
                };
                oFileReader.readAsDataURL(blob);
              }
            }
            xhr.send();
        }else{
            that.fileSrc = imgUrl;
            getImageSize.call(that,that.fileSrc,that.inputFn)//获取上传的图片尺寸
        }
    }
    changeImg(src:string){//更改图片的回调
        let that:any = this;
         that.fileSrc = src;
         getImageSize.call(that,that.fileSrc,that.inputFn)//获取上传的图片尺寸
        //that.getBase64(src);
    }
    private getContainerStyle(){//设置裁剪父元素样式
        let that:any = this;
        that.$cropperContainer.className +=" cropper-bg"; //设置裁剪框背景
        that.$cropperContainer.style.width = that.width+"px";//设置裁剪背景框尺寸
        that.$cropperContainer.style.height = that.height+"px";
        that.$cropperDragBox.className +=" cropper-modal cropper-move";//设置透明背景层
        that.$cropperFaceBox.className += " cropper-move";
    }
    private getDom(){//获取dom及父元素尺寸
        let that:any = this;
        let parentDom:HTMLElement = that.option.ele;
        that.width = parentDom.clientWidth;
        that.height = parentDom.clientHeight;
        that.$cropperContainer = parentDom.getElementsByClassName("cropper-container")[0];        
        that.$cropperCropBox = parentDom.getElementsByClassName("cropper-crop-box")[0];
        that.$cropperViewBox = that.$cropperCropBox.getElementsByClassName("cropper-view-box")[0];
        that.$cropperCanvasBox = parentDom.getElementsByClassName("cropper-canvas")[0];
        that.$cropperDragBox = parentDom.getElementsByClassName("cropper-drag-box")[0];
        that.$cropperFaceBox = that.$cropperCropBox.getElementsByClassName("cropper-face")[0];
        that.$cropperLineE = that.$cropperCropBox.getElementsByClassName("line-e")[0];
        that.$cropperPointE = that.$cropperCropBox.getElementsByClassName("point-e")[0];
        that.$cropperPointNe = that.$cropperCropBox.getElementsByClassName("point-ne")[0];
        that.$cropperLineN = that.$cropperCropBox.getElementsByClassName("line-n")[0];
        that.$cropperPointN = that.$cropperCropBox.getElementsByClassName("point-n")[0];
        that.$cropperPointNw = that.$cropperCropBox.getElementsByClassName("point-nw")[0];
        that.$cropperLineW = that.$cropperCropBox.getElementsByClassName("line-w")[0];
        that.$cropperPointW = that.$cropperCropBox.getElementsByClassName("point-w")[0];
        that.$cropperPointSw = that.$cropperCropBox.getElementsByClassName("point-sw")[0];
        that.$cropperLineS = that.$cropperCropBox.getElementsByClassName("line-s")[0];
        that.$cropperPointS = that.$cropperCropBox.getElementsByClassName("point-s")[0];
        that.$cropperPointSe = that.$cropperCropBox.getElementsByClassName("point-se")[0];
    }
    private addInputEvent(){//注册上传本地图片事件
        let that:any = this;
        addEvent(that.$inputBox,"input",function(e:any){
            let ie_version:string|number = IE_VERSION();
            if(ie_version!=="edge"&&ie_version>0&&ie_version<10){
                that.fileSrc = e.target.value;
            }else{
                const file:any = this.files[0];
                that.fileSrc = file?URL.createObjectURL(file):"";//获取上传的图片
            }
            that.option.inputImgComplete&&that.option.inputImgComplete.call(that,this);
            e.target.type = "text";
            e.target.type = "file";
            if(that.fileSrc&&that.fileSrc!==""){
                getImageSize.call(that,that.fileSrc,that.inputFn)//获取上传的图片尺寸
            }
        })
    }
    private inputFn(size:domSize){//获取上传图片尺寸后的回调
        let that:any = this;
        that.dragPosition = {x:0,y:0}//拖拽的起始位置
        that.zoom=1//图片当前缩放比例
        that.zoomNumber=0//当前放大或缩小的值
        that.computeCanvasSize(size);
        that.computeCropperSize();
        show(that.$cropperContainer);//显示裁剪框
        that.addCropperEvent();
        that.previewImg();
    }
    private previewImg(){//预览框参数处理
        let that:any = this;
        if(!that.option.previewBox)return;
        if(that.previewObj.length>0){
            for(let y=0;y<that.previewObj.length;y++){
                that.previewObj[y].imgBox.src = that.fileSrc;
                that.getPreviewImgSize(y);
            }
        }else{
            that.previewList = (Object.prototype.toString.call(that.option.previewBox) === "[object HTMLCollection]"||Object.prototype.toString.call(that.option.previewBox) === "[object Array]")?
                that.option.previewBox:[that.option.previewBox];
            for(let i=0;i<that.previewList.length;i++){
                that.addPreviewImg(that.previewList[i],i);
            }
        }
    }
    private addPreviewImg(dom:HTMLElement,index:number){//添加预览图片
        let that:any = this;
        that.previewObj.push({
            previewWidth:dom.clientWidth,
            previewHeight:dom.clientHeight,
            imgBox:document.createElement("img")
        });
        let imgBox:any = that.previewObj[index].imgBox;
        imgBox.src = that.fileSrc;
        that.getPreviewImgSize(index);
        dom.appendChild(imgBox);
    }
    private updatePreviewImgSize(){//更新预览图片的尺寸位置
        let that:any = this;
        if(that.previewObj.length===0)return;
        for(let i=0;i<that.previewObj.length;i++){
            that.getPreviewImgSize(i);
        };
    }
    private getPreviewImgSize(index:number){//设置预览图片的尺寸位置
        let that:any = this,imgBox:any = that.previewObj[index].imgBox;
        imgBox.style.width = (that.canvasSize.width*that.previewObj[index].previewWidth/that.cropperSize.width)+"px";
        imgBox.style.height = (that.canvasSize.height*that.previewObj[index].previewHeight/that.cropperSize.height)+"px";
        getTransform(imgBox,`translate(${(that.canvasSize.x-that.cropperSize.x)*that.previewObj[index].previewWidth/that.cropperSize.width}px,
                            ${(that.canvasSize.y-that.cropperSize.y)*that.previewObj[index].previewHeight/that.cropperSize.height}px)`);
    }
    private computeCanvasSize(size:domSize){//根据图片尺寸计算裁剪框及背景的尺寸、位置
        let that:any = this;
        that.imgSize.width = size.width;
        that.imgSize.height = size.height;
        let aspectRatio:number = size.width/size.height;//获取图片的宽高比例
        let canvasWidth:number = that.width;
        let canvasHeight:number = that.height;
        if(that.width*aspectRatio>that.height){//计算裁剪框背景图片的宽高
            canvasHeight = that.width/aspectRatio;
        }else{
            canvasWidth = that.height*aspectRatio;
        }
        that.canvasSize = {
            width:canvasWidth,
            height:canvasHeight,
            x:that.width>canvasWidth?(that.width-canvasWidth)/2:0,
            y:that.height>canvasHeight?(that.height-canvasHeight)/2:0,
        }
        that.initCanvasSize = JSON.parse(JSON.stringify(that.canvasSize));//保存裁剪框背景图片宽高的初始值
        that.addImage(canvasWidth,canvasHeight)//添加图片
        that.getCanvasSize()//设置背景框尺寸
    }
    private computeCropperSize(){//计算裁剪框的尺寸、位置
        let that:any = this;
        that.cropperSize = {
            width:that.option.cropperBoxWidth,
            height:that.option.cropperBoxHeight,
            x:(that.width-that.option.cropperBoxWidth)/2,
            y:(that.height-that.option.cropperBoxHeight)/2
        }
        that.getCropperSize();//设置裁剪框尺寸
    }
    private addImage(canvasWidth:number,canvasHeight:number){//添加图片
        let that:any = this;
        let imgStr:string = `<img src="${that.fileSrc}" style="width:${canvasWidth}px;height:${canvasHeight}px" />`;
        that.$cropperViewBox.innerHTML = imgStr;//添加图片
        that.$cropperCanvasBox.innerHTML = imgStr;
    }
    private getCanvasSize(key?:boolean){//设置背景图片框尺寸
        let that:any = this;
        that.$cropperCanvasBox.style.width = that.canvasSize.width+"px";//设置图片尺寸
        that.$cropperCanvasBox.style.height = that.canvasSize.height+"px";
        getTransform(that.$cropperCanvasBox,`translate(${that.canvasSize.x}px, ${that.canvasSize.y}px)`);
        if(key){
            let canvasImgDom:HTMLElement = that.$cropperCanvasBox.getElementsByTagName("img")[0];
            canvasImgDom.style.width = that.canvasSize.width+"px";
            canvasImgDom.style.height = that.canvasSize.height+"px";    
        }
    }
    private getCropperSize(){//设置裁剪框尺寸
        let that:any = this;
        that.$cropperCropBox.style.width = that.cropperSize.width+"px";
        that.$cropperCropBox.style.height = that.cropperSize.height+"px";
        getTransform(that.$cropperCropBox,`translate(${that.cropperSize.x}px, ${that.cropperSize.y}px)`);
        that.getCropperImgSize();
    }
    private getCropperImgSize(key?:boolean){//设置裁剪框内图片的尺寸及位置
        let that:any = this;
        let cropperImg:HTMLElement = that.$cropperCropBox.getElementsByTagName("img")[0];
        getTransform(cropperImg,`translate(${that.canvasSize.x-that.cropperSize.x}px, ${that.canvasSize.y-that.cropperSize.y}px)`);
        if(key){
            cropperImg.style.width = that.canvasSize.width+"px";
            cropperImg.style.height = that.canvasSize.height+"px";
        }
    }
    private addCropperEvent(){//事件绑定
        let that:any = this;
        const USER_AGENT: string = window.navigator && window.navigator.userAgent || '';
        const IS_FIREFOX: Boolean = (/Firefox/i).test(USER_AGENT);//判断是否是火狐浏览器
        //-------滚动鼠标滚轮----
        let onMousewheel:(event:any)=>void = function(event:any){
            let ev:any = event||window.event;
            that.mousewheelFn.call(that,ev);
            that.updatePreviewImgSize();
        }
        if(IS_FIREFOX){//滚动鼠标滚轮放大图片兼容火狐浏览器
            removeEvent(that.option.ele,"DOMMouseScroll",onMousewheel);
            addEvent(that.option.ele,"DOMMouseScroll",onMousewheel)
        }else{
            removeEvent(that.option.ele,"mousewheel",onMousewheel);
            addEvent(that.option.ele,"mousewheel",onMousewheel)
        }
        //-------拖拽-----
        let onMousedown:(event:any)=>void = function(event:any){//鼠标按下执行的方法
            let ev:any = event||window.event;
            that.dragDom = ev.target;
            that.dragPosition = {
                x:ev.clientX,
                y:ev.clientY,
            }
        }
        removeEvent(that.option.ele,"mousedown",onMousedown);
        addEvent(that.option.ele,"mousedown",onMousedown)//鼠标按下事件

        let onMousemove:(event:any)=>void = function(event:any){//拖拽时执行的方法
            if(!that.dragDom)return;
            
            let ev:any = event||window.event;
            let dragDistance:dragValue = {//拖拽距离的计算
                x:ev.clientX-that.dragPosition.x,
                y:ev.clientY-that.dragPosition.y,
            }
            that.dragPosition.x = ev.clientX;
            that.dragPosition.y = ev.clientY;
            that.mousemoveTypeFn(dragDistance);
            that.updatePreviewImgSize();
        }
        removeEvent(document,"mousemove",onMousemove);
        addEvent(document,"mousemove",onMousemove)//拖拽事件
        let onMouseup:(event:any)=>void = function(){//鼠标松开执行的方法
            that.dragDom = null;
            that.dragPosition = {x:0,y:0,}
        }
        removeEvent(document,"mouseup",onMouseup);
        addEvent(document,"mouseup",onMouseup)//鼠标松开事件

    }
    private mousewheelFn(event:any){//滚动鼠标滚轮执行的方法
        try {
            if (event && event.preventDefault) {
                event.preventDefault();//阻止默认浏览器动作(W3C)
            } else {
                window.event.returnValue = false;//IE中阻止函数器默认动作的方式 
            }
        } catch (e) { }
        let that:any = this,down:any;
        try{down = event.wheelDelta|| - event.detail }catch(e){};
        that.zoomNumber = down>0?that.option.zoomScale:-that.option.zoomScale;//计算缩放比例
        let newZoom:number = that.zoom+that.zoomNumber;
        that.imgZoomFn(newZoom);
    }
    private imgZoomFn(newZoom:number){//根据缩放比例重新设置图片大小
        let that:any = this;
        if(newZoom<1/that.option.zoomMultiple||newZoom>that.option.zoomMultiple)return "已超出最大缩放尺寸";
        that.zoom=newZoom;
        that.canvasSize.width = that.initCanvasSize.width*that.zoom;
        that.canvasSize.height = that.initCanvasSize.height*that.zoom;
        that.canvasSize.x -= that.initCanvasSize.width*that.zoomNumber/2;
        that.canvasSize.y -= that.initCanvasSize.height*that.zoomNumber/2;
        that.getCanvasSize(true);
        that.getCropperImgSize(true);
    }
    private mousemoveTypeFn(dragDistance:dragValue){//根据拖拽元素的不同执行不同的操作
        let that:any = this;
        if(that.option.fixedCropSize){//如果固定
            switch(that.dragDom){
                case that.$cropperDragBox://拖拽图片
                    that.mousemoveImgFn(dragDistance);
                    break;
                case that.$cropperFaceBox://拖拽裁剪框内部
                    that.mousemoveCropperFn(dragDistance);
                    break;
            }
        }else{
            switch(that.dragDom){
                case that.$cropperDragBox://拖拽图片
                    that.mousemoveImgFn(dragDistance);
                    break;
                case that.$cropperFaceBox://拖拽裁剪框内部
                    that.mousemoveCropperFn(dragDistance);
                    break;
                case that.$cropperLineE:case that.$cropperPointE://右
                    that.cropperRight(dragDistance);
                    that.cropperTransform();
                    break;
                case that. $cropperLineS:case that.$cropperPointS://下
                    that.cropperDown(dragDistance);
                    that.cropperTransform();
                    break;
                case that.$cropperPointSe://右下角
                    that.cropperRightDown(dragDistance);
                    break;
                case that.$cropperPointNe://右上角
                    that.cropperRightUp(dragDistance);
                    that.cropperTransform();
                    break;
                case that.$cropperLineN:case that.$cropperPointN://上
                    that.cropperUp(dragDistance);
                    that.cropperTransform();
                    break;
                case that.$cropperLineW:case that.$cropperPointW://左
                    that.cropperLeft(dragDistance);
                    that.cropperTransform();
                    break;
                case that.$cropperPointNw://左上角
                    that.cropperLeftUp(dragDistance);
                    that.cropperTransform();
                    break;
                case that.$cropperPointSw://左下角
                    that.cropperLeftDown(dragDistance);
                    that.cropperTransform();
                    break;
            }
        }
        
    }
    private moveReturn(){
        let that:any = this;
        that.dragDom = null;
        that.dragPosition = {
            x:0,
            y:0,
        }
    }
    private cropperRight(dragDistance:dragValue){//裁剪框往右放大的方法
        let that:any = this;
        if(that.cropperSize.y-dragDistance.x/(2*that.cropperScale)<=0)return;//裁剪框上边超出
        if(that.cropperRightDown(dragDistance))
            that.cropperSize.y-=(dragDistance.x/(2*that.cropperScale));
    }
    private cropperDown(dragDistance:dragValue){//裁剪框往下放大的方法
        let that:any = this;
        if(that.cropperSize.x-dragDistance.y*that.cropperScale/2<=0)return;//裁剪框左边超出
        if(that.cropperSize.width+dragDistance.y*that.cropperScale/2+that.cropperSize.x>=that.width)return;//裁剪框右边超出
        if(that.cropperSize.height + dragDistance.y+that.cropperSize.y>=that.height)return;//裁剪框下边超出
        if(that.cropperSize.width + dragDistance.y*that.cropperScale<=10||that.cropperSize.height + dragDistance.y<=10)return;//裁剪框高宽为0
        that.cropperSize.x-=(dragDistance.y*that.cropperScale/2);
        that.cropperSize.width += dragDistance.y*that.cropperScale;
        that.cropperSize.height += dragDistance.y;
        that.$cropperCropBox.style.width = that.cropperSize.width+"px";
        that.$cropperCropBox.style.height = that.cropperSize.height+"px";
    }
    private cropperUp(dragDistance:dragValue){//裁剪框往上放大的方法
        let that:any = this;
        if(that.cropperSize.x+dragDistance.y*that.cropperScale/2<=0)return;//裁剪框左边超出
        if(that.cropperRightUp(dragDistance))
            that.cropperSize.x+=(dragDistance.y*that.cropperScale/2);
    }
    private cropperLeft(dragDistance:dragValue){//裁剪框往左放大的方法
        let that:any = this;
        if(that.cropperSize.y+dragDistance.x/(2*that.cropperScale)<=0)return;//裁剪框上边超出
        if(that.cropperLeftDown(dragDistance))
            that.cropperSize.y+=(dragDistance.x/(2*that.cropperScale));
    }
    private cropperRightDown(dragDistance:dragValue){//裁剪框右下放大的方法
        let that:any = this;
        if(that.cropperSize.width + dragDistance.x<=10||that.cropperSize.height + dragDistance.x/that.cropperScale<=10)return false;//裁剪框高宽为0
        if(that.cropperSize.width+dragDistance.x+that.cropperSize.x>=that.width)return false;//裁剪框右边超出
        if(that.cropperSize.height+dragDistance.x/that.cropperScale+that.cropperSize.y>=that.height)return false;//裁剪框下边超出
        that.cropperSize.width += dragDistance.x;
        that.cropperSize.height += dragDistance.x/that.cropperScale;
        that.$cropperCropBox.style.width = that.cropperSize.width+"px";
        that.$cropperCropBox.style.height = that.cropperSize.height+"px";
        return true;
    }
    private cropperLeftDown(dragDistance:dragValue){//裁剪框左下放大的方法
        let that:any = this;
        if(that.cropperSize.width - dragDistance.x<=10||that.cropperSize.height - dragDistance.x/that.cropperScale<=10)return false;//裁剪框高宽为0
        if(that.cropperSize.x+dragDistance.x<=0)return false;//裁剪框左边超出
        if(that.cropperSize.y+that.cropperSize.height-dragDistance.x/that.cropperScale>=that.height)return false;//裁剪框下边超出
        that.cropperSize.x+=dragDistance.x;
        that.cropperSize.width -= dragDistance.x;
        that.cropperSize.height -= dragDistance.x/that.cropperScale;
        that.$cropperCropBox.style.width = that.cropperSize.width+"px";
        that.$cropperCropBox.style.height = that.cropperSize.height+"px";
        return true;
    }
    private cropperRightUp(dragDistance:dragValue){//裁剪框右上放大的方法
        let that:any = this;
        if(that.cropperSize.width - dragDistance.y*that.cropperScale<=10||that.cropperSize.height - dragDistance.y<=10)return false;//裁剪框高宽为0
        if(that.cropperSize.y+dragDistance.y<=0)return false;//裁剪框上边超出
        if(that.cropperSize.x+that.cropperSize.width-dragDistance.y*that.cropperScale>=that.width)return false;//裁剪框右边超出
        that.cropperSize.y+=dragDistance.y;
        that.cropperSize.width -= dragDistance.y*that.cropperScale;
        that.cropperSize.height -= dragDistance.y;
        that.$cropperCropBox.style.width = that.cropperSize.width+"px";
        that.$cropperCropBox.style.height = that.cropperSize.height+"px";
        return true;
    }
    private cropperLeftUp(dragDistance:dragValue){//裁剪框左上放大的方法
        let that:any = this;
        if(that.cropperSize.width - dragDistance.y*that.cropperScale<=10||that.cropperSize.height - dragDistance.y<=10)return false;//裁剪框高宽为0
        if(that.cropperSize.y+dragDistance.y<=0)return false;//裁剪框上边超出
        if(that.cropperSize.x+dragDistance.y*that.cropperScale<=0)return false;//裁剪框左边超出
        that.cropperSize.x+=dragDistance.y*that.cropperScale;
        that.cropperSize.y+=dragDistance.y;
        that.cropperSize.width -= dragDistance.y*that.cropperScale;
        that.cropperSize.height -= dragDistance.y;
        that.$cropperCropBox.style.width = that.cropperSize.width+"px";
        that.$cropperCropBox.style.height = that.cropperSize.height+"px";
        return true;
    }
    private cropperTransform(){//裁剪框和裁剪框内图片位置更新的方法
        let that:any = this;
        getTransform(that.$cropperCropBox,`translate(${that.cropperSize.x}px, ${that.cropperSize.y}px)`);
        that.getCropperImgSize();
    }
    private mousemoveImgFn(distance:dragValue){//拖拽图片更新位置的方法
        let that:any = this;
        that.initCanvasSize.x = that.canvasSize.x +=distance.x; 
        that.initCanvasSize.y = that.canvasSize.y += distance.y;
        getTransform(that.$cropperCanvasBox,`translate(${that.canvasSize.x}px, ${that.canvasSize.y}px)`);
        that.getCropperImgSize();
    }
    private mousemoveCropperFn(distance:dragValue){//拖拽裁剪框内部更新位置的方法
        let that:any = this,
            cropperRightMax:number = that.width-that.cropperSize.width-1,
            cropperDownMax:number = that.height-that.cropperSize.height-1,
            cropperDragX:number = that.cropperSize.x+distance.x,
            cropperDragY:number = that.cropperSize.y+distance.y;
        that.cropperSize.x = cropperDragX<1?1:cropperDragX>cropperRightMax?cropperRightMax:cropperDragX;
        that.cropperSize.y = cropperDragY<1?1:cropperDragY>cropperDownMax?cropperDownMax:cropperDragY;
        getTransform(that.$cropperCropBox,`translate(${that.cropperSize.x}px, ${that.cropperSize.y}px)`);
        that.getCropperImgSize();
    }
    private stateCallback(){//声明回调方法,注册事件
        let that:any = this;
        that.magnifyFn = function(){//放大图片的回调方法
            if(!that.fileSrc)return;
            that.zoomNumber = that.option.zoomScale;
            let newZoom:number = that.zoom+that.zoomNumber;
            that.imgZoomFn(newZoom);
            that.updatePreviewImgSize();
        };
        that.shrinkFn = function(){//缩小图片的回调方法
            if(!that.fileSrc)return;
            that.zoomNumber = -that.option.zoomScale;
            let newZoom:number = that.zoom+that.zoomNumber;
            that.imgZoomFn(newZoom);
            that.updatePreviewImgSize();
        }
        that.moveRightFn = function(){//裁剪框右移的回调方法
            if(!that.fileSrc)return;
            let obj:dragValue = {x:that.option.moveStep,y:0};
            that.mousemoveCropperFn(obj);
            that.updatePreviewImgSize();
        }
        that.moveUpFn = function(){//裁剪框上移的回调方法
            if(!that.fileSrc)return;
            let obj:dragValue = {x:0,y:-that.option.moveStep};
            that.mousemoveCropperFn(obj)
            that.updatePreviewImgSize();
        }
        that.moveLeftFn = function(){//裁剪框左移的回调方法
            if(!that.fileSrc)return;
            let obj:dragValue = {x:-that.option.moveStep,y:0};
            that.mousemoveCropperFn(obj)
            that.updatePreviewImgSize();
        }
        that.moveDownFn = function(){//裁剪框下移的回调方法
            if(!that.fileSrc)return;
            let obj:dragValue = {x:0,y:that.option.moveStep};
            that.mousemoveCropperFn(obj)
            that.updatePreviewImgSize();
        }
        if(that.option.magnifyBtn){
            addEvent(that.option.magnifyBtn,"click",that.magnifyFn)
        };
        if(that.option.shrinkBtn){
            addEvent(that.option.shrinkBtn,"click",that.shrinkFn)
        };
        if(that.option.moveLeftBtn){
            addEvent(that.option.moveLeftBtn,"click",that.moveLeftFn)
        };
        if(that.option.moveRightBtn){
            addEvent(that.option.moveRightBtn,"click",that.moveRightFn)
        };
        if(that.option.moveUpBtn){
            addEvent(that.option.moveUpBtn,"click",that.moveUpFn)
        };
        if(that.option.moveDownBtn){
            addEvent(that.option.moveDownBtn,"click",that.moveDownFn)
        };
        if(that.option.getImgBtn){
            addEvent(that.option.getImgBtn,"click",function(){
                that.getCropSize(that.option.getImgCallback)
            })
        }
    }
    getCropSize(fn?:any){//获取裁剪后的参数
        let that:any = this;
        let canvas:any = document.createElement("canvas");
        let scale:number = that.imgSize.width/that.canvasSize.width;
        let imgSrc:any = that.$cropperCropBox.getElementsByTagName("img")[0].src;
        let img:any = new Image();
        img.src = imgSrc;
        img.crossorigin = "anonymous";
        canvas.width = that.cropperSize.width*scale;
        canvas.height = that.cropperSize.height*scale;
        let ctx:any = canvas.getContext("2d");
        img.onload = function(){
            ctx.drawImage(img, (that.cropperSize.x-that.canvasSize.x)*scale, (that.cropperSize.y-that.canvasSize.y)*scale, that.cropperSize.width*scale, that.cropperSize.height*scale,0,0,that.cropperSize.width*scale, that.cropperSize.height*scale);
            try{
                fn&&fn.call(that,canvas.toDataURL("image/png"))
            }catch(e){
                let obj:any = {
                    width:that.cropperSize.width*scale,
                    height:that.cropperSize.height*scale,
                    x:(that.cropperSize.x-that.canvasSize.x)*scale,
                    y:(that.cropperSize.y-that.canvasSize.y)*scale,
                    src:that.fileSrc
                }
                fn&&fn.call(that,obj)
            }
        }
    }
}



