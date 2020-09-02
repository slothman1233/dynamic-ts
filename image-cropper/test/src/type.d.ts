export interface domSize {
    width: number;
    height: number;
}
export interface option {
    ele: Element;
    src?: string;
    inputBox?: HTMLElement;
    addStyle?: boolean;
    previewBox?: Element | HTMLCollectionOf<Element>;
    zoomMultiple?: number;
    zoomScale?: number;
    cropperBoxWidth?: number;
    cropperBoxHeight?: number;
    fixedCropSize?: boolean;
    moveStep?: number;
    magnifyBtn?: HTMLElement;
    shrinkBtn?: HTMLElement;
    moveLeftBtn?: HTMLElement;
    moveRightBtn?: HTMLElement;
    moveUpBtn?: HTMLElement;
    moveDownBtn?: HTMLElement;
    getImgBtn?: HTMLElement;
    cropInitComplete?: () => void;
    inputImgComplete?: (this: any) => void;
    getImgCallback?: (src: string | object) => void;
}
export interface dragValue {
    x: number;
    y: number;
}
export interface proportionModel {
    imageUrl: string;
    parentEle?: Element;
    thumbnailSize?: Array<number>;
    InterceptWidth?: number;
    InterceptHeight?: number;
    VirtualEdge?: number;
    BrokerRadius?: boolean;
    Isthumbnail?: boolean;
    narrowDom?: Element;
    enlargeDom?: Element;
    Wheel?: number;
    mousemoveCallback?: Function;
    zoomCallback?: Function;
}
export interface proportionsModel extends proportionModel {
    allWidth?: number;
    allHeight?: number;
    ImageWidth?: number;
    ImageHeight?: number;
}
