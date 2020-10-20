import { lineDragSort } from "../src/index";

let data:any = {
    dragMove:"#line_dragsort > li",
    dragSelector:"#line_dragsort > li > em",
    dragEnd:function(){
        console.log("拖动结束")
    },
    placeHolderTemplate:"<li>123456</li>"
}
lineDragSort(data);

/**
 * 单行拖拽的控件
 * @param {object} data { dragMove: "#solo > .Imgms" ,  dragEnd: function () { }, placeHolderTemplate: "<div class='Imgms'></div>" }
        * @param {string} dragMove CSS选择器内的元素的列表项的移动手柄 "#solo > .Imgms"。
        * @param {string} dragSelector 拖动手柄必须要是dragMove子级的元素，如果是自身就不用传 "#solo > .Imgms > li"
        * @param {function} dragEnd 拖动结束后将被调用的回调函数
        * @param {string} placeHolderTemplate 拖动列表的HTML部分。
 */