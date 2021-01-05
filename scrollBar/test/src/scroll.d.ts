interface positionScroll {
    left?: number;
    top?: number;
}
export declare function mousewheelFn(event: any, that: any, type: string): void;
export declare function mouseMoveFn(event: any, that: any, type: string): void;
export declare function clickScrollY(event: any, that: any): void;
export declare function clickScrollX(event: any, that: any): void;
export declare function scrollSpecifiedPosition(obj: positionScroll): void;
export {};
