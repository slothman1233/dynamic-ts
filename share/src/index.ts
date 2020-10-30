
import { show } from "@stl/tool-ts/src/common/dom/show"
import { hide } from "@stl/tool-ts/src/common/dom/hide"
import { mergeOptions } from "@stl/tool-ts/src/common/compatible/mergeOptions"
import { addEvent } from "@stl/tool-ts/src/common/compatible/addEvent"
import { on } from "@stl/tool-ts/src/common/event/on"
import { qrcode } from "./qrcode"

interface qrcodeDeploy {
    width?:number
    height?:number
    colorDark?:string
    colorLight?:string
}

interface parameter {
  qrcodeBox?:HTMLElement|string//渲染二维码的元素
  qrcodeDeploy?:qrcodeDeploy|string
  copyCallback?:()=>void
}

export class share {
    parameter:parameter
    weibo:string = "http://service.weibo.com/share/share.php"
    qq:string = "http://connect.qq.com/widget/shareqq/index.html"
    qzone:string = "https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey"
    weixinSrc:any
    shareDom:NodeListOf<Element>
    qrcodeObj:any = null
    qrcodeKey:Boolean = false
    qrcodeParent:HTMLElement = null
    qrcodeUrl:string
    constructor(parameter:parameter){
        let that:any = this;
        that.parameter = parameter;
        on({
            agent:document.body,
            events:"click",
            ele:"[data-bshare]",
            fn:function(e:any){
                let ev:any = e || window.event.target;
                that.clickFn.call(that,ev)
            }
        })
        if(that.parameter.qrcodeBox){
         let obj = that.getBshare(that.parameter.qrcodeBox)
         if(!obj)return;
         this.qrcodeObj = new qrcode(this.parameter.qrcodeBox,mergeOptions({},this.parameter.qrcodeDeploy,{text:obj.url}))
        }
    }
    getBshare(dom:any){
      let shareData = dom.getAttribute("data-bshare");
      let obj = shareData&&shareData!==""?eval("(" + shareData + ")"):null;
      return obj?obj:null;
    }
    clickFn(ev:any){
        let obj = this.getBshare(ev);
        if(!obj)return;
        switch(obj.type){
            case "weixin":
                this.weixinFn(obj);
                break;
            case "weibo":
                this.weiboFn(obj)
                break;
            case "qzone":
                this.qzoneFn(obj)
                break;
            case "copy":
                this.copyFn(obj)
                break;
            case "qq":
                this.qqFn(obj)
                break;
        }
    }
    weixinFn(obj:any){
      if(this.parameter.qrcodeBox)return;
      this.getQrcodeDom();
      if(!this.qrcodeObj){
        this.qrcodeUrl = obj.url;
        let data = {text:this.qrcodeUrl};
        this.qrcodeObj = new qrcode(this.parameter.qrcodeBox,mergeOptions({},this.parameter.qrcodeDeploy,data))
      }else{
        if(this.qrcodeUrl!=obj.url)this.qrcodeObj.makeCode(obj.url), this.qrcodeUrl = obj.url;
      }
      if(this.qrcodeKey&&this.qrcodeParent)show(this.qrcodeParent);
    }
    getQrcodeDom(){
        let that = this;
        let html =  `<div id='qrcHtml' style='width:200px;height:200px;margin:auto;'></div>
                    <div style='text-align: center;margin-top:5px;'>使用微信扫一扫</div>
                    <a href='javascript:;' id='qrcClose' style='width: 16px; height: 16px;position: absolute; right: 0;top: 0;color: #999;text-decoration: none;font-size: 16px;'>×</a>`
        this.qrcodeParent = document.createElement("div");
        this.qrcodeParent.id = "QRcode";
        let styles = 'position:fixed;left:50%;top:50%;margin:-224px 0 0 -150px;padding:40px;width:220px !important;height:228px !important;background:#fff;border:solid 1px #d8d8d8;z-index:11001; font-size:12px;';
        this.qrcodeParent.setAttribute("style",styles)
        this.qrcodeParent.innerHTML = html;
        document.body.appendChild(this.qrcodeParent);
        this.parameter.qrcodeBox = document.getElementById("qrcHtml")
        addEvent(document.getElementById("qrcClose"),"click",function(){
            hide(that.qrcodeParent)
        });
        this.qrcodeKey = true;
    }
    qqFn(obj:any){
        let href = this.qq+"?url="+this.isUndefined(obj.url)+"&sharesource=qzone&title="+this.isUndefined(obj.title)+"&pics="+this.isUndefined(obj.images)+"&summary="+this.isUndefined(obj.summary)+"&desc="+this.isUndefined(obj.desc)
        this.bashreHref(href);
    }
    qzoneFn(obj:any){
        let href = this.qzone+"?url="+this.isUndefined(obj.url)+"&sharesource=qzone&title="+this.isUndefined(obj.title)+"&pics="+this.isUndefined(obj.images)+"&summary="+this.isUndefined(obj.summary)+"&desc="+this.isUndefined(obj.desc)
        this.bashreHref(href);
    }
    weiboFn(obj:any){
        let href = this.weibo+"?url="+this.isUndefined(obj.url) + "&pic=" + this.isUndefined(obj.images) + "&type=button&language=zh_cn&style=simple&searchPic=true&title=" + this.isUndefined(obj.summary) + "&appkey=";
        this.bashreHref(href);
    }
    copyFn(obj:any){
        let text:string = obj.url;
        let input = document.createElement("input");
        input.value = text;
        document.body.appendChild(input)
        input.select();
        document.execCommand("copy");
        input.remove();
        this.parameter.copyCallback&&this.parameter.copyCallback.call(this);
    }
    bashreHref(href:any) {
        window.open(href, '_blank', 'width=800,height=800,left=10,top=10,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no');
    }
    isUndefined(v:any) {
        if (v == undefined || !v) {
            return "";
        }
        return v;
    }
    changeQrcode(url:string){
      if(this.qrcodeUrl!=url)this.qrcodeObj.makeCode(url), this.qrcodeUrl = url;
    }
}
