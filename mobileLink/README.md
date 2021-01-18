# 唤起app组件

### 使用方法
```
npm install @stl/mobilelink

ts:
    import { MobileLink } from "@stl/mobilelink"

    let mobLink = new MobileLink({
         buttom:document.querySelectorAll("#isload"),
        androidLink:"",
        androidDownloadUrl:""
        iosLink:"",
        ios9Link:"",
        iosDownloadUrl:"",
        winxinFn:()=>{},
        weiboFn:()=>{},
        qqFn:()=>{},
        winxinSrc:"",
        weiboSrc:"",
        qqSrc:"",
        callback:()=>{},
        downloadUrl:"",
    })
```

### 参数说明
```
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
```

### 文件介绍
```
├── config  配置文件
│    ├── karma 单元测试生成报告的文件
│    └── build 配置需要生成的文件
├── src  开发文件夹
├── test    单元测试文件夹
│    └── hello.component.test   karam-test -> hello.component ts文件的单元测试
│── dist  生产文件夹
├── karma.conf.js   单元测试的配置文件
└── rollup.config.js   rollup的配置文件
```