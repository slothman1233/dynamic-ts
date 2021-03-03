declare class CanvasWrap {
    parent: any;
    wrapBox: any;
    wrapDom: any;
    canvesBox: any;
    motionFn: any;
    closeFn: any;
    bgObj: any;
    bgParameter: any;
    constructor();
    private getType;
    private closeBg;
    private addParentClass;
    private getWrapOut;
    private getWrapIn;
    private getWrapAll;
    private getWrapScal;
    private closeWrap;
    private closeWrapIn;
    private closeWrapOut;
    private closeWrapAll;
    private closeWrapScal;
}
export declare const canvasWrap: CanvasWrap;
export {};
