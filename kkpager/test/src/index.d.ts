import "./index.less";
/**
 * 分页控件 需要引用默认样式： 样式1： https://gajsapi.fx110.com/script/public/kkpager/kkpager_blue.min.css  或者  https://gajsapi.fx110.com/script/public/kkpager/kkpager.min.css
 * @param {kkpagerNewsModel} fx.kkpager({data:data})
        * @param {string | number} total 总页数
        * @param {string |number} pno: 当前页码
        *  @param {string |number} totalRecords: 总数据条数
        * @param {string | number} pagerid 分页容器id
        * @param {string} mode 分页类型：link（链接类型），click（点击类型）
        * @param {string} gopageButtonId 页码跳转确定按钮元素id
        * @param {string} gopageTextboxId 页码跳转输入框元素id
        * @param {boolean} isShowFirstPageBtn 是否显示第一页按钮
        * @param {boolean} isShowLastPageBtn 是否显示最后一页按钮
        * @param {boolean} isShowPrePageBtn 是否显示上一页按钮
        * @param {boolean} isShowNextPageBtn 是否显示下一页按钮
        * @param {boolean} isShowTotalPage 是否显示总页数
        * @param {boolean} isShowCurrPage 是否显示当前页
        * @param {boolean} isShowTotalRecords 是否显示总记录数
        * @param {boolean} isWrapedPageBtns 是否用span包裹住页码按钮
        * @param {boolean} isWrapedInfoTextAndGoPageBtn 是否用span包裹住分页信息和跳转按钮
        * @param {boolean} isGoPage 是否显示页码跳转输入框
        * @param {boolean} lang 分页框文字配置
        * @param {string} hrefFormer 链接前部（mode:link有效）
        * @param {string} hrefLatter 链接尾部（mode:link有效）
        * @param {Function} getLink 链接算法（mode:link有效） function (n) {}   n 当前的页码
        * @param {Function} click 点击执行（mode:click有效） function (n, config) {} //n  当前页面   config:{total: 10, pagerid: "kkpager"} 总页数 当前容器id
        * @param {Function} getHref 链接算法（mode:link有效） function (n) {}   n 当前的页码
  * example
  `  fx.kkpager({
            pagerid: "kkpager",
            total: 10,
            pno: 4,
            isShowTotalPage: false,
            isShowCurrPage: false,
            isGoPage: false,
            mode: 'click',
            click: function (n, config) {}
        },
            true);

        fx.kkpager({
            pagerid: "kkpager1",
            total: 10,
            pno: 4,
            isShowTotalPage:true,
            isShowCurrPage: true,
            isGoPage: true,
            mode: 'link',
            hrefFormer: '链接前部',
            hrefLatter: '链接尾部',
            getLink: function (n) {
                if (n == 1) {
                    return this.hrefFormer + this.hrefLatter;
                }
                return this.hrefFormer + '_' + n + this.hrefLatter;
            }
        },
            true);
 */
export declare let kkpagerNews: {
    pagerid: string;
    mode: string;
    pno: number;
    total: number;
    totalRecords: number;
    isShowFirstPageBtn: boolean;
    isShowLastPageBtn: boolean;
    isShowPrePageBtn: boolean;
    isShowNextPageBtn: boolean;
    isShowTotalPage: boolean;
    isShowCurrPage: boolean;
    isShowTotalRecords: boolean;
    isGoPage: boolean;
    isWrapedPageBtns: boolean;
    isWrapedInfoTextAndGoPageBtn: boolean;
    isEllipsisLink: boolean;
    isShowLastPage: boolean;
    hrefFormer: string;
    hrefLatter: string;
    gopageWrapId: string;
    gopageButtonId: string;
    gopageTextboxId: string;
    lang: {
        firstPageText: string;
        firstPageTipText: string;
        lastPageText: string;
        lastPageTipText: string;
        prePageText: string;
        prePageTipText: string;
        nextPageText: string;
        nextPageTipText: string;
        totalPageBeforeText: string;
        totalPageAfterText: string;
        currPageBeforeText: string;
        currPageAfterText: string;
        totalInfoSplitStr: string;
        totalRecordsBeforeText: string;
        totalRecordsAfterText: string;
        gopageBeforeText: string;
        gopageButtonOkText: string;
        gopageAfterText: string;
        buttonTipBeforeText: string;
        buttonTipAfterText: string;
    };
    getLink: (n: number) => any;
    click: (n: number) => boolean;
    getHref: (n: number) => string;
    focus_gopage: () => void;
    blur_gopage: () => void;
    keypress_gopage: () => boolean;
    gopage: () => void;
    selectPage: (n: number, config: any) => void;
    generPageHtml: (config: any) => void;
    init: (config: any) => void;
    _getHandlerStr: (n: number) => string;
    _clickHandler: (n: number, config: any) => boolean;
    deepCopy: () => any;
    _deepCopy: (kkpager: any) => any;
    initialize: (data: any) => void;
};
export declare const kkpager: any;
