
import window from 'global/window';

/**
 * 获取元素样式表里面的样式
 * @param {Element} el 获取样式的元素
 * @param {string} prop 样式的名称
 * @return {String | Number}
 */
export function computedStyle(el: any, prop: any) {
  if (!el || !prop) {
    return '';
  }
  let cs;
  if (typeof window.getComputedStyle === 'function') {
     cs = window.getComputedStyle(el);

    return cs ? cs[prop] : '';

  } else { //ie6-8下不兼容

    if (prop === "opacity") { //有些属性在浏览器上是不兼容的例如opacity
      cs = el.currentStyle["filter"];

      let reg = /^alpha\(opacity=(\d+(?:\.\d+)?)\)$/i;

      cs = reg.test(cs) ? (<any>(<RegExp>reg).exec(cs)[1])/100 : 1;

    }

     let  reg = /^(-?\d+(\.\d+)?)(px|pt|rem|em)?$/i;   //去掉单位的正则

     cs = el.currentStyle[prop];

     return cs? reg.test(cs) ? parseFloat(cs) : cs : "";
  }
}


