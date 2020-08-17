import { imgMagnificationModel } from "./type";
import { mergeOptions, index, addEvent ,removeEvent} from '@stl/tool-ts/src/common/compatible';
import { createEl, show, parent, hide, remove,siblings } from '@stl/tool-ts/src/common/dom';
import { on } from "@stl/tool-ts/src/common/event";
import { NodeListToArray, each } from '@stl/tool-ts/src/common/obj';
import { installEvents } from '@stl/tool-ts/src/common/subscrible';
let prevClick:any = "prevClick";
let nextClick:any = "nextClick";
let closeClick:any = "closeClick";
let imgResize:any = "imgResize";
let sImgResize:any = "sImgResize";
let imgZoomFn:any = "imgZoomFn";
let mouseDown:any = "mouseDown";
let videoResize:any = "videoResize";
let onresize:any = window.onresize;
let SET_IMAGE_PREVIEW_OBG:any = {
    sinpleImgPreviewKey:true,//是否已经生成简单图片预览框
    imgPreviewKey:true,//是否已经生成图片预览框
    videoPreviewKey:true,//是否已经生成视频预览框
    SImgPreviewBoxBg:"sImgViewerBoxBg",//简单图片预览框透明背景层
    SImgPreviewBox:"sImgViewerBox",//简单图片预览框内容层
    SImgPreviewClose:"sImgViewerClose",//简单图片预览框关闭按钮
    SImgPreviewPrev:"sImgViewerPrev",//简单图片预览框上一张按钮
    SImgPreviewNext:"sImgViewerNext",//简单图片预览框下一张按钮
    SImgPreviewTitle:"sImgViewerTitleCont",//简单图片预览框标题
    SImgPreviewId:"sFullResImgViewer",//简单图片预览框图片标签ID
    SImgPreviewTitleBtn:"sImgTitleBtn",//展开title框的按钮
    imgPreviewBoxBg:"imgViewerBoxBg",//图片预览框透明背景层
    imgPreviewBox:"imgViewerBox",//图片预览框内容层
    imgPreviewId:"fullResImgViewer",//图片预览框图片标签ID
    imgPreviewClose:"imgViewerClose",//图片预览框关闭按钮
    imgPreviewPrev:"imgViewerPrev",//图片预览框上一张按钮
    imgPreviewNext:"imgViewerNext",//图片预览框下一张按钮
    imgPreviewBig:"imgViewerBig",//图片放大按钮
    imgPreviewSmall:"imgViewerSmall",//图片缩小按钮
    imgPreviewTitle:"imgViewerTitleCont",//简单图片预览框标题
    imgPreviewTitleBtn:"imgTitleBtn",//展开title框的按钮
    videoPreviewBoxBg:"videoViewerBoxBg",//video预览框透明背景层
    videoPreviewBox:"videoViewerBox",//video预览框内容层
    videoPreviewClose:"videoViewerClose",//video预览框关闭按钮
    imgPreviewWidth:window.innerWidth,//窗口宽度
    imgPreviewHeight:window.innerHeight,//窗口高度
    previewEvents:installEvents(),
}
function createPreviewDom(key:string,titleUp:boolean,closeBgImg?:string):any{//生成预览框
    let imgHtml:HTMLElement = null;let imgBoxBg:HTMLElement = null;
    let titleBtn = titleUp?`<div id="${key==="simg"?"sImgTitleBtn":"imgTitleBtn"}" 
                                data-type="1" style="height:52px;position:absolute;margin:0;cursor:pointer;line-height:70px;padding:0 10px;z-index:2;">
                                <img style="width:30px;transform:rotate(180deg);-ms-transform:rotate(180deg);-moz-transform:rotate(180deg);-webkit-transform:rotate(180deg);-o-transform:rotate(180deg)" src="https://imgs.wbp5.com/api/secrecymaster/html_up/2018/10/20181029154606401.png"/>
                            </div>`:"";
    if(key==="simg"&&SET_IMAGE_PREVIEW_OBG.sinpleImgPreviewKey){
        imgHtml = <HTMLElement>createEl("div",{
            id:"sImgViewerBox",
            innerHTML:`<div id="sImgViewerList">
                            <div>
                                <div id="sImgViewerClose">close</div>
                                <img id="sFullResImgViewer" src="" style="display:none;" />
                                <div id="sImgViewerTitleCont"></div>
                                ${titleBtn}
                            </div>
                            <div id="sImgTitleContBg" style="display:none"></div>
                        </div>
                        <div id="sImgViewerPrev" style="display:none;position:fixed;width:10%;height:100%;cursor:pointer;">prev</div>
                        <div id="sImgViewerNext" style="display:none;position:fixed;width:10%;height:100%;cursor:pointer;">next</div>`
        })
        imgBoxBg = <HTMLElement>createEl("div",{
            id:"sImgViewerBoxBg"
        })
        imgHtml.style.fontSize = "14px";
        imgHtml.style.display = "none";
        imgBoxBg.style.display = "none";
        sImgAddEventFn(imgHtml,imgBoxBg,titleUp)
    }else if(key === "img"&&SET_IMAGE_PREVIEW_OBG.imgPreviewKey){
        imgHtml = <HTMLElement>createEl("div",{
            id:"imgViewerBox",
            innerHTML:`<div id="imgViewerList">
                            <div>
                                <div id="imgViewerClose">close</div>
                                <div id="imgViewerBig"></div>
                                <div id="imgViewerSmall"></div>
                                <img id="fullResImgViewer" src="" style="display:none;" />
                                <div id="imgViewerTitleCont"></div>
                                ${titleBtn}
                            </div>
                            <div id="imgViewerTitleContBg" style="display:none"></div>
                        </div>
                        <div id="imgViewerPrev" style="display:none;position:fixed;width:10%;height:100%;cursor:pointer;">prev</div>
                        <div id="imgViewerNext" style="display:none;position:fixed;width:10%;height:100%;cursor:pointer;">next</div>`
        })
        imgBoxBg = <HTMLElement>createEl("div",{
            id:"imgViewerBoxBg"
        })
        imgHtml.style.fontSize = "14px";
        imgHtml.style.display = "none";
        imgBoxBg.style.display = "none";
        imgAddEventFn(imgHtml,imgBoxBg,titleUp)
    }else if(key === "video"&&SET_IMAGE_PREVIEW_OBG.videoPreviewKey){
        let closeStr:string = closeBgImg ? `<img style="width:30px;display:block;" src="${closeBgImg}" />` : 'close';
        imgHtml = <HTMLElement>createEl("div",{
            id:"videoViewerBox",
            innerHTML:`<div id="videoViewerClose" style="position:absolute;top:-25px;right:-25px;cursor:pointer;border-radius:50%;background:rgba(0,0,0,0.5);">${closeStr}</div>`
        })
        imgBoxBg = <HTMLElement>createEl("div",{
            id:"videoViewerBoxBg"
        })
        imgHtml.style.display = "none";
        imgBoxBg.style.display = "none";
        videoAddEventFn(imgHtml,imgBoxBg)
    }
}
class imgMagnificationFn{
    settings:any//所有的参数
    domList:any//元素列表
    $win:Window = window.parent.window || window//window元素
    parentEle:HTMLElement//父级容器元素
    _allIndex:any//图片的长度
    //body:HTMLElement = document.querySelector("body")//body元素
    index:number = 0//当前图片的索引
    imgUrlArray:Array<string> = []//存放图片地址数组
    imgTitleArray:Array<string> = []//存放图片标题数组
    ImgIndex:any = {}
    TitleHeight:number//保存title高度
    scrollNum:number = 1//图片缩放倍数
    constructor(options:imgMagnificationModel){
        let that:any = this;
        that.settings = options;
        that.parentEle = <HTMLElement>that.settings.parentEle;//父级容器元素
        if(!that.settings.parentEle) return;
        that.init()
    }
    init(){
        let that:any = this;
        switch(that.settings.key){
            case "video":
                that.videoInit();
                break;
            case "simg":
                that.sImgInit();
                break;
            case "img":
                that.imgInit();
                break;
        }
    }
    getSImgDomList(){
        this.domList = {
            $imgID : <HTMLElement>document.body.querySelector("#" + SET_IMAGE_PREVIEW_OBG.SImgPreviewId),
            $imgIDTitle : <HTMLElement>document.body.querySelector("#" + SET_IMAGE_PREVIEW_OBG.SImgPreviewTitle),
            $imgPrev : <HTMLElement>document.body.querySelector("#" + SET_IMAGE_PREVIEW_OBG.SImgPreviewPrev),
            $imgNext : <HTMLElement>document.body.querySelector("#" + SET_IMAGE_PREVIEW_OBG.SImgPreviewNext),
            $imgIDClose : <HTMLElement>document.body.querySelector("#" + SET_IMAGE_PREVIEW_OBG.SImgPreviewClose),
            $imgBoxBg : <HTMLElement>document.body.querySelector("#" + SET_IMAGE_PREVIEW_OBG.SImgPreviewBoxBg),
            $imgBox : <HTMLElement>document.body.querySelector("#" + SET_IMAGE_PREVIEW_OBG.SImgPreviewBox),
            $titleBtn : <HTMLElement>document.body.querySelector("#" + SET_IMAGE_PREVIEW_OBG.SImgPreviewTitleBtn),
        }
    }
    getImgDomList(){
        this.domList = {
            $imgID : <HTMLElement>document.body.querySelector("#" + SET_IMAGE_PREVIEW_OBG.imgPreviewId),
            $imgIDTitle : <HTMLElement>document.body.querySelector("#" + SET_IMAGE_PREVIEW_OBG.imgPreviewTitle),
            $imgPrev : <HTMLElement>document.body.querySelector("#" + SET_IMAGE_PREVIEW_OBG.imgPreviewPrev),
            $imgNext : <HTMLElement>document.body.querySelector("#" + SET_IMAGE_PREVIEW_OBG.imgPreviewNext),
            $imgIDClose : <HTMLElement>document.body.querySelector("#" + SET_IMAGE_PREVIEW_OBG.imgPreviewClose),
            $imgBoxBg : <HTMLElement>document.body.querySelector("#" + SET_IMAGE_PREVIEW_OBG.imgPreviewBoxBg),
            $imgBox : <HTMLElement>document.body.querySelector("#" + SET_IMAGE_PREVIEW_OBG.imgPreviewBox),
            $bigBox:<HTMLElement>document.body.querySelector("#" + SET_IMAGE_PREVIEW_OBG.imgPreviewBig),
            $smallBox:<HTMLElement>document.body.querySelector("#" + SET_IMAGE_PREVIEW_OBG.imgPreviewSmall),
            $titleBtn : <HTMLElement>document.body.querySelector("#" + SET_IMAGE_PREVIEW_OBG.imgPreviewTitleBtn),
        }
    }
    getVideoDomList(){
        this.domList = {
            $videoIDClose : <HTMLElement>document.body.querySelector("#" + SET_IMAGE_PREVIEW_OBG.videoPreviewClose),
            $videoBoxBg : <HTMLElement>document.body.querySelector("#" + SET_IMAGE_PREVIEW_OBG.videoPreviewBoxBg),
            $videoBox:<HTMLElement>document.body.querySelector("#" + SET_IMAGE_PREVIEW_OBG.videoPreviewBox),
        }
    }
    sImgInit(){
        let that:any = this;
        that.getSImgDomList();
        on({
            agent: that.parentEle,
            events: "click",
            ele: "[data-viewer]",
            fn: function (dom:any, ev:any) {
                let bindKey:boolean = true;
                if(that.settings.clickCallback)bindKey = that.settings.clickCallback.call(that,dom,ev);
                if(!bindKey)return;
                SET_IMAGE_PREVIEW_OBG.previewEvents.remove(prevClick);
                SET_IMAGE_PREVIEW_OBG.previewEvents.remove(nextClick);
                SET_IMAGE_PREVIEW_OBG.previewEvents.remove(closeClick);
                SET_IMAGE_PREVIEW_OBG.previewEvents.remove(sImgResize);
                SET_IMAGE_PREVIEW_OBG.previewEvents.listen(prevClick, function () {
                    that.prevClick.call(that)
                })
                SET_IMAGE_PREVIEW_OBG.previewEvents.listen(nextClick, function () {
                    that.nextClick.call(that)
                })

                SET_IMAGE_PREVIEW_OBG.previewEvents.listen(closeClick, function () {
                    that.closeClick.call(that)
                })
                SET_IMAGE_PREVIEW_OBG.previewEvents.listen(sImgResize, function () {
                    that.onresize.call(that)
                })
                that.getImgFn(dom,ev);
            }
        })
    }
    imgInit(){
        let that:any = this;
        that.getImgDomList();
        on({
            agent:that.parentEle,
            events:"click",
            ele:"[data-viewer]",
            fn:function(dom:any,ev:any){
                let bindKey:boolean = true;
                if(that.settings.clickCallback)bindKey = that.settings.clickCallback.call(that,dom,ev);
                if(!bindKey)return;
                SET_IMAGE_PREVIEW_OBG.previewEvents.remove(prevClick);
                SET_IMAGE_PREVIEW_OBG.previewEvents.remove(nextClick);
                SET_IMAGE_PREVIEW_OBG.previewEvents.remove(closeClick);
                SET_IMAGE_PREVIEW_OBG.previewEvents.remove(imgResize);
                SET_IMAGE_PREVIEW_OBG.previewEvents.remove(imgZoomFn);
                SET_IMAGE_PREVIEW_OBG.previewEvents.remove(imgZoomFn);
                SET_IMAGE_PREVIEW_OBG.previewEvents.remove(mouseDown);
                SET_IMAGE_PREVIEW_OBG.previewEvents.listen(prevClick, function () {
                    that.prevClick.call(that)
                })
                SET_IMAGE_PREVIEW_OBG.previewEvents.listen(nextClick, function () {
                    that.nextClick.call(that)
                })

                SET_IMAGE_PREVIEW_OBG.previewEvents.listen(closeClick, function () {
                    that.closeClick.call(that)
                })
                SET_IMAGE_PREVIEW_OBG.previewEvents.listen(imgResize, function () {
                    that.onresize.call(that)
                })
                SET_IMAGE_PREVIEW_OBG.previewEvents.listen(imgZoomFn, function (e:any,type?:any) {
                    that.imgZoomFn.call(that,e,type)
                })
                // SET_IMAGE_PREVIEW_OBG.previewEvents.listen(imgZoomFn, function (e:any) {
                //     that.imgZoomFn.call(that,e)
                // })
                SET_IMAGE_PREVIEW_OBG.previewEvents.listen(mouseDown, function (e:any) {
                    that.mouseDown.call(that,e)
                })
                that.getImgFn(dom,ev);
            }
        })
    }
    videoInit(){
        let that:any = this;
        that.getVideoDomList();
        on({
            events:"click",
            ele:that.parentEle,
            fn:function(dom:any,ev:any){
                let bindKey:boolean = true;
                if(that.settings.clickCallback)bindKey = that.settings.clickCallback.call(that,dom,ev);
                if(!bindKey)return;
                SET_IMAGE_PREVIEW_OBG.previewEvents.remove(videoResize);
                SET_IMAGE_PREVIEW_OBG.previewEvents.listen(videoResize, function () {
                    that.videoResize.call(that)
                })
                let src:string = null;
                if(ev.target.getAttribute("data-viewer")){
                    src = ev.target.getAttribute("data-viewer");
                }else{
                    var domList:any = siblings(ev.target)
                    for(let i=0;i<domList.length;i++){
                        if(domList[i].getAttribute("data-viewer")){
                            src = domList[i].getAttribute("data-viewer")
                        }
                    }
                }
                if(!src)return;
                let videoDom:any = <HTMLElement>createEl("video",{});
                videoDom.src = src;
                videoDom.loop = "loop";
                videoDom.autoplay = "autoplay";
                videoDom.controls = "controls";
                videoDom.style.display = "block";
                videoDom.style.width ="100%";
                that.domList.$videoBox.style.width = that.settings.videoWidth+"px";
                that.domList.$videoBox.appendChild(videoDom);
                show(that.domList.$videoBox)
                show(that.domList.$videoBoxBg)
            }
        })
    }
    getImgFn(dom:any,ev:any){
        let that:any = this;
        that._allIndex = that.settings.parentEle.querySelectorAll("img[data-viewer]").length;//图片的长度
        let e:any = ev || event;
        let ele: HTMLElement = e.target || e.srcElement;
        if (!ele.getAttribute("data-viewer") && ele.querySelectorAll("[data-viewer]").length <= 0) { return false }

        if (e && e.preventDefault) { ev.preventDefault() } else { window.event.returnValue = false };
        if (ele.nodeName === "INPUT") { return false }

        var imgMaxUrl = ele.getAttribute("href") || ele.getAttribute("data-viewer") || ele.getAttribute("src");
        that.index = index(ele);
        SET_IMAGE_PREVIEW_OBG.imgPreviewWidth = that.$win.innerWidth;
        SET_IMAGE_PREVIEW_OBG.imgPreviewHeight = that.$win.innerHeight;
        that.getImgOrTitle();
        that.index = that.ImgIndex[ele.getAttribute('data-imgindex')];
        that.imgClick(imgMaxUrl);
    }
    getImgOrTitle() {// 获取图片大图地址及图片标题，并提前缓存图片
        let that:any = this;
        let i:number = 0;
        that.imgUrlArray = [];
        that.imgTitleArray = [];
        that.ImgIndex = {};
        each(NodeListToArray(that.parentEle.querySelectorAll('img')), function (value:any, index:any) {
            if ((<HTMLElement>value).getAttribute("data-viewer")) {
                let $this:HTMLElement = <HTMLElement>value, imgMax = [],
                    _title_text:string = $this.getAttribute("title") || "",
                    _realIndex:number = parseInt(index) + 1,
                    _title_content = _title_text?` <p style="margin: 5px;"><span style="word-break:break-all">${_title_text}</span></p>`:"",
                    _title_style = _title_text?"position:absolute;margin:0;top:0;left:0":"margin:5px auto;text-align:center;",
                    _title = `<div style="position:relative;${that.settings.titleUp&&_title_text?"padding:0 40px 0 70px;":_title_text?"padding-left:70px;":that.settings.titleUp?"padding-right:40px":""}">
                                <p style="${_title_style}">
                                    <span style="color: red; font-size: 28px; font-style: italic;">${_realIndex}</span>
                                    <em style="font-style: italic; margin-left: 3px; margin-right: 1px; font-size: 24px;">|</em>
                                    <span style="position:relative;top:5px;font-style: italic;">${that._allIndex}</span>
                                </p>
                                ${_title_content}
                            </div>`,

                    imgurl = $this.getAttribute("data-viewer") || $this.getAttribute("src");
                $this.setAttribute('data-imgindex', index);

                imgMax[index] = new Image();
                imgMax[index].src = imgurl;
                that.ImgIndex[index] = i;
                i++;
                that.imgUrlArray.push(imgurl);
                that.imgTitleArray.push(_title);
            }
        })
    }
    imgClick(imgUrl:string) {// 显示图片事件
        var that = this;
        var $imgID = <HTMLElement>that.domList.$imgID;
        setTimeout(function () { $imgID.setAttribute("src", imgUrl) }, 200);
        $imgID.onload = function () {  // 在IE下必须设置延迟，否则读取图片信息会出错
            
            if (that.settings.IsBox) {
                show(that.domList.$imgBoxBg)
            } else {
                hide(that.domList.$imgBoxBg)
            }
            switch(that.settings.key){
                case "simg":
                    that.sImgResize(imgUrl);
                    $imgID.onclick = function () { that.closeClick.call(that) }
                    $imgID.onmouseover = function () { show(that.domList.$imgIDClose); };
                    break;
                case "img":
                    that.imgResize(imgUrl);
                    break;
            }
           
        }
    }
    videoResize(){
        let that:any = this;
        that.domList.$videoBox.style.maxWidth = SET_IMAGE_PREVIEW_OBG.imgPreviewWidth*0.8+"px";
        let videoBox:HTMLElement = that.domList.$videoBox.getElementsByTagName("video")[0];
        videoBox.style.maxWidth = SET_IMAGE_PREVIEW_OBG.imgPreviewWidth*0.8+"px";
        videoBox.style.maxHeight = SET_IMAGE_PREVIEW_OBG.imgPreviewHeight*0.8+"px";
    }
    sImgResize(imgUrl:string) {
        let that:any = this;
        let imgSize:any = that.getImageSize(imgUrl);
        let top:number = imgSize.h >= SET_IMAGE_PREVIEW_OBG.imgPreviewHeight ? 5 : that.getTop(imgSize.h);
        let tw:number = (SET_IMAGE_PREVIEW_OBG.imgPreviewWidth - 100 <= imgSize.w) ? SET_IMAGE_PREVIEW_OBG.imgPreviewWidth - 100 : imgSize.w;
        let left:number = tw >= SET_IMAGE_PREVIEW_OBG.imgPreviewWidth ? 100 : that.getLeft(tw);

        // 设置图片样式
        that.domList.$imgID.style.maxWidth = imgSize.w + "px";
        that.domList.$imgID.style.maxHeight = imgSize.h + "px";
        that.domList.$imgID.style.position = "absolute";
        that.domList.$imgID.style.top = top + "px";
        that.domList.$imgID.style.left = left + "px";
        that.domList.$imgID.style.cursor = "zoom-out";
        that.domList.$imgID.style.cursor = "-webkit-zoom-out";
        that.domList.$imgID.style.display = "block";
        that.domList.$imgID.style.margin = "auto";

        // 关闭层样式
        that.domList.$imgIDClose.style.width = "20px";
        that.domList.$imgIDClose.style.height = "20px";
        that.domList.$imgIDClose.style.position = "absolute";
        that.domList.$imgIDClose.style.top = top - 10 + "px";
        that.domList.$imgIDClose.style.left = left + tw - 10 + "px";
        that.domList.$imgIDClose.style.zIndex = "20181115";
        that.domList.$imgIDClose.style.cursor = "pointer";
        that.domList.$imgIDClose.style.display = "none";
        that.domList.$imgIDClose.innerHTML = that.settings.closeBgImg ? '<img width="20" src="' + that.settings.closeBgImg + '" />' : 'close';

        // 图片标题层样式
        that.domList.$imgIDTitle.style.position = "absolute";
        that.domList.$imgIDTitle.style.color = "#fff";
        that.domList.$imgIDTitle.style.textAlign = "left";
        that.domList.$imgIDTitle.style.padding = "10px";
        that.domList.$imgIDTitle.style.boxSizing = "border-box";
        that.domList.$imgIDTitle.style.webkitBoxSizing = "border-box";
        that.domList.$imgIDTitle.style.overflow = "hidden";
        that.domList.$imgIDTitle.style.lineHeight = "22px";
        that.domList.$imgIDTitle.style.background = "rgba(0,0,0,0.5)";
        that.domList.$imgIDTitle.style.fontSize = "14px";
        that.domList.$imgIDTitle.innerHTML = that.imgTitleArray[that.index] || "";
        if(that.settings.titlePosition === 2){
            that.domList.$imgIDTitle.style.width = "100%";
            that.domList.$imgIDTitle.style.bottom = "0px";
            that.domList.$imgIDTitle.style.left = "0";
            that.domList.$imgIDTitle.style.right = "0";
        }else{
            that.domList.$imgIDTitle.style.width = (imgSize.w)+"px";
            that.domList.$imgIDTitle.style.left = left+"px";
        }

        
        
        // 上一张层样式
        that.domList.$imgPrev.style.top = "0";
        that.domList.$imgPrev.style.left = "0";
        that.domList.$imgPrev.innerHTML = that.settings.prevBgImg ? '<div style="text-align: center; margin-top:' + (SET_IMAGE_PREVIEW_OBG.imgPreviewHeight - 60) / 2 + 'px ;"> <img width="20" height="60" src="' + that.settings.prevBgImg + '"> </div>' : 'prev';

        that.domList.$imgNext.style.top = "0";
        that.domList.$imgNext.style.right = "0";
        that.domList.$imgNext.innerHTML = that.settings.nextBgImg ? '<div style="text-align: center; margin-top:' + (SET_IMAGE_PREVIEW_OBG.imgPreviewHeight - 60) / 2 + 'px ;"> <img width="20" height="60" src="' + that.settings.nextBgImg + '"> </div>' : 'prev';
        try {
            if (!that.settings.isPaging) {
                hide(that.domList.$imgPrev);
                hide(that.domList.$imgNext);
                hide(that.domList.$imgIDTitle.firstElementChild);
            } else {
                show(that.domList.$imgPrev);
                show(that.domList.$imgNext);
                show(that.domList.$imgIDTitle.firstElementChild);
            }
        } catch (e) { }

        that.settings.isBox&&show(that.domList.$imgBoxBg);
        show(that.domList.$imgBox);

        that.TitleHeight = that.domList.$imgIDTitle.offsetHeight?that.domList.$imgIDTitle.offsetHeight:that.TitleHeight;
        if(that.settings.titlePosition === 1){
            that.domList.$imgIDTitle.style.top = (top+imgSize.h-that.TitleHeight)+"px";
        }
        //收起标题层按钮样式
        if(that.settings.titleUp&&that.settings.titlePosition === 1){
            that.domList.$titleBtn.style.left=(left+imgSize.w-50)+"px";
            that.domList.$titleBtn.style.top=(top+imgSize.h-that.TitleHeight)+"px";
        }else if(that.settings.titleUp&&that.settings.titlePosition === 2){
            that.domList.$titleBtn.style.right="0px";
            that.domList.$titleBtn.style.bottom=(that.TitleHeight-52)+"px";
        }
    } 
    imgResize(imgUrl:string) {
        let that:any = this;
        let imgSize:any = that.getImageSize(imgUrl);
        let top:number = imgSize.h >= that.sHeight ? 5 : that.getTop(imgSize.h);
        let tw:number = (that.sWidth - 100 <= imgSize.w) ? that.sWidth - 100 : imgSize.w;
        let left:number = tw >= that.sWidth ? 100 : that.getLeft(tw);

        // 设置图片样式
        that.domList.$imgID.style.maxWidth = imgSize.w + "px";
        that.domList.$imgID.style.maxHeight = imgSize.h + "px";
        that.domList.$imgID.style.position = "absolute";
        that.domList.$imgID.style.top = top+"px";
        that.domList.$imgID.style.left = left + "px";
        that.domList.$imgID.style.cursor = "zoom-out";
        that.domList.$imgID.style.cursor = "-webkit-zoom-out";
        that.domList.$imgID.style.display = "block";
        that.domList.$imgID.style.margin = "auto";

        // 关闭层样式
        that.domList.$imgIDClose.style.wdith = "30px";
        that.domList.$imgIDClose.style.height = "30px";
        that.domList.$imgIDClose.style.position = "fixed";
        that.domList.$imgIDClose.style.top = "50px";
        that.domList.$imgIDClose.style.right = "50px";
        that.domList.$imgIDClose.style.zIndex = "20160904";
        that.domList.$imgIDClose.style.cursor = "pointer";
        that.domList.$imgIDClose.innerHTML = that.settings.closeBgImg ? `<img width="30px" src="${that.settings.closeBgImg}" />` : 'close';

        // 放大層樣式
        that.domList.$bigBox.style.wdith = "30px";
        that.domList.$bigBox.style.height = "30px";
        that.domList.$bigBox.style.position = "fixed";
        that.domList.$bigBox.style.top = "100px";
        that.domList.$bigBox.style.right = "50px";
        that.domList.$bigBox.style.zIndex = "20160904";
        that.domList.$bigBox.style.cursor = "pointer";
        that.domList.$bigBox.innerHTML = that.settings.bigBgImg ? `<img width="30px" src="${that.settings.bigBgImg}" />` : 'close';


        // 缩小層樣式
        that.domList.$smallBox.style.wdith = "30px";
        that.domList.$smallBox.style.height = "30px";
        that.domList.$smallBox.style.position = "fixed";
        that.domList.$smallBox.style.top = "150px";
        that.domList.$smallBox.style.right = "50px";
        that.domList.$smallBox.style.zIndex = "20160904";
        that.domList.$smallBox.style.cursor = "pointer";
        that.domList.$smallBox.innerHTML = that.settings.smallBgImg ? `<img width="30px" src="${that.settings.smallBgImg}" />` : 'close';

         // 上一张层样式
         that.domList.$imgPrev.style.top = "0";
         that.domList.$imgPrev.style.left = "0";
         that.domList.$imgPrev.innerHTML = that.settings.prevBgImg ? '<div style="text-align: center; margin-top:' + (SET_IMAGE_PREVIEW_OBG.imgPreviewHeight - 60) / 2 + 'px ;"> <img width="20" height="60" src="' + that.settings.prevBgImg + '"> </div>' : 'prev';
 
         that.domList.$imgNext.style.top = "0";
         that.domList.$imgNext.style.right = "0";
         that.domList.$imgNext.innerHTML = that.settings.nextBgImg ? '<div style="text-align: center; margin-top:' + (SET_IMAGE_PREVIEW_OBG.imgPreviewHeight - 60) / 2 + 'px ;"> <img width="20" height="60" src="' + that.settings.nextBgImg + '"> </div>' : 'prev';

        // 图片标题层样式
        that.domList.$imgIDTitle.style.position = "absolute";
        that.domList.$imgIDTitle.style.color = "#fff";
        that.domList.$imgIDTitle.style.textAlign = "left";
        that.domList.$imgIDTitle.style.padding = "10px";
        that.domList.$imgIDTitle.style.boxSizing = "border-box";
        that.domList.$imgIDTitle.style.webkitBoxSizing = "border-box";
        that.domList.$imgIDTitle.style.overflow = "hidden";
        that.domList.$imgIDTitle.style.lineHeight = "22px";
        that.domList.$imgIDTitle.style.background = "rgba(0,0,0,0.5)";
        that.domList.$imgIDTitle.style.fontSize = "14px";
        that.domList.$imgIDTitle.innerHTML = that.imgTitleArray[that.index] || "";
        if(that.settings.titlePosition === 2){
            that.domList.$imgIDTitle.style.width = "100%";
            that.domList.$imgIDTitle.style.bottom = "0px";
            that.domList.$imgIDTitle.style.left = "0";
            that.domList.$imgIDTitle.style.right = "0";
        }else{
            that.domList.$imgIDTitle.style.width = (imgSize.w)+"px";
            that.domList.$imgIDTitle.style.left = left+"px";
        }
        try {
            if (!that.settings.isPaging) {
                hide(that.domList.$imgPrev);
                hide(that.domList.$imgNext);
                hide(that.domList.$imgIDTitle.firstElementChild);
            } else {
                show(that.domList.$imgPrev);
                show(that.domList.$imgNext);
                show(that.domList.$imgIDTitle.firstElementChild);
            }
        } catch (e) { }

        that.settings.isBox&&show(that.domList.$imgBoxBg);
        show(that.domList.$imgBox);
        
        that.TitleHeight = that.domList.$imgIDTitle.offsetHeight?that.domList.$imgIDTitle.offsetHeight:that.TitleHeight;
        if(that.settings.titlePosition === 1){
            that.domList.$imgIDTitle.style.top = (top+imgSize.h-that.TitleHeight)+"px";
        }
        //收起标题层按钮样式
        if(that.settings.titleUp&&that.settings.titlePosition === 1){
            that.domList.$titleBtn.style.left=(left+imgSize.w-50)+"px";
            that.domList.$titleBtn.style.top=(top+imgSize.h-52)+"px";
        }else if(that.settings.titleUp&&that.settings.titlePosition === 2){
            that.domList.$titleBtn.style.right="0px";
            that.domList.$titleBtn.style.bottom="52px";
        }

        //$imgID.fadeIn();

    }
    getImageSize(url:string) {// 获取图片高宽，返回包含高度的对象
        var that = this,
            maxWidth = SET_IMAGE_PREVIEW_OBG.imgPreviewWidth * 0.7,
            maxHeight = SET_IMAGE_PREVIEW_OBG.imgPreviewHeight - 50,
            //w = o.find("#" + IMG_ID).width(),    
            //h = o.find("#" + IMG_ID).height();
            boxWidth = (<HTMLImageElement>that.domList.$imgID).naturalWidth ? (<HTMLImageElement>that.domList.$imgID).naturalWidth : (<HTMLImageElement>that.domList.$imgID).width,
            boxHeight = (<HTMLImageElement>that.domList.$imgID).naturalHeight ? (<HTMLImageElement>that.domList.$imgID).naturalHeight : (<HTMLImageElement>that.domList.$imgID).height,
            w = (<HTMLImageElement>that.domList.$imgID).naturalWidth ? (<HTMLImageElement>that.domList.$imgID).naturalWidth : (<HTMLImageElement>that.domList.$imgID).width,
            h = (<HTMLImageElement>that.domList.$imgID).naturalHeight ? (<HTMLImageElement>that.domList.$imgID).naturalHeight : (<HTMLImageElement>that.domList.$imgID).height;
        if (h > maxHeight) {
            w = (maxHeight * boxWidth / boxHeight);
            h = maxHeight
        }
        if (w > maxWidth) {
            w = maxWidth;
            h = (maxWidth * boxHeight / boxWidth)
        }
        return { w: w, h: h }
    }

    // 获取图片顶部位置 返回顶部值
    getTop(h:number) {
        if (SET_IMAGE_PREVIEW_OBG.imgPreviewHeight > h) {
            return SET_IMAGE_PREVIEW_OBG.imgPreviewHeight / 2 - h / 2;
        } else {
            return 0;
        }
    }

    // 获取图片左边位置 返回左边值
    getLeft(w:number) {
        if (SET_IMAGE_PREVIEW_OBG.imgPreviewWidth > w) {
            return SET_IMAGE_PREVIEW_OBG.imgPreviewWidth / 2 - w / 2;
        } else {
            return 0;
        }
    }
    prevClick(){
        let that:any = this;
        if (that.index <= 0) {
            //return false
            that.index = that._allIndex;
        }
        var $imgID = that.domList.$imgID;
        hide($imgID);
        var imgUrl = that.imgUrlArray[--that.index];
        that.imgClick(imgUrl);

        if(that.settings.key==="img"){
            that.scrollNum = 1;
            that.imgZoomFn();
        }
    }
    nextClick(){
        let that = this;
        if (that.index >= that.imgUrlArray.length - 1) {
            //return false
            that.index = -1;
        }
        var $imgID = that.domList.$imgID;
        hide($imgID);
        var imgUrl = that.imgUrlArray[++that.index];
        that.imgClick(imgUrl);

        if(that.settings.key==="img"){
            that.scrollNum = 1;
            that.imgZoomFn();
        }
    }
    closeClick(){
        let that = this;
        hide(that.domList.$imgBoxBg);
        hide(that.domList.$imgBox);
        if(that.settings.key==="img"){
            that.scrollNum = 1;
        }
    }
    imgZoomFn(event?:any,_num?:any){
        let that:any = this;
        let ev:any = event ? event : null;
        //let IsIeNine:boolean = (navigator.appName == "Microsoft Internet Explorer" && <any>navigator.appVersion.match(/9./i) == "9.") ? true : false;
        //var down = ev ? ev.deltaY : null; // 定义一个标志，当滚轮向下滚时，执行一些操作
        try { var down = _num ? _num : (ev.wheelDelta || -ev.detail) } catch (e) { }
        if (down > 0) {
            if (that.scrollNum <= 2.6 || that.domList.$imgID.offsetWidth * that.scrollNum < 1000) {
                that.scrollNum += 0.2;
            } else {
                try {
                    if (event && event.preventDefault) {
                        //阻止默认浏览器动作(W3C)
                        event.preventDefault();
                    } else {
                        //IE中阻止函数器默认动作的方式 
                        window.event.returnValue = false;
                    }
                } catch (e) { }
                // layer.msg("已经是最大了", { time: 1000, skin: "bgbg" })
                console.log("已经是最大了")
            }
        }
        if (down < 0) {
            if (that.scrollNum > 0.3) {
                that.scrollNum -= 0.2;
            } else {
                try {
                    if (event && event.preventDefault) {
                        //阻止默认浏览器动作(W3C)
                        event.preventDefault();
                    } else {
                        //IE中阻止函数器默认动作的方式 
                        window.event.returnValue = false;
                    }
                } catch (e) { }
                // return layer.msg("已经是最小了", { time: 1000, skin: "bgbg" })
                return console.log("已经是最小了")
            }
        }
        try {
            if (event && event.preventDefault) {
                //阻止默认浏览器动作(W3C)
                event.preventDefault();
            } else {
                //IE中阻止函数器默认动作的方式 
                window.event.returnValue = false;
            }
        } catch (e) { }
        // if (IsIeNine) {
        //     that.domList.$imgID.style.msTransform = "scale(" + that.scrollNum + ")";  /*IE*/
        // } else {
        //     that.domList.$imgID.style.transform = "scale(" + that.scrollNum + ")";
        // }
        that.domList.$imgID.style.Transform = "scale(" + that.scrollNum + ")";
        (<any>that.domList.$imgID.style).msTransform = "scale(" + that.scrollNum + ")";
        (<any>that.domList.$imgID.style).oTransform = "scale(" + that.scrollNum + ")";
        (<any>that.domList.$imgID.style).mozTransform = "scale(" + that.scrollNum + ")";
        (<any>that.domList.$imgID.style).webkitTransform = "scale(" + that.scrollNum + ")";
        return false;
    }
    mouseDown(e:any){
        let that:any = this,ele:any = e.target,initX:number = e.clientX,initY:number = e.clientY,
            itemX:number = parseInt(ele.offsetLeft),itemY:number = parseInt(ele.offsetTop);
        let mousemoveFn = function(){
            let e:any = event||window.event;
            let curX:number = e.clientX,curY:number = e.clientY;
            ele.style.left = itemX + (curX - initX) + 'px';
            ele.style.top = itemY + (curY - initY) + 'px';
            if (e && e.preventDefault) {
                //阻止默认浏览器动作(W3C)
                e.preventDefault();
                document.ondragstart = function () { return false; }
            } else {
                //IE中阻止函数器默认动作的方式 
                window.event.returnValue = false;
            }
            //e.stopPropagation();
            return false;
        }
        addEvent(that.domList.$imgBox,"mousemove",mousemoveFn);
        addEvent(that.domList.$imgBox,"mouseup",function(){
            removeEvent(that.domList.$imgBox,"mousemove",mousemoveFn)
        })
    }
    onresize(imgUrl:string){
        let that = this;
        let $imgIDClose = <HTMLElement>that.domList.$imgIDClose;
        let $imgID = <HTMLElement>that.domList.$imgID;
        var imgSize = that.getImageSize(imgUrl);
        var top = imgSize.h >= SET_IMAGE_PREVIEW_OBG.imgPreviewHeight ? 5 : that.getTop(imgSize.h);
        var tw = (SET_IMAGE_PREVIEW_OBG.imgPreviewWidth - 100 <= imgSize.w) ? SET_IMAGE_PREVIEW_OBG.imgPreviewWidth - 100 : imgSize.w;
        var left = tw >= SET_IMAGE_PREVIEW_OBG.imgPreviewWidth ? 100 : that.getLeft(tw);
    
        // 设置图片样式
        $imgID.style.maxWidth = imgSize.w + "px";
        $imgID.style.maxHeight = imgSize.h + "px";
        $imgID.style.top = top + "px";
        $imgID.style.left = left + "px";
        //设置标题层样式
        if(that.settings.titlePosition === 1){
            that.domList.$imgIDTitle.style.width = (imgSize.w)+"px";
            that.domList.$imgIDTitle.style.left = left+"px";
            that.domList.$imgIDTitle.style.top = (top+imgSize.h-that.TitleHeight)+"px";
            if(that.settings.titleUp){
                that.domList.$titleBtn.style.left=(left+imgSize.w-50)+"px";
                that.domList.$titleBtn.style.top=(top+imgSize.h-52)+"px";
            }
        }
        // 关闭层样式
        if(that.settings.key === "simg"){
            $imgIDClose.style.top = top - 10 + "px";
            $imgIDClose.style.left = left + tw - 10 + "px";
        }
        // 上一张层样式
        that.domList.$imgPrev.style.top = "0";
        that.domList.$imgPrev.style.left = "0";
        that.domList.$imgPrev.innerHTML = that.settings.prevBgImg ? '<div style="text-align: center; margin-top:' + (SET_IMAGE_PREVIEW_OBG.imgPreviewHeight - 60) / 2 + 'px ;"> <img width="20" height="60" src="' + that.settings.prevBgImg + '"> </div>' : 'prev';

        that.domList.$imgNext.style.top = "0";
        that.domList.$imgNext.style.right = "0";
        that.domList.$imgNext.innerHTML = that.settings.nextBgImg ? '<div style="text-align: center; margin-top:' + (SET_IMAGE_PREVIEW_OBG.imgPreviewHeight - 60) / 2 + 'px ;"> <img width="20" height="60" src="' + that.settings.nextBgImg + '"> </div>' : 'prev';
    }
}
function sImgAddEventFn(imgHtml:HTMLElement,imgBoxBg:HTMLElement,titleUp:boolean){//简单图片预览框事件注册
    document.body.appendChild(imgHtml);
    document.body.appendChild(imgBoxBg);
    SET_IMAGE_PREVIEW_OBG.sinpleImgPreviewKey = false;
    let $imgBoxBg:HTMLElement = <HTMLElement>document.body.querySelector("#"+ SET_IMAGE_PREVIEW_OBG.SImgPreviewBoxBg);
    let $imgBox:HTMLElement = <HTMLElement>document.body.querySelector("#"+SET_IMAGE_PREVIEW_OBG.SImgPreviewBox);
    let $imgIDClose:HTMLElement = <HTMLElement>document.body.querySelector("#"+SET_IMAGE_PREVIEW_OBG.SImgPreviewClose);
    let $imgPrev:HTMLElement = <HTMLElement>document.body.querySelector("#"+SET_IMAGE_PREVIEW_OBG.SImgPreviewPrev);
    let $imgNext:HTMLElement = <HTMLElement>document.body.querySelector("#"+SET_IMAGE_PREVIEW_OBG.SImgPreviewNext);
    imgStyle($imgBoxBg,$imgBox);//初始化样式
    addEvent($imgPrev,"click",function(){//注册上一张事件
        SET_IMAGE_PREVIEW_OBG.previewEvents.trigger("prevClick")
    })
    addEvent($imgNext,"click",function(){//注册下一张事件
        SET_IMAGE_PREVIEW_OBG.previewEvents.trigger("nextClick")
    })
    addEvent($imgIDClose,"click",function(){//注册关闭事件
        SET_IMAGE_PREVIEW_OBG.previewEvents.trigger("closeClick")
    })
    if(titleUp){
        let $imgIDTitle:HTMLElement = <HTMLElement>document.body.querySelector("#" + SET_IMAGE_PREVIEW_OBG.SImgPreviewTitle);
        let $titleBtn:HTMLElement =  <HTMLElement>document.body.querySelector("#" + SET_IMAGE_PREVIEW_OBG.SImgPreviewTitleBtn);
        addEvent($titleBtn,"click",function(){
            if($imgIDTitle.style.display === "none"){
                let $imgBox = <HTMLElement>document.body.querySelector("#"+SET_IMAGE_PREVIEW_OBG.SImgPreviewId);
                let h:number = (<HTMLImageElement>$imgBox).naturalHeight ? (<HTMLImageElement>$imgBox).naturalHeight : (<HTMLImageElement>$imgBox).height;
                let top:number = parseFloat($imgBox.style.top);
                show($imgIDTitle);
                let th:number = (<HTMLImageElement>$imgIDTitle).naturalHeight ? (<HTMLImageElement>$imgIDTitle).naturalHeight : (<HTMLImageElement>$imgIDTitle).height;
                $imgIDTitle.style.top = (top+h-th)+"px";
                this.style.background="none";
                this.children[0].style.transform = "rotate(180deg)";
                this.children[0].style.msTransform = "rotate(180deg)";
                this.children[0].style.mozTransform = "rotate(180deg)";
                this.children[0].style.webkitTransform = "rotate(180deg)";
                this.children[0].style.oTransform = "rotate(180deg)";
            }else{
                hide($imgIDTitle);
                this.style.background="rgba(0,0,0,0.5)";
                this.children[0].style.transform = "rotate(0)";
                this.children[0].style.msTransform = "rotate(0)";
                this.children[0].style.mozTransform = "rotate(0)";
                this.children[0].style.webkitTransform = "rotate(0)";
                this.children[0].style.oTransform = "rotate(0)";
            }
        })
    }
}
function imgAddEventFn(imgHtml:HTMLElement,imgBoxBg:HTMLElement,titleUp:boolean){//图片预览框事件注册
    document.body.appendChild(imgHtml);
    document.body.appendChild(imgBoxBg);
    SET_IMAGE_PREVIEW_OBG.imgPreviewKey = false;
    let $imgBoxBg = <HTMLElement>document.body.querySelector("#"+ SET_IMAGE_PREVIEW_OBG.imgPreviewBoxBg);
    let $imgBox = <HTMLElement>document.body.querySelector("#"+SET_IMAGE_PREVIEW_OBG.imgPreviewBox);
    let $imgIDClose:HTMLElement = document.body.querySelector("#"+SET_IMAGE_PREVIEW_OBG.imgPreviewClose);
    let $imgPrev:HTMLElement = document.body.querySelector("#"+SET_IMAGE_PREVIEW_OBG.imgPreviewPrev);
    let $imgNext:HTMLElement = document.body.querySelector("#"+SET_IMAGE_PREVIEW_OBG.imgPreviewNext);
    let $imgBig:HTMLElement = document.body.querySelector("#"+SET_IMAGE_PREVIEW_OBG.imgPreviewBig);
    let $imgSmall:HTMLElement = document.body.querySelector("#"+SET_IMAGE_PREVIEW_OBG.imgPreviewSmall);
    let $imgId:HTMLElement = document.body.querySelector("#"+SET_IMAGE_PREVIEW_OBG.imgPreviewId);
    imgStyle($imgBoxBg,$imgBox);//初始化样式
    addEvent($imgPrev,"click",function(){//注册上一张事件
        SET_IMAGE_PREVIEW_OBG.previewEvents.trigger("prevClick")
    })
    addEvent($imgNext,"click",function(){//注册下一张事件
        SET_IMAGE_PREVIEW_OBG.previewEvents.trigger("nextClick")
    })
    addEvent($imgIDClose,"click",function(){//注册关闭事件
        SET_IMAGE_PREVIEW_OBG.previewEvents.trigger("closeClick")
    })
    addEvent($imgBig,"click",function(e:any){// 註冊放大事件
        SET_IMAGE_PREVIEW_OBG.previewEvents.trigger("imgZoomFn",e,1)
    })
    addEvent($imgSmall,"click",function(e:any){// 註冊缩小事件
        SET_IMAGE_PREVIEW_OBG.previewEvents.trigger("imgZoomFn",e,-1)        
        //scrollMouse(e, -1)
    })
    addEvent($imgId,"mousewheel",function(e:any){// 註冊鼠标滚轮事件
        SET_IMAGE_PREVIEW_OBG.previewEvents.trigger("imgZoomFn",e)   
    })
    addEvent($imgId,"DOMMouseScroll",function(e:any){
        SET_IMAGE_PREVIEW_OBG.previewEvents.trigger("imgZoomFn",e)   
    })
    addEvent($imgId,"mousedown",function(e:any){// 註冊图片拖拽事件
        SET_IMAGE_PREVIEW_OBG.previewEvents.trigger("mouseDown",e)   
    })
    if(titleUp){
        let $imgIDTitle:HTMLElement = <HTMLElement>document.body.querySelector("#" + SET_IMAGE_PREVIEW_OBG.imgPreviewTitle);
        let $titleBtn:HTMLElement =  <HTMLElement>document.body.querySelector("#" + SET_IMAGE_PREVIEW_OBG.imgPreviewTitleBtn);
        addEvent($titleBtn,"click",function(){
            if($imgIDTitle.style.display === "none"){
                let $imgBox = <HTMLElement>document.body.querySelector("#"+SET_IMAGE_PREVIEW_OBG.imgPreviewId);
                let h:number = (<HTMLImageElement>$imgBox).naturalHeight ? (<HTMLImageElement>$imgBox).naturalHeight : (<HTMLImageElement>$imgBox).height;
                let top:number = parseFloat($imgBox.style.top);
                show($imgIDTitle);
                let th:number = (<HTMLImageElement>$imgIDTitle).clientHeight;
                $imgIDTitle.style.top = (top+h-th)+"px";
                this.style.background="none";
                this.children[0].style.transform = "rotate(180deg)";
                this.children[0].style.msTransform = "rotate(180deg)";
                this.children[0].style.mozTransform = "rotate(180deg)";
                this.children[0].style.webkitTransform = "rotate(180deg)";
                this.children[0].style.oTransform = "rotate(180deg)";
            }else{
                hide($imgIDTitle);
                this.style.background="rgba(0,0,0,0.5)";
                this.children[0].style.transform = "rotate(0)";
                this.children[0].style.msTransform = "rotate(0)";
                this.children[0].style.mozTransform = "rotate(0)";
                this.children[0].style.webkitTransform = "rotate(0)";
                this.children[0].style.oTransform = "rotate(0)";
            }
        })
    }
}
function videoAddEventFn(imgHtml:HTMLElement,imgBoxBg:HTMLElement){//视频预览框事件注册
    document.body.appendChild(imgHtml);
    document.body.appendChild(imgBoxBg);
    let $videoBoxBg = <HTMLElement>document.body.querySelector("#"+ SET_IMAGE_PREVIEW_OBG.videoPreviewBoxBg);
    let $videoBox = <HTMLElement>document.body.querySelector("#"+SET_IMAGE_PREVIEW_OBG.videoPreviewBox);
    let $videoIDClose:HTMLElement = document.body.querySelector("#"+SET_IMAGE_PREVIEW_OBG.videoPreviewClose);
    videoStyle($videoBoxBg,$videoBox);//初始化样式
    addEvent($videoIDClose,"click",function(){//注册关闭事件
        let dom:HTMLElement = <HTMLElement>$videoBox.querySelector("video")
        remove(dom);
        hide($videoBoxBg);
        hide($videoBox);
    })
}
function imgStyle($imgBoxBg:HTMLElement,$imgBox:HTMLElement){//初始化图片框样式
    // 展示时的内容层样式
    $imgBox.style.position = "fixed";
    $imgBox.style.top = "0";
    $imgBox.style.left = "0";
    $imgBox.style.width = "100%";
    $imgBox.style.minHeight = SET_IMAGE_PREVIEW_OBG.imgPreviewHeight + "px";
    $imgBox.style.zIndex = "20160901";

    // 展示时的透明背景层样式
    $imgBoxBg.style.position = "fixed";
    $imgBoxBg.style.top = "0";
    $imgBoxBg.style.left = "0";
    $imgBoxBg.style.width = "100%";
    $imgBoxBg.style.height = "100%";
    $imgBoxBg.style.background = "#000";
    $imgBoxBg.style.opacity = "0.6";
    $imgBoxBg.style.zIndex = "20160900";
    $imgBoxBg.style.overflow = "hidden";
}
function videoStyle($videoBoxBg:HTMLElement,$videoBox:HTMLElement){
    // 展示时的内容层样式
    $videoBox.style.position = "fixed";
    $videoBox.style.left = "50%";
    $videoBox.style.top = "50%";
    $videoBox.style.transform = "translate(-50%,-50%)";
    (<any>$videoBox.style).msTransform = "translate(-50%,-50%)";
    (<any>$videoBox.style).oTransform = "translate(-50%,-50%)";
    (<any>$videoBox.style).webkitTransform = "translate(-50%,-50%)";
    (<any>$videoBox.style).mozTransform = "translate(-50%,-50%)";
    $videoBox.style.zIndex = "20160901";

    // 展示时的透明背景层样式
    $videoBoxBg.style.position = "fixed";
    $videoBoxBg.style.top = "0";
    $videoBoxBg.style.left = "0";
    $videoBoxBg.style.width = "100%";
    $videoBoxBg.style.height = "100%";
    $videoBoxBg.style.background = "#000";
    $videoBoxBg.style.opacity = "0";
    $videoBoxBg.style.zIndex = "20160900";
    $videoBoxBg.style.overflow = "hidden";
}
window.onresize = function(){
    onresize && onresize();
    let sele = (<HTMLElement>document.querySelector("#" + SET_IMAGE_PREVIEW_OBG.SImgPreviewBoxBg));
    let ele = (<HTMLElement>document.querySelector("#" + SET_IMAGE_PREVIEW_OBG.imgPreviewBoxBg));
    let vele = (<HTMLElement>document.querySelector("#" + SET_IMAGE_PREVIEW_OBG.videoPreviewBoxBg));
    SET_IMAGE_PREVIEW_OBG.imgPreviewWidth = window.innerWidth;
    SET_IMAGE_PREVIEW_OBG.imgPreviewHeight = window.innerHeight;
    if (ele){
        ele.style.width = "100%";
        ele.style.height = "100%";
        try{
            SET_IMAGE_PREVIEW_OBG.previewEvents.trigger(imgResize, document.querySelector("#" + SET_IMAGE_PREVIEW_OBG.imgPreviewId).getAttribute("data-viewer"));
        }catch(e){}
    }
    if(sele){
        sele.style.width = "100%";
        sele.style.height = "100%";
        try{
            SET_IMAGE_PREVIEW_OBG.previewEvents.trigger(sImgResize, document.querySelector("#" + SET_IMAGE_PREVIEW_OBG.SImgPreviewId).getAttribute("data-viewer"));
        }catch(e){}
    }
    if(vele){
        vele.style.width = "100%";
        vele.style.height = "100%";
        SET_IMAGE_PREVIEW_OBG.previewEvents.trigger(videoResize);
    }
}
export const imgPreview = function(options:imgMagnificationModel){
    if(!options.parentEle)return
    //初始化参数
    let optionObj:imgMagnificationModel = mergeOptions({}, {
        isPaging: true,//是否需要翻页
        key:"img",//生成预览框的类型  "simg":简单图片预览框，"img":带缩放功能的图片预览框（默认），"video":视频预览框
        prevBgImg: "https://imgs.wbp5.com/api/secrecymaster/html_up/2018/10/20181009152904076.png", // 上一张按钮图片
        nextBgImg: "https://imgs.wbp5.com/api/secrecymaster/html_up/2018/10/20181009152928779.png", // 下一张按钮图片
        closeBgImg: "https://imgs.wbp5.com/api/secrecymaster/html_up/2019/11/20191112190957661.png", // 关闭按钮图片
        bigBgImg:"https://imgs.wbp5.com/api/secrecymaster/html_up/2019/11/20191112192601224.png",
        smallBgImg:"https://imgs.wbp5.com/api/secrecymaster/html_up/2019/11/20191112192603317.png",
        parentEle: "",
        IsBox: true, //是否需要显示背景
        titleUp:false,//是否需要收起标题按钮
        titlePosition:1,//标题层的位置
        videoWidth:1170,
    }, options);
    createPreviewDom(options.key,optionObj.titleUp,optionObj.closeBgImg);//生成预览框dom，注册事件
    let eleAry:Array<HTMLElement> = Object.prototype.toString.call(options.parentEle) === "[object Array]"?options.parentEle:[options.parentEle];//判断传入的是不是数组如果不是则转为数组
    for(let i=0;i<eleAry.length;i++){
        let ele:any = eleAry[i];
        if(!/\[object HTML.*Element\]/.test(Object.prototype.toString.call(ele))){
            ele = document.querySelector(ele);
        }
        if(!ele)break;
        let object=JSON.parse(JSON.stringify(optionObj));
        object.parentEle = ele;
        object.clickCallback = optionObj.clickCallback?optionObj.clickCallback:null
        new imgMagnificationFn(object)
    }
}


