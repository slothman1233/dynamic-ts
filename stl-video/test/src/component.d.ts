import option from "./model/option-model";
declare class Component {
    static components_: any;
    static options_: option;
    static languages: {
        errorMessage: {
            noStream: string;
            noString: string;
            noMediaSource: string;
            loadError: string;
        };
        tips: {
            loadWaiting: string;
        };
    };
    static guid_: number;
    static videoEmit: any;
    static videoForegin: {
        hooks: any;
        operation: any;
    };
    options_: any;
    children: Array<any>;
    id_: string;
    el_: Element;
    play_: any;
    static ischangeSource: boolean;
    constructor(play: any, options?: option, ready?: any);
    /**
     * 初始化子元素
     */
    initChildren(): void;
    /**
     * 创建一个元素
     * @param {String} tagName 标签
     * @param properties 标签里面的文本内容
            {
                className: 'vjs-seek-to-live-text',
                innerHTML: this.localize('LIVE')
            }
     * @param {Object} attributes  添加属性
     * @param {Array<Element> | Element} content 标签里面添加元素
     * @return {Element} 返回添加的元素
     */
    createEl(tagName?: string, properties?: {}, attributes?: {}, content?: any): any;
    /**
     * 隐藏元素
     * @param {HTMLElement} el 需要隐藏的元素
     * @return {HTMLElement} return当前元素
     */
    hide(el: HTMLElement): HTMLElement;
    /**
     * 显示元素
     * @param {HTMLElement} el 需要显示的元素
     * @return {HTMLElement} 返回当前元素
     */
    show(el: HTMLElement): HTMLElement;
    /**
     * 发送错误信息
     * @param error
     */
    static sendError(error: any): void;
    /**
     * 向元素添加属性集合
     * @param el  元素
     * @param attributes  属性集合
     */
    static setAttribute(el: HTMLElement, attributes: Array<{
        name: string;
        value: string;
    }>): void;
    /**
     * 类的挂载
     * @param {String} name 类名称
     * @param {Function} componentToRegister 类方法
     * @return {Function}  返回挂载的方法
     */
    static setComponents(name: string, componentToRegister: Function): Function;
    /**
     * 获取挂载的类
     * @param {String} name 类的名称
     * @return {Function} 返回类的方法
     */
    static getComponents(name: string): any;
}
export default Component;
