export interface paramets {
    hubjs?:string,//hub的静态js  用于动态加载静态js 如果不传则默认加载的静态js地址为 hubConnection+"/signalr/hubs"
    hubConnection:string,//signalr的服务器地址  (由后端提供)
    connHunProxyOn:string,//需要订阅的参数   订阅多个参数以“,”隔开，返回值是[订阅的名称,json数据](由后端提供)
    createHubProxy:string,//新建Hub代理实例自定的Hub类(由后端提供)
    transports?:Array<string>,//连接方式  默认['webSockets','longPolling']
    invokes?:string,//需要调用的服务端方法名，首字母遵循驼峰命名法(由后端提供)
    qs?:any,//后台需要的参数 以对象的形式展现{userkey:_userkey}
    jsonp?:boolean,//是否允许跨域  默认为true
    connectionSuccessCallback?:(json:any,singlar?:any)=>void//signalr连接成功后的回调   cb
    afterConnectionCallback?:(that:any)=>void//signalr连接后的回调 (执行订阅this.connHunProxy.invoke(方法名，参数))  callbacks
    stateChangedCallback?:(change:number)=>void//连接状态发生改变时的回调  change:0正在连接 1已连接 2重新连接 4断开连接
    disconnected?:()=>void,//连接断开时触发的回调
    noNetworkCallback?:()=>void//无网络时的回调  默认3秒后再次获取网络状态
}
