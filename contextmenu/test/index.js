!function(t){"function"==typeof define&&define.amd?define(t):t()}(function(){"use strict";function u(t){return!!t&&"object"==typeof t}function l(e){var n=null;try{n=Array.prototype.slice.call(e,0)}catch(t){n=new Array;for(var i=0,c=e.length;i<c;i++)n.push(e[i])}return n}var t=(e.prototype.listen=function(t,e){this.clientList[t]||(this.clientList[t]=new Array),this.clientList[t].push(e)},e.prototype.trigger=function(t){for(var e=this,n=[],i=1;i<arguments.length;i++)n[i-1]=arguments[i];this.clientList[t]&&0!==this.clientList[t].length&&this.clientList[t].forEach(function(t){t.apply(e,n)})},e.prototype.remove=function(t,e){if(this.clientList[t])if(e)for(var n=this.clientList[t].length-1;0<=n;n--)this.clientList[t][n]==e&&this.clientList[t].splice(n,1);else this.clientList[t].length=0},e);function e(){this.clientList={}}function r(t,e,n){t.addEventListener?t.addEventListener(e,n,!1):(t["e"+e+n]=n,t[e+n]=function(){t["e"+e+n](window.event)},t.attachEvent("on"+e,t[e+n]))}var o=new t;function a(t,e){/\[object HTML.*Element\]/.test(t)&&(t=[t]);for(var n=0;n<t.length;n++)e(n)}function f(t){var e=t||o;if(e.path||e.composedPath)return e.path||e.composedPath&&e.composedPath();for(var n=[],i=e.target||e.srcElement;i;)n.push(i),i=i.parentElement;return n}function d(t){return!t||t.length<=0?"":/\[object HTML.*Element\]/.test(Object.prototype.toString.call(t))?t:(i=t,"[object String]"!==Object.prototype.toString.call(i)?t:"window"===t?window:"document"===t?document:(0<=t.indexOf("[")&&0<t.indexOf("]")&&(null!==(e=function(t){"["===t.charAt(0)&&t.indexOf("]")===t.length-1&&(t=t.slice(1,-1));var e=t.split("=");return 2===e.length?"'"!==e[1].charAt(0)&&'"'!==e[1].charAt(0)||(e[1]=e[1].slice(1,-1)):e.push(null),e}(t.slice(t.indexOf("["))))[1]&&(n="'"+e[1]+"'",t=t.slice(0,t.indexOf("["))+"["+e[0]+"="+n+"]")),document.querySelectorAll(t)));var e,n,i}function s(t){void 0===t&&(t="div");for(var e=[],n=1;n<arguments.length;n++)e[n-1]=arguments[n];if(0===e.length){var i=document.createElement("div");return i.innerHTML=t,i.firstElementChild}var c,r=e[0]||{},o=e[1]||{},l=e[2],a=document.createElement(t);return Object.getOwnPropertyNames(r).forEach(function(t){var e,n,i=r[t];"textContent"===t?(n=i,void 0===(e=a).textContent?e.innerText=n:e.textContent=n):a[t]=i}),Object.getOwnPropertyNames(o).forEach(function(t){a.setAttribute(t,o[t])}),l&&(c=a,function(t){return"function"==typeof t&&(t=t()),(Array.isArray(t)?t:[t]).map(function(t){return"function"==typeof t&&(t=t()),(n=t)&&u(n)&&1===n.nodeType||u(e=t)&&3===e.nodeType?t:"string"==typeof t&&/\S/.test(t)?document.createTextNode(t):void 0;var e,n}).filter(function(t){return t})}(l).forEach(function(t){return c.appendChild(t)})),a}var h,p=[],v=s("div",{id:"contextmeun_parent"});function m(t){var e=function t(e){var n=document.createElement("ul");for(var i=0;i<e.length;i++){var c=e[i];c.id=g().toString();var r=s("div",{className:"content",innerHTML:c.content});r.setAttribute("data-id",c.id);var o=s("li",{},{},[r]);0<c.children.length&&o.appendChild(t(c.children)),n.appendChild(o)}return n}(t.data);v.innerHTML="",v.appendChild(e),v.style.display="block"}v.style.position="absolute",setTimeout(function(){var t,e,n,i,c;document.body&&document.body.appendChild(v),(t={agent:v,events:"click",ele:"li",fn:function(t){var r,e=t.firstElementChild.getAttribute("data-id"),n=(r=e,function t(e){for(var n=0;n<e.length;n++){var i=e[n];if(i.id==r)return i;if(0<i.children.length){var c=t(i.children);if(c)return c}}}(h.data));n&&n.callback(h.ele)}}).fn&&(e=d(t.agent),n=d(t.ele),t.agent?(e&&/\[object HTML.*Element\]/.test(e)&&(e=[e]),c=t,a(e,function(t){r(e[t],c.events,function(t){for(var e=t||o,n=f(e),i=0;i<n.length;i++){if(n[i]===this)return;if("#document"===n[i].nodeName)return;0<=l(this.querySelectorAll(c.ele)).indexOf(n[i])&&c.fn(n[i],e)}})})):(/\[object HTML.*Element\]/.test(n)&&(n=[n]),i=t,a(n,function(t){r(n[t],i.events,function(t){var e=t||o,n=f(e);i.fn(n,e)})})))},0);var y=document.oncontextmenu;document.oncontextmenu=function(t){y&&y();for(var n,e=t||event,i=f(e),c=function(e){return"BODY"===i[e].nodeName||(n=function(){for(var t=[],e=[],n=p.length-1;0<=n;n--){var i=p[n],c=[],r=Object.prototype.toString.call(i.ele);"[object String]"===r?c=l(document.querySelectorAll(i.ele)):"[object NodeList]"===r?c=l(i.ele):"[object Array]"===r?c=i.ele:/\[object HTML.*Element\]/.test(r)&&(c=[i.ele]);for(var o=0;o<c.length;o++)t.indexOf(c[o])<0&&(t.push(c[o]),e.push({ele:c[o],data:i.data,callback:i.callback}))}return e}().find(function(t){return t.ele===i[e]}))?"break":void 0},r=0;r<i.length;r++){if("break"===c(r))break}v.style.display="none",n&&(e.preventDefault(),v.style.left=e.pageX+"px",v.style.top=e.pageY+"px",m(h=n),n.callback(n.ele))};var n=document.onscroll;document.onscroll=function(){n&&n(),v.style.display="none"};var i=document.onclick;document.onclick=function(){i&&i(),v.style.display="none"};var c,b,g=(c=0,function(){return c++}),L={ele:document.getElementById("contextmenu"),callback:function(){},data:[{content:"<p>复制</p>",children:[],callback:function(t){}},{content:"<p>粘贴</p>",children:[],callback:function(t){}},{content:"<p>删除</p>",children:[],callback:function(t){}},{content:"单元格格式",children:[{content:"合并单元格",children:[],callback:function(t){}},{content:"拆分单元格",children:[],callback:function(t){}}],callback:function(t){}}]};b=L,p.push({ele:b.ele,data:b.data,callback:b.callback})});
