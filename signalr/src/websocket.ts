import { paramets } from "./types"
import { IsIE,loadScript } from "./util"
declare let $:any

class linkSignalr {
    private isInvoke:boolean = true
    private hubConnection:string
    private connHunProxyOn:string
    private createHubProxy:string
    private jsonp:boolean
    private transports:Array<string>
    private signalrSettimeout:any = null
    private connection:any
    private connHunProxy:any
    private start:(callback:any)=>void
    private stop:()=>void
    constructor(data:paramets){
        let that = this;
        this.hubConnection = data.hubConnection || "//fxchatnews.fx110.com";
        this.connHunProxyOn = data.connHunProxyOn || "ReceiverQuote";
        this.createHubProxy = data.createHubProxy || "MT4Hub";
        this.jsonp = data.jsonp || true;
        if(IsIE()){
            this.transports = data.transports || ["webSockets"];
        }else{
            this.transports = data.transports || ["webSockets","longPolling"];
        }
        this.connection = $.hubConnection(this.hubConnection);
        this.connHunProxy = this.connection.createHubProxy(this.createHubProxy);
        if(data.qs)
            this.connection.qs = data.qs;
        if(this.connHunProxyOn.indexOf(",")>=0){
            let conn = this.connHunProxyOn.split(",");
            for(let i=0;i<conn.length;i++){
                (function(conn){
                    this.connHunProxy.on(conn,function(json:any){
                        setTimeout(function(){
                            try{
                                data.connectionSuccessCallback&&data.connectionSuccessCallback([conn,json.tran()]);
                            }catch(e){
                                data.connectionSuccessCallback&&data.connectionSuccessCallback([conn,json]);
                            };
                        },100);
                    });
                })(conn[i]);
            };
        }else{
            this.connHunProxy.on(this.connHunProxyOn,function(json:any){
                setTimeout(function(){
                    try{
                        data.connectionSuccessCallback&&data.connectionSuccessCallback(json.tran());
                    }catch(e){
                        data.connectionSuccessCallback&&data.connectionSuccessCallback(json);
                    };
                },100);
            });
        };
        //开始连接
        this.connection.start({jsonp:this.jsonp,transport:this.transports}).done(function(){
            data.afterConnectionCallback&&data.afterConnectionCallback(that);
        });
        this.connection.error(function(error:any){});
        this.connection.stateChanged(function(change:any){//监听连接状态发生改变  change:{oldState:4,newState:0}    0正在连接 1已连接 2重新连接 4断开连接
            if(data.stateChangedCallback)
                data.stateChangedCallback(change);
            if(change.newState == $.signalR.connectionState.reconnecting){//重新连接
                clearTimeout(that.signalrSettimeout);
            }else if (change.newState == $.signalR.connectionState.connected) { //连接
                clearTimeout(that.signalrSettimeout);
            }else if (change.newState == $.signalR.connectionState.connecting) {  //正在连接

            }else if (change.newState == $.signalR.connectionState.disconnected) { //断开
            
            };
        });
        that.connection.disconnected(function(){
            data.disconnected&&data.disconnected();
        });
        that.start = function(callback){//开始连接
            that.connection.start({ jsonp: true, transport: that.transports }).done(function () {
                if (callback) { callback(that) } else { data.afterConnectionCallback(that); }
            });
        };
        that.stop = function() {//停止连接
            that.connection.stop();
        }
    }
}


export function signalrWebsocket(data:paramets):object{
    let script = document.getElementsByTagName("script");
    let reg:RegExp = /<script[^src]*src="([^"]*)"[^>]*>/ig;
    let isLoad:boolean = false;
    let loadJs:number = 0;
    let signalrFn:any;
    for(let i=0;i<script.length;i++){
        if(script[i].src.indexOf("signalr/hubs")>=0||(data.hubjs&&script[i].src.indexOf(data.hubjs)>=0)){
            isLoad = true;
            break;
        };
    };
    if(!isLoad){
        loadScript("//js.wbp5.com/script/public/signalr/signalrjs/2.2.2/jquery.signalR-2.2.2.min.js",function(){
            loadScript(data.hubjs || data.hubConnection + "/signalr/hubs" || "https//fxchatnews.fx110.com/signalr/hubs", function () {
                signalrFn = new linkSignalr(data);
                console.log("js加载完成")
            });
        });
    }else {
        console.log("js已加载")
        signalrFn = new linkSignalr(data);
    };
    return {
        connection: function () {
            return signalrFn.connection;
        },
        connHunProxy: function () {
            return signalrFn.connHunProxy;
        },
        //开启连接
        start: function (callback:any) {
            signalrFn.start(callback);
        },
        //停止连接
        stop: function () {
            signalrFn.connection.stop();
        }
    }
}