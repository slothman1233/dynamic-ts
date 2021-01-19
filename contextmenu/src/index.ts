import { createEl } from "@stl/tool-ts/src/common/dom/createEl";
import { on } from "@stl/tool-ts/src/common/event/on";
import { eventsPath } from "@stl/tool-ts/src/common/event/eventsPath";
import { NodeListToArray } from "@stl/tool-ts/src/common/obj/NodeListToArray";

interface contentData {
    id?: string  //唯一标识
    content: string  //内容元素
    children: Array<contentData> //子项
    callback?: Function //点击后的回调
}

interface contextmenuData {
    ele: any//右键的元素
    data: Array<contentData>
    callback?: Function //右键后的回调
}

let AllData: Array<contextmenuData> = []; //缓存数据
let thatEleDom: contextmenuData; //当前右键元素的数据
let parentEle = <HTMLElement>createEl("div", {
    id: "contextmeun_parent"
})
parentEle.style.position = "absolute";
setTimeout(() => {
    document.body && document.body.appendChild(parentEle);

    //点击列表的方法
    on({
        agent: parentEle,
        events: "click",
        ele: "li",
        fn: function (e: HTMLElement) {
            let id = e.firstElementChild.getAttribute("data-id");

            let obj = getThatObj(id);
            if (!obj) return;

            obj.callback(thatEleDom.ele);

        }
    })
}, 0);

//获取当前点击的对象
function getThatObj(id: any) {
    let obj = thatEleDom.data;

    function getObj(ary: Array<contentData>): any {
        for (let i = 0; i < ary.length; i++) {
            let d = ary[i];
            if (d.id == id) {
                return d;
            }

            if (d.children.length > 0) {
                let obj = getObj(d.children);
                if (obj) return obj;
            }
        }
    }

    return getObj(obj);
}

//右键事件
function contextmeunFn(data: contextmenuData) {

    let ele = getHtml(data.data);

    parentEle.innerHTML = "";
    parentEle.appendChild(ele);
    parentEle.style.display = "block";

    //获取整个html的元素
    function getHtml(data: Array<contentData>): HTMLElement {
        let HTMLEle = document.createElement("ul");
        for (let i = 0; i < data.length; i++) {
            let dt = data[i];
            dt.id = contextmenu_uuid().toString();
            let content = createEl("div", {
                className: "content",
                innerHTML: dt.content
            });
            content.setAttribute("data-id", dt.id);

            let li = createEl("li", {}, {}, [content]);

            if (dt.children.length > 0) {
                li.appendChild(getHtml(dt.children));
            }

            HTMLEle.appendChild(li);

        }

        return HTMLEle;
    }
}

function existEle() {
    // ele: data.ele, data: data.data, callback: data.callback
    let DomCahe = []; // 用于去重
    let cacheData = [];
    for (let i = AllData.length - 1; i >= 0; i--) {
        let data = AllData[i];
        let e: Array<Element> = [];
        let type = Object.prototype.toString.call(data.ele);

        if (type === "[object String]") {
            e = NodeListToArray(document.querySelectorAll(<string>data.ele));
        } else if (type === "[object NodeList]") {
            e = NodeListToArray(data.ele);
        } else if (type === "[object Array]") {
            e = <Array<Element>>data.ele;
        } else if (/\[object HTML.*Element\]/.test(type)) {
            e = [<Element>data.ele];
        }

        for (let j = 0; j < e.length; j++) {
            if (DomCahe.indexOf(e[j]) < 0) {
                DomCahe.push(e[j]);
                cacheData.push({ ele: e[j], data: data.data, callback: data.callback });
            }
        }
    }

    return cacheData;

}

let contextmenus: any = document.oncontextmenu;//储存右击事件
document.oncontextmenu = function (ev) {//重新注册右击事件
    contextmenus && contextmenus();//如果已经存在右击事件则先执行
    let e = ev || event;
    //let thatEle = e.target || e.srcElement;
    let path = eventsPath(e);//获取冒泡过程的所有元素
    let eleData;
    for (let i = 0; i < path.length; i++) {
        if (path[i].nodeName === "BODY") break;
        eleData = <contextmenuData>existEle().find(e => e.ele === path[i]);
        if (eleData) break;
    }

    parentEle.style.display = "none";
    if (!eleData) return;

    e.preventDefault();

    parentEle.style.left = (<MouseEvent>e).pageX + "px";
    parentEle.style.top = (<MouseEvent>e).pageY + "px";

    thatEleDom = eleData;
    contextmeunFn(eleData);
    eleData.callback(eleData.ele);
}

let scroll: any = document.onscroll;
document.onscroll = function () {
    scroll && scroll();
    parentEle.style.display = "none";
}

let click: any = document.onclick;
document.onclick = function () {
    click && click();
    parentEle.style.display = "none";
}
export function contextmenu(data: contextmenuData) {
    AllData.push({ ele: data.ele, data: data.data, callback: data.callback });
}

let contextmenu_uuid = function () {
    let i = 0;
    return function () {
        return i++;
    }
}()



