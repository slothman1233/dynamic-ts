# signalr插件

### 使用方法
```
npm install @stl/signalr

import { stlSignalr } from "@stl/signalr"

let obj ={ 
    hubConnection:url,
    connHunProxyOn: "Commit",
    createHubProxy: "BrokersShowHub",
    qs:data,
    connectionSuccessCallback:function(json){
        console.log("signalr连接成功",json)
    },
    afterConnectionCallback:function(that){
        console.log("signalr连接后的回调")
    },
    stateChangedCallback:function(type){
        console.log("当前连接状态"+type)
    },
    disconnected:function(){
        console.log("连接已断开")
    },
    noNetworkCallback:function(){
        console.log("当前无网络")
    }
}
let signalr = new stlSignalr(obj);
```

### 参数说明
|  name         |  type     |  default    |  description                                                                                   |
| :----------:  | :-------: |  :--------: |  :------------------------------------------------------------------------------------------:  |
|  hubjs        |  string   |     ""      |  hub的静态js  用于动态加载静态js 如果不传则默认加载的静态js地址为 hubConnection+"/signalr/hubs"  |
|  hubConnection|  string   |    ""    |  signalr的服务器地址  (与后端开发人员对接)**(必填)**   |
|  connHunProxyOn |  string   |     ""  |  需要订阅的参数   订阅多个参数以“,”隔开，返回值是\[订阅的名称,json数据\]\(与后端开发人员对接\)**(必填)**    |
|  createHubProxy |  string  |    ""     |  新建Hub代理实例自定的Hub类(与后端开发人员对接)**(必填)**      |
|  transports  |  Array  | ['webSockets','longPolling']  |  连接方式                                                               |
|  invokes      |  string   |     ""      |  需要调用的服务端方法名，首字母遵循驼峰命名法(与后端开发人员对接)   |
|  qs      |  object   |     {}   |  后台需要的参数 以对象的形式展现{userkey:_userkey}  |
|  jsonp  |  boolean  |     true    |   是否允许跨域  默认为true  |
|  connectionSuccessCallback  |  function  |  null    |  signalr连接成功后的回调 |
|  afterConnectionCallback  |  function  | null    | signalr连接后的回调 (执行订阅this.connHunProxy.invoke(方法名，参数))  |
|  stateChangedCallback  |  function  | null    | 连接状态发生改变时的回调 change:0正在连接 1已连接 2重新连接 4断开连接  |
|  disconnected  |  function  | null    | 连接断开时触发的回调 |
|  noNetworkCallback  |  function  | null    | 无网络时的回调  默认3秒后再次获取网络状态 |