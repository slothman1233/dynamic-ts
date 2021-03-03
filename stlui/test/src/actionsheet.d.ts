declare class Actionsheet {
    bgObj: any;
    bgParameter: any;
    constructor();
    showPopover(dom: HTMLElement | Element, type?: string): void;
    closePopover(dom: HTMLElement | Element, type?: string): void;
    private addPopoverEvent;
}
export declare const actionsheet: Actionsheet;
export {};
