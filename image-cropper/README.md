# 图片裁剪插件

### 使用方法
```
npm install @stl/image-cropper

//如果“addStyle”参数传入的是false，需要用此方式加载css;如果不传“addStyle”参数则默认通过js方式加载css
css:  @import "/node_modules/@stl/image-cropper/dist/index.css";

html:
<input type="file" id="input_box" />//上传图片框
<div class="img_box" id="img_cropper"></div>//裁剪框父元素
<div class="yl" ></div>//大预览框
<div class="yl" ></div>//中等预览框
<div class="yl" ></div>//小预览框
<div>
    <div id="fd">图片放大按钮</div>
    <div id="sx">图片缩小按钮</div>
    <div id="yy">裁剪框右移按钮</div>
    <div id="sy">裁剪框上移按钮</div>
    <div id="zy">裁剪框左移按钮</div>
    <div id="xy">裁剪框下移按钮</div>
</div>
<div id="get_img">获取裁剪后的图片</div>

ts：
import { imageCropper } from "@stl/image-cropper"
let imgCropper:any = new imageCropper(
    {
        ele:document.getElementById("img_cropper"),
        inputBox:document.getElementById("input_box"),
        src:"http://www.jq22.com/demo/cropper-master20160830/examples/crop-avatar/img/picture.jpg",
        previewBox:document.getElementsByClassName("yl"),
        magnifyBtn:document.getElementById("fd"),
        shrinkBtn:document.getElementById("sx"),
        moveLeftBtn:document.getElementById("zy"),
        moveRightBtn:document.getElementById("yy"),
        moveUpBtn:document.getElementById("sy"),
        moveDownBtn:document.getElementById("xy"),
        getImgBtn:document.getElementById("get_img"),
        getImgCallback:uploadImg,
    }
);
function uploadImg(src){
    console.log(src)
    ......
}
```

### 方法说明
```
magnifyFn:()=>void 放大图片的回调方法(如果传入了参数magnifyBtn则不需要再调用此方法放大图片)    
            调用方式  imgCropper.magnifyFn()
shrinkFn:()=>void 缩小图片的回调方法(如果传入了参数shrinkBtn则不需要再调用此方法缩小图片)     
            调用方式  imgCropper.shrinkFn()
moveLeftFn:()=>void 裁剪框左移的回调方法(如果传入了参数moveLeftBtn则不需要再调用此方法)   
            调用方式  imgCropper.moveLeftFn()
moveRightFn:()=>void 裁剪框右移的回调方法(如果传入了参数moveRightBtn则不需要再调用此方法)  
            调用方式  imgCropper.moveRightFn()
moveUpFn:()=>void 裁剪框上移的回调方法(如果传入了参数moveUpBtn则不需要再调用此方法)     
            调用方式  imgCropper.moveUpFn()
moveDownFn:()=>void 裁剪框下移的回调方法(如果传入了参数moveDownBtn则不需要再调用此方法)   
            调用方式  imgCropper.moveDownFn()
changeImg:(src:string)=>void 更改图片的回调(如果传入了上传图片的input框则不需要再调用此方法)   
            调用方式  imgCropper.changeImg()
getCropSize：(callback)=>void 获取裁剪后图片的base64编码（如果传入参数getImgBtn和getImgCallback则不需要再调用此方法）   
            调用方式 imgCropper.getCropSize(callback)
            此方法接收一个参数callback  callback将在获取裁剪后图片的base64编码后执行并将base64编码传入callback中
``` 

### 备注
```
1.如果你要使用跨源图片来作为剪裁图片，请确保你的图片服务器支持Access-Control-Allow-Origin属性，
  不然会产生图片跨域问题。
2.getImgCallback方法将获得裁剪后图片的base64编码，如果图片有跨域或其他未知问题会导致生成base64编码失败， 
  如果生成失败则会返回一个对象：
    {
        width:裁剪后的图片宽度,
        height:裁剪后的图片高度,
        x:x轴的起始裁剪位置,
        y:y轴的起始裁剪位置,
        src:裁剪前的原图片地址
    }
```

### 参数说明（加粗的为必传项）
|  参数名         |  类型     |  默认值    |  description               |
| :----------:  | :-------: |  :--------: |  :-----------------------:  |
|  **ele**          |  HTMLElement  |         |    裁剪框父元素               |
|  src         |  string   |    ""        |  初始化时裁剪框内显示的图片地址     |
|  inputBox     |  HTMLElement   |     null  |  上传图片的input框 （必须设置type="file"）点击此元素上传图片后将会默认将上传图片加载到裁剪框     |
|  addStyle        |  boolean  |    true     |   true：通过js的方式添加style标签，false:不会通过js的方式添加样式   需要手动引入css文件    |
|  previewBox    |  HTMLElement   |     null    |     预览裁剪图片的元素（列表）document.getElementById("")或document.getElementsByClassName("")两种方式传入  |
|  zoomMultiple  |  number   |     20      |  图片可缩放的倍数       |
|  zoomScale    |  number   |     0.05   | 每次缩放图片的比例       |
|  cropperBoxWidth  |  number  |  200    | 裁剪框初始宽度   |
|  cropperBoxHeight  |  number  |  200    |   裁剪框初始高度   |
|  fixedCropSize  |  boolean  |  false    |  是否固定裁剪框尺寸   |
|  moveStep  |  number  |  10    |  点击移动裁剪框按钮每次移动的距离   |
|  magnifyBtn  |  HTMLElement  |  null    |  点击放大图片的按钮   |
|  shrinkBtn  |  HTMLElement  |  null    |  点击缩小图片的按钮   |
|  moveLeftBtn  |  HTMLElement  |  null    |  点击向左移动裁剪框的按钮   |
|  moveRightBtn  |  HTMLElement  |  null    |  点击向右移动裁剪框的按钮   |
|  moveUpBtn  |  HTMLElement  |  null    |  点击向上移动裁剪框的按钮   |
|  moveDownBtn  |  HTMLElement  |  null    |  点击向下移动裁剪框的按钮   |
| getImgCallback | function  |  null  | 获取裁剪后图片成功的回调 此方法将获得一个参数（参数值见备注2）（此方法中this指向为实例化出来的imageCropper对象） |
|  cropInitComplete  |  function  |  null    |  裁剪框dom初始化完成的回调 （此方法中this指向为实例化出来的imageCropper对象）   |
|  inputImgComplete  |  function  |  null    |  添加本地图片完成的回调（此方法将获得一个参数 input事件的this对象）（此方法中this指向为实例化出来的imageCropper对象）方法中将this.fileSrc赋值为空将阻止后面方法的执行   |

