# 图片、视频预览插件

### 使用方法
```
npm install @stl/image-preview

html:
    <div id="imgBox">
        <img src="图片地址" data-viewer="预览图片地址" title="描述" data-item="0" />
    </div>
    *备注： 1：预览框展示的图片为data-viewer属性的值
            2：预览框中图片描述为title属性的值 如果没有则不显示图片描述
            3：data-item作为分组使用的属性  data-item值相同的打开预览框可左右切换
               如果没有data-item属性则都视为同一组

ts:
    import { imgPreview } from ""@stl/image-preview"

    imgPreview({
        parentEle:document.getElementById("imgBox"),
        clickCallback:function(dom,ev){
            console.log(dom,ev);
            return true;
        }
    })
```

### 参数说明
```
必填参数
    * @param {Element|string|Array<Element>|Array<string>} parentEle    
        图片集合的父元素或者元素字符串（document.getElementById("box")|"box"|[document.getElementById("box")]|["box1","box2"]）
选填参数
    * @param {string} key 预览框的类型  "simg"为简单预览框，"img"为带图片放大缩小、拖拽功能的预览框，"video"为视频预览框   默认为"img"
    * @param {string} prevBgImg 上一张按钮图片 默认有图片
    * @param {string} nextBgImg 下一张按钮图片 默认有图片
    * @param {string} closeBgImg 关闭按钮图片 默认有图片
    * @param {string} bigBgImg 放大按钮图片  只有在key的值为"img"时有用   默认有图片
    * @param {string} smallBgImg 缩小按钮图片 只有在key的值为"img"时有用  默认有图片
    * @param {boolean} IsBox 是否需要显示背景 默认true
    * @param {boolean} isPaging 是否需要切换上下张功能  默认true
    * @param {boolean} titleUp  是否需要收起标题按钮  默认false
    * @param {number} titlePosition  标题层的位置  1表示在图片底部，2表示在页面底部   默认是1
    * @param {number} videoWdith  视频预览的宽度  只有在key的值为"video"时有用  默认为1170
    * @param {function} clickCallback 点击小图显示预览框前的回调  
        此方法接收两个参数 dom：当前点击的绑定预览事件的元素 ev：当前点击的元素（event.target） 
        此方法需要返回true或false 返回true时将继续执行后面的操作，返回false时则不会继续执行后面的操作
```
