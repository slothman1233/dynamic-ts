!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t="undefined"!=typeof globalThis?globalThis:t||self).indexjs={})}(this,function(t){"use strict";function e(t){function n(t,e){var s,a;return 0<t.length&&(s=t[e],(a=document.createElement("link")).href=s,a.rel="stylesheet",document.getElementsByTagName("head")[0].appendChild(a),a.onload=function(){t.length-1!=e&&n.call(this,t,++e)}),!1}n(t,0)}function c(t,e,s){t.addEventListener?t.addEventListener(e,s,!1):(t["e"+e+s]=s,t[e+s]=function(){t["e"+e+s](window.event)},t.attachEvent("on"+e,t[e+s]))}function s(t){return!!t&&"object"==typeof t}function n(t){return s(t)&&"[object Object]"===Object.prototype.toString.call(t)&&t.constructor===Object}var l=function(t){return s(t)?Object.keys(t):[]};function p(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];var a={};return t.forEach(function(t){var e,s;t&&(s=function(t,e){n(t)?(n(a[e])||(a[e]={}),a[e]=p(a[e],t)):a[e]=t},l(e=t).forEach(function(t){return s(e[t],t)}))}),a}function i(t){try{var e,s=Object.prototype.toString.call(t);if("[object Object]"==s)try{t.constructor&&(s=-1!=(e=t.constructor.toString()).indexOf("Array")?"[object Array]":-1!=e.indexOf("HTMLCollection")?"[object NodeList]":-1!=e.indexOf("function")&&-1!=e.indexOf("Object()")?"[object Object]":e)}catch(t){return"[object Null]"}else"[object HTMLCollection]"==s&&(s="[object NodeList]");return s}catch(t){return"variable is not defined."}}var o={index:{error:"已经存在改方法名称"},httprequest:{timeOut:"请求超时",noAuthority:"没有权限",parameterError:"参数有误"},dom:{throwWhitespace:"类具有非法空格字符",notElement:"不是元素"},select:{prompt:"请选择"},proportion:{noImg:"imageUrl参数不正确",noParentEle:"容器元素不正确"}};function C(t,e){var s=i(t);if(!/\[object HTML.*Element\]/.test(s))throw new Error(""+o.dom.notElement);var a=t.className.split(" ");return 0<=a.indexOf(e)&&a.splice(a.indexOf(e),1),t.className=a.join(" "),t}function N(t,e){var s=i(t);if(!/\[object HTML.*Element\]/.test(s))throw new Error(""+o.dom.notElement);var a=t.className.split(" ");return-1===a.indexOf(e)&&a.push(e),t.className=a.join(" "),t}function r(t,e){return t&&(function(t){if(/\s/.test(t))throw new Error(""+o.dom.throwWhitespace)}(e),t.classList?t.classList.contains(e):new RegExp("(^|\\s)"+e+"($|\\s)").test(t.className))}function a(t,e){var s,a=e;if(0<=e.indexOf("[")&&0<e.indexOf("]")){var n=(s=function(t){"["===t.charAt(0)&&t.indexOf("]")===t.length-1&&(t=t.slice(1,-1));var e=t.split("=");if(2!==e.length)return e.push(null),e;"'"!==e[1].charAt(0)&&'"'!==e[1].charAt(0)||(e[1]=e[1].slice(1,-1));return e}(e.slice(e.indexOf("["))),!(!t.getAttribute(s[0])||null!==s[1])||!(!s[1]||!t.getAttribute(s[0])||t.getAttribute(s[0])!==s[1]));if(!n)return;if(0==e.indexOf("[")&&e.indexOf("]")===e.length-1&&n)return 1;a=e.slice(0,e.indexOf("["))}if("#"===a.charAt(0)&&t.id===a.slice(1))return 1;if("."===a.charAt(0)&&r(t,a.slice(1)))return 1;if(t.nodeName&&t.nodeName.toUpperCase()===e.toUpperCase())return 1}function m(){this.times=1,this.iconfontSrc="https://js.wbp5.com/iconfont/build/layer/iconfont.css?v=888",this.iconList={11:"&#xA001;",12:"&#xA002;",21:"&#xA003;",22:"&#xA004;",31:"&#xA006;",32:"&#xA007;",41:"&#xA008;",42:"&#xA009;",1110:"&#xA005;"},this.iconColorList={11:"#21d37d",12:"#21d37d",21:"#d5375a",22:"#d5375a",31:"#26d1e0",32:"#26d1e0",41:"#e8a02e",42:"#e8a02e",1110:"rgba(0, 0, 0, 0.75)"},this.msgObj={className:"stl-layer-msg stl-layer-shadow stl-layer-centered",iconClassName:"stl-layer-msg-icon",paddingClassName:"stl-layer-msg-padding",iconPaddingClassName:"stl-layer-icon-msg-padding",time:3e3},this.hasTitleAlertObj={iconClassName:"stl-layer-title-alert-icon",btnClassName:"stl-layer-alert-btn stl-layer-alert-hastitle-btn",titleClassName:"stl-layer-alert-title",textClassName:"stl-layer-alert-hastitle-text"},this.noTitleAlertObj={btnClassName:"stl-layer-alert-btn stl-layer-alert-notitle-btn",iconClassName:"stl-layer-alert-icon",textClassName:"stl-layer-alert-text"},this.alertObj={time:3e3,closeClassName:"stl-layer-alert-close",className:"stl-layer-alert stl-layer-centered",paddingClassName:"stl-layer-alert-padding",iconPaddingClassName:"stl-layer-icon-alert-padding",contentClassName:"stl-layer-content  stl-layer-border stl-layer-alert"},this.openObj={className:"stl-layer-shadow stl-layer-centered stl-layer-open",bgClassName:"stl-layer-open-bg",classNameTwo:"stl-layer-open-two",contentPadding:"stl-layer-open-padding stl-layer-open-content",iconContentPadding:"stl-layer-icon-open-padding stl-layer-open-content",iconClassName:"stl-layer-open-icon",titleClassName:"stl-layer-open-title",iconTitleClassName:"stl-layer-open-icon-title",textClassName:"stl-layer-open-text",iconTextClassName:"stl-layer-open-icon-text",closeClassName:"stl-layer-open-close",btnClassName:"stl-layer-open-btn",btnBoxClassName:"stl-layer-open-btn-box",determineClassName:"stl-layer-open-btn-determine",cancelClassName:"stl-layer-open-btn-cancel",textNoBtnClassName:"stl-layer-open-text-nobtn",parameter:{type:1,autoClose:!1,hasClose:!0,determineBtn:!1,determineText:"确定",cancelBtn:!1,cancelText:"取消",bg:!0}},this.modalObj={className:"stl-layer-shadow stl-layer-centered stl-layer-modal",bgClassName:"stl-layer-modal-bg",headClassName:"stl-layer-modal-head",titleClassName:"stl-layer-modal-title",contentClassName:"stl-layer-modal-content",textClassName:"stl-layer-modal-text",footClassName:"stl-layer-modal-foot",btnClassName:"stl-layer-modal-btn",determineClassName:"stl-layer-open-btn-determine",cancelClassName:"stl-layer-open-btn-cancel",closeClassName:"stl-layer-modal-close",parameter:{hasClose:!0,determineBtn:!0,determineText:"确定",cancelBtn:!0,cancelText:"取消",bg:!0}},this.loadObj={className:"stl-layer-loading",bgClassName:"stl-layer-loading-bg",pClassName:"stl-layer-parent-loading",pBgClassName:"stl-layer-parent-loading-bg",parameter:{bg:!0,width:40,height:40}},this.tipObj={parameter:{position:"top",time:3e3},hideClassName:"stl-layer-tip-hide",className:"stl-layer-tip",ContentClassName:"stl-layer-tip-content"},this.bgDom=null,this.timeoutList={msg:null,alert:null},e([this.iconfontSrc])}function d(t,e,s){t.addEventListener?t.addEventListener(e,s,!1):(t["e"+e+s]=s,t[e+s]=function(){t["e"+e+s](window.event)},t.attachEvent("on"+e,t[e+s]))}var h=new(m.prototype.getBgDom=function(t){var e=document.createElement("div");return e.className="stl-layer-shade "+t,e.id="stl-layer-shade"+this.times,e.setAttribute("times",""+this.times),e},m.prototype.getDomStr=function(t,e){var s=document.createElement("div");return s.className="stl-layer stl-layer"+this.times+" "+e,s.id="stl-layer"+this.times,s.innerHTML=t,s},m.prototype.getIconStr=function(t,e,s){var a=s&&""!==s?s:this.iconColorList[e];return e&&this.iconList[e]?'<i class="'+t+' iconfont_layer" style="color:'+a+'">'+this.iconList[e]+"</i>":""},m.prototype.getCloseStr=function(t){return'<i class="iconfont_layer '+t+'">&#xA005;</i>'},m.prototype.deduplication=function(t,e){var s=document.getElementsByClassName(t);0<s.length&&(document.body.removeChild(s[0]),clearTimeout(this.timeoutList[e]),this.timeoutList[e]=null)},m.prototype.msgStr=function(t,e,s){var a="",n=this.msgObj.paddingClassName;return e&&(a=this.getIconStr(this.msgObj.iconClassName,e,s),n=this.msgObj.iconPaddingClassName),'<div id="" class="stl-layer-content '+n+'">'+a+t+"</div>"},m.prototype.msg=function(t,e,s){this.deduplication("stl-layer-msg","msg");var a="function"==typeof e,n=this.msgObj.time,l=0,i="";e&&!a&&(n=e.time?e.time:n,l=e.icon?e.icon:l,i=e.iconColor?e.iconColor:"");var o=this.msgStr(t,l,i),r=this.getDomStr(o,this.msgObj.className);this.appendDom(r),this.times++,this.autoClose("msg",r,n,s)},m.prototype.hasTitleAlertStr=function(t){var e,s="",a="",n="",l=this.alertObj.paddingClassName,i=t.iconColor?t.iconColor:"";t.icon&&(s=this.getIconStr(this.hasTitleAlertObj.iconClassName,t.icon,i),a="stl-layer-skin"+t.icon,l=this.alertObj.iconPaddingClassName),t.btnStr&&(n='<div class="'+this.hasTitleAlertObj.btnClassName+'">'+t.btnStr+"</div>"),e=t.autoClose?"":this.getCloseStr(this.alertObj.closeClassName);var o='<p class="'+this.hasTitleAlertObj.titleClassName+'">'+t.title+"</p>",r='<p class="'+this.hasTitleAlertObj.textClassName+'">'+t.content+"</p>";return'<div id="" class="'+this.alertObj.contentClassName+" "+l+" "+a+'">\n                '+s+o+r+n+e+"</div>"},m.prototype.noTitleAlertStr=function(t){var e="",s="",a="",n="",l=this.msgObj.paddingClassName,i=t.iconColor?t.iconColor:"";t.icon&&(e=this.getIconStr(this.noTitleAlertObj.iconClassName,t.icon,i),s="stl-layer-skin"+t.icon,l=this.msgObj.iconPaddingClassName),t.btnStr?a='<div class="'+this.noTitleAlertObj.btnClassName+'">'+t.btnStr+"</div>":n=t.autoClose?"":this.getCloseStr(this.alertObj.closeClassName);var o='<p class="'+this.noTitleAlertObj.textClassName+'">'+t.content+"</p>";return'<div id="" class="'+this.alertObj.contentClassName+" "+l+" "+s+'">\n                '+e+o+a+n+"</div>"},m.prototype.addAlertBtnEvent=function(l,t,i){var o=this,r=t?o.hasTitleAlertObj.btnClassName:o.noTitleAlertObj.btnClassName;o.alertBtnCallback=function(t){var e,s,a,n=t||window.event;e=l.getElementsByClassName(r)[0],s="click",a=o.alertBtnCallback,e.detachEvent?(e.detachEvent("on"+s,e[s+a]),e[s+a]=null):e.removeEventListener(s,a,!1);try{i&&i.call(o,n)}catch(t){}document.body.removeChild(l),o.alertBtnCallback=null},c(l.getElementsByClassName(r)[0],"click",o.alertBtnCallback)},m.prototype.alert=function(t){this.deduplication("stl-layer-alert","alert");var e="",s="",a=!1;t.title?(e=this.hasTitleAlertStr(t),s=this.alertObj.className,a=!0):e=this.noTitleAlertStr(t);var n,l=this.getDomStr(e,s),i=t.endCallback?t.endCallback:null;this.appendDom(l);try{t.showCallback&&t.showCallback.call(this)}catch(t){}if(this.times++,t.btnStr&&t.btnCallback&&this.addAlertBtnEvent(l,a,t.btnCallback),t.autoClose)return this.autoClose("alert",l,this.alertObj.time,i);t.btnStr&&!t.title||(n=l.getElementsByClassName(this.alertObj.closeClassName)[0],this.addCloseEventFn(n,i))},m.prototype.getOpenStr=function(t,e){var s=this.openObj.contentPadding,a=this.openObj.titleClassName,n=this.openObj.textClassName,l="";""!==e&&(s=this.openObj.iconContentPadding,a=this.openObj.iconTitleClassName,n=this.openObj.iconTextClassName);var i,o,r=this.openObj.textNoBtnClassName;return(t.determineBtn||t.cancelBtn)&&(r="",i=t.determineBtn?'<span class="'+this.openObj.btnBoxClassName+" "+this.openObj.determineClassName+'">'+t.determineText+"</span>":"",o=t.cancelBtn?'<span class="'+this.openObj.btnBoxClassName+" "+this.openObj.cancelClassName+'">'+t.cancelText+"</span>":"",l='<div class="'+this.openObj.btnClassName+'">'+o+i+"</div>"),'<div id="" class="'+s+'"><p class="'+a+'">'+t.title+'</p><p class="'+n+" "+r+'">'+t.content+"</p>"+l+"</div>"},m.prototype.open=function(t){var e,s,a,n=p({},this.openObj.parameter,t),l=n.end?n.end:null,i=n.iconColor?n.iconColor:"",o=n.icon?this.getIconStr(this.openObj.iconClassName,n.icon,i):"",r=n.hasClose?this.getCloseStr(this.openObj.closeClassName):"",c=this.getOpenStr(n,o),m=2===n.type?this.openObj.classNameTwo:"",d=this.getDomStr(c+o+r,this.openObj.className+" "+m);n.bg&&(this.bgDom=this.getBgDom(this.openObj.bgClassName),this.appendDom(this.bgDom),this.addBgEvent(this.bgDom,l)),this.appendDom(d),this.times++;try{n.showCallback&&n.showCallback.call(this)}catch(t){}""!==r&&(e=d.getElementsByClassName(this.openObj.closeClassName)[0],this.addCloseEventFn(e,l)),n.determineBtn&&(s=d.getElementsByClassName(this.openObj.determineClassName)[0],this.addOpenBtnFn(s,n.determineFn,l)),n.cancelBtn&&(a=d.getElementsByClassName(this.openObj.cancelClassName)[0],this.addOpenBtnFn(a,n.cancelFn,l))},m.prototype.getModalFn=function(t){var e=t.hasClose?this.getCloseStr(this.modalObj.closeClassName):"",s='<div class="'+this.modalObj.headClassName+'">\n                <p class="'+this.modalObj.titleClassName+'">'+t.title+"</p>"+e+"\n            </div>",a='<div class="'+this.modalObj.contentClassName+'">\n                <p class="'+this.modalObj.textClassName+'">'+t.content+"</p>\n            </div>",n=t.determineBtn?'<span class="'+this.modalObj.btnClassName+" "+this.modalObj.determineClassName+'">'+t.determineText+"</span>":"",l=t.cancelBtn?'<span class="'+this.modalObj.btnClassName+" "+this.modalObj.cancelClassName+'">'+t.cancelText+"</span>":"";return s+a+'<div class="'+this.modalObj.footClassName+'">'+l+n+"</div>"},m.prototype.modal=function(t){var e,s,a,n=p({},this.modalObj.parameter,t),l=n.end?n.end:null,i=this.getModalFn(n),o=this.getDomStr(i,this.modalObj.className);n.bg&&(this.bgDom=this.getBgDom(this.modalObj.bgClassName),this.appendDom(this.bgDom),this.addBgEvent(this.bgDom,l)),this.appendDom(o),this.times++;try{n.showCallback&&n.showCallback.call(this)}catch(t){}n.hasClose&&(e=o.getElementsByClassName(this.modalObj.closeClassName)[0],this.addCloseEventFn(e,l)),n.determineBtn&&(s=o.getElementsByClassName(this.openObj.determineClassName)[0],this.addOpenBtnFn(s,n.determineFn,l)),n.cancelBtn&&(a=o.getElementsByClassName(this.openObj.cancelClassName)[0],this.addOpenBtnFn(a,n.cancelFn,l))},m.prototype.addBgEvent=function(s,a){var n=this;c(s,"click",function(){var t=s.getAttribute("times"),e=document.getElementsByClassName("stl-layer"+t)[0];document.body.removeChild(s),document.body.removeChild(e),n.bgDom=null;try{a&&a()}catch(t){}})},m.prototype.addOpenBtnFn=function(t,s,a){var n=this;c(t,"click",function(t){var e=t||window.event;s&&s.call(n,e.target),n.closeFn.call(n,e.target);try{a&&a.call(n)}catch(t){}})},m.prototype.addCloseEventFn=function(t,s){var a=this;c(t,"click",function(t){var e=t||window.event;a.closeFn.call(a,e.target);try{s&&s.call(a)}catch(t){}})},m.prototype.closeFn=function(t){document.body.removeChild(function(t,e){if(!e||e.length<=0)return null;var s=t.parentElement;do{if(a(s,e))return s;if("HTML"===s.nodeName)return null;s=s.parentElement}while(s);return null}(t,".stl-layer")),this.bgDom&&(document.body.removeChild(this.bgDom),this.bgDom=null)},m.prototype.appendDom=function(t,e){(e||document.body).appendChild(t)},m.prototype.autoClose=function(t,e,s,a){var n=this;this.timeoutList[t]=setTimeout(function(){document.body.removeChild(e),n.bgDom&&(document.body.removeChild(n.bgDom),n.bgDom=null),n.timeoutList[t]=null;try{a&&a()}catch(t){}},s)},m.prototype.loading=function(t){var e=p({},this.loadObj.parameter,t);t.parent?this.parentLoad(e):this.noParentLoad(e)},m.prototype.getLoadDom=function(t,e){var s='<img src="'+t.img+'" style="width:'+t.width+"px;height:"+t.height+'px;display:block;" />';return this.getDomStr(s,e)},m.prototype.parentLoad=function(t){var e=this.getLoadDom(t,this.loadObj.pClassName),s=this.getBgDom(this.loadObj.pBgClassName);this.appendDom(s,t.parent),this.appendDom(e,t.parent),this.times++},m.prototype.noParentLoad=function(t){var e,s;0<document.getElementsByClassName("stl-layer-loading").length||(e=this.getLoadDom(t,this.loadObj.className),t.bg&&(s=this.getBgDom(this.loadObj.bgClassName),this.appendDom(s)),this.appendDom(e),this.times++)},m.prototype.closeLoad=function(t){var e=document,s=document.body,a="stl-layer-loading",n="stl-layer-loading-bg";t&&(s=e=t,a="stl-layer-parent-loading",n="stl-layer-parent-loading-bg");var l=e.getElementsByClassName(a),i=e.getElementsByClassName(n);0<l.length&&s.removeChild(l[0]),0<i.length&&s.removeChild(i[0])},m.prototype.tips=function(t,e,s,a){void 0===s&&(s={});var n=p({},this.tipObj.parameter,s),l=n.maxWidth?"max-width:"+n.maxWidth+"px":"",i='<div class="'+this.tipObj.ContentClassName+'">\n                <p class="'+this.tipObj.className+'-p" style="'+l+'">'+e+'</p>\n                <em class="'+this.tipObj.className+"-em "+this.tipObj.className+"-em-"+n.position+'"></em>\n            </div>',o=this.getDomStr(i,this.tipObj.className+" "+this.tipObj.hideClassName);this.getTipPosition(o,t,n),this.times++,this.autoClose("tips",o,n.time,a)},m.prototype.getTipPosition=function(t,e,s){var a=e.getBoundingClientRect().left,n=e.getBoundingClientRect().top,l=e.offsetWidth,i=e.offsetHeight;document.body.appendChild(t);var o=t.offsetWidth,r=t.offsetHeight,c=a+l/2-o/2,m=c<0?0:c,d=n+i/2-r/2,p=d<0?0:d,h=t.getElementsByClassName(this.tipObj.className+"-em")[0];switch(s.position){case"top":var b=n-r-8;t.style.left=m+"px",n+b<0?(t.style.top=n+i+8+"px",C(h,this.tipObj.className+"-em-"+s.position),N(h,this.tipObj.className+"-em-bottom")):t.style.top=b+"px";break;case"bottom":var g=n+i+8;t.style.left=m+"px",n+g+r>document.body.clientHeight?(t.style.top=n-r-8+"px",C(h,this.tipObj.className+"-em-"+s.position),N(h,this.tipObj.className+"-em-top")):t.style.top=g+"px";break;case"right":var u=a+l+8;t.style.top=p+"px",a+u+o>document.body.clientWidth?(t.style.left=a-o-8+"px",C(h,this.tipObj.className+"-em-"+s.position),N(h,this.tipObj.className+"-em-left")):t.style.left=u+"px";break;case"left":var y=a-o-8;t.style.top=p+"px",a+y<0?(t.style.left=a+l+8+"px",C(h,this.tipObj.className+"-em-"+s.position),N(h,this.tipObj.className+"-em-right")):t.style.left=y+"px"}C(t,"stl-layer-tip-hide")},m),b=document.getElementById("btn"),g=document.getElementById("btn1"),u=document.getElementById("btn2"),y=document.getElementById("btn3"),f=document.getElementById("btn4"),O=document.getElementById("btn5");d(b,"click",function(){h.msg("不开心。。。",{icon:11,time:3e3})}),d(g,"click",function(){h.alert({content:"这是一个自定义alert",title:"这是一个标题",autoClose:!0,btnStr:"<p data-link='https://www.baidu.com' style='padding:0;margin:0'>查看详情</p>",btnCallback:function(t){}})}),d(u,"click",function(){h.open({title:"这是一个标题",content:"这是一段内容这是一段内容这是一段内容这是一段内容这是一段内容这是一段内容这是一段内容",icon:11,iconColor:"#00ff00",determineBtn:!0,type:2,cancelBtn:!0,determineFn:function(){},cancelFn:function(){}})}),d(y,"click",function(){h.modal({title:"这是一个标题",content:"这是一段内容这是一段内容这是一段内容这是一段内容这是一段内容这是一段内容这是一段内容",determineFn:function(){},cancelFn:function(){}})}),d(f,"click",function(){h.loading({img:"./loading.gif",width:60,height:60,parent:document.getElementById("parent_box")})}),d(O,"click",function(){h.tips(this,"这是一条tips这是一条tips这是一条tips这是一条tips这是一条tips",{position:"left"})}),t.addEvent=d,Object.defineProperty(t,"__esModule",{value:!0})});
