interface bgParameter {
    parent?: HTMLElement | Element;
    time?: number;
    closeDom?: HTMLElement | Element;
    className: string;
    actionClassName: string;
    callback?: any;
}
export declare class StlBg {
    parameter: bgParameter;
    parent: any;
    bg: any;
    constructor(obj: bgParameter);
    showBg(box?: HTMLElement | Element, type?: string): void;
    private addBgEvent;
    closeBgFn(): void;
}
export {};
