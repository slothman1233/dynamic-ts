import "./index.less";
import { option, domObj, domSize, positionScroll } from "./types";
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
