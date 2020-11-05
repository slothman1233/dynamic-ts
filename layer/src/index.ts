import "./index.less";
import { addLinkLoad } from "@stl/tool-ts/src/common/compatible/addLinkLoad"
import { addEvent } from "@stl/tool-ts/src/common/compatible/addEvent"
import { removeEvent } from "@stl/tool-ts/src/common/compatible/removeEvent"
import { mergeOptions } from "@stl/tool-ts/src/common/compatible/mergeOptions"
import { parent } from "@stl/tool-ts/src/common/dom/parent"
import { each } from "@stl/tool-ts/src/common/obj/each"
import { msgOption,alertParameter,openParameter,modalParameter } from "./type"
class stlLayer{
    times:number = 1
    iconfontSrc:string = "https://js.wbp5.com/iconfont/build/layer/iconfont.css"
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
    bgDom:HTMLElement = null
    closeCallback:(e:any)=>void
    alertBtnCallback:(e:any)=>void
    constructor(){
        let arr:Array<string> = [this.iconfontSrc];
        addLinkLoad(arr);
    }
    private getBgDom(){
        let dom:HTMLElement = document.createElement("div");
        dom.className = "stl-layer-shade";
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
        return icon&&this.iconList[icon]?`<i class="${className} iconfont" style="color:${iconColorStr}">${this.iconList[icon]}</i>`:"";
    }
    private getCloseStr(className:string){
        return `<i class="iconfont ${className}">&#xA005;</i>`
    }

    private msgStr(content:string,icon?:number,iconColor?:string){
        let iconStr = "",className = this.msgObj.paddingClassName;
        if(icon)iconStr = this.getIconStr(this.msgObj.iconClassName,icon,iconColor),className = this.msgObj.iconPaddingClassName;
        return `<div id="" class="stl-layer-content ${className}">${iconStr}${content}</div>`
    }
    msg(content:string,options?:msgOption,end?:()=>void){
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
        this.autoClose(dom,time,end);
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
            return this.autoClose(dom,this.alertObj.time,end);
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
        if(obj.bg)this.bgDom = this.getBgDom(),this.appendDom(this.bgDom),this.addBgEvent(this.bgDom,end);
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
        if(obj.bg)this.bgDom = this.getBgDom(),this.appendDom(this.bgDom),this.addBgEvent(this.bgDom,end);
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
    private appendDom(dom:HTMLElement){
        document.body.appendChild(dom);
    }
    private autoClose(dom:HTMLElement,time:number,end?:()=>void){
        let that = this;
        setTimeout(function(){
            document.body.removeChild(dom);
            if(that.bgDom)document.body.removeChild(that.bgDom),that.bgDom = null;
            try{end&&end()}catch(e){};
        },time)
    }
}

export let layer = new stlLayer();