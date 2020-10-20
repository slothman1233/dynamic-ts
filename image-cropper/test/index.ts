import { imageCropper } from "./../src/index"
let cropperBox:HTMLElement = document.getElementById("img_cropper");
let fd = document.getElementById("fd");
let sx = document.getElementById("sx");
let yy = document.getElementById("yy");
let zy = document.getElementById("zy");
let sy = document.getElementById("sy");
let xy = document.getElementById("xy");
let imgCropper:any = new imageCropper(
    {
        ele:cropperBox,
        inputBox:document.getElementById("input_box"),
        src:"https://img.wbp5.com/upload/images/master/2020/08/18/111237247.png",
        previewBox:document.getElementsByClassName("yl"),
        cropperBoxWidth:300,
        cropperBoxHeight:200,
        magnifyBtn:fd,
        shrinkBtn:sx,
        moveLeftBtn:zy,
        moveRightBtn:yy,
        moveUpBtn:sy,
        moveDownBtn:xy,
        getImgBtn:document.getElementById("getCrop"),
        getImgCallback:getSrc,
    }
);
// addEvent(document.getElementById("input_box"),"input",function(){
//     const file:any = this.files[0];
//     let fileSrc:any = file?URL.createObjectURL(file):"";//获取上传的图片
//     imgCropper.changeImg(fileSrc);
// })

function getSrc(src:any){
    (<any>document.getElementById("show_img")).src = src;
}