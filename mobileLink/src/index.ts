import { mergeOptions } from "@stl/tool-ts/src/common/Compatible/mergeOptions"
import { addEvent } from "@stl/tool-ts/src/common/Compatible/addEvent"
import { createEl } from "@stl/tool-ts/src/common/dom/createEl"
interface options{
    params?:string//链接后面的参数
    buttom?:any//按钮
    androidLink:string//安卓唤起的链接
    oldAndroidLink?:string
    androidDownloadUrl:string//安卓的下载链接
    androidYyb?:boolean//是否开启应用宝下载
    iosLink:string//ios唤起的链接
    ios9Link?:string//ios的Universal Link
    iosDownloadUrl:string//ios的下载链接
    iosUniversalLinkEnabled?:boolean//是否开启Universal Link
    iosYyb?:boolean//ios是否开启应用宝下载
    yybDownloadUrl?:string//应用宝下载链接
    autoLaunchApp?:boolean//是否打开页面就唤起App
    autoRedirectToDownloadUrl?:boolean//是否自动跳转到下载页面
    noLoadingYyb?:boolean//是否自动跳转到应用宝下载页面
    winxinFn?:any//微信浏览器打开
    weiboFn?:any//微博浏览器打开
    qqFn?:any//qq浏览器打开
    winxinSrc?:any//微信浏览器提示图片
    weiboSrc?:any//微博浏览器提示图片
    qqSrc?:any//qq浏览器提示图片
    callback?:any//加载完成的回调
    trigger?:boolean
    downloadUrl:any//下载页地址
    beforeCallback?:any//加载前的回调
    formatUrlFn?:(url:string,params:any) => string//格式化url的方法 url:唤起的链接，params:需要添加的参数 {url:"https://www.baidu.com",b:1}；return 格式化后的链接
    count?:number//启动定时器的次数 默认100次
    clickTime?:number//打开App累计消耗时间 默认3000ms
}
export class MobileLink{
    options:any//参数列表
    ifr:any = false//创建的iframe
    iframeId:string = "plugIn_downloadAppPlugIn_loadIframe"//iframe的类名
    Navigators:any = navigator.userAgent//浏览器信息
    ifChrome:any//是否是谷歌浏览器
    ifAndroid:any//是否是安卓浏览器
    ifiPad:any//是否是ipad浏览器
    ifiPhone:any//是否是苹果
    ifIos:any//是否是ios打开
    ifSafari:any//是否是safari浏览器打开
    iosVersion:any//ios版本号
    androidVersion:any//安卓版本号
    isWeixin:any//是否是微信浏览器打开
    isWeibo:any//是否是微博浏览器打开
    isQQ:any//是否是qq浏览器打开
    openLink:string//唤起的链接
    openAndroidOldLink:string
    downloadUrl:string//下载页地址
    isClick:boolean = false//是否是点击触发
    initOption:any = {
        buttom:document.querySelectorAll("#isload"),
        params:{},
        androidYyb:false,
        iosUniversalLinkEnabled:false,
        iosYyb:false,
        autoLaunchApp:false,
        autoRedirectToDownloadUrl:false,
        noLoadingYyb:false,
        trigger:false,
        weixinSrc:"https://imgs.wx168e.com/api/secrecymaster/html_up/2019/7/20190703115949958.png",
        weiboSrc:"https://imgs.wx168e.com/api/secrecymaster/html_up/2019/7/20190703115949958.png",
        qqSrc:"https://imgs.wx168e.com/api/secrecymaster/html_up/2019/7/20190703115949958.png",
        count:100,

    }
    constructor(option:options){
        this.options = mergeOptions(this.initOption,option);
        this.getBrowserInformation();
        this.init();
    }
    private init(){
        let that = this;
        if(this.options.button){//给每个按钮都绑定事件
            if(Object.prototype.toString.call(this.options.button) === '[object Array]'){
                for(let i=0;i<this.options.button.length;i++){
                    this.addClickFn(this.options.button[i]);
                }
            }else{
                this.addClickFn(this.options.button);
            }
        }
    }
    private getBrowserInformation(){//获取浏览器信息
        this.ifChrome = this.Navigators.match(/Chrome/i) != null && this.Navigators.match(/Version\/\d+\.\d+(\.\d+)?\sChrome\//i) == null?true:false;
        this.ifAndroid = this.Navigators.match(/(Android);?[\s\/]+([\d.]+)?/)?true:false;
        this.ifiPad = this.Navigators.match(/(iPad).*OS\s([\d_]+)/)?true:false;
        this.ifiPhone = !this.ifiPad&&this.Navigators.match(/(iPhone\sOS)\s([\d_]+)/)?true:false;
        this.ifIos = this.Navigators.match(/iPhone|iPad|iPd/i)?true:false;
        this.ifSafari = this.ifIos && this.Navigators.match(/Safari/);
        let iosVersion = this.Navigators.match(/OS\s*(\d+)/);
        this.iosVersion = iosVersion ? iosVersion[1]||0:0;
        let androidVersion = this.Navigators.match(/Android\s*(\d+)/);
        this.androidVersion = androidVersion?androidVersion[1]||0:0;
        if(this.Navigators.indexOf("MicroMessenger")>=0){//微信中打开
            this.isWeixin = true;
        }else if(this.Navigators.indexOf("QQ")>=0){//qq中打开
            this.isQQ = true;
            if(this.ifAndroid){
                if(/MQQBrowser/i.test(this.Navigators)){
                    if(!(/\sQQ/i.test((this.Navigators).split('MQQBrowser'))))this.isQQ = false;
                }
            }else if(this.ifIos){
                if(!(/\sQQ/i.test(this.Navigators)) && /MQQBrowser/i.test(this.Navigators))this.isQQ = false;
            }
        }else if(this.Navigators.indexOf("Weibo")>=0){//微博中打开
            this.isWeibo = true;
        }
    }
    private addClickFn(dom:any){//给唤起按钮绑定唤起事件
        let that = this;
        dom.setAttrbute('href','javascript:void(0)');
        addEvent(dom,'click',function(){
            that.openClick.call(that);
        })
    }
    private openClick(){//点击按钮执行的操作
        let that = this;
        if(that.options.beforeCallback){
            that.options.beforeCallback(function(){
                that.createIframe.call(that);
            });
        }else{
            that.createIframe();
        }
    }
    private createIframe(){
        if(!this.ifr){
            this.ifr = document.createElement("iframe");
            this.ifr.id = this.iframeId;
            document.body.appendChild(this.ifr);
            this.ifr.style.display = "none";
            this.ifr.style.width = "0px";
            this.ifr.style.height = "0px";
        }
        this.openApp();//打开app
    }
    private openApp(){
        let that = this;
        this.openLink = null,this.openAndroidOldLink = null,this.downloadUrl = null;
        if(this.isWeixin){//是否在微信中打开
            if(!this.thirdPartyFn("weixin",this.options.weixinSrc,this.options.weixinFn))return;
        }else if(this.isWeibo){//是否在微博中打开
            if(!this.thirdPartyFn("weibo",this.options.weiboSrc,this.options.weiboFn))return;
        }
        this.isClick = true;
        if(this.ifIos){
            this.openLink = this.options.iosLink || null;
            this.downloadUrl = this.options.iosDownloadUrl || null;
        }else if(this.ifAndroid){
            if(!this.isWeixin&&!this.isWeibo){
                this.openLink = this.options.androidLink || null;
                this.openAndroidOldLink = this.options.oldAndroidLink || null;
                //开启应用宝跳转
                this.downloadUrl = (this.options.androidYyb || false) ? (this.options.yybDownloadUrl || null) : (this.options.androidDownloadUrl || null);
            }
        }
        this.openLink = this.options.formatUrlFn?this.options.formatUrlFn(this.openLink,this.options.params):this.formatUrl(this.openLink,this.options.params);
        //android5及以上版本
        if(this.ifAndroid&&this.androidVersion>=3){
            setTimeout(()=>{
                if(that.options.androidYyb)that.openLink = that.options.yybDownloadUrl || null;
                window.location.href = that.openLink;
            },50);
        }
        if(this.ifIos){//ios9及以上的版本

        }
        let aLink:any = document.createComment("a");
        aLink.href = this.openLink;
        document.body.appendChild(aLink);

        //使用计算时差的方案打开APP
        let checkOpen = function(cb:any){
            let _clickTime = +new Date();
            function check(elsTime:any){
                if(elsTime>that.options.clickTime||document.hidden||(<any>document).webkitHidden){
                    cb(1);
                    that.options&&that.options.Callback&&that.options.Callback();
                }else{
                    cb(0);
                }
            }
            //启动间隔20ms运行的定时器，并检测累计消耗时间是否超过3000ms，超过则结束
            let _count = 0,intHandle:any;
            intHandle = setInterval(function(){
                _count++;
                var elsTime=+new Date() - _clickTime;
                if(_count>=that.options.count||elsTime>that.options.clickTime){
                    clearInterval(intHandle);
                    check(elsTime);
                }
            },20)
        }
        checkOpen(function(opened:any){
            if(opened === 0&& that.options.autoRedirectToDownloadUrl){
                window.location.href = that.downloadUrl;
            }
        })
    }
    /*
        type:string 在微信还是微博中打开 微信打开为"weixin",微博打开为"weibo"
        src:string 提示在浏览器打开的图片地址
        fn:function 回调函数
    */
   private thirdPartyFn(type:string,src:string,fn:any){//在微信或微博中打开执行的操作
        if(this.ifAndroid){
            if(this.options.noLoadingYyb){
                this.openLink = this.options.androidLink || null;
                this.downloadUrl = this.options.yybDownloadUrl || null;
                this.createTipDom(type,src)
                return false;
            }else{
                if(fn)fn();
                this.createTipDom(type,src);
                return false;
            }
        }else if(this.ifIos){
            this.openLink = this.options.iosLink || null;
            this.downloadUrl = this.options.iosDownloadUrl || null;//开启应用宝跳转
            return true;
        }
    }
     /*
        type:string 在微信还是微博中打开 微信打开为"weixin",微博打开为"weibo"
        src:string 提示在浏览器打开的图片地址
    */
   private createTipDom(type:string,src:string){//创建提示元素
        let tsDom = createEl("div",{
            className:"zx",
            innerHTML:`<img src="${src}" class="${type}">`
        })
        document.body.appendChild(tsDom);
    }
    //格式化url
    /*
        url:string 需要格式化的url地址
        params:object 需要添加的参数 {url:"https://www.baidu.com",b:1}
    */
   private formatUrl(url:any,params:any){
        let arr:any = [];
        for (var p in params) {
            if (p && params[p]) {
                arr.push(p + '=' + encodeURIComponent(params[p]));
            }
        }
        arr = arr.join('&');
        var u = url.split("?");
        var newUrl = null;
        if (u.length == 2) {
            newUrl = u[0] + "?" + u[1] + "&" + arr;
        } else {
            newUrl = u[0] + "?" + arr;
        }
        return newUrl;
    }
}
