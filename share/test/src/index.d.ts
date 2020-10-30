interface qrcodeDeploy {
    width?: number;
    height?: number;
    colorDark?: string;
    colorLight?: string;
}
interface parameter {
    qrcodeBox?: HTMLElement | string;
    qrcodeDeploy?: qrcodeDeploy | string;
    copyCallback?: () => void;
}
export declare class share {
    parameter: parameter;
    weibo: string;
    qq: string;
    qzone: string;
    weixinSrc: any;
    shareDom: NodeListOf<Element>;
    qrcodeObj: any;
    qrcodeKey: Boolean;
    qrcodeParent: HTMLElement;
    qrcodeUrl: string;
    constructor(parameter: parameter);
    getBshare(dom: any): any;
    clickFn(ev: any): void;
    weixinFn(obj: any): void;
    getQrcodeDom(): void;
    qqFn(obj: any): void;
    qzoneFn(obj: any): void;
    weiboFn(obj: any): void;
    copyFn(obj: any): void;
    bashreHref(href: any): void;
    isUndefined(v: any): any;
    changeQrcode(url: string): void;
}
export {};
