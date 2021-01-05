interface imgMagnificationModel {
    parentEle: any;
    key?: string;
    prevBgImg?: string;
    nextBgImg?: string;
    closeBgImg?: string;
    bigBgImg?: string;
    smallBgImg?: string;
    IsBox?: boolean;
    isPaging?: boolean;
    titleUp?: boolean;
    titlePosition?: number;
    videoWdith?: number;
    clickCallback?: (dom: any, ev: any) => boolean;
    showBox?: string;
}
export declare const imgPreview: (options: imgMagnificationModel) => void;
export {};
