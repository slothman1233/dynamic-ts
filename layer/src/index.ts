import "./index.less";
import { addLinkLoad } from "@stl/tool-ts/src/common/compatible/addLinkLoad"
import { addEvent } from "@stl/tool-ts/src/common/compatible/addEvent"
import { removeEvent } from "@stl/tool-ts/src/common/compatible/removeEvent"
import { mergeOptions } from "@stl/tool-ts/src/common/compatible/mergeOptions"
import { removeClass } from "@stl/tool-ts/src/common/dom/removeClass"
import { addClass } from "@stl/tool-ts/src/common/dom/addClass"
import { parent } from "@stl/tool-ts/src/common/dom/parent"
import { each } from "@stl/tool-ts/src/common/obj/each"
interface msgOption{
    icon?:number,
    iconColor?:string,
    time?:number,
}

interface alertParameter{
    content:string,
    icon?:number,
    iconColor?:string,
    title?:string,
    autoClose?:boolean,
    time?:number,
    // bg?:boolean,
    btnStr?:string,
    btnCallback?:(ev:any)=>void,
    showCallback?:()=>void,
    endCallback?:()=>void,
}

interface modalParameter{
    title:string,
    content:string,
    hasClose?:boolean,
    bg?:boolean,
    determineBtn?:boolean,
    determineText?:string,
    determineFn?:()=>void,
    cancelBtn?:boolean,
    cancelText?:string,
    cancelFn?:()=>void,
    showCallback?:()=>void,
    endCallback?:()=>void,
}
interface openParameter extends modalParameter{
    type?:1|2,
    icon?:number,
    iconColor?:string,
}

interface loadParameter{
    img:string
    parent?:HTMLElement
    bg?:boolean
    width?:number
    height?:number
} 
interface tipsParameter{
    //auto?:boolean
    time?:number
    position?:"top"|"bottom"|"left"|"right"
    maxWidth?:number
}
class stlLayer{
    times:number = 1
    iconfontSrc:string = "https://js.wbp5.com/iconfont/build/layer/iconfont.css?v=888"
    iconList:any = {
        11:"&#xA001;",12:"&#xA002;",//1开头为‘✔’的图标
        21:"&#xA003;",22:"&#xA004;",//2开头为‘×’的图标
        31:"&#xA006;",32:"&#xA007;",//3开头为‘i’的图标
        41:"&#xA008;",42:"&#xA009;",//4开头为‘！’的图标
        1110:"&#xA005;",//关闭弹窗图标
    }
    iconColorList:any={
        11:"#21d37d",12:"#21d37d",
        21:"#d5375a",22:"#d5375a",
        31:"#26d1e0",32:"#26d1e0",
        41:"#e8a02e",42:"#e8a02e",
        1110:"rgba(0, 0, 0, 0.75)",
    }
    msgObj:any = {
        className:"stl-layer-msg stl-layer-shadow stl-layer-centered",
        iconClassName:"stl-layer-msg-icon",
        paddingClassName:"stl-layer-msg-padding",
        iconPaddingClassName:"stl-layer-icon-msg-padding",
        time:3000
    }
    hasTitleAlertObj:any = {
        iconClassName:"stl-layer-title-alert-icon",
        btnClassName:"stl-layer-alert-btn stl-layer-alert-hastitle-btn",
        titleClassName:"stl-layer-alert-title",
        textClassName:"stl-layer-alert-hastitle-text",
    }
    noTitleAlertObj:any = {
        btnClassName:"stl-layer-alert-btn stl-layer-alert-notitle-btn",
        iconClassName:"stl-layer-alert-icon",
        textClassName:"stl-layer-alert-text",
    }
    alertObj:any = {
        time:3000,
        closeClassName:"stl-layer-alert-close",
        className:"stl-layer-alert stl-layer-centered",
        paddingClassName:"stl-layer-alert-padding",
        iconPaddingClassName:"stl-layer-icon-alert-padding",
        contentClassName:"stl-layer-content  stl-layer-border stl-layer-alert",
    }
    openObj:any = {
        className:"stl-layer-shadow stl-layer-centered stl-layer-open",
        bgClassName:"stl-layer-open-bg",
        classNameTwo:"stl-layer-open-two",
        contentPadding:"stl-layer-open-padding stl-layer-open-content",
        iconContentPadding:"stl-layer-icon-open-padding stl-layer-open-content",
        iconClassName:"stl-layer-open-icon",
        titleClassName:"stl-layer-open-title",
        iconTitleClassName:"stl-layer-open-icon-title",
        textClassName:"stl-layer-open-text",
        iconTextClassName:"stl-layer-open-icon-text",
        closeClassName:"stl-layer-open-close",
        btnClassName:"stl-layer-open-btn",
        btnBoxClassName:"stl-layer-open-btn-box",
        determineClassName:"stl-layer-open-btn-determine",
        cancelClassName:"stl-layer-open-btn-cancel",
        textNoBtnClassName:"stl-layer-open-text-nobtn",
        parameter:{
            type:1,autoClose:false,hasClose:true,determineBtn:false,determineText:"确定",cancelBtn:false,cancelText:"取消",bg:true,
        }
    }
    modalObj:any = {
        className:"stl-layer-shadow stl-layer-centered stl-layer-modal",
        bgClassName:"stl-layer-modal-bg",
        headClassName:"stl-layer-modal-head",
        titleClassName:"stl-layer-modal-title",
        contentClassName:"stl-layer-modal-content",
        textClassName:"stl-layer-modal-text",
        footClassName:"stl-layer-modal-foot",
        btnClassName:"stl-layer-modal-btn",
        determineClassName:"stl-layer-open-btn-determine",
        cancelClassName:"stl-layer-open-btn-cancel",
        closeClassName:"stl-layer-modal-close",
        parameter:{
            hasClose:true,determineBtn:true,determineText:"确定",cancelBtn:true,cancelText:"取消",bg:true,
        }
    }
    loadObj:any = {
        className:"stl-layer-loading",
        bgClassName:"stl-layer-loading-bg",
        pClassName:"stl-layer-parent-loading",
        pBgClassName:"stl-layer-parent-loading-bg",
        parameter:{bg:true,width:40,height:40,}
    }
    tipObj:any = {
        parameter:{position:"top",time:3000,},
        hideClassName:"stl-layer-tip-hide",
        className:"stl-layer-tip",
        ContentClassName:"stl-layer-tip-content",
    }
    bgDom:HTMLElement = null
    timeoutList:any = {
        msg:null,
        alert:null,
    }
    closeCallback:(e:any)=>void
    alertBtnCallback:(e:any)=>void
    constructor(){
        let arr:Array<string> = [this.iconfontSrc];
        addLinkLoad(arr);
    }
    private getBgDom(className?:string){
        let dom:HTMLElement = document.createElement("div");
        dom.className = "stl-layer-shade "+className;
        dom.id = `stl-layer-shade${this.times}`;
        dom.setAttribute("times",""+this.times);
        return dom;
    }
    private getDomStr(content:string,className:string){
        let dom:HTMLElement = document.createElement("div");
        dom.className = `stl-layer stl-layer${this.times} ${className}`;
        dom.id = `stl-layer${this.times}`;
        // dom.setAttribute("times",""+this.times);
        dom.innerHTML = content;
        return dom;
    }
    private getIconStr(className:string,icon?:number,iconColor?:string){
        let iconColorStr:string = iconColor&& iconColor!==""?iconColor:this.iconColorList[icon]; 
        return icon&&this.iconList[icon]?`<i class="${className} iconfont_layer" style="color:${iconColorStr}">${this.iconList[icon]}</i>`:"";
    }
    private getCloseStr(className:string){
        return `<i class="iconfont_layer ${className}">&#xA005;</i>`
    }
    private deduplication(className:string,type:string){
        let domList = document.getElementsByClassName(className)
        if(domList.length>0){
            document.body.removeChild(domList[0]);
            clearTimeout(this.timeoutList[type]);
            this.timeoutList[type] = null;
        }
    }
    private msgStr(content:string,icon?:number,iconColor?:string){
        let iconStr = "",className = this.msgObj.paddingClassName;
        if(icon)iconStr = this.getIconStr(this.msgObj.iconClassName,icon,iconColor),className = this.msgObj.iconPaddingClassName;
        return `<div id="" class="stl-layer-content ${className}">${iconStr}${content}</div>`
    }
    msg(content:string,options?:msgOption,end?:()=>void){
        this.deduplication("stl-layer-msg","msg");
        let type:boolean = typeof options === "function",callback:any = end?end:null,time:number = this.msgObj.time,icon:number = 0,iconColor:string = "";
        if(type)callback = options;
        if(options&&!type){
            time = options.time?options.time:time;
            icon = options.icon?options.icon:icon;
            iconColor = options.iconColor?options.iconColor:""
        }
        let contentStr:string =this.msgStr(content,icon,iconColor);
        let dom:HTMLElement = this.getDomStr(contentStr,this.msgObj.className);
        this.appendDom(dom);
        this.times++;
        this.autoClose("msg",dom,time,end);
    }

    private hasTitleAlertStr(obj:alertParameter){
        let iconStr:string = "",skinClassName:string = "",btnStr:string = "",closeStr:string = "",className = this.alertObj.paddingClassName,iconColor:string = obj.iconColor?obj.iconColor:"";
        if(obj.icon)
            iconStr = this.getIconStr(this.hasTitleAlertObj.iconClassName,obj.icon,iconColor),skinClassName = "stl-layer-skin"+obj.icon,className = this.alertObj.iconPaddingClassName;
        if(obj.btnStr)btnStr = `<div class="${this.hasTitleAlertObj.btnClassName}">${obj.btnStr}</div>`;
        closeStr = obj.autoClose?"":this.getCloseStr(this.alertObj.closeClassName);
        let titleStr:string = `<p class="${this.hasTitleAlertObj.titleClassName}">${obj.title}</p>`;
        let contentStr:string = `<p class="${this.hasTitleAlertObj.textClassName}">${obj.content}</p>`;
        return `<div id="" class="${this.alertObj.contentClassName} ${className} ${skinClassName}">
                ${iconStr}${titleStr}${contentStr}${btnStr}${closeStr}</div>`
    }
    private noTitleAlertStr(obj:alertParameter){
        let iconStr:string = "",skinClassName:string = "",btnStr:string = "",closeStr:string = "",className = this.msgObj.paddingClassName,iconColor:string = obj.iconColor?obj.iconColor:"";
        if(obj.icon)
            iconStr = this.getIconStr(this.noTitleAlertObj.iconClassName,obj.icon,iconColor),skinClassName = "stl-layer-skin"+obj.icon,className = this.msgObj.iconPaddingClassName;
        if(obj.btnStr){
            btnStr = `<div class="${this.noTitleAlertObj.btnClassName}">${obj.btnStr}</div>`;
        }else{
            closeStr = obj.autoClose?"":this.getCloseStr(this.alertObj.closeClassName);
        }
        let content:string = `<p class="${this.noTitleAlertObj.textClassName}">${obj.content}</p>`
        return `<div id="" class="${this.alertObj.contentClassName} ${className} ${skinClassName}">
                ${iconStr}${content}${btnStr}${closeStr}</div>`
    }
    private addAlertBtnEvent(dom:HTMLElement,key:boolean,fn:(ev:any)=>void){
        let that:any = this,btnClassName = key?that.hasTitleAlertObj.btnClassName:that.noTitleAlertObj.btnClassName;
        that.alertBtnCallback = function(e:any){
            let ev:any = e||window.event;
            removeEvent(dom.getElementsByClassName(btnClassName)[0],"click",that.alertBtnCallback);
            try{fn&&fn.call(that,ev)}catch(e){console.log(e)};
            document.body.removeChild(dom);
            that.alertBtnCallback = null;
        }
        addEvent(dom.getElementsByClassName(btnClassName)[0],"click",that.alertBtnCallback);
    }
    alert(obj:alertParameter){
        this.deduplication("stl-layer-alert","alert");
        let contentStr:string = "",className:string = "",hasTitle:boolean = false;
        if(obj.title){
            contentStr = this.hasTitleAlertStr(obj),className = this.alertObj.className,hasTitle = true;
        }else{
            contentStr = this.noTitleAlertStr(obj);
        }
        let dom:HTMLElement = this.getDomStr(contentStr,className);
        let end:any = obj.endCallback?obj.endCallback:null;
        this.appendDom(dom);
        try{
            obj.showCallback&&obj.showCallback.call(this);
        }catch(e){}
        this.times++;
        if(obj.btnStr&&obj.btnCallback) this.addAlertBtnEvent(dom,hasTitle,obj.btnCallback)
        if(obj.autoClose){
            return this.autoClose("alert",dom,this.alertObj.time,end);
        }else if(!obj.btnStr||obj.title){
            let closeDom:Element = dom.getElementsByClassName(this.alertObj.closeClassName)[0];
            this.addCloseEventFn(closeDom,end)
        }
    }
    private getOpenStr(obj:openParameter,iconStr:string){
        let contentClassName:string = this.openObj.contentPadding,titleClassName:string = this.openObj.titleClassName,
            textClassName:string = this.openObj.textClassName,btnStr:string = "";
        if(iconStr !== ""){
            contentClassName = this.openObj.iconContentPadding,titleClassName = this.openObj.iconTitleClassName,
            textClassName = this.openObj.iconTextClassName;
        }
        let noBtnClassName:string = this.openObj.textNoBtnClassName;
        if(obj.determineBtn||obj.cancelBtn){
            noBtnClassName = "";
            let determineBtnStr:string = obj.determineBtn?`<span class="${this.openObj.btnBoxClassName} ${this.openObj.determineClassName}">${obj.determineText}</span>`:"",
                cancelBtnStr:string = obj.cancelBtn?`<span class="${this.openObj.btnBoxClassName} ${this.openObj.cancelClassName}">${obj.cancelText}</span>`:"";
            btnStr = `<div class="${this.openObj.btnClassName}">${cancelBtnStr}${determineBtnStr}</div>`
        }
        let titleStr:string = `<p class="${titleClassName}">${obj.title}</p>`,textStr:string = `<p class="${textClassName} ${noBtnClassName}">${obj.content}</p>`;
        
        return `<div id="" class="${contentClassName}">${titleStr}${textStr}${btnStr}</div>`
    }
    open(data:openParameter){
        let obj = mergeOptions({},this.openObj.parameter,data),end = obj.end?obj.end:null,iconColor:string = obj.iconColor?obj.iconColor:"";
        let iconStr:string =obj.icon?this.getIconStr(this.openObj.iconClassName,obj.icon,iconColor):"",
            closeStr:string = obj.hasClose?this.getCloseStr(this.openObj.closeClassName):"";
        let contentStr:string = this.getOpenStr(obj,iconStr);
        let openTypeClassName = obj.type === 2?this.openObj.classNameTwo:"";
        let dom:HTMLElement = this.getDomStr(contentStr+iconStr+closeStr,this.openObj.className+" "+openTypeClassName);
        if(obj.bg)this.bgDom = this.getBgDom(this.openObj.bgClassName),this.appendDom(this.bgDom),this.addBgEvent(this.bgDom,end);
        this.appendDom(dom);
        this.times++;
        try{obj.showCallback&&obj.showCallback.call(this)}catch(e){};
        if(closeStr !== ""){
            let closeDom:Element = dom.getElementsByClassName(this.openObj.closeClassName)[0];
            this.addCloseEventFn(closeDom,end);
        }
        if(obj.determineBtn){
            let determineBox:Element = dom.getElementsByClassName(this.openObj.determineClassName)[0];
            this.addOpenBtnFn(determineBox,obj.determineFn,end);
        }
        if(obj.cancelBtn){
            let cancelBox:Element = dom.getElementsByClassName(this.openObj.cancelClassName)[0];
            this.addOpenBtnFn(cancelBox,obj.cancelFn,end);
        }
    }
    private getModalFn(data:modalParameter){
        let closeStr:string = data.hasClose?this.getCloseStr(this.modalObj.closeClassName):"";
        let headStr:string = `<div class="${this.modalObj.headClassName}">
                <p class="${this.modalObj.titleClassName}">${data.title}</p>${closeStr}
            </div>`;
        let contentStr:string = `<div class="${this.modalObj.contentClassName}">
                <p class="${this.modalObj.textClassName}">${data.content}</p>
            </div>`
        let determineBtnStr:string = data.determineBtn?`<span class="${this.modalObj.btnClassName} ${this.modalObj.determineClassName}">${data.determineText}</span>`:"",
            cancelBtnStr:string = data.cancelBtn?`<span class="${this.modalObj.btnClassName} ${this.modalObj.cancelClassName}">${data.cancelText}</span>`:"";
        let btnStr:string = `<div class="${this.modalObj.footClassName}">${cancelBtnStr}${determineBtnStr}</div>`
            return headStr+contentStr+btnStr;
    }
    modal(data:modalParameter){
        let obj = mergeOptions({},this.modalObj.parameter,data),end = obj.end?obj.end:null;
        let contentStr:string = this.getModalFn(obj);
        let dom:HTMLElement = this.getDomStr(contentStr,this.modalObj.className);
        if(obj.bg)this.bgDom = this.getBgDom(this.modalObj.bgClassName),this.appendDom(this.bgDom),this.addBgEvent(this.bgDom,end);
        this.appendDom(dom);
        this.times++;
        try{obj.showCallback&&obj.showCallback.call(this)}catch(e){};
        if(obj.hasClose){
            let closeDom:Element = dom.getElementsByClassName(this.modalObj.closeClassName)[0];
            this.addCloseEventFn(closeDom,end);
        }
        if(obj.determineBtn){
            let determineBox:Element = dom.getElementsByClassName(this.openObj.determineClassName)[0];
            this.addOpenBtnFn(determineBox,obj.determineFn,end);
        };
        if(obj.cancelBtn){
            let cancelBox:Element = dom.getElementsByClassName(this.openObj.cancelClassName)[0];
            this.addOpenBtnFn(cancelBox,obj.cancelFn,end);
        }
    }
    private addBgEvent(dom:HTMLElement,end:()=>void){
      let that = this;
      addEvent(dom,"click",function(){
        let id:string = dom.getAttribute("times");
        let box:Element = document.getElementsByClassName("stl-layer"+id)[0];
        document.body.removeChild(dom);
        document.body.removeChild(box);
        that.bgDom = null;
        try{end&&end()}catch(e){};
      })
    }
    private addOpenBtnFn(dom:Element,fn:()=>void,end:()=>void){
        let that:any = this;
        let clickFn = function(e:any){
            let ev:any = e||window.event;
            fn&&fn.call(that,ev.target);
            that.closeFn.call(that,ev.target);
            try{end&&end.call(that)}catch(e){}
        }
        addEvent(dom,"click",clickFn);
    }
    private addCloseEventFn(dom:Element,end:()=>void){
        let that:any = this;
        let closeCallback = function(e:any){
            let ev:any = e||window.event;
            that.closeFn.call(that,ev.target);
            try{end&&end.call(that)}catch(e){};
        };
        addEvent(dom,"click",closeCallback)
    }
    private closeFn(dom:any){
        // removeEvent(dom,"click",this.closeCallback);
        // this.closeCallback = null;
        document.body.removeChild(parent(dom,".stl-layer"));
        if(this.bgDom)document.body.removeChild(this.bgDom),this.bgDom = null;
        // let that:any = this;
        // if(type){
        //     each(this.btnDom,function(value:any,key:any){
        //         value&&removeEvent(value,"click",that.btnFn[key]),that.btnDom[key] = null,that.btnFn[key] = null;
        //     })
        // }
    }
    private appendDom(dom:HTMLElement,parent?:HTMLElement){
        let parentDom:HTMLElement = parent?parent:document.body;
        parentDom.appendChild(dom);
    }
    private autoClose(type:string,dom:HTMLElement,time:number,end?:()=>void){
        let that = this;
        this.timeoutList[type] = setTimeout(function(){
            document.body.removeChild(dom);
            if(that.bgDom)document.body.removeChild(that.bgDom),that.bgDom = null;
            that.timeoutList[type] = null;
            try{end&&end()}catch(e){};
        },time)
    }
    loading(data:loadParameter){
        let obj = mergeOptions({},this.loadObj.parameter,data);
        if(data.parent){
            this.parentLoad(obj)
        }else{
            this.noParentLoad(obj)
        }
    }
    private getLoadDom(obj:loadParameter,className:string):HTMLElement{
        let imgStr:string = `<img src="${obj.img}" style="width:${obj.width}px;height:${obj.height}px;display:block;" />`;
        return this.getDomStr(imgStr,className);
    }
    private parentLoad(obj:loadParameter){
        let dom:HTMLElement = this.getLoadDom(obj,this.loadObj.pClassName);
        let bg:HTMLElement = this.getBgDom(this.loadObj.pBgClassName);
        this.appendDom(bg,obj.parent);
        this.appendDom(dom,obj.parent);
        this.times++;
    }
    private noParentLoad(obj:loadParameter){
        let load:HTMLCollectionOf<Element> = document.getElementsByClassName("stl-layer-loading");
        if(load.length>0)return;
        let dom:HTMLElement = this.getLoadDom(obj,this.loadObj.className);
        if(obj.bg){
            let bg:HTMLElement = this.getBgDom(this.loadObj.bgClassName);
            this.appendDom(bg)
        }
        this.appendDom(dom);
        this.times++;
    }
    closeLoad(parent?:HTMLElement){
        let parentDom:HTMLElement | Document = document,removeDom:HTMLElement = document.body,
            ClassName:string = "stl-layer-loading",BgClassName:string = "stl-layer-loading-bg";
        if(parent){
            parentDom = parent,
            removeDom = parent,
            ClassName = "stl-layer-parent-loading",
            BgClassName = "stl-layer-parent-loading-bg";
        }
        let load:NodeListOf<Element> | HTMLCollectionOf<Element> = parentDom.getElementsByClassName(ClassName)
        let dom:NodeListOf<Element> | HTMLCollectionOf<Element> = parentDom.getElementsByClassName(BgClassName)
        if(load.length>0)removeDom.removeChild(load[0]);
        if(dom.length>0)removeDom.removeChild(dom[0]);
    }
    tips(that:any,content:string,data:tipsParameter = {},end?:()=>void){
        let obj:tipsParameter = mergeOptions({},this.tipObj.parameter,data);
        let styleStr:string = obj.maxWidth?`max-width:${obj.maxWidth}px`:"";
        let str:string = `<div class="${this.tipObj.ContentClassName}">
                <p class="${this.tipObj.className}-p" style="${styleStr}">${content}</p>
                <em class="${this.tipObj.className}-em ${this.tipObj.className}-em-${obj.position}"></em>
            </div>`;
        let dom:HTMLElement = this.getDomStr(str,this.tipObj.className+" "+this.tipObj.hideClassName);
        this.getTipPosition(dom,that,obj);
        this.times++;
        this.autoClose("tips",dom,obj.time,end)
    }
    // closeTips(dom:HTMLElement){
    //     dom.removeChild(document.getElementsByClassName("stl-layer-tip")[0])
    // }
    private getTipPosition(dom:HTMLElement,that:any,obj:tipsParameter){
        let left:number = that.getBoundingClientRect().left
        let top:number = that.getBoundingClientRect().top
        let width:number = that.offsetWidth;
        let height:number = that.offsetHeight;
        document.body.appendChild(dom);
        let domWidth:number = dom.offsetWidth;
        let domHeight:number = dom.offsetHeight;
        let leftNum:number = left+width/2-domWidth/2
        let domLeft:number = leftNum<0?0:leftNum;
        let topNum:number = top+height/2-domHeight/2
        let domTop:number = topNum<0?0:topNum;
        let emDom:Element = dom.getElementsByClassName(this.tipObj.className+"-em")[0];
        switch(obj.position){
            case "top":
                let positionTop:number = top-domHeight-8;
                dom.style.left = domLeft+"px";
                if(top+positionTop<0)
                    dom.style.top = (top+height+8)+"px",
                    removeClass(emDom,this.tipObj.className+"-em-"+obj.position),
                    addClass(emDom,this.tipObj.className+"-em-bottom");
                else dom.style.top = positionTop+"px";
                break;
            case "bottom":
                let positionBottom:number = top+height+8;
                dom.style.left = domLeft+"px";
                if(top+positionBottom+domHeight>document.body.clientHeight)
                    dom.style.top = (top-domHeight-8)+"px",
                    removeClass(emDom,this.tipObj.className+"-em-"+obj.position),
                    addClass(emDom,this.tipObj.className+"-em-top");
                else dom.style.top = positionBottom+"px";
                break;
            case "right":
                let positionLeft:number = left+width+8;
                dom.style.top = domTop+"px";
                if(left+positionLeft+domWidth>document.body.clientWidth)
                    dom.style.left =(left-domWidth-8)+"px",
                    removeClass(emDom,this.tipObj.className+"-em-"+obj.position),
                    addClass(emDom,this.tipObj.className+"-em-left");
                else dom.style.left =positionLeft+"px";
                break;
            case "left":
                let positionRight:number = left-domWidth-8;
                dom.style.top = domTop+"px";
                if(left+positionRight<0)
                    dom.style.left = (left+width+8)+"px",
                    removeClass(emDom,this.tipObj.className+"-em-"+obj.position),
                    addClass(emDom,this.tipObj.className+"-em-right");
                else dom.style.left = positionRight+"px";
        } 
        removeClass(dom,"stl-layer-tip-hide");
    }
}

export let layer = new stlLayer();