# 单行拖拽控件

### 使用方法
```
npm install @stl/line-dragsort

html:
    <ul id="line_dragsort" class="line-dragsort">
        <li><em></em>第一个</li>
        <li><em></em>第二个</li>
        <li><em></em>第三个</li>
        <li><em></em>第四个</li>
        <li><em></em>第五个</li>
        <li><em></em>第六个</li>
        <li><em></em>第七个</li>        
    </ul>

ts:
    import { lineDragSort } from "@stl/line-dragsort"
    let data:any = {
    dragMove:"#line_dragsort > li",
    dragSelector:"#line_dragsort > li > em",
    dragEnd:function(){
        console.log("拖动结束")
    },
    placeHolderTemplate:"<li>123456</li>"
}
lineDragSort(data); 
```

### 参数说明
```
* @param {object} data { dragMove: "#solo > .Imgms" ,  dragEnd: function () { }, placeHolderTemplate: "<div class='Imgms'></div>" }
    * @param {string} dragMove CSS选择器内的元素的列表项的移动手柄 "#solo > .Imgms"。
    * @param {string} dragSelector 拖动手柄必须要是dragMove子级的元素，如果是自身就不用传 "#solo > .Imgms > li"
    * @param {function} dragEnd 拖动结束后将被调用的回调函数
    * @param {string} placeHolderTemplate 拖动列表的HTML部分。
```
