import { share } from "./../src"
let shareObj = new share({
     qrcodeBox:document.getElementById("qrcode"),
    // qrcodeDeploy:"http://www.baidu.com"
    qrcodeDeploy:{
        width:200,
        height:200,
        colorDark:"#0000ff",
    }
});


setTimeout(function(){
    shareObj.changeQrcode("http://www.juejin.im")
},10000)