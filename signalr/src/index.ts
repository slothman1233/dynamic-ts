// import '@babel/polyfill'

import { paramets } from "./types"
import { signalrOnline } from "./util"
import { signalrWebsocket } from "./websocket"


export class stlSignalr {
    private data:paramets
    constructor(data:paramets){
        this.data = data;
        this.init();
    }
    init(){
        const that = this;
        const promise = signalrOnline();//判断是否有网络
        promise.then(
            ()=>{
                signalrWebsocket(that.data)
            },
            ()=>{
                if(that.data.noNetworkCallback){
                    that.data.noNetworkCallback.call(that);
                }else{
                    setTimeout(//如果没有网络则每隔三秒重连一次
                        ()=>{that.init.call(that)}
                    ,3000)
                }
            }
        )
    }
}
