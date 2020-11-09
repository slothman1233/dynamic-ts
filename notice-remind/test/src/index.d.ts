import "./index.less";
interface parameter {
    close?: boolean;
    cancel?: boolean;
    autoClose?: boolean;
    closeTime?: number;
    only?: boolean;
    top?: number;
    right?: number;
}
interface htmlStr {
    contentStr: string;
    headStr?: string;
    footStr?: string;
}
export declare class NoticeRemind {
    noticeDom: any;
    noticeTimeout: any;
    noticeParent: HTMLElement;
    option: parameter;
    index: number;
    cancelKey: boolean;
    noticeList: Array<any>;
    initOption: parameter;
    constructor(option: parameter);
    private getParent;
    private addEvent;
    private closeAll;
    private getNoticeDom;
    private getNewNotice;
    private autoCloseFn;
    private addNextNotice;
    addNewNotice(obj: htmlStr): void;
}
export {};
