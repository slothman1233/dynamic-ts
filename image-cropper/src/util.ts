import { domSize } from "./type";
import { IMG_CROPPER_STYLE_STRING } from "./template"

export function addStyleFn(){//添加style标签
    const styleList:any = document.getElementsByTagName("style");
    for(let i=0;i<styleList.length;i++){//如果已经添加了样式则不再添加
        if(styleList[i].getAttribute("name") === "imageCropper")return;
    }
    let styleLable:any = document.createElement("style");
    styleLable.tyle = "text/css";
    styleLable.setAttribute("name","imageCropper");
    styleLable.innerHTML = IMG_CROPPER_STYLE_STRING;
    document.getElementsByTagName("head")[0].appendChild(styleLable);
}

export function IE_VERSION():number|string {//判断当前是IE几
    const USER_AGENT: string = window.navigator && window.navigator.userAgent || '';
    let isIE:boolean = USER_AGENT.indexOf("compatible") > -1 && USER_AGENT.indexOf("MSIE") > -1; //判断是否IE<11浏览器  
    if (isIE) {
        const reIE:RegExp = new RegExp("MSIE (\\d+\\.\\d+);");
        reIE.test(USER_AGENT);
        let fIEVersion:number = parseFloat(RegExp["$1"]);
        return fIEVersion >= 7?fIEVersion:6
      }
    let isEdge:boolean = USER_AGENT.indexOf("Edge") > -1; //判断是否IE的Edge浏览器  
    if (isEdge) {
        return 'edge';//edge
    }
    let isIE11:boolean = USER_AGENT.indexOf('Trident') > -1 && USER_AGENT.indexOf("rv:11.0") > -1;
    if (isIE11) {
        return 11; //IE11  
    }
    return -1;//不是ie浏览器
  }

export function getImageSize(src:string,fn:Function){//获取图片尺寸
    let that:any = this;
    let img:HTMLImageElement = new Image();
    img.src = src;
    img.onload = function(){
        let size:domSize = {width:img.width,height:img.height};
        if(fn){
            return fn.call(that,size);
        };
        return size;
    }
}

export function getTransform(dom:any,val:string){
    dom.style.transform = val;
    dom.style.msTransform = val;
    dom.style.mozTransform = val;
    dom.style.webkitTransform = val;
    dom.style.oTransform = val;
}

export function getBase64(imgUrl:any) {
    window.URL = window.URL || (<any>window).webkitURL;
    let xhr:any = new XMLHttpRequest();
    xhr.open("get", imgUrl, true);
    // 至关重要
    xhr.responseType = "blob";
    xhr.onload = function () {
      if (this.status == 200) {
        //得到一个blob对象
        let blob:any = this.response;
        // 至关重要
        let oFileReader:any = new FileReader();
        oFileReader.onloadend = function (e:any) {
          let base64:any = (<any>e.target).result;
          return base64;
        };
        oFileReader.readAsDataURL(blob);
      }
    }
    xhr.send();
  }