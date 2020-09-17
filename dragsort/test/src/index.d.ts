interface dragsortData {
    dragLevel?: string;
    dragSelector?: string;
    dragEle?: string;
    dragParent?: string | Element;
    dragEnd?: Function;
    placeHolderTemplate?: string;
    Maxlevel: string;
    bodyMessage: Array<bodyMessage>;
}
interface bodyMessage {
    id?: string;
    headEle: Element;
    contentEle: Element;
    isDrag: boolean;
    children: Array<bodyMessage>;
}
declare class dragsortFn {
    data: dragsortData;
    domAll: Array<Element>;
    thatDom: HTMLElement;
    fillDom: HTMLElement;
    dragStartBol: boolean;
    scroll: {
        left: number;
        top: number;
    };
    disy: any;
    disx: any;
    parentsEle: any;
    parsentScrollLeft: any;
    parsentScrollTop: any;
    dragEleChildrenSize: number;
    dragMoveL: boolean;
    thatdragEle: any;
    thatReplaceEle: any;
    thatPosition: number[];
    constructor(data: dragsortData);
    getHtml(): any;
    getfill(): void;
    addEvents(): void;
    dragStart(e: any, ele: any): void;
    dragMove(e: any): void;
    dragEnd(e: any): void;
    addCss(data: any): void;
    NodeListToArray(nodes: any): any;
    getItem(): any;
    swapItems(event: any): void;
    SameOrLower(fillDom: any, dom: any, event: any, isDownOrUp: any): void;
    eleLevel(ele: any): number;
    ChildrenSize(): number;
}
export declare function dragsort(data: dragsortData): dragsortFn;
export {};
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
