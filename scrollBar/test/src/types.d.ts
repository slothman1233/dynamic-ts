export interface option {
    id: string;
    direction?: string;
    size?: Number;
    smallSize?: number;
    wheelDis?: number;
    autoRefresh?: boolean;
    xMousewheel?: boolean;
    className?: string;
}
export interface domObj {
    "x": HTMLElement;
    "y": HTMLElement;
}
export interface domSize {
    "x": number;
    "y": number;
}
export interface mousewheelObj {
    scrollNumber: number;
    sliderScale: number;
}
export interface scaleObj {
    scrollRange: number;
    sliderRange: number;
    scrollNumber: number;
    scrollType: string;
    transformType: string;
}
export interface positionScroll {
    left?: number;
    top?: number;
}
