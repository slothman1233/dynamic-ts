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

document.getElementById("btn").addEventListener("click",function(){
    document.getElementById("weixin_share").setAttribute("data-bshare",'{type:"weixin",url:"http://www.baidu.com",title:"百度",desc:"分享百度",summary:"一个很牛逼的网站",images:"https://imgs.wbp5.com/api/secrecymaster/html_up/2020/3/20200327115851614.png"}')
    document.getElementById("qzone_share").setAttribute("data-bshare",'{type:"qzone",url:"http://www.baidu.com",title:"百度",desc:"分享百度",summary:"一个很牛逼的网站",images:"https://imgs.wbp5.com/api/secrecymaster/html_up/2020/3/20200327115851614.png"}')
    document.getElementById("weibo_share").setAttribute("data-bshare",'{type:"weibo",url:"http://www.baidu.com",title:"百度",desc:"分享百度",summary:"一个很牛逼的网站",images:"https://imgs.wbp5.com/api/secrecymaster/html_up/2020/3/20200327115851614.png"}')
    document.getElementById("copy_share").setAttribute("data-bshare",'{type:"copy",url:"http://www.baidu.com",title:"百度",desc:"分享百度",summary:"一个很牛逼的网站",images:"https://imgs.wbp5.com/api/secrecymaster/html_up/2020/3/20200327115851614.png"}')
    shareObj.changeQrcode("http://www.baidu.com")
    document.getElementById("share").style.display = "block";
})





// setTimeout(function(){
//     shareObj.changeQrcode("http://www.juejin.im")
// },10000)