import { qrcode } from "./../src"
let dom = document.getElementById("qrcode")
let qrcodes = new qrcode(dom,{
    text:"http://www.baidu.com",
    width:200,
    height:200,
    colorDark:"#0000ff",
})