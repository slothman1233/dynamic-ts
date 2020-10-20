// Firefox和Chrome早期版本中带有前缀
declare let window:any;

interface config {
    attributes:boolean//检测属性变动
    childList:boolean//检测子节点变动
    characterData:boolean//节点内容或节点文本的变动。
}

// function debounce(method:any,delay:number){//防抖函数
//     let timer:any = null,that = this;
//     return function(){
//         if(timer){
//             clearTimeout(timer);
//             timer = null;
//         }
//         timer = setTimeout(function(){
//             method.call(that)
//         },delay)
//     }
// }

/**
 * 监听元素内容变化的方法
 * @param id   需要监听的元素的id
 * @param callback  内容变化后需要执行的回调 
 * @param config?  观察选项配置 详细配置见config接口
 */
export function domResize(id:string,callback:()=>any,config?:config){//监听元素内容变化
    let MutationObserver:any = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    let that = this;
    // let debounceFn = debounce.call(that,callback,100)
    const target:HTMLElement = document.getElementById(id);// 选择目标节点
    if (MutationObserver) {
        // 创建观察者对象
        const observer:any = new MutationObserver(function (mutations:any) {
            mutations.forEach(function (mutation:any) {
                // debounceFn.call(that);
                callback.call(that)
            });
        });
        // 配置观察选项:
        const configs = config||{
            attributes: true,//检测属性变动
            childList: true,//检测子节点变动
            characterData: true//节点内容或节点文本的变动。
        }
        observer.observe(target, configs);
    } else {
        target.addEventListener("DOMNodeRemoved", function (event:any) {
            // debounceFn.call(that);
            callback.call(that)
        }, false);
 
        target.addEventListener("DOMNodeInserted", function (event:any) {
            // debounceFn.call(that);
            callback.call(that)
        }, false);
    }
}
 


   