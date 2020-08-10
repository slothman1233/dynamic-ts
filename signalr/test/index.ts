import { paramets } from "../src/types"
import { stlSignalr } from "../src/index"

let obj:paramets ={ 
    hubConnection:"https://bspush.wbp5.com/BrokersShow/hubs",
    connHunProxyOn: "Commit",
    createHubProxy: "BrokersShowHub",
    qs:{userkey:"userkey"},
    connectionSuccessCallback:function(){
        console.log("signalr连接成功")
    },
    afterConnectionCallback:function(){
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
let mockHelloService:any = new stlSignalr(obj);