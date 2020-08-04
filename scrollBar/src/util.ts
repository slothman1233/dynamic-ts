declare let window:any

class boundEvent {//绑定事件兼容性方法  尝试使用了懒汉试单例模式

    private addEvent:(elem:any,type:string,fn:()=>void)=>void = null

    private removeEvent:(elem:any,type:string,fn:()=>void)=>void = null

    private constructor(){
    　  if ( window.addEventListener ){
    　　　　this.addEvent = function( elem, type, handler ){
    　　　　　　elem.addEventListener( type, handler, false );
    　　　　}
            this.removeEvent = function( elem, type, handler ){
    　　　　　　elem.removeEventListener( type, handler, false );
    　　　　}
    　　}else if ( window.attachEvent ){
    　　　　this.addEvent = function( elem, type, handler ){
    　　　　　　elem.attachEvent( 'on' + type, handler );
    　　　　}
            this.removeEvent = function( elem, type, handler ){
    　　　　　　elem.detachEvent(  'on' + type, handler );
    　　　　}
    　　}
    }

    private static instance:boundEvent = null;

    public static bind():boundEvent{
        if(this.instance === null){
            this.instance = new boundEvent();
        }
        return this.instance
    }
}
export const addObj:any = boundEvent.bind();

export function IsIE(){//判断是否是IE的方法
    if (!!window.ActiveXObject || "ActiveXObject" in window)
        return true;
    else
        return false;
}

export function IsFirefox(){//判断是否是firefox的方法
    if(window.navigator.userAgent.toLowerCase().indexOf('firefox')>=0)
        return true;
    else
        return false;
}

export function IEVersion(){//判断当前是IE几
    let userAgent:any = navigator.userAgent;
    let isIE:boolean = userAgent.indexOf("compatible")>-1&&userAgent.indexOf("MSIE")>-1;
    let isEdge:boolean = userAgent.indexOf("Edge")>-1&&!isIE;
    let isIE11:boolean = userAgent.indexOf("Trident")>-1&&userAgent.indexOf("rv:11.0")>-1;
    if(isIE){
        let reIE:RegExp = new RegExp("MSIE (\\d+\\.\\d+);");
        reIE.test(userAgent);
        return parseFloat(RegExp["$1"]);
    }else if(isEdge){
        return "edge";
    }else if(isIE11){
        return 11;
    }else{
        return -1;
    }
}