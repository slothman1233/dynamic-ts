


import option from "./model/option-model"
import * as Dom from "./utils/dom"
import { newGUID } from './utils/guid';
import cn from "./languages/cn";




class Component {
    static components_: any;
    static options_: option;
    static languages = cn;
    static guid_ = newGUID();
    static videoEmit: any
    static videoForegin: { hooks: any, operation: any }
    options_: any;
    children: Array<any> = [];
    id_: string;
    el_: Element;
    play_: any;
    static ischangeSource = false;
    constructor(play: any, options?: option, ready?: any) {
        if (!play && this.play_) {
            this.play_ = play = this;
        } else {
            this.play_ = play;
        }

        this.options_ = options;

    }

    /**
     * 初始化子元素
     */
    initChildren() {
        // this.options_.children
    }

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
    createEl(tagName = 'div', properties = {}, attributes = {}, content?: any) {
        return Dom.createEl(tagName, properties, attributes, content);
    }

    /**
     * 隐藏元素
     * @param {HTMLElement} el 需要隐藏的元素
     * @return {HTMLElement} return当前元素
     */
    hide(el: HTMLElement) {
        if (!el) return

        if (Dom.isEl(el)) {
            el.style.display = "none";
        }
        return el;
    }

    /**
     * 显示元素
     * @param {HTMLElement} el 需要显示的元素
     * @return {HTMLElement} 返回当前元素
     */
    show(el: HTMLElement) {
        if (!el) return

        if (Dom.isEl(el)) {

            el.style.display = "block";
        }
        return el;
    }

    /**
     * 发送错误信息
     * @param error 
     */
    static sendError(error: any) {
        if (Component.videoForegin.hooks.error) {
            Component.videoForegin.hooks.error(error)
        }

        Component.options_.errorDom.dom.innerHTML = error.message;
        Component.options_.errorDom.show(Component.options_.errorDom.dom)

    }

    /**
     * 向元素添加属性集合
     * @param el  元素
     * @param attributes  属性集合
     */
    static setAttribute(el: HTMLElement, attributes: Array<{ name: string, value: string }>) {
        attributes.forEach((item) => {
            el.setAttribute(item.name, item.value);
        });
    }

    /**
     * 类的挂载
     * @param {String} name 类名称
     * @param {Function} componentToRegister 类方法
     * @return {Function}  返回挂载的方法
     */
    static setComponents(name: string, componentToRegister: Function) {
        if (typeof name !== "string" || !name) {
            throw new Error(`${name}${Component.languages.errorMessage.noString}`);
        }

        name = name.toLocaleLowerCase();

        if (!Component.components_) {
            Component.components_ = {};
        }

        Component.components_[name] = componentToRegister;

        return componentToRegister

    }

    /**
     * 获取挂载的类
     * @param {String} name 类的名称
     * @return {Function} 返回类的方法
     */
    static getComponents(name: string) {
        name = name.toLocaleLowerCase();

        if (!Component.components_[name]) {
            return null;
        }

        return Component.components_[name];
    }
}

export default Component
