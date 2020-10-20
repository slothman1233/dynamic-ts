export interface contentData {
    id?: string;
    content: string;
    children: Array<contentData>;
    callback?: Function;
}
export interface contextmenuData {
    ele: any;
    data: Array<contentData>;
    callback?: Function;
}
