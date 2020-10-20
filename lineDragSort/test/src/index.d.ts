/**
 * 单行拖拽的控件
 * @param {object} data { dragSelector: "#solo > .Imgms" ,  dragEnd: function () { }, placeHolderTemplate: "<div class='Imgms'></div>" }
        * @param {string} dragMove CSS选择器内的元素的列表项的移动手柄。
        * @param {string} dragSelector 拖动手柄必须要是dragMove子级的元素，如果是自身就不用传
        * @param {function} dragEnd 拖动结束后将被调用的回调函数
        * @param {string} placeHolderTemplate 拖动列表的HTML部分。
 */
interface dragsortData {
    dragSelector?: string;
    dragMove?: string;
    dragEnd?: Function;
    placeHolderTemplate?: string;
}
declare class dragsortFn {
    data: dragsortData;
    domAll: Array<Element>;
    thatDom: HTMLElement;
    fillDom: HTMLElement;
    dragStartBol: boolean;
    disy: any;
    disx: any;
    constructor(data: dragsortData);
    getfill(): void;
    addEvents(): void;
    dragStart(e: any, ele: any): void;
    dragMove(e: any): void;
    dragEnd(e: any): void;
    addCss(data: any): void;
    NodeListToArray(nodes: any): any;
    getItem(): any;
    swapItems(event: any): void;
}
export declare function lineDragSort(data: dragsortData): dragsortFn;
export {};
