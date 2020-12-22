import "./index.less";
interface scrollBar {
    el?: HTMLElement;
    dragSize?: string;
    hide?: boolean;
}
interface autoplay {
    delay?: number;
}
interface thumbs {
    list: Array<string>;
    thumbsPerview?: number;
}
interface pagination {
    ele?: HTMLElement | Element;
}
interface parameter {
    watchOverflow?: boolean;
    slidesPerGroup?: number;
    loop?: boolean;
    slidesPerView?: number | string;
    autoHeight?: boolean;
    speed?: number;
    autoplay?: autoplay;
    scrollBar?: scrollBar;
    thumbs?: thumbs;
    pagination?: pagination;
    sliderStart?: any;
    sliderEnd?: any;
}
export declare class stlSwiper {
    parameter: parameter;
    startLeft: number;
    startTop: number;
    startTransform: any;
    parentWidth: number;
    parentScrollWidth: number;
    movekey: boolean;
    item: number;
    parent: HTMLElement;
    touchmoveFn: (event: any) => void;
    touchendFn: (event: any) => void;
    wrapperClassName: string;
    sliderClassName: string;
    thumbsClassName: string;
    wrapperDom: any;
    sliderList: NodeListOf<Element>;
    startTime: number;
    endTime: number;
    length: number;
    scrollBox: HTMLElement;
    scrollNav: Element;
    scrollClassName: string;
    scrollWidth: number;
    scrollTransform: any;
    scrollNavWidth: number;
    moveAngle: any;
    thumbsBox: any;
    thumbsDom: any;
    thumbsList: any;
    thumbsStartLeft: any;
    thumbsStartTop: any;
    thumbsMoveFn: any;
    thumbsEndFn: any;
    thumbsStartTransform: any;
    thumbsMaxScroll: any;
    thumbsMoveKey: boolean;
    thumbsMoveStart: any;
    thumbsMoveEnd: any;
    autoPlayKey: boolean;
    autoPlayTimeout: any;
    motionKey: boolean;
    paginationBox: any;
    paginationList: any;
    initParameter: parameter;
    constructor(parent: HTMLElement, obj?: parameter);
    private loopInit;
    private updateItem;
    private addTouchFn;
    private updatePosition;
    private updateScroll;
    private getScrollBar;
    private autoPlayFn;
    private getThumbsFn;
    private updateThumbsItem;
    private updateThumbsPosition;
    private addThumbsEvent;
    private updateThumbsTransform;
    private addThumbsSwitch;
    private getPagination;
    private updatePagination;
}
export {};
