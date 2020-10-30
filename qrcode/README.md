# 生成二维码

### 使用方法
```
npm install @stl/qrcode

html:
    <div id="qrcode"></div>

ts:
import  qrcode  from "@stl/qrcode"
    let dom = document.getElementById("qrcode")
    let qrcodeObj = new qrcode(dom,{
        text:"http://www.baidu.com",
        width:200,
        height:200,
        colorDark:"#0000ff",
    })
```

### 参数说明
```
    * @param {HTMLElement|string} 显示二维码的元素或元素id    
    * @param {object}  二维码的配置  
          {        
              * @param {string} text  要生成二维码的内容  
              * @param {number} width  生成二维码的宽度 默认 256  
              * @param {number} height  生成二维码的高度 默认 256  
              * @param {string} colorDark 生成二维码的颜色 默认 "#000000"  
          }     
```

### 方法说明
```
clear:清除二维码 使用方法：qrcodeObj.clear()
makeCode:重新生成二维码 使用方法：qrcodeObj.makeCode("http://naver.com")
```