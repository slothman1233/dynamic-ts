import "./index.less";
interface parameter {
    close?: boolean;
    cancel?: boolean;
    autoClose?: boolean;
    closeTime?: number;
    number?: number;
    top?: number;
    right?: number;
    left?: number;
    bottom?: number;
    showCallback?: (obj: htmlStr) => void;
    cancelCallback?: () => void;
}
interface htmlStr {
    contentStr: string;
    headStr?: string;
    footStr?: string;
    id?: string | number;
}
export declare class NoticeRemind {
    noticeDom: any;
    noticeTimeout: any;
    noticeParent: HTMLElement;
    option: parameter;
    index: number;
    showIndex: number;
    cancelKey: boolean;
    noticeList: Array<any>;
    initOption: parameter;
    constructor(option: parameter);
    private getParent;
    private addEvent;
    private closeAll;
    private closeOnce;
    private getNoticeDom;
    private getNewNotice;
    private autoCloseFn;
    private addNextNotice;
    addNewNotice(obj: htmlStr | Array<htmlStr>): void;
    private addNoice;
}
export {};
