import { imgPreview } from "../src/index"
imgPreview({
    parentEle:document.getElementById("img_list"),
    key:"img",
    titleUp:true,
    clickCallback:function(dom,ev){
        if(ev.target.parentNode.tagName === "A"){
            return false;
        }else{
            return true;
        }
    }
})
imgPreview({
    parentEle:document.getElementById("imgs"),
    key:"simg",
    titleUp:false,
    IsBox:false,
    titlePosition:2,
    nextBgImg:"https://imgs.wbp5.com/api/secrecymaster/html_up/2020/1/20200113155738458.png",
    prevBgImg:"https://imgs.wbp5.com/api/secrecymaster/html_up/2020/1/20200113155730317.png",
    closeBgImg:"https://imgs.wbp5.com/api/secrecymaster/html_up/2018/12/20181214092752161.png"
})

imgPreview({
    parentEle:document.getElementById("video_box"),
    key:"video",
    videoWdith:900,
})

setTimeout(function(){
    let img:any = document.createElement("img");
    img.src = "https://img.wbp5.com/upload/images/firstnews/2020/07/06/110109700.jpg";
    img.setAttribute("data-viewer","https://img.wbp5.com/upload/images/firstnews/2020/07/06/110109700.jpg");
    img.setAttribute("data-item","1");
    document.getElementById("img_list").appendChild(img);
},10000)