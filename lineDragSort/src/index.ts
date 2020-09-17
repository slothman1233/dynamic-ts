
import { createEl, insertAfter, insertBefore, getOffset, swapArray, remove } from '@stl/tool-ts/src/common/dom';
import { eventsPath } from '@stl/tool-ts/src/common/event';

/**
 * 单行拖拽的控件
 * @param {object} data { dragSelector: "#solo > .Imgms" ,  dragEnd: function () { }, placeHolderTemplate: "<div class='Imgms'></div>" }
        * @param {string} dragMove CSS选择器内的元素的列表项的移动手柄。
        * @param {string} dragSelector 拖动手柄必须要是dragMove子级的元素，如果是自身就不用传
        * @param {function} dragEnd 拖动结束后将被调用的回调函数
        * @param {string} placeHolderTemplate 拖动列表的HTML部分。
 */

interface dragsortData {
    dragSelector?: string
    dragMove?: string
    dragEnd?: Function
    placeHolderTemplate?: string
}


class dragsortFn {
    data: dragsortData = {}
    domAll: Array<Element> //所有元素的集合
    thatDom: HTMLElement //当前选中的元素
    fillDom: HTMLElement //填充的元素
    dragStartBol: boolean = false //是否开始拖拽了
    disy:any //记录开始时候的y轴位置
    disx:any //记录开始时候的x轴位置

    constructor(data: dragsortData) {
        this.data.dragEnd = data.dragEnd || function () { };
        this.data.dragSelector = data.dragSelector || null;
        this.data.dragMove = data.dragMove || "li";
        this.data.placeHolderTemplate = data.placeHolderTemplate || "<li></li>";
        this.addEvents();

    }

    //初始化填充元素
    getfill() {
        let ele = createEl("div", {
            innerHTML: this.data.placeHolderTemplate
        })
        this.fillDom = <HTMLElement>ele.firstElementChild;
    }

    addEvents() {
        let that = this;
        let parent = document.querySelectorAll(this.data.dragMove)[0].parentElement;
        let domDown: any = parent.onmousedown;
        parent.onmousedown = function (e) {
            domDown && domDown(e);
            that.domAll = that.NodeListToArray(document.querySelectorAll(that.data.dragMove));
            let ev: any = e || event;
            let path = eventsPath(ev);

            outerloop:
            for (let i = 0; i < path.length; i++) {
                if (path[i].nodeName === "#document") return;
                if (that.data.dragSelector) {
                    for (let j = 0; j < that.domAll.length; j++) {
                        if (that.domAll[j].querySelector(that.data.dragSelector) === path[i]) {
                            that.dragStart.call(that, ev, that.domAll[j]);
                            break outerloop;
                        }
                    }
                } else {
                    if (that.domAll.indexOf(path[i]) >= 0) {
                        that.dragStart.call(that, ev, path[i]);
                        break outerloop;
                    }
                }
            }
            return false;
        }
        let documentMove: any = document.onmousemove;
        let documentUp: any = document.onmouseup;

        document.onmousemove = function (e) {
            documentMove && documentMove(e);
            if (!that.dragStartBol) return;
            that.dragMove.call(that, e);
        }

        document.onmouseup = function (e) {
            documentUp && documentUp(e);
            if (!that.dragStartBol) return;
            that.dragEnd.call(that, e);
        }
    }

    //推拽开始
    dragStart(e:any, ele:any) {
        let that = this;
        let ev = e || event;
        that.thatDom = ele;
        that.dragStartBol = true;

        this.getfill();
        that.domAll = that.getItem.call(that);
        insertAfter(that.fillDom, that.thatDom);

        that.addCss.call(that, {
            position: "absolute",
            zIndex: "999",
            opacity: "0.8",
            cursor: "pointer",
            top: that.thatDom.offsetTop + "px",
            left: that.thatDom.offsetLeft + "px"
        });

        that.disx = ev.clientX - parseInt(that.thatDom.style.left);//记录鼠标当前的位置
        that.disy = ev.clientY - parseInt(that.thatDom.style.top);
    }

    //推拽过程中
    dragMove(e:any) {
        
        var event:any = e || event;

        let that = this;
        that.swapItems.call(that, event);

        that.thatDom.style.left = event.clientX - that.disx + "px";
        that.thatDom.style.top = event.clientY - that.disy + "px";
    }

    //推拽结束
    dragEnd(e:any) {
        let that = this;
       
        if (!this.domAll || this.domAll.indexOf(that.thatDom) === -1) return;

        that.dragStartBol = false;

        that.addCss.call(that, {});

        insertAfter(that.thatDom, that.fillDom);
        remove(that.fillDom)
        that.data.dragEnd && that.data.dragEnd();
    }

    //样式添加
    addCss(data:any) {
        this.thatDom.style.position = data.position || "";
        this.thatDom.style.zIndex = data.zIndex || "";
        this.thatDom.style.opacity = data.opacity || "";
        this.thatDom.style.cursor = data.cursor || "";
        this.thatDom.style.top = data.top || "";
        this.thatDom.style.left = data.left || "";
    }

    NodeListToArray(nodes:any) {
        let array = null;
        let that = this;
        try {
            array = Array.prototype.slice.call(nodes, 0);
        } catch (ex) {
            array = new Array();
            for (var i = 0, len = nodes.length; i < len; i++) {
                if (that.fillDom === nodes[i]) continue;
                array.push(nodes[i]);
            }
        }

        return array;
    }

    //获取所有的元素
    getItem() {
        let eleAry = this.NodeListToArray(document.querySelectorAll(this.data.dragMove));
        return eleAry
    }

    //切换位置
    swapItems(event:any) {
        let that = this;

        let thatEleIndex = that.domAll.indexOf(that.thatDom);
        for (let i = 0; i < that.domAll.length; i++) {
            let dom: HTMLElement = <HTMLElement>that.domAll[i];
            if (dom === that.thatDom) continue;
            let domoffset = getOffset(dom);
            let domLeft = domoffset.left;
            let domTop = domoffset.top;
            let offsetRight = domLeft + dom.offsetWidth;
            let offsetBottom = domTop + dom.offsetHeight;
            //判断是否触碰到了其他的元素
            if (
                event.clientX >= domLeft && event.clientX <= offsetRight &&
                event.clientY >= domTop && event.clientY <= offsetBottom
            ) {
                if (i > thatEleIndex) {
                    insertAfter(that.fillDom, dom);
                } else {
                    insertBefore(that.fillDom, dom);
                }
                //重排数组里面的位置
                swapArray(that.domAll, i, thatEleIndex);


            }
        }
    }
}

export function lineDragSort(data: dragsortData) {
    let dragsort = new dragsortFn(data);
    return dragsort;
}



