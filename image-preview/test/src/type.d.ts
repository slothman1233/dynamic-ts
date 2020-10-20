export interface imgMagnificationModel {
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
}
