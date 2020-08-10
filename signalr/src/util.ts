export function signalrOnline():any{//通过加载图片的方式判断当前网络是否连接
    let img = new Image();
    img.src = 'https://www.fx110.com//images/Annbgline.jpg?' + (new Date());
    return new Promise((resolve:()=>void,reject:()=>void)=>{
        img.onload = resolve;
        img.onerror = reject;
    })
}

export function IsIE(type:Number = 9.0):Boolean{//判断是否是ie浏览器   type表示浏览器数字变量   9.0表示IE9以下返回false
    //设置判断浏览器数字变量
    const DEFAULT_VERSION = type;
    const ua = navigator.userAgent.toLowerCase();
    const isIE = ua.indexOf("msie") > -1;
    let safariVersion;
    let box = document.getElementById("browser-box");
    if (isIE) {
        safariVersion = ua.match(/msie ([\d.]+)/)[1];
        if (parseInt(safariVersion) <= DEFAULT_VERSION) {
            return false;
        }
    };
    return true;
}

export function loadScript(url:string,callback?:()=>void){//添加js的方法
    let script:any=document.createElement('script');
    script.type='text/javaScript';
    if(script.readyState){//IE
        script.onreadystatechange=function(){ 
            if(script.readyState=='loaded'||script.readyState=='complete'){ 
                script.onreadystatechange=null; callback(); 
            } 
        };
    }else{//其他浏览器
        script.onload=function(){ callback(); }; 
    };
    script.src=url; 
    document.getElementsByTagName('head')[0].appendChild(script);
}