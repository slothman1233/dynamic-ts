interface config {
    attributes: boolean;
    childList: boolean;
    characterData: boolean;
}
/**
 * 监听元素内容变化的方法
 * @param id   需要监听的元素的id
 * @param callback  内容变化后需要执行的回调
 * @param config?  观察选项配置 详细配置见config接口
 */
export declare function domResize(id: string, callback: () => any, config?: config): void;
export {};
