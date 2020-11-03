# 分享

### 使用方法
```
npm install @stl/share

html:
     <div class="share" id="share">
        <em>分享给朋友：</em>
        <i class="share_div" data-bshare='{type:"weixin"}'></i>
        <i class="share_div" data-bshare='{type:"qzone",url:"",title:"",desc:"",summary:"",images:""}'></i>
        <i class="share_div" data-bshare='{type:"weibo",url:"",title:"",desc:"",summary:"",images:""}'></i>   
        <i class="share_div" data-bshare='{type:"qq",url:"",title:"",desc:"",summary:"",images:""}'></i>   
        <i class="share_div" data-bshare='{type:"copy",url:""}'></i>     
    </div>
    <div class="qrcode" data-bshare='{url:""}'></div>
ts:
    import { share } from "@stl/share"
    let shareObj = new share({
        qrcodeBox:document.getElementById("qrcode"),
        qrcodeDeploy:{
            text:"http://www.baidu.com",
            width:200,
            height:200,
            colorDark:"#0000ff",
        }
});
```

### 参数说明
```
    * @param {HTMLElement|string} qrcodeBox 显示微信分享二维码的元素或元素id 如果不传则将生成弹窗显示二维码   
    * @param {object} qrcodeDeploy 微信分享二维码的配置  
          {          
              * @param {number} width  生成二维码的宽度 默认 256  
              * @param {number} height  生成二维码的高度 默认 256  
              * @param {string} colorDark 生成二维码的颜色 默认 "#000000"  
          }     
```

### 方法说明
```
changeQrcode：更新二维码的方法 
调用方法：shareObj.changeQrcode(url)
参数说明：url(要生成二维码的地址)

当实例化“share”时传入了“qrcodeBox”参数 需要更新二维码时调用此方法
如果未传入“qrcodeBox”参数 点击微信分享按钮时二维码会实时更新为当前点击按钮“data-bshare”中的url
```


### 备注
```
此组件将获取所有带"data-bshare"属性的元素  然后根据元素"data-bshare"中"type"的值确定分享类型 可选的分享类型有：   
    1.微信(weixin)：将生成微信分享二维码   
    2.微博(weibo)：将打开微博分享页面   
    3.qq空间(qzone)：将打开qq空间分享页面   
    4.qq(qq)：将打开qq分享页面   
    5.复制链接(copy):将复制要分享的链接地址   

"data-bshare"属性值说明
    1.type:分享类型
    2.url:要分享地址 如果不传则分享的地址为当前页面地址
    3.title:分享的标题 type为"weibo","qq","qzone"时需要
    4.desc:分享的描述 type为"weibo","qq","qzone"时需要
    4.summary:分享的说明 type为"weibo","qq","qzone"时需要
    5.images:分享的预览图 type为"weibo","qq","qzone"时需要
    6.pop:是否弹窗显示二维码  当页面同时有弹窗显示二维码和显示在'qrcodeBox'元素时 在需要弹窗显示的微信分享按钮的"data-bshare"上加入"pop:true"

参数中传入的"qrcodeBox"也需要添加"data-bshare"属性 此时只需要"url"一个参数
```