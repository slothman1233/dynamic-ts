import "./index.less";
interface option {
    id: string;
    direction?: string;
    size?: Number;
    smallSize?: number;
    wheelDis?: number;
    autoRefresh?: boolean;
    xMousewheel?: boolean;
    className?: string;
}
interface domObj {
    "x": HTMLElement;
    "y": HTMLElement;
}
interface domSize {
    "x": number;
    "y": number;
}
interface positionScroll {
    left?: number;
    top?: number;
}
export declare class scrollBar {
    options: option;
    scrollParent: any;
    scrollBox: HTMLElement;
    scrollContentBox: HTMLElement;
    contentDomSize: domSize;
    contentDomScrollSize: domSize;
    scrollDom: domObj;
    sliderDom: domObj;
    scrollDomSize: domSize;
    sliderDomSize: domSize;
    startClient: domSize;
    constructor(options: option);
    private initOption;
    refresh(): void;
    fixedPointScroll(obj: positionScroll): void;
}
export {};
