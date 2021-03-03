
import { createEl, insertAfter, insertBefore, getOffset, remove, parent, AllScroll, hasClass, find, hide, show } from '@stl/tool-ts/src/common/dom';
import { eventsPath } from '@stl/tool-ts/src/common/event/eventsPath';
// ///<reference path="../languages/language.d.ts" />

interface dragsortData {
    dragLevel?: string
    dragSelector?: string
    dragEle?: string
    dragParent?: string | Element
    dragEnd?: Function
    placeHolderTemplate?: string
    Maxlevel: string
    bodyMessage: Array<bodyMessage>
}
interface bodyMessage {
    id?: string
    headEle: Element
    contentEle: Element
    isDrag: boolean
    children: Array<bodyMessage>
}
class dragsortFn {
    data: dragsortData = { bodyMessage: [], Maxlevel: "1" }
    domAll: Array<Element> //所有元素的集合
    thatDom: HTMLElement //当前选中的元素
    fillDom: HTMLElement //填充的元素
    dragStartBol: boolean = false //是否开始拖拽了
    scroll = { left: 0, top: 0 } //滚动条Y轴的高度
    disy:any //记录开始时候的y轴位置
    disx:any //记录开始时候的x轴位置
    parentsEle:any //父级元素
    parsentScrollLeft:any //开始的时候父级的滚动条的左边距离
    parsentScrollTop:any //开始的时候父级的滚动条的顶部距离
    dragEleChildrenSize: number //当前拖动元素有几个子级
    dragMoveL = true
    thatdragEle:any // 当前拖拽的元素
    thatReplaceEle:any //替换的元素
    thatPosition = [-1, -1] //位置 [0]1是父级 2是子级   [1]1上面 2是下面
    constructor(data: dragsortData) {
        if (data.bodyMessage.length <= 0) return;
        data.dragParent = Object.prototype.toString.call(data.dragParent) === "[object String]" ? document.querySelector(<string>data.dragParent) : <HTMLElement>data.dragParent;
        let ele = data.dragParent;
        if (!ele) return;
        this.data.dragEle = Object.prototype.toString.call(data.dragEle) === "[object String]" ? data.dragEle : ".containe";
        this.data.Maxlevel = data.Maxlevel;
        this.data.bodyMessage = data.bodyMessage;
        this.data.dragEnd = data.dragEnd || function () { };
        this.data.dragParent = data.dragParent;
        this.data.dragLevel = data.dragLevel || "0";
        this.data.dragSelector = data.dragLevel == "0" ? ".containe" : data.dragLevel == "1" ? ".containe_head" : data.dragLevel == "2" ? ".containe_content" : this.data.dragEle;
        this.data.placeHolderTemplate = data.placeHolderTemplate || "<li></li>";
        ele.appendChild(this.getHtml());
        (<HTMLElement>this.data.dragParent).querySelector("ul").style.position = "relative";
        this.addEvents();
    }
    getHtml() {
        /**
         * 递归获取内容的元素
         * @param bodyMessage 
         */
        function getHead(bodyMessage:any) {
            let that = this;
            let HTMLEle = document.createElement("ul");
            for (let i = 0; i < bodyMessage.length; i++) {
                let data = bodyMessage[i];
                let containe_head = createEl("div", {
                    className: "containe_head"
                }, {}, [data.headEle]);

                let containe_content = createEl("div", {
                    className: "containe_content"
                }, {}, [data.contentEle]);

                let containe = createEl("div", {
                    className: "containe"
                }, {}, [containe_head, containe_content])

                let isdrag = data.isDrag == false ? false : true;
                let li = createEl("li",{} , {}, [containe]);
                li.setAttribute("data-id", data.id);
                li.setAttribute("data-drag", `${isdrag}`);
                if (data.children) {
                    li.appendChild(getHead.call(that, data.children));
                }

                HTMLEle.appendChild(li);
            }
            return HTMLEle;
        }
        return getHead.call(this, this.data.bodyMessage);
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
        that.parentsEle = <HTMLElement>that.data.dragParent;
        let domDown: any = that.parentsEle.onmousedown;
        that.parentsEle.onmousedown = function (e:any) {
            domDown && domDown(e);
            that.domAll = that.NodeListToArray((<HTMLElement>that.data.dragParent).querySelectorAll(that.data.dragSelector));
            let ev: any = e || event;
            let path = eventsPath(ev);

            outerloop:
            for (let i = 0; i < path.length; i++) {
                if (path[i].nodeName === "#document" || path[i] === this) return;
                for (let j = 0; j < that.domAll.length; j++) {
                    if (that.domAll[j] === path[i]) {
                        let ele = parent(that.domAll[j], "li");
                        if(!ele.getAttribute("data-drag") || ele.getAttribute("data-drag") === "false") return;
                        that.thatdragEle = that.domAll[j];
                        
                        that.dragStart.call(that, ev, ele);
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
            if (!that.dragStartBol) return
            that.dragEnd.call(that, e);
        }
    }
    //推拽开始
    dragStart(e:any, ele:any) {
        let that = this;
        let ev = e || event;
        that.thatDom = ele;
        that.thatPosition = [-1, -1];
        that.dragEleChildrenSize = that.ChildrenSize.call(that);

        hide(that.thatDom.lastElementChild);
        that.dragStartBol = true;

        this.getfill();
        that.domAll = that.getItem.call(that);
        let el = (<HTMLElement>that.data.dragParent).querySelector("ul");
        let scroll = getOffset(that.thatDom, el);

        insertAfter(that.fillDom, that.thatDom);
        el.appendChild(that.thatDom);
        that.addCss.call(that, {
            position: "absolute",
            zIndex: "999",
            opacity: "0.8",
            cursor: "pointer",
            top: scroll.top + "px",
            left: scroll.left + "px"
        });

        that.disx = ev.clientX - parseInt(that.thatDom.style.left);//记录鼠标当前的位置
        that.disy = ev.clientY - parseInt(that.thatDom.style.top);

        that.parsentScrollLeft = that.parentsEle.scrollLeft;
        that.parsentScrollTop = that.parentsEle.scrollTop;
    }
    //推拽过程中
    dragMove(e:any) {
        var event:any = e || event;

        let that = this;
        that.swapItems.call(that, event);

        let scrollLeft = that.parentsEle.scrollLeft - that.parsentScrollLeft;
        let scrollTop = that.parentsEle.scrollTop - that.parsentScrollTop;

        that.thatDom.style.left = event.clientX - that.disx + scrollLeft + "px";
        that.thatDom.style.top = event.clientY - that.disy + scrollTop + "px";
    }

    //推拽结束
    dragEnd(e:any) {
        let that = this;
        that.dragStartBol = false;
        if (!this.domAll || this.domAll.indexOf(that.thatDom.querySelector(that.data.dragSelector)) === -1) return;
        show(that.thatDom.lastElementChild);

        that.addCss.call(that, {});

        insertAfter(that.thatDom, that.fillDom);
        remove(that.fillDom);
        that.data.dragEnd && that.data.dragEnd(that.thatdragEle, that.thatReplaceEle, that.thatPosition);
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
        let eleAry = this.NodeListToArray(document.querySelectorAll(this.data.dragSelector));
        return eleAry
    }

    //切换位置
    swapItems(event:any) {
        let that = this;
        if (!this.dragMoveL) return;
        for (let i = 0; i < that.domAll.length; i++) {
            let dom: HTMLElement = <HTMLElement>that.domAll[i];

            if (!hasClass(dom, "containe")) {
                dom = parent(dom, ".containe");
            }

            if (dom === that.thatDom.firstElementChild) continue;

            let OffsetScroll = AllScroll(dom);
            let Offset = getOffset(dom);

            let domLeft = Offset.left - OffsetScroll.left;
            let domTop = Offset.top - OffsetScroll.top;
            let offsetRight = domLeft + dom.offsetWidth;
            let offsetBottom = domTop + dom.offsetHeight;

            //判断是否触碰到了其他的元素
            if (
                event.clientX >= domLeft && event.clientX <= offsetRight &&
                event.clientY >= domTop && event.clientY <= offsetBottom
            ) {
                //中间位置的坐标
                let middlePosition = domTop + (offsetBottom - domTop) / 2;
                // true为上半部分
                // false为下半部分
                let isDownOrUp = event.clientY <= middlePosition ? true : false;

                that.SameOrLower.call(that, that.fillDom, dom, event, isDownOrUp);

                this.dragMoveL = false;
            }
        }
        setTimeout(() => {
            that.dragMoveL = true;
        }, 500);
    }

    //判断是添加在同级还是在下级
    SameOrLower(fillDom:any, dom:any, event:any, isDownOrUp:any) {
        let that = this;
        let headEle = dom.querySelector(".containe_head");

        let headOffsetScroll = AllScroll(headEle);
        let headOffset = getOffset(headEle);

        let domLeft = headOffset.left - headOffsetScroll.left;
        let domTop = headOffset.top - headOffsetScroll.top;
        let offsetRight = domLeft + headEle.offsetWidth;
        let offsetBottom = domTop + headEle.offsetHeight;
        //拖动在头部的位置
        if (
            event.clientX >= domLeft && event.clientX <= offsetRight &&
            event.clientY >= domTop && event.clientY <= offsetBottom
        ) {
            let dargLevel = that.eleLevel.call(that, dom); //替换的元素的位置层级

            //最大可拖动的层级不够
            if (dargLevel + that.dragEleChildrenSize > that.data.Maxlevel) return;

            that.thatReplaceEle = dom.parentElement;
            that.thatPosition[1] = isDownOrUp ? 1 : 2;
            that.thatPosition[0] = 1;

            if (event.clientY)
                if (isDownOrUp) {
                    insertBefore(that.fillDom, dom.parentElement);
                } else {
                    insertAfter(that.fillDom, dom.parentElement);
                }
        } else { //拖动在内容的位置
            let dargLevel = that.eleLevel.call(that, dom) + 1; //替换的元素的位置层级

            //最大可拖动的层级不够
            if (dargLevel + that.dragEleChildrenSize > that.data.Maxlevel) return;

            that.thatReplaceEle = dom.parentElement;
            that.thatPosition[1] = isDownOrUp ? 1 : 2;
            that.thatPosition[0] = 2;

            if (dom.nextElementSibling) {
                if (dom.nextElementSibling.firstElementChild) {
                    insertBefore(fillDom, dom.nextElementSibling.firstElementChild);
                } else {
                    dom.nextElementSibling.appendChild(fillDom);
                }
            } else {
                let ul = document.createElement("ul");
                ul.appendChild(fillDom);
                insertAfter(ul, dom);
            }
        }
    }
    //元素是在第几级别
    eleLevel(ele:any) {
        let level = 0;
        while (ele !== (<HTMLElement>this.data.dragParent)) {
            if (ele.nodeName === "UL") {
                level += 1;
            }
            ele = ele.parentElement;
        }
        return level;
    }

    //元素有几个子元素
    ChildrenSize() {
        let that = this;
        let level = 0;
        let li = that.thatDom;
        let cache = [li];
        function getLevel(parent:any) {
            let c = [];
            for (let i = 0; i < parent.length; i++) {
                let ul = parent[i].lastElementChild;
                if (ul.children.length > 0) {
                    for (let j = 0; j < ul.childElementCount; j++) {
                        c.push(ul.children[j]);
                    }
                }
            }

            if (c.length > 0) {
                level++;
                cache = c;
                getLevel(cache);
            }
        }
        getLevel(cache);

        return level;
    }
}
export function dragsort(data: dragsortData) {
    let dragsort = new dragsortFn(data);
    return dragsort;
}
/**
 * 拖拽的控件
  * @param {object} data { dragParent: document.querySelector("#id") | "string",  dragEnd: function () { }, placeHolderTemplate: "<div class='Imgms'></div>" }
         * @param {Element | string} dragParent 父级的元素获取元素的id class。
         * @param {string} dragLevel 触发拖动的部分 1为containe本身 2级为 head部分  3级为 content部分   -1为使用dragEle为拖拽的元素
         * @param {string} dragEle  当dragLevel为4时的拖拽元素的 id class
         * @param {function} dragEnd(thatdragEle,thatReplaceEle,thatPosition) 拖动结束后将被调用的回调函数
                        thatdragEle // 当前拖拽的元素
                        thatReplaceEle //替换的元素
                        thatPosition = [-1, -1] //位置 [0]1是父级 2是子级   [1]1上面 2是下面
         * @param {string} placeHolderTemplate 拖动列表的填充部分。
         * @param {string | number} Maxlevel 允许最大拖动的层级
         * @param {object} bodyMessage [{headEle:headEle,contentEle:contentEle,isDrag:true,id:id,children:[{headEle:headEle,contentEle:contentEle,isDrag:true,children[]}]}]
              * @param {string} id 标识
              * @param {Element} headEle 标题部分内容的元素
              * @param {Element} contentEle 主体部分内容的元素
              * @param {boolean} isDrag 是否允许拖拽 默认为true
              * @param {Array<object>} children 当前条目的子级 [{headEle:headEle,contentEle:contentEle,isDrag:true,id:id,children:[{headEle:headEle,contentEle:contentEle,isDrag:true,children[]}]}]
 */




