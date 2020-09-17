export interface contentData {
    id?: string  //唯一标识
    content: string  //内容元素
    children: Array<contentData> //子项
    callback?: Function //点击后的回调
}

export interface contextmenuData {
    ele: any//右键的元素
    data: Array<contentData>
    callback?: Function //右键后的回调
}