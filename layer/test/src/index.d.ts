import "./index.less";
interface msgOption {
    icon?: number;
    iconColor?: string;
    time?: number;
}
interface alertParameter {
    content: string;
    icon?: number;
    iconColor?: string;
    className?: string;
    title?: string;
    autoClose?: boolean;
    time?: number;
    btnStr?: string;
    btnCallback?: (ev: any) => void;
    showCallback?: () => void;
    endCallback?: () => void;
}
interface modalParameter {
    title: string;
    content: string;
    hasClose?: boolean;
    bg?: boolean;
    bgClose?: boolean;
    determineBtn?: boolean;
    determineText?: string;
    determineFn?: () => void;
    cancelBtn?: boolean;
    cancelText?: string;
    cancelFn?: () => void;
    showCallback?: () => void;
    endCallback?: () => void;
}
interface openParameter extends modalParameter {
    type?: 1 | 2;
    icon?: number;
    iconColor?: string;
}
interface loadParameter {
    img: string;
    parent?: HTMLElement;
    bg?: boolean;
    width?: number;
    height?: number;
}
interface tipsParameter {
    time?: number;
    position?: "top" | "bottom" | "left" | "right";
    maxWidth?: number;
}
interface customParameter {
    content: string | HTMLElement;
    hasClose?: boolean;
    determineBtn?: boolean;
    determineText?: string;
    determineClickFn?: () => void;
    cancelBtn?: boolean;
    cancelText?: string;
    cancelClickFn?: () => void;
    bg?: boolean;
    bgClose?: boolean;
    showCallback?: () => void;
    endCallback?: () => void;
}
declare class stlLayer {
    times: number;
    iconfontSrc: string;
    iconList: any;
    iconColorList: any;
    msgObj: any;
    hasTitleAlertObj: any;
    noTitleAlertObj: any;
    alertObj: any;
    openObj: any;
    modalObj: any;
    loadObj: any;
    tipObj: any;
    customObj: any;
    bgDom: HTMLElement;
    timeoutList: any;
    closeCallback: (e: any) => void;
    alertBtnCallback: (e: any) => void;
    constructor();
    private getBgDom;
    private getDomStr;
    private getIconStr;
    private getCloseStr;
    private deduplication;
    private removeHide;
    private closeBoxFn;
    private addBgDom;
    private msgStr;
    msg(content: string, options?: msgOption, end?: () => void): void;
    private hasTitleAlertStr;
    private noTitleAlertStr;
    private addAlertBtnEvent;
    alert(obj: alertParameter): void;
    private getOpenStr;
    open(data: openParameter): void;
    private getModalFn;
    modal(data: modalParameter): void;
    private addBgEvent;
    private addOpenBtnFn;
    private addCloseEventFn;
    private closeFn;
    private appendDom;
    private autoClose;
    loading(data: loadParameter): void;
    private getLoadDom;
    private parentLoad;
    private noParentLoad;
    closeLoad(parent?: HTMLElement): void;
    tips(that: any, content: string, data?: tipsParameter, end?: () => void): void;
    private getTipPosition;
    custom(data: customParameter): void;
    private getCustomFn;
    private getCustomBtnFn;
}
export declare let layer: stlLayer;
export {};
