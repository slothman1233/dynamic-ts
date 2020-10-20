(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
}((function () { 'use strict';

  ///<reference path="../indexModel.d.ts" />
  /**
   * 是否是object类型
   */
  function isObject(value) {
      return !!value && typeof value === "object";
  }
  /**
   * 判断是否是数组对象类型
   * @param value 值
   */
  function isPlain(value) {
      return isObject(value) &&
          Object.prototype.toString.call(value) === '[object Object]' &&
          value.constructor === Object;
  }
  /**
   * 判断是否是字符串
   * @param value 值
   */
  function isString(value) {
      return Object.prototype.toString.call(value) === "[object String]";
  }
  var keys = function (object) {
      return isObject(object) ? Object.keys(object) : [];
  };
  /**
   * 对象的循环
   * @param {Object} object 对象
   * @param {Function} fn(value,key) 回调的函数
   */
  function each(object, fn) {
      keys(object).forEach(function (key) { return fn(object[key], key); });
  }
  /**
   * 获取或判断任意数据类类型的通用方法
   * @param {any} any 任意数据
   * @example
   * var aa=null;
   * getDataType(aa);
   * var abc;
   * getDataType(abc); //[object Undefined] 说明此变量已经声明，但尚未被初始化
   * var fn=function(){}
   * getDataType(fn); //[object Function]
   * getDataType(new Object()); //[object Object]
   * getDataType("Hello");//[object String]
   * getDataType(234);//[object Number]
   * getDataType(true));//[object Boolean]
   * getDataType(new Date()); //[object Date]
   * getDataType(new Date().getTime()); //[object Number]
   * getDataType(document.getElementById("demopic")); //[object HTMLDivElement]
   * getDataType(document.querySelector('div'));//[object HTMLDivElement]
   * var nodelist=NodeListToArray(document.getElementsByTagName("*"));
   * getDataType(nodelist); //[object Array]
   * getDataType(document.getElementsByTagName("*")); //[object NodeList)]
   * getDataType(document.querySelectorAll('div')); //[object NodeList)]
   * //nodelist[10].tagName);
   * getDataType(/[a-z]/); //[object RegExp]
   */
  function getDataType(any) {
      /* (1) Object.prototype.toString.call 方法判断类型：
      优点：通用，返回"[object String]" 具体object的类型
      缺点：不能返回继承的类型
      
      (2)typeof x
      缺点：对object类型不能细分；
      优点：对空null的判断 'undefined'的应用;
      返回类型有：'undefined' “string” 'number' 'boolean' 'function' 'object'
      
      (3) instanceof 能返回具体的类型，只适用于用new关键字创建的对象进行判断
      */
      // var baseType=["string","number","boolean"];//基本类型
      // var refType=["object", "Function","Array","Date"];//引用类型
      try {
          var dtype = Object.prototype.toString.call(any);
          if (dtype == "[object Object]") //IE，某个dom元素对象
           {
              try {
                  if (any.constructor) {
                      var constructorStr = any.constructor.toString(); //obj.constructor可以返回继承的类型
                      if (constructorStr.indexOf("Array") != -1) {
                          dtype = "[object Array]";
                      }
                      else if (constructorStr.indexOf("HTMLCollection") != -1) { /* IE */
                          dtype = "[object NodeList]";
                      }
                      else if ((constructorStr.indexOf("function") != -1) && (constructorStr.indexOf("Object()") != -1)) {
                          dtype = "[object Object]";
                      }
                      else
                          dtype = constructorStr;
                  }
              }
              catch (e) {
                  return "[object Null]";
              }
          }
          else {
              if (dtype == "[object HTMLCollection]") { /* FF */
                  dtype = "[object NodeList]";
              }
          }
          return dtype;
      }
      catch (e) {
          return "variable is not defined.";
      }
  }
  /**
   * NodeList转为数组
   * @param {NodeList} nodes 对象数组类型
   * @return {Array} 转化后的数组
   */
  function NodeListToArray(nodes) {
      var array = null;
      try {
          array = Array.prototype.slice.call(nodes, 0);
      }
      catch (ex) {
          array = new Array();
          for (var i = 0, len = nodes.length; i < len; i++) {
              array.push(nodes[i]);
          }
      }
      return array;
  }

  /**
   * 绑定方法
   * @param {Element} obj 绑定的元素
   * @param {String} type 方法名称
   * @param {function} fn  绑定的方法
   */
  var addEvent = function (obj, type, fn) {
      if (obj.addEventListener) {
          obj.addEventListener(type, fn, false);
      }
      else {
          obj['e' + type + fn] = fn;
          obj[type + fn] = function () { obj['e' + type + fn](window.event); };
          obj.attachEvent('on' + type, obj[type + fn]);
      }
  };
  /**
   * 解除方法绑定
   * @param {Element} obj 解除方法绑定的元素
   * @param {String} type 方法名称
   * @param {function} fn  解除方法绑定的方法
   */
  var removeEvent = function (obj, type, fn) {
      if (obj.detachEvent) {
          obj.detachEvent('on' + type, obj[type + fn]);
          obj[type + fn] = null;
      }
      else
          obj.removeEventListener(type, fn, false);
  };
  /**
   * 合并对象
   * @param { Array<any> } args 所有的参数   后面的参数替换前面的参数
   * @param sources 需要合并的对象
   */
  function mergeOptions() {
      var sources = [];
      for (var _i = 0; _i < arguments.length; _i++) {
          sources[_i] = arguments[_i];
      }
      var result = {};
      sources.forEach(function (source) {
          if (!source) {
              return;
          }
          each(source, function (value, key) {
              if (!isPlain(value)) {
                  result[key] = value;
                  return;
              }
              if (!isPlain(result[key])) {
                  result[key] = {};
              }
              result[key] = mergeOptions(result[key], value);
          });
      });
      return result;
  }

  var win;
  if (typeof window !== "undefined") {
      win = window;
  }
  else if (typeof global !== "undefined") {
      win = global;
  }
  else if (typeof self !== "undefined") {
      win = self;
  }
  else {
      win = {};
  }
  var window$1 = win;

  /**
   * 获取元素样式表里面的样式
   * @param {Element} el 获取样式的元素
   * @param {string} prop 样式的名称
   * @return {String | Number}
   * @example
   *  computedStyle(document.getElementById('id'),"fontSize") ==> "12px"
   */
  function computedStyle(el, prop) {
      if (!el || !prop) {
          return '';
      }
      var cs;
      if (typeof window$1.getComputedStyle === 'function') {
          cs = window$1.getComputedStyle(el);
          return cs ? cs[prop] : '';
      }
      else { //ie6-8下不兼容
          if (prop === "opacity") { //有些属性在浏览器上是不兼容的例如opacity
              cs = el.currentStyle["filter"];
              var reg_1 = /^alpha\(opacity=(\d+(?:\.\d+)?)\)$/i;
              cs = reg_1.test(cs) ? reg_1.exec(cs)[1] / 100 : 1;
          }
          var reg = /^(-?\d+(\.\d+)?)(px|pt|rem|em)?$/i; //去掉单位的正则
          cs = el.currentStyle[prop];
          return cs ? reg.test(cs) ? parseFloat(cs) : cs : "";
      }
  }

  /**
   * 发布订阅模式
   */
  var events = /** @class */ (function () {
      function events() {
          this.clientList = {};
      }
      /**
  * 添加订阅者
  * @param {string} key 订阅名称
  * @param {Function} fn 订阅的函数
  */
      events.prototype.listen = function (key, fn) {
          if (!this.clientList[key]) {
              this.clientList[key] = new Array;
          }
          this.clientList[key].push(fn);
      };
      /**
       * 发送消息
       * @param {string} key 订阅名称
       * @param {any} arg 函数的参数
       */
      events.prototype.trigger = function (key) {
          var _this = this;
          var arg = [];
          for (var _i = 1; _i < arguments.length; _i++) {
              arg[_i - 1] = arguments[_i];
          }
          if (!this.clientList[key] || this.clientList[key].length === 0) {
              return;
          }
          this.clientList[key].forEach(function (fn) {
              fn.apply(_this, arg);
          });
      };
      /**
       * 取消订阅事件
       * @param {string} key 订阅名称
       * @param {function} fn 取消的函数 不传等于清空里面的所有的方法
       */
      events.prototype.remove = function (key, fn) {
          if (!this.clientList[key]) {
              return;
          }
          if (!fn) {
              this.clientList[key].length = 0;
              return;
          }
          for (var i = this.clientList[key].length - 1; i >= 0; i--) {
              if (this.clientList[key][i] == fn) {
                  this.clientList[key].splice(i, 1);
              }
          }
      };
      return events;
  }());
  /**
   * 动态安装 发布-订阅功能
   */
  var installEvents = function () {
      var obj = new events();
      return obj;
  };

  ///<reference path="../indexModel.d.ts" />
  var event$1 = installEvents(); //没有代理对象的缓存
  function LoopBinding(ele, cb) {
      if (/\[object HTML.*Element\]/.test(ele))
          ele = [ele];
      for (var i = 0; i < ele.length; i++) {
          (function (i) { cb(i); })(i);
      }
  }
  /**
   * 解析出属性名称和值
   * @param {string} str [data-id=11]  [data-id] [data-id='a']
   * @return {Array<string>} [0]属性名称 [1]属性值 之不存在为null
   */
  function getTagName(str) {
      if (str.charAt(0) === "[" && str.indexOf(']') === str.length - 1) {
          str = str.slice(1, -1);
      }
      var strAry = str.split("=");
      if (strAry.length === 2) {
          if (strAry[1].charAt(0) === "'" || strAry[1].charAt(0) === '"') {
              strAry[1] = strAry[1].slice(1, -1);
          }
          return strAry;
      }
      strAry.push(null);
      return strAry;
  }
  /**
   * 绑定方法
   * @param {listenDataModel} data
      * @param {String | Element} agent 代理对象
      * @param {Stirng} events 触发的方法
      * @param {Stirng} ele 事件对象
      * @param {Function} fn 事件方法
   * @return {Element} 事件对象
   * @example
   *      fx.on({
   *          agent:document,
   *          events:"click",
   *          ele:".aa",
   *          fn:function(){fx.log(1)}
   *          })
   */
  function on(data) {
      if (!data.fn)
          return;
      var agentDom = dom(data.agent);
      var events = dom(data.ele);
      //有代理元素
      if (data.agent) {
          if (agentDom)
              if (/\[object HTML.*Element\]/.test(agentDom))
                  agentDom = [agentDom];
          (function (data) {
              LoopBinding(agentDom, function (i) {
                  addEvent(agentDom[i], data.events, function (e) {
                      var ev = e || event$1;
                      var path = eventsPath(ev);
                      for (var i_1 = 0; i_1 < path.length; i_1++) {
                          if (path[i_1] === this)
                              return;
                          if (path[i_1].nodeName === "#document")
                              return;
                          if (NodeListToArray(this.querySelectorAll(data.ele)).indexOf(path[i_1]) >= 0) {
                              data.fn(path[i_1], ev);
                          }
                      }
                  });
              });
          })(data);
      }
      else { //没有代理元素的情况
          if (/\[object HTML.*Element\]/.test(events))
              events = [events];
          (function (data) {
              LoopBinding(events, function (i) {
                  addEvent(events[i], data.events, function (e) {
                      var ev = e || event$1;
                      var path = eventsPath(ev);
                      data.fn(path, ev);
                  });
              });
          })(data);
      }
  }
  /**
   * 兼容 e.path方法
   * @param {Event} e 需要获取的指针
   */
  function eventsPath(e) {
      var ev = e || event$1;
      if (ev.path || ev.composedPath)
          return ev.path || (ev.composedPath && ev.composedPath());
      var Ary = [];
      var ele = ev.target || ev.srcElement;
      while (ele) {
          Ary.push(ele);
          ele = ele.parentElement;
      }
      return Ary;
  }
  /**
   * 获取指定的所有对象
   * @param {String} str 元素的字符串名称
   * @return {Array<Element>} 返回对象的数组
   */
  function dom(str) {
      if (!str || str.length <= 0)
          return "";
      if (/\[object HTML.*Element\]/.test(Object.prototype.toString.call(str)))
          return str;
      if (isString(str)) {
          if (str === "window")
              return window;
          if (str === "document")
              return document;
          if (str.indexOf('[') >= 0 && str.indexOf(']') > 0) {
              var strAry = getTagName(str.slice(str.indexOf('[')));
              if (strAry[1] !== null) {
                  var strValue = "'" + strAry[1] + "'";
                  str = str.slice(0, str.indexOf('[')) + "[" + strAry[0] + "=" + strValue + "]";
              }
          }
          return document.querySelectorAll(str);
      }
      else {
          return str;
      }
  }

  var cn = {
      index: {
          error: "已经存在改方法名称"
      },
      httprequest: {
          timeOut: "请求超时",
          noAuthority: "没有权限",
          parameterError: '参数有误'
      },
      dom: {
          throwWhitespace: "类具有非法空格字符",
          notElement: "不是元素"
      },
      select: {
          prompt: "请选择"
      },
      proportion: {
          noImg: "imageUrl参数不正确",
          noParentEle: "容器元素不正确"
      }
  };

  /**
   * 是否是元素
   * @param {any} value 元素
   */
  function isEl(value) {
      return value && isObject(value) && value.nodeType === 1;
  }
  /**
     * 判断是否是文本
     * @param {any} value 内容
     */
  function isTextNode(value) {
      return isObject(value) && value.nodeType === 3;
  }
  /**
   * 传一个元素
   * @param {String} tagName 标签
   * @param properties 标签里面的文本内容
          {
              className: 'vjs-seek-to-live-text',
              innerHTML: this.localize('LIVE')
          }
   * @param {Object} attributes  添加属性
   * @param {Array<Element> | Element} content 标签里面添加元素
   * @return {Element} 返回添加的元素
   *
   * @or
   * 只传入一个参数
   * @param {String} tagName html代码
   * @return {Element} 返回需要创建的html代码的元素
   * @example
          createEl("<div>adsffadf</div>")
   */
  function createEl(tagName) {
      if (tagName === void 0) { tagName = 'div'; }
      var arg = [];
      for (var _i = 1; _i < arguments.length; _i++) {
          arg[_i - 1] = arguments[_i];
      }
      if (arg.length === 0) {
          var ele = document.createElement("div");
          ele.innerHTML = tagName;
          return ele.firstElementChild;
      }
      else {
          var properties_1 = arg[0] || {};
          var attributes_1 = arg[1] || {};
          var content = arg[2];
          var el_1 = document.createElement(tagName);
          Object.getOwnPropertyNames(properties_1).forEach(function (propName) {
              var val = properties_1[propName];
              if (propName === 'textContent') {
                  textContent(el_1, val);
              }
              else {
                  el_1[propName] = val;
              }
          });
          Object.getOwnPropertyNames(attributes_1).forEach(function (attrName) {
              el_1.setAttribute(attrName, attributes_1[attrName]);
          });
          if (content) {
              appendContent(el_1, content);
          }
          return el_1;
      }
  }
  /**
   * 添加文本内容的兼容处理
   * @param {Element} el 需要添加文本的元素
   * @param {String} text 添加的文本
   * @return {Element} 元素
   */
  function textContent(el, text) {
      if (typeof el.textContent === 'undefined') {
          el.innerText = text;
      }
      else {
          el.textContent = text;
      }
      return el;
  }
  /**
   * 添加元素
   * @param {Element} el 父元素
   * @param {Array<Element> | Element} content 添加的元素
   * @return {Element} 父元素
   */
  function appendContent(el, content) {
      normalizeContent(content).forEach(function (node) { return el.appendChild(node); });
      return el;
  }
  /**
   * 这是一个混合值，描述要注入到DOM中的内容
   * 通过某种方法。它可以是以下类型:
   * 输入     | 描述
   * string   | 值将被规范化为一个文本节点。
   * Element  | 值将按原样接受。
   * TextNode | 值将按原样接受。
   * Array    | 一维数组，包含字符串、元素、文本节点或函数。这些函数应该返回字符串、元素或文本节点(任何其他返回值，如数组，都将被忽略)。
   * Function |一个函数，它期望返回一个字符串、元素、文本节点或数组——上面描述的任何其他可能的值。这意味着内容描述符可以是返回函数数组的函数，但是这些二级函数必须返回字符串、元素或文本节点
   *
   * 规范化最终插入到DOM中的内容
   * 这允许广泛的内容定义方法，但有助于保护
   * 避免陷入简单编写“innerHTML”的陷阱，这是可能的成为XSS关注的对象。
   *
   * 元素的内容可以以多种类型传递
   * 组合，其行为如下:
   * @param {module:dom~ContentDescriptor} content
   * @return {Array}
   */
  function normalizeContent(content) {
      if (typeof content === 'function') {
          content = content();
      }
      return (Array.isArray(content) ? content : [content]).map(function (value) {
          if (typeof value === 'function') {
              value = value();
          }
          if (isEl(value) || isTextNode(value)) {
              return value;
          }
          if (typeof value === 'string' && (/\S/).test(value)) {
              return document.createTextNode(value);
          }
      }).filter(function (value) { return value; });
  }
  /**
   * 显示当前元素
   * @param {Element|NodeList | Array<Element>} ele 需要显示的元素
   * @return {Element|NodeList | Array<Element>} 返回当前元素
   */
  function show(ele) {
      var e = ele;
      var type = getDataType(ele);
      switch (type) {
          case "[object String]":
          case "[object NodeList]":
          case "[object Array]":
              for (var i = 0; i < e.length; i++) {
                  if (computedStyle(e[i], "display") === "none")
                      e[i].style.display = "block";
              }
              break;
          default:
              if (/\[object HTML.*Element\]/.test(type)) {
                  if (computedStyle(ele, "display") === "none")
                      ele.style.display = "block";
              }
              else {
                  throw new Error("" + cn.dom.notElement);
              }
      }
      return ele;
  }
  /**
   * 隐藏当前元素
   * @param {Element|NodeList | Array<Element>} ele 需要隐藏的元素
   * @return {Element|NodeList | Array<Element>} 返回当前元素
   */
  function hide(ele) {
      var e = ele;
      var type = getDataType(ele);
      switch (type) {
          case "[object String]":
          case "[object NodeList]":
          case "[object Array]":
              for (var i = 0; i < e.length; i++) {
                  if (computedStyle(e[i], "display") !== "none")
                      e[i].style.display = "none";
              }
              break;
          default:
              if (/\[object HTML.*Element\]/.test(type)) {
                  if (computedStyle(ele, "display") !== "none")
                      ele.style.display = "none";
              }
              else {
                  throw new Error("" + cn.dom.notElement);
              }
      }
      return ele;
  }
  /**
   * 当前元素的同辈元素
   * @param {string | Element} ele 当前元素
   * @param {Function} callback 每个元素的回调方法
   * @return {Array<Element>} 返回对象数组
   * @example
   *    fx.siblings("sss" | document.querySelector("div") | document.querySelectorAll("div"))
   */
  function siblings(ele, callback) {
      var e = ele;
      var r = [];
      var type = getDataType(ele);
      switch (type) {
          case "[object String]":
              e = document.querySelector(ele);
              break;
          case "[object NodeList]":
              e = ele[0];
              break;
          default:
              if (/\[object HTML.*Element\]/.test(type)) {
                  e = ele;
              }
              else {
                  throw new Error("" + cn.dom.notElement);
              }
      }
      var n = e.parentNode.firstChild;
      for (; n; n = n.nextSibling) {
          if (n.nodeType === 1 && n !== e) {
              callback && callback(n);
              r.push(n);
          }
      }
      return r;
  }
  /**
   * 删除元素 兼容IE
   * @param {Element} ele 需要删除的元素
   */
  function remove(ele) {
      if (ele.removeNode) {
          ele.removeNode(true);
      }
      else {
          ele.remove();
      }
  }

  var prevClick = "prevClick";
  var nextClick = "nextClick";
  var closeClick = "closeClick";
  var imgResize = "imgResize";
  var sImgResize = "sImgResize";
  var imgZoomFn = "imgZoomFn";
  var mouseDown = "mouseDown";
  var videoResize = "videoResize";
  var onresize = window.onresize;
  var SET_IMAGE_PREVIEW_OBG = {
      sinpleImgPreviewKey: true,
      imgPreviewKey: true,
      videoPreviewKey: true,
      SImgPreviewBoxBg: "sImgViewerBoxBg",
      SImgPreviewBox: "sImgViewerBox",
      SImgPreviewClose: "sImgViewerClose",
      SImgPreviewPrev: "sImgViewerPrev",
      SImgPreviewNext: "sImgViewerNext",
      SImgPreviewTitle: "sImgViewerTitleCont",
      SImgPreviewId: "sFullResImgViewer",
      SImgPreviewTitleBtn: "sImgTitleBtn",
      imgPreviewBoxBg: "imgViewerBoxBg",
      imgPreviewBox: "imgViewerBox",
      imgPreviewId: "fullResImgViewer",
      imgPreviewClose: "imgViewerClose",
      imgPreviewPrev: "imgViewerPrev",
      imgPreviewNext: "imgViewerNext",
      imgPreviewBig: "imgViewerBig",
      imgPreviewSmall: "imgViewerSmall",
      imgPreviewTitle: "imgViewerTitleCont",
      imgPreviewTitleBtn: "imgTitleBtn",
      videoPreviewBoxBg: "videoViewerBoxBg",
      videoPreviewBox: "videoViewerBox",
      videoPreviewClose: "videoViewerClose",
      imgPreviewWidth: window.innerWidth,
      imgPreviewHeight: window.innerHeight,
      previewEvents: installEvents(),
  };
  function createPreviewDom(key, titleUp, closeBgImg) {
      var imgHtml = null;
      var imgBoxBg = null;
      var titleBtn = titleUp ? "<div id=\"" + (key === "simg" ? "sImgTitleBtn" : "imgTitleBtn") + "\" \n                                data-type=\"1\" style=\"height:52px;position:absolute;margin:0;cursor:pointer;line-height:70px;padding:0 10px;z-index:2;\">\n                                <img style=\"width:30px;transform:rotate(180deg);-ms-transform:rotate(180deg);-moz-transform:rotate(180deg);-webkit-transform:rotate(180deg);-o-transform:rotate(180deg)\" src=\"https://imgs.wbp5.com/api/secrecymaster/html_up/2018/10/20181029154606401.png\"/>\n                            </div>" : "";
      if (key === "simg" && SET_IMAGE_PREVIEW_OBG.sinpleImgPreviewKey) {
          imgHtml = createEl("div", {
              id: "sImgViewerBox",
              innerHTML: "<div id=\"sImgViewerList\">\n                            <div>\n                                <div id=\"sImgViewerClose\">close</div>\n                                <img id=\"sFullResImgViewer\" src=\"\" style=\"display:none;\" />\n                                <div id=\"sImgViewerTitleCont\"></div>\n                                " + titleBtn + "\n                            </div>\n                            <div id=\"sImgTitleContBg\" style=\"display:none\"></div>\n                        </div>\n                        <div id=\"sImgViewerPrev\" style=\"display:none;position:fixed;width:10%;height:100%;cursor:pointer;\">prev</div>\n                        <div id=\"sImgViewerNext\" style=\"display:none;position:fixed;width:10%;height:100%;cursor:pointer;\">next</div>"
          });
          imgBoxBg = createEl("div", {
              id: "sImgViewerBoxBg"
          });
          imgHtml.style.fontSize = "14px";
          imgHtml.style.display = "none";
          imgBoxBg.style.display = "none";
          sImgAddEventFn(imgHtml, imgBoxBg, titleUp);
      }
      else if (key === "img" && SET_IMAGE_PREVIEW_OBG.imgPreviewKey) {
          imgHtml = createEl("div", {
              id: "imgViewerBox",
              innerHTML: "<div id=\"imgViewerList\">\n                            <div>\n                                <div id=\"imgViewerClose\">close</div>\n                                <div id=\"imgViewerBig\"></div>\n                                <div id=\"imgViewerSmall\"></div>\n                                <img id=\"fullResImgViewer\" src=\"\" style=\"display:none;\" />\n                                <div id=\"imgViewerTitleCont\"></div>\n                                " + titleBtn + "\n                            </div>\n                            <div id=\"imgViewerTitleContBg\" style=\"display:none\"></div>\n                        </div>\n                        <div id=\"imgViewerPrev\" style=\"display:none;position:fixed;width:10%;height:100%;cursor:pointer;\">prev</div>\n                        <div id=\"imgViewerNext\" style=\"display:none;position:fixed;width:10%;height:100%;cursor:pointer;\">next</div>"
          });
          imgBoxBg = createEl("div", {
              id: "imgViewerBoxBg"
          });
          imgHtml.style.fontSize = "14px";
          imgHtml.style.display = "none";
          imgBoxBg.style.display = "none";
          imgAddEventFn(imgHtml, imgBoxBg, titleUp);
      }
      else if (key === "video" && SET_IMAGE_PREVIEW_OBG.videoPreviewKey) {
          var closeStr = closeBgImg ? "<img style=\"width:30px;display:block;\" src=\"" + closeBgImg + "\" />" : 'close';
          imgHtml = createEl("div", {
              id: "videoViewerBox",
              innerHTML: "<div id=\"videoViewerClose\" style=\"position:absolute;top:-25px;right:-25px;cursor:pointer;border-radius:50%;background:rgba(0,0,0,0.5);\">" + closeStr + "</div>"
          });
          imgBoxBg = createEl("div", {
              id: "videoViewerBoxBg"
          });
          imgHtml.style.display = "none";
          imgBoxBg.style.display = "none";
          videoAddEventFn(imgHtml, imgBoxBg);
      }
  }
  var imgMagnificationFn = /** @class */ (function () {
      function imgMagnificationFn(options) {
          this.$win = window.parent.window || window; //window元素
          //body:HTMLElement = document.querySelector("body")//body元素
          this.index = 0; //当前图片的索引
          this.imgUrlArray = []; //存放图片地址数组
          this.imgTitleArray = []; //存放图片标题数组
          this.ImgIndex = {};
          this.scrollNum = 1; //图片缩放倍数
          var that = this;
          that.settings = options;
          that.parentEle = that.settings.parentEle; //父级容器元素
          if (!that.settings.parentEle)
              return;
          that.init();
      }
      imgMagnificationFn.prototype.init = function () {
          var that = this;
          switch (that.settings.key) {
              case "video":
                  that.videoInit();
                  break;
              case "simg":
                  that.sImgInit();
                  break;
              case "img":
                  that.imgInit();
                  break;
          }
      };
      imgMagnificationFn.prototype.getSImgDomList = function () {
          this.domList = {
              $imgID: document.body.querySelector("#" + SET_IMAGE_PREVIEW_OBG.SImgPreviewId),
              $imgIDTitle: document.body.querySelector("#" + SET_IMAGE_PREVIEW_OBG.SImgPreviewTitle),
              $imgPrev: document.body.querySelector("#" + SET_IMAGE_PREVIEW_OBG.SImgPreviewPrev),
              $imgNext: document.body.querySelector("#" + SET_IMAGE_PREVIEW_OBG.SImgPreviewNext),
              $imgIDClose: document.body.querySelector("#" + SET_IMAGE_PREVIEW_OBG.SImgPreviewClose),
              $imgBoxBg: document.body.querySelector("#" + SET_IMAGE_PREVIEW_OBG.SImgPreviewBoxBg),
              $imgBox: document.body.querySelector("#" + SET_IMAGE_PREVIEW_OBG.SImgPreviewBox),
              $titleBtn: document.body.querySelector("#" + SET_IMAGE_PREVIEW_OBG.SImgPreviewTitleBtn),
          };
      };
      imgMagnificationFn.prototype.getImgDomList = function () {
          this.domList = {
              $imgID: document.body.querySelector("#" + SET_IMAGE_PREVIEW_OBG.imgPreviewId),
              $imgIDTitle: document.body.querySelector("#" + SET_IMAGE_PREVIEW_OBG.imgPreviewTitle),
              $imgPrev: document.body.querySelector("#" + SET_IMAGE_PREVIEW_OBG.imgPreviewPrev),
              $imgNext: document.body.querySelector("#" + SET_IMAGE_PREVIEW_OBG.imgPreviewNext),
              $imgIDClose: document.body.querySelector("#" + SET_IMAGE_PREVIEW_OBG.imgPreviewClose),
              $imgBoxBg: document.body.querySelector("#" + SET_IMAGE_PREVIEW_OBG.imgPreviewBoxBg),
              $imgBox: document.body.querySelector("#" + SET_IMAGE_PREVIEW_OBG.imgPreviewBox),
              $bigBox: document.body.querySelector("#" + SET_IMAGE_PREVIEW_OBG.imgPreviewBig),
              $smallBox: document.body.querySelector("#" + SET_IMAGE_PREVIEW_OBG.imgPreviewSmall),
              $titleBtn: document.body.querySelector("#" + SET_IMAGE_PREVIEW_OBG.imgPreviewTitleBtn),
          };
      };
      imgMagnificationFn.prototype.getVideoDomList = function () {
          this.domList = {
              $videoIDClose: document.body.querySelector("#" + SET_IMAGE_PREVIEW_OBG.videoPreviewClose),
              $videoBoxBg: document.body.querySelector("#" + SET_IMAGE_PREVIEW_OBG.videoPreviewBoxBg),
              $videoBox: document.body.querySelector("#" + SET_IMAGE_PREVIEW_OBG.videoPreviewBox),
          };
      };
      imgMagnificationFn.prototype.sImgInit = function () {
          var that = this;
          that.getSImgDomList();
          on({
              agent: that.parentEle,
              events: "click",
              ele: "[data-viewer]",
              fn: function (dom, ev) {
                  var bindKey = true;
                  if (that.settings.clickCallback)
                      bindKey = that.settings.clickCallback.call(that, dom, ev);
                  if (!bindKey)
                      return;
                  SET_IMAGE_PREVIEW_OBG.previewEvents.remove(prevClick);
                  SET_IMAGE_PREVIEW_OBG.previewEvents.remove(nextClick);
                  SET_IMAGE_PREVIEW_OBG.previewEvents.remove(closeClick);
                  SET_IMAGE_PREVIEW_OBG.previewEvents.remove(sImgResize);
                  SET_IMAGE_PREVIEW_OBG.previewEvents.listen(prevClick, function () {
                      that.prevClick.call(that);
                  });
                  SET_IMAGE_PREVIEW_OBG.previewEvents.listen(nextClick, function () {
                      that.nextClick.call(that);
                  });
                  SET_IMAGE_PREVIEW_OBG.previewEvents.listen(closeClick, function () {
                      that.closeClick.call(that);
                  });
                  SET_IMAGE_PREVIEW_OBG.previewEvents.listen(sImgResize, function () {
                      that.onresize.call(that);
                  });
                  that.getImgFn(dom, ev);
              }
          });
      };
      imgMagnificationFn.prototype.imgInit = function () {
          var that = this;
          that.getImgDomList();
          on({
              agent: that.parentEle,
              events: "click",
              ele: "[data-viewer]",
              fn: function (dom, ev) {
                  var bindKey = true;
                  if (that.settings.clickCallback)
                      bindKey = that.settings.clickCallback.call(that, dom, ev);
                  if (!bindKey)
                      return;
                  SET_IMAGE_PREVIEW_OBG.previewEvents.remove(prevClick);
                  SET_IMAGE_PREVIEW_OBG.previewEvents.remove(nextClick);
                  SET_IMAGE_PREVIEW_OBG.previewEvents.remove(closeClick);
                  SET_IMAGE_PREVIEW_OBG.previewEvents.remove(imgResize);
                  SET_IMAGE_PREVIEW_OBG.previewEvents.remove(imgZoomFn);
                  SET_IMAGE_PREVIEW_OBG.previewEvents.remove(mouseDown);
                  SET_IMAGE_PREVIEW_OBG.previewEvents.listen(prevClick, function () {
                      that.prevClick.call(that);
                  });
                  SET_IMAGE_PREVIEW_OBG.previewEvents.listen(nextClick, function () {
                      that.nextClick.call(that);
                  });
                  SET_IMAGE_PREVIEW_OBG.previewEvents.listen(closeClick, function () {
                      that.closeClick.call(that);
                  });
                  SET_IMAGE_PREVIEW_OBG.previewEvents.listen(imgResize, function () {
                      that.onresize.call(that);
                  });
                  SET_IMAGE_PREVIEW_OBG.previewEvents.listen(imgZoomFn, function (e, type) {
                      that.imgZoomFn.call(that, e, type);
                  });
                  // SET_IMAGE_PREVIEW_OBG.previewEvents.listen(imgZoomFn, function (e:any) {
                  //     that.imgZoomFn.call(that,e)
                  // })
                  SET_IMAGE_PREVIEW_OBG.previewEvents.listen(mouseDown, function (e) {
                      that.mouseDown.call(that, e);
                  });
                  that.getImgFn(dom, ev);
              }
          });
      };
      imgMagnificationFn.prototype.videoInit = function () {
          var that = this;
          that.getVideoDomList();
          on({
              events: "click",
              ele: that.parentEle,
              fn: function (dom, ev) {
                  var bindKey = true;
                  if (that.settings.clickCallback)
                      bindKey = that.settings.clickCallback.call(that, dom, ev);
                  if (!bindKey)
                      return;
                  SET_IMAGE_PREVIEW_OBG.previewEvents.remove(videoResize);
                  SET_IMAGE_PREVIEW_OBG.previewEvents.listen(videoResize, function () {
                      that.videoResize.call(that);
                  });
                  var src = null;
                  if (ev.target.getAttribute("data-viewer")) {
                      src = ev.target.getAttribute("data-viewer");
                  }
                  else {
                      var domList = siblings(ev.target);
                      for (var i = 0; i < domList.length; i++) {
                          if (domList[i].getAttribute("data-viewer")) {
                              src = domList[i].getAttribute("data-viewer");
                          }
                      }
                  }
                  if (!src)
                      return;
                  var videoDom = createEl("video", {});
                  videoDom.src = src;
                  videoDom.loop = "loop";
                  videoDom.autoplay = "autoplay";
                  videoDom.controls = "controls";
                  videoDom.style.display = "block";
                  videoDom.style.width = "100%";
                  that.domList.$videoBox.style.width = that.settings.videoWidth + "px";
                  that.domList.$videoBox.appendChild(videoDom);
                  show(that.domList.$videoBox);
                  show(that.domList.$videoBoxBg);
              }
          });
      };
      imgMagnificationFn.prototype.getImgFn = function (dom, ev) {
          var that = this;
          // that._allIndex = that.settings.parentEle.querySelectorAll("img[data-viewer]").length;//图片的长度
          var e = ev || event;
          var ele = e.target || e.srcElement;
          var eleItem = ele.getAttribute("data-item");
          that._allIndex = eleItem ? that.settings.parentEle.querySelectorAll("img[data-item='" + eleItem + "']").length : that.settings.parentEle.querySelectorAll("img[data-viewer]").length; //图片的长度
          if (!ele.getAttribute("data-viewer") && ele.querySelectorAll("[data-viewer]").length <= 0) {
              return false;
          }
          if (e && e.preventDefault) {
              ev.preventDefault();
          }
          else {
              window.event.returnValue = false;
          }
          if (ele.nodeName === "INPUT") {
              return false;
          }
          var imgMaxUrl = ele.getAttribute("href") || ele.getAttribute("data-viewer") || ele.getAttribute("src");
          // that.index = index(ele);
          SET_IMAGE_PREVIEW_OBG.imgPreviewWidth = that.$win.innerWidth;
          SET_IMAGE_PREVIEW_OBG.imgPreviewHeight = that.$win.innerHeight;
          that.getImgOrTitle(eleItem);
          that.index = that.ImgIndex[ele.getAttribute('data-imgindex')];
          that.imgClick(imgMaxUrl);
      };
      imgMagnificationFn.prototype.getImgOrTitle = function (item) {
          var that = this, i = 0;
          that.imgUrlArray = [];
          that.imgTitleArray = [];
          that.ImgIndex = {};
          each(NodeListToArray(that.parentEle.querySelectorAll('img')), function (value, index) {
              if (value.getAttribute("data-viewer")) {
                  if (!item || value.getAttribute("data-item") === item) {
                      var $this = value, imgMax = [], _title_text = $this.getAttribute("title") || "", _realIndex = i + 1, _title_content = _title_text ? " <p style=\"margin: 5px;\"><span style=\"word-break:break-all\">" + _title_text + "</span></p>" : "", _title_style = _title_text ? "position:absolute;margin:0;top:0;left:0" : "margin:5px auto;text-align:center;", _title = "<div style=\"position:relative;" + (that.settings.titleUp && _title_text ? "padding:0 40px 0 70px;" : _title_text ? "padding-left:70px;" : that.settings.titleUp ? "padding-right:40px" : "") + "\">\n                                <p style=\"" + _title_style + "\">\n                                    <span style=\"color: red; font-size: 28px; font-style: italic;\">" + _realIndex + "</span>\n                                    <em style=\"font-style: italic; margin-left: 3px; margin-right: 1px; font-size: 24px;\">|</em>\n                                    <span style=\"position:relative;top:5px;font-style: italic;\">" + that._allIndex + "</span>\n                                </p>\n                                " + _title_content + "\n                            </div>", imgurl = $this.getAttribute("data-viewer") || $this.getAttribute("src");
                      $this.setAttribute('data-imgindex', i + "");
                      imgMax[i] = new Image();
                      imgMax[i].src = imgurl;
                      that.ImgIndex[i] = i;
                      i++;
                      that.imgUrlArray.push(imgurl);
                      that.imgTitleArray.push(_title);
                  }
              }
          });
      };
      imgMagnificationFn.prototype.imgClick = function (imgUrl) {
          var that = this;
          var $imgID = that.domList.$imgID;
          setTimeout(function () { $imgID.setAttribute("src", imgUrl); }, 200);
          $imgID.onload = function () {
              if (that.settings.IsBox) {
                  show(that.domList.$imgBoxBg);
              }
              else {
                  hide(that.domList.$imgBoxBg);
              }
              switch (that.settings.key) {
                  case "simg":
                      that.sImgResize(imgUrl);
                      $imgID.onclick = function () { that.closeClick.call(that); };
                      $imgID.onmouseover = function () { show(that.domList.$imgIDClose); };
                      break;
                  case "img":
                      that.imgResize(imgUrl);
                      break;
              }
          };
      };
      imgMagnificationFn.prototype.videoResize = function () {
          var that = this;
          that.domList.$videoBox.style.maxWidth = SET_IMAGE_PREVIEW_OBG.imgPreviewWidth * 0.8 + "px";
          var videoBox = that.domList.$videoBox.getElementsByTagName("video")[0];
          videoBox.style.maxWidth = SET_IMAGE_PREVIEW_OBG.imgPreviewWidth * 0.8 + "px";
          videoBox.style.maxHeight = SET_IMAGE_PREVIEW_OBG.imgPreviewHeight * 0.8 + "px";
      };
      imgMagnificationFn.prototype.sImgResize = function (imgUrl) {
          var that = this;
          var imgSize = that.getImageSize(imgUrl);
          var top = imgSize.h >= SET_IMAGE_PREVIEW_OBG.imgPreviewHeight ? 5 : that.getTop(imgSize.h);
          var tw = (SET_IMAGE_PREVIEW_OBG.imgPreviewWidth - 100 <= imgSize.w) ? SET_IMAGE_PREVIEW_OBG.imgPreviewWidth - 100 : imgSize.w;
          var left = tw >= SET_IMAGE_PREVIEW_OBG.imgPreviewWidth ? 100 : that.getLeft(tw);
          // 设置图片样式
          that.domList.$imgID.style.maxWidth = imgSize.w + "px";
          that.domList.$imgID.style.maxHeight = imgSize.h + "px";
          that.domList.$imgID.style.position = "absolute";
          that.domList.$imgID.style.top = top + "px";
          that.domList.$imgID.style.left = left + "px";
          that.domList.$imgID.style.cursor = "zoom-out";
          that.domList.$imgID.style.cursor = "-webkit-zoom-out";
          that.domList.$imgID.style.display = "block";
          that.domList.$imgID.style.margin = "auto";
          // 关闭层样式
          that.domList.$imgIDClose.style.width = "20px";
          that.domList.$imgIDClose.style.height = "20px";
          that.domList.$imgIDClose.style.position = "absolute";
          that.domList.$imgIDClose.style.top = top - 10 + "px";
          that.domList.$imgIDClose.style.left = left + tw - 10 + "px";
          that.domList.$imgIDClose.style.zIndex = "20181115";
          that.domList.$imgIDClose.style.cursor = "pointer";
          that.domList.$imgIDClose.style.display = "none";
          that.domList.$imgIDClose.innerHTML = that.settings.closeBgImg ? '<img width="20" src="' + that.settings.closeBgImg + '" />' : 'close';
          // 图片标题层样式
          that.domList.$imgIDTitle.style.position = "absolute";
          that.domList.$imgIDTitle.style.color = "#fff";
          that.domList.$imgIDTitle.style.textAlign = "left";
          that.domList.$imgIDTitle.style.padding = "10px";
          that.domList.$imgIDTitle.style.boxSizing = "border-box";
          that.domList.$imgIDTitle.style.webkitBoxSizing = "border-box";
          that.domList.$imgIDTitle.style.overflow = "hidden";
          that.domList.$imgIDTitle.style.lineHeight = "22px";
          that.domList.$imgIDTitle.style.background = "rgba(0,0,0,0.5)";
          that.domList.$imgIDTitle.style.fontSize = "14px";
          that.domList.$imgIDTitle.innerHTML = that.imgTitleArray[that.index] || "";
          if (that.settings.titlePosition === 2) {
              that.domList.$imgIDTitle.style.width = "100%";
              that.domList.$imgIDTitle.style.bottom = "0px";
              that.domList.$imgIDTitle.style.left = "0";
              that.domList.$imgIDTitle.style.right = "0";
          }
          else {
              that.domList.$imgIDTitle.style.width = (imgSize.w) + "px";
              that.domList.$imgIDTitle.style.left = left + "px";
          }
          // 上一张层样式
          that.domList.$imgPrev.style.top = "0";
          that.domList.$imgPrev.style.left = "0";
          that.domList.$imgPrev.innerHTML = that.settings.prevBgImg ? '<div style="text-align: center; margin-top:' + (SET_IMAGE_PREVIEW_OBG.imgPreviewHeight - 60) / 2 + 'px ;"> <img width="20" height="60" src="' + that.settings.prevBgImg + '"> </div>' : 'prev';
          that.domList.$imgNext.style.top = "0";
          that.domList.$imgNext.style.right = "0";
          that.domList.$imgNext.innerHTML = that.settings.nextBgImg ? '<div style="text-align: center; margin-top:' + (SET_IMAGE_PREVIEW_OBG.imgPreviewHeight - 60) / 2 + 'px ;"> <img width="20" height="60" src="' + that.settings.nextBgImg + '"> </div>' : 'prev';
          try {
              if (!that.settings.isPaging) {
                  hide(that.domList.$imgPrev);
                  hide(that.domList.$imgNext);
                  hide(that.domList.$imgIDTitle.firstElementChild);
              }
              else {
                  show(that.domList.$imgPrev);
                  show(that.domList.$imgNext);
                  show(that.domList.$imgIDTitle.firstElementChild);
              }
          }
          catch (e) { }
          that.settings.isBox && show(that.domList.$imgBoxBg);
          show(that.domList.$imgBox);
          that.TitleHeight = that.domList.$imgIDTitle.offsetHeight ? that.domList.$imgIDTitle.offsetHeight : that.TitleHeight;
          if (that.settings.titlePosition === 1) {
              that.domList.$imgIDTitle.style.top = (top + imgSize.h - that.TitleHeight) + "px";
          }
          //收起标题层按钮样式
          if (that.settings.titleUp && that.settings.titlePosition === 1) {
              that.domList.$titleBtn.style.left = (left + imgSize.w - 50) + "px";
              that.domList.$titleBtn.style.top = (top + imgSize.h - that.TitleHeight) + "px";
          }
          else if (that.settings.titleUp && that.settings.titlePosition === 2) {
              that.domList.$titleBtn.style.right = "0px";
              that.domList.$titleBtn.style.bottom = (that.TitleHeight - 52) + "px";
          }
      };
      imgMagnificationFn.prototype.imgResize = function (imgUrl) {
          var that = this;
          var imgSize = that.getImageSize(imgUrl);
          var top = imgSize.h >= that.sHeight ? 5 : that.getTop(imgSize.h);
          var tw = (that.sWidth - 100 <= imgSize.w) ? that.sWidth - 100 : imgSize.w;
          var left = tw >= that.sWidth ? 100 : that.getLeft(tw);
          // 设置图片样式
          that.domList.$imgID.style.maxWidth = imgSize.w + "px";
          that.domList.$imgID.style.maxHeight = imgSize.h + "px";
          that.domList.$imgID.style.position = "absolute";
          that.domList.$imgID.style.top = top + "px";
          that.domList.$imgID.style.left = left + "px";
          that.domList.$imgID.style.cursor = "zoom-out";
          that.domList.$imgID.style.cursor = "-webkit-zoom-out";
          that.domList.$imgID.style.display = "block";
          that.domList.$imgID.style.margin = "auto";
          // 关闭层样式
          that.domList.$imgIDClose.style.wdith = "30px";
          that.domList.$imgIDClose.style.height = "30px";
          that.domList.$imgIDClose.style.position = "fixed";
          that.domList.$imgIDClose.style.top = "50px";
          that.domList.$imgIDClose.style.right = "50px";
          that.domList.$imgIDClose.style.zIndex = "20160904";
          that.domList.$imgIDClose.style.cursor = "pointer";
          that.domList.$imgIDClose.innerHTML = that.settings.closeBgImg ? "<img width=\"30px\" src=\"" + that.settings.closeBgImg + "\" />" : 'close';
          // 放大層樣式
          that.domList.$bigBox.style.wdith = "30px";
          that.domList.$bigBox.style.height = "30px";
          that.domList.$bigBox.style.position = "fixed";
          that.domList.$bigBox.style.top = "100px";
          that.domList.$bigBox.style.right = "50px";
          that.domList.$bigBox.style.zIndex = "20160904";
          that.domList.$bigBox.style.cursor = "pointer";
          that.domList.$bigBox.innerHTML = that.settings.bigBgImg ? "<img width=\"30px\" src=\"" + that.settings.bigBgImg + "\" />" : 'close';
          // 缩小層樣式
          that.domList.$smallBox.style.wdith = "30px";
          that.domList.$smallBox.style.height = "30px";
          that.domList.$smallBox.style.position = "fixed";
          that.domList.$smallBox.style.top = "150px";
          that.domList.$smallBox.style.right = "50px";
          that.domList.$smallBox.style.zIndex = "20160904";
          that.domList.$smallBox.style.cursor = "pointer";
          that.domList.$smallBox.innerHTML = that.settings.smallBgImg ? "<img width=\"30px\" src=\"" + that.settings.smallBgImg + "\" />" : 'close';
          // 上一张层样式
          that.domList.$imgPrev.style.top = "0";
          that.domList.$imgPrev.style.left = "0";
          that.domList.$imgPrev.innerHTML = that.settings.prevBgImg ? '<div style="text-align: center; margin-top:' + (SET_IMAGE_PREVIEW_OBG.imgPreviewHeight - 60) / 2 + 'px ;"> <img width="20" height="60" src="' + that.settings.prevBgImg + '"> </div>' : 'prev';
          that.domList.$imgNext.style.top = "0";
          that.domList.$imgNext.style.right = "0";
          that.domList.$imgNext.innerHTML = that.settings.nextBgImg ? '<div style="text-align: center; margin-top:' + (SET_IMAGE_PREVIEW_OBG.imgPreviewHeight - 60) / 2 + 'px ;"> <img width="20" height="60" src="' + that.settings.nextBgImg + '"> </div>' : 'prev';
          // 图片标题层样式
          that.domList.$imgIDTitle.style.position = "absolute";
          that.domList.$imgIDTitle.style.color = "#fff";
          that.domList.$imgIDTitle.style.textAlign = "left";
          that.domList.$imgIDTitle.style.padding = "10px";
          that.domList.$imgIDTitle.style.boxSizing = "border-box";
          that.domList.$imgIDTitle.style.webkitBoxSizing = "border-box";
          that.domList.$imgIDTitle.style.overflow = "hidden";
          that.domList.$imgIDTitle.style.lineHeight = "22px";
          that.domList.$imgIDTitle.style.background = "rgba(0,0,0,0.5)";
          that.domList.$imgIDTitle.style.fontSize = "14px";
          that.domList.$imgIDTitle.innerHTML = that.imgTitleArray[that.index] || "";
          if (that.settings.titlePosition === 2) {
              that.domList.$imgIDTitle.style.width = "100%";
              that.domList.$imgIDTitle.style.bottom = "0px";
              that.domList.$imgIDTitle.style.left = "0";
              that.domList.$imgIDTitle.style.right = "0";
          }
          else {
              that.domList.$imgIDTitle.style.width = (imgSize.w) + "px";
              that.domList.$imgIDTitle.style.left = left + "px";
          }
          try {
              if (!that.settings.isPaging) {
                  hide(that.domList.$imgPrev);
                  hide(that.domList.$imgNext);
                  hide(that.domList.$imgIDTitle.firstElementChild);
              }
              else {
                  show(that.domList.$imgPrev);
                  show(that.domList.$imgNext);
                  show(that.domList.$imgIDTitle.firstElementChild);
              }
          }
          catch (e) { }
          that.settings.isBox && show(that.domList.$imgBoxBg);
          show(that.domList.$imgBox);
          that.TitleHeight = that.domList.$imgIDTitle.offsetHeight ? that.domList.$imgIDTitle.offsetHeight : that.TitleHeight;
          if (that.settings.titlePosition === 1) {
              that.domList.$imgIDTitle.style.top = (top + imgSize.h - that.TitleHeight) + "px";
          }
          //收起标题层按钮样式
          if (that.settings.titleUp && that.settings.titlePosition === 1) {
              that.domList.$titleBtn.style.left = (left + imgSize.w - 50) + "px";
              that.domList.$titleBtn.style.top = (top + imgSize.h - 52) + "px";
          }
          else if (that.settings.titleUp && that.settings.titlePosition === 2) {
              that.domList.$titleBtn.style.right = "0px";
              that.domList.$titleBtn.style.bottom = "52px";
          }
          //$imgID.fadeIn();
      };
      imgMagnificationFn.prototype.getImageSize = function (url) {
          var that = this, maxWidth = SET_IMAGE_PREVIEW_OBG.imgPreviewWidth * 0.7, maxHeight = SET_IMAGE_PREVIEW_OBG.imgPreviewHeight - 50, 
          //w = o.find("#" + IMG_ID).width(),    
          //h = o.find("#" + IMG_ID).height();
          boxWidth = that.domList.$imgID.naturalWidth ? that.domList.$imgID.naturalWidth : that.domList.$imgID.width, boxHeight = that.domList.$imgID.naturalHeight ? that.domList.$imgID.naturalHeight : that.domList.$imgID.height, w = that.domList.$imgID.naturalWidth ? that.domList.$imgID.naturalWidth : that.domList.$imgID.width, h = that.domList.$imgID.naturalHeight ? that.domList.$imgID.naturalHeight : that.domList.$imgID.height;
          if (h > maxHeight) {
              w = (maxHeight * boxWidth / boxHeight);
              h = maxHeight;
          }
          if (w > maxWidth) {
              w = maxWidth;
              h = (maxWidth * boxHeight / boxWidth);
          }
          return { w: w, h: h };
      };
      // 获取图片顶部位置 返回顶部值
      imgMagnificationFn.prototype.getTop = function (h) {
          if (SET_IMAGE_PREVIEW_OBG.imgPreviewHeight > h) {
              return SET_IMAGE_PREVIEW_OBG.imgPreviewHeight / 2 - h / 2;
          }
          else {
              return 0;
          }
      };
      // 获取图片左边位置 返回左边值
      imgMagnificationFn.prototype.getLeft = function (w) {
          if (SET_IMAGE_PREVIEW_OBG.imgPreviewWidth > w) {
              return SET_IMAGE_PREVIEW_OBG.imgPreviewWidth / 2 - w / 2;
          }
          else {
              return 0;
          }
      };
      imgMagnificationFn.prototype.prevClick = function () {
          var that = this;
          if (that.index <= 0) {
              //return false
              that.index = that._allIndex;
          }
          var $imgID = that.domList.$imgID;
          hide($imgID);
          var imgUrl = that.imgUrlArray[--that.index];
          that.imgClick(imgUrl);
          if (that.settings.key === "img") {
              that.scrollNum = 1;
              that.imgZoomFn();
          }
      };
      imgMagnificationFn.prototype.nextClick = function () {
          var that = this;
          if (that.index >= that.imgUrlArray.length - 1) {
              //return false
              that.index = -1;
          }
          var $imgID = that.domList.$imgID;
          hide($imgID);
          var imgUrl = that.imgUrlArray[++that.index];
          that.imgClick(imgUrl);
          if (that.settings.key === "img") {
              that.scrollNum = 1;
              that.imgZoomFn();
          }
      };
      imgMagnificationFn.prototype.closeClick = function () {
          var that = this;
          hide(that.domList.$imgBoxBg);
          hide(that.domList.$imgBox);
          if (that.settings.key === "img") {
              that.scrollNum = 1;
          }
      };
      imgMagnificationFn.prototype.imgZoomFn = function (event, _num) {
          var that = this;
          var ev = event ? event : null;
          //let IsIeNine:boolean = (navigator.appName == "Microsoft Internet Explorer" && <any>navigator.appVersion.match(/9./i) == "9.") ? true : false;
          //var down = ev ? ev.deltaY : null; // 定义一个标志，当滚轮向下滚时，执行一些操作
          try {
              var down = _num ? _num : (ev.wheelDelta || -ev.detail);
          }
          catch (e) { }
          if (down > 0) {
              if (that.scrollNum <= 2.6 || that.domList.$imgID.offsetWidth * that.scrollNum < 1000) {
                  that.scrollNum += 0.2;
              }
              else {
                  try {
                      if (event && event.preventDefault) {
                          //阻止默认浏览器动作(W3C)
                          event.preventDefault();
                      }
                      else {
                          //IE中阻止函数器默认动作的方式 
                          window.event.returnValue = false;
                      }
                  }
                  catch (e) { }
                  // layer.msg("已经是最大了", { time: 1000, skin: "bgbg" })
                  console.log("已经是最大了");
              }
          }
          if (down < 0) {
              if (that.scrollNum > 0.3) {
                  that.scrollNum -= 0.2;
              }
              else {
                  try {
                      if (event && event.preventDefault) {
                          //阻止默认浏览器动作(W3C)
                          event.preventDefault();
                      }
                      else {
                          //IE中阻止函数器默认动作的方式 
                          window.event.returnValue = false;
                      }
                  }
                  catch (e) { }
                  // return layer.msg("已经是最小了", { time: 1000, skin: "bgbg" })
                  return console.log("已经是最小了");
              }
          }
          try {
              if (event && event.preventDefault) {
                  //阻止默认浏览器动作(W3C)
                  event.preventDefault();
              }
              else {
                  //IE中阻止函数器默认动作的方式 
                  window.event.returnValue = false;
              }
          }
          catch (e) { }
          // if (IsIeNine) {
          //     that.domList.$imgID.style.msTransform = "scale(" + that.scrollNum + ")";  /*IE*/
          // } else {
          //     that.domList.$imgID.style.transform = "scale(" + that.scrollNum + ")";
          // }
          that.domList.$imgID.style.Transform = "scale(" + that.scrollNum + ")";
          that.domList.$imgID.style.msTransform = "scale(" + that.scrollNum + ")";
          that.domList.$imgID.style.oTransform = "scale(" + that.scrollNum + ")";
          that.domList.$imgID.style.mozTransform = "scale(" + that.scrollNum + ")";
          that.domList.$imgID.style.webkitTransform = "scale(" + that.scrollNum + ")";
          return false;
      };
      imgMagnificationFn.prototype.mouseDown = function (e) {
          var that = this, ele = e.target, initX = e.clientX, initY = e.clientY, itemX = parseInt(ele.offsetLeft), itemY = parseInt(ele.offsetTop);
          var mousemoveFn = function () {
              var e = event || window.event;
              var curX = e.clientX, curY = e.clientY;
              ele.style.left = itemX + (curX - initX) + 'px';
              ele.style.top = itemY + (curY - initY) + 'px';
              if (e && e.preventDefault) {
                  //阻止默认浏览器动作(W3C)
                  e.preventDefault();
                  document.ondragstart = function () { return false; };
              }
              else {
                  //IE中阻止函数器默认动作的方式 
                  window.event.returnValue = false;
              }
              //e.stopPropagation();
              return false;
          };
          addEvent(that.domList.$imgBox, "mousemove", mousemoveFn);
          addEvent(that.domList.$imgBox, "mouseup", function () {
              removeEvent(that.domList.$imgBox, "mousemove", mousemoveFn);
          });
      };
      imgMagnificationFn.prototype.onresize = function (imgUrl) {
          var that = this;
          var $imgIDClose = that.domList.$imgIDClose;
          var $imgID = that.domList.$imgID;
          var imgSize = that.getImageSize(imgUrl);
          var top = imgSize.h >= SET_IMAGE_PREVIEW_OBG.imgPreviewHeight ? 5 : that.getTop(imgSize.h);
          var tw = (SET_IMAGE_PREVIEW_OBG.imgPreviewWidth - 100 <= imgSize.w) ? SET_IMAGE_PREVIEW_OBG.imgPreviewWidth - 100 : imgSize.w;
          var left = tw >= SET_IMAGE_PREVIEW_OBG.imgPreviewWidth ? 100 : that.getLeft(tw);
          // 设置图片样式
          $imgID.style.maxWidth = imgSize.w + "px";
          $imgID.style.maxHeight = imgSize.h + "px";
          $imgID.style.top = top + "px";
          $imgID.style.left = left + "px";
          //设置标题层样式
          if (that.settings.titlePosition === 1) {
              that.domList.$imgIDTitle.style.width = (imgSize.w) + "px";
              that.domList.$imgIDTitle.style.left = left + "px";
              that.domList.$imgIDTitle.style.top = (top + imgSize.h - that.TitleHeight) + "px";
              if (that.settings.titleUp) {
                  that.domList.$titleBtn.style.left = (left + imgSize.w - 50) + "px";
                  that.domList.$titleBtn.style.top = (top + imgSize.h - 52) + "px";
              }
          }
          // 关闭层样式
          if (that.settings.key === "simg") {
              $imgIDClose.style.top = top - 10 + "px";
              $imgIDClose.style.left = left + tw - 10 + "px";
          }
          // 上一张层样式
          that.domList.$imgPrev.style.top = "0";
          that.domList.$imgPrev.style.left = "0";
          that.domList.$imgPrev.innerHTML = that.settings.prevBgImg ? '<div style="text-align: center; margin-top:' + (SET_IMAGE_PREVIEW_OBG.imgPreviewHeight - 60) / 2 + 'px ;"> <img width="20" height="60" src="' + that.settings.prevBgImg + '"> </div>' : 'prev';
          that.domList.$imgNext.style.top = "0";
          that.domList.$imgNext.style.right = "0";
          that.domList.$imgNext.innerHTML = that.settings.nextBgImg ? '<div style="text-align: center; margin-top:' + (SET_IMAGE_PREVIEW_OBG.imgPreviewHeight - 60) / 2 + 'px ;"> <img width="20" height="60" src="' + that.settings.nextBgImg + '"> </div>' : 'prev';
      };
      return imgMagnificationFn;
  }());
  function sImgAddEventFn(imgHtml, imgBoxBg, titleUp) {
      document.body.appendChild(imgHtml);
      document.body.appendChild(imgBoxBg);
      SET_IMAGE_PREVIEW_OBG.sinpleImgPreviewKey = false;
      var $imgBoxBg = document.body.querySelector("#" + SET_IMAGE_PREVIEW_OBG.SImgPreviewBoxBg);
      var $imgBox = document.body.querySelector("#" + SET_IMAGE_PREVIEW_OBG.SImgPreviewBox);
      var $imgIDClose = document.body.querySelector("#" + SET_IMAGE_PREVIEW_OBG.SImgPreviewClose);
      var $imgPrev = document.body.querySelector("#" + SET_IMAGE_PREVIEW_OBG.SImgPreviewPrev);
      var $imgNext = document.body.querySelector("#" + SET_IMAGE_PREVIEW_OBG.SImgPreviewNext);
      imgStyle($imgBoxBg, $imgBox); //初始化样式
      addEvent($imgPrev, "click", function () {
          SET_IMAGE_PREVIEW_OBG.previewEvents.trigger("prevClick");
      });
      addEvent($imgNext, "click", function () {
          SET_IMAGE_PREVIEW_OBG.previewEvents.trigger("nextClick");
      });
      addEvent($imgIDClose, "click", function () {
          SET_IMAGE_PREVIEW_OBG.previewEvents.trigger("closeClick");
      });
      if (titleUp) {
          var $imgIDTitle_1 = document.body.querySelector("#" + SET_IMAGE_PREVIEW_OBG.SImgPreviewTitle);
          var $titleBtn = document.body.querySelector("#" + SET_IMAGE_PREVIEW_OBG.SImgPreviewTitleBtn);
          addEvent($titleBtn, "click", function () {
              if ($imgIDTitle_1.style.display === "none") {
                  var $imgBox_1 = document.body.querySelector("#" + SET_IMAGE_PREVIEW_OBG.SImgPreviewId);
                  var h = $imgBox_1.naturalHeight ? $imgBox_1.naturalHeight : $imgBox_1.height;
                  var top_1 = parseFloat($imgBox_1.style.top);
                  show($imgIDTitle_1);
                  var th = $imgIDTitle_1.naturalHeight ? $imgIDTitle_1.naturalHeight : $imgIDTitle_1.height;
                  $imgIDTitle_1.style.top = (top_1 + h - th) + "px";
                  this.style.background = "none";
                  this.children[0].style.transform = "rotate(180deg)";
                  this.children[0].style.msTransform = "rotate(180deg)";
                  this.children[0].style.mozTransform = "rotate(180deg)";
                  this.children[0].style.webkitTransform = "rotate(180deg)";
                  this.children[0].style.oTransform = "rotate(180deg)";
              }
              else {
                  hide($imgIDTitle_1);
                  this.style.background = "rgba(0,0,0,0.5)";
                  this.children[0].style.transform = "rotate(0)";
                  this.children[0].style.msTransform = "rotate(0)";
                  this.children[0].style.mozTransform = "rotate(0)";
                  this.children[0].style.webkitTransform = "rotate(0)";
                  this.children[0].style.oTransform = "rotate(0)";
              }
          });
      }
  }
  function imgAddEventFn(imgHtml, imgBoxBg, titleUp) {
      document.body.appendChild(imgHtml);
      document.body.appendChild(imgBoxBg);
      SET_IMAGE_PREVIEW_OBG.imgPreviewKey = false;
      var $imgBoxBg = document.body.querySelector("#" + SET_IMAGE_PREVIEW_OBG.imgPreviewBoxBg);
      var $imgBox = document.body.querySelector("#" + SET_IMAGE_PREVIEW_OBG.imgPreviewBox);
      var $imgIDClose = document.body.querySelector("#" + SET_IMAGE_PREVIEW_OBG.imgPreviewClose);
      var $imgPrev = document.body.querySelector("#" + SET_IMAGE_PREVIEW_OBG.imgPreviewPrev);
      var $imgNext = document.body.querySelector("#" + SET_IMAGE_PREVIEW_OBG.imgPreviewNext);
      var $imgBig = document.body.querySelector("#" + SET_IMAGE_PREVIEW_OBG.imgPreviewBig);
      var $imgSmall = document.body.querySelector("#" + SET_IMAGE_PREVIEW_OBG.imgPreviewSmall);
      var $imgId = document.body.querySelector("#" + SET_IMAGE_PREVIEW_OBG.imgPreviewId);
      imgStyle($imgBoxBg, $imgBox); //初始化样式
      addEvent($imgPrev, "click", function () {
          SET_IMAGE_PREVIEW_OBG.previewEvents.trigger("prevClick");
      });
      addEvent($imgNext, "click", function () {
          SET_IMAGE_PREVIEW_OBG.previewEvents.trigger("nextClick");
      });
      addEvent($imgIDClose, "click", function () {
          SET_IMAGE_PREVIEW_OBG.previewEvents.trigger("closeClick");
      });
      addEvent($imgBig, "click", function (e) {
          SET_IMAGE_PREVIEW_OBG.previewEvents.trigger("imgZoomFn", e, 1);
      });
      addEvent($imgSmall, "click", function (e) {
          SET_IMAGE_PREVIEW_OBG.previewEvents.trigger("imgZoomFn", e, -1);
          //scrollMouse(e, -1)
      });
      addEvent($imgId, "mousewheel", function (e) {
          SET_IMAGE_PREVIEW_OBG.previewEvents.trigger("imgZoomFn", e);
      });
      addEvent($imgId, "DOMMouseScroll", function (e) {
          SET_IMAGE_PREVIEW_OBG.previewEvents.trigger("imgZoomFn", e);
      });
      addEvent($imgId, "mousedown", function (e) {
          SET_IMAGE_PREVIEW_OBG.previewEvents.trigger("mouseDown", e);
      });
      if (titleUp) {
          var $imgIDTitle_2 = document.body.querySelector("#" + SET_IMAGE_PREVIEW_OBG.imgPreviewTitle);
          var $titleBtn = document.body.querySelector("#" + SET_IMAGE_PREVIEW_OBG.imgPreviewTitleBtn);
          addEvent($titleBtn, "click", function () {
              if ($imgIDTitle_2.style.display === "none") {
                  var $imgBox_2 = document.body.querySelector("#" + SET_IMAGE_PREVIEW_OBG.imgPreviewId);
                  var h = $imgBox_2.naturalHeight ? $imgBox_2.naturalHeight : $imgBox_2.height;
                  var top_2 = parseFloat($imgBox_2.style.top);
                  show($imgIDTitle_2);
                  var th = $imgIDTitle_2.clientHeight;
                  $imgIDTitle_2.style.top = (top_2 + h - th) + "px";
                  this.style.background = "none";
                  this.children[0].style.transform = "rotate(180deg)";
                  this.children[0].style.msTransform = "rotate(180deg)";
                  this.children[0].style.mozTransform = "rotate(180deg)";
                  this.children[0].style.webkitTransform = "rotate(180deg)";
                  this.children[0].style.oTransform = "rotate(180deg)";
              }
              else {
                  hide($imgIDTitle_2);
                  this.style.background = "rgba(0,0,0,0.5)";
                  this.children[0].style.transform = "rotate(0)";
                  this.children[0].style.msTransform = "rotate(0)";
                  this.children[0].style.mozTransform = "rotate(0)";
                  this.children[0].style.webkitTransform = "rotate(0)";
                  this.children[0].style.oTransform = "rotate(0)";
              }
          });
      }
  }
  function videoAddEventFn(imgHtml, imgBoxBg) {
      document.body.appendChild(imgHtml);
      document.body.appendChild(imgBoxBg);
      var $videoBoxBg = document.body.querySelector("#" + SET_IMAGE_PREVIEW_OBG.videoPreviewBoxBg);
      var $videoBox = document.body.querySelector("#" + SET_IMAGE_PREVIEW_OBG.videoPreviewBox);
      var $videoIDClose = document.body.querySelector("#" + SET_IMAGE_PREVIEW_OBG.videoPreviewClose);
      videoStyle($videoBoxBg, $videoBox); //初始化样式
      addEvent($videoIDClose, "click", function () {
          var dom = $videoBox.querySelector("video");
          remove(dom);
          hide($videoBoxBg);
          hide($videoBox);
      });
  }
  function imgStyle($imgBoxBg, $imgBox) {
      // 展示时的内容层样式
      $imgBox.style.position = "fixed";
      $imgBox.style.top = "0";
      $imgBox.style.left = "0";
      $imgBox.style.width = "100%";
      $imgBox.style.minHeight = SET_IMAGE_PREVIEW_OBG.imgPreviewHeight + "px";
      $imgBox.style.zIndex = "20160901";
      // 展示时的透明背景层样式
      $imgBoxBg.style.position = "fixed";
      $imgBoxBg.style.top = "0";
      $imgBoxBg.style.left = "0";
      $imgBoxBg.style.width = "100%";
      $imgBoxBg.style.height = "100%";
      $imgBoxBg.style.background = "#000";
      $imgBoxBg.style.opacity = "0.6";
      $imgBoxBg.style.zIndex = "20160900";
      $imgBoxBg.style.overflow = "hidden";
  }
  function videoStyle($videoBoxBg, $videoBox) {
      // 展示时的内容层样式
      $videoBox.style.position = "fixed";
      $videoBox.style.left = "50%";
      $videoBox.style.top = "50%";
      $videoBox.style.transform = "translate(-50%,-50%)";
      $videoBox.style.msTransform = "translate(-50%,-50%)";
      $videoBox.style.oTransform = "translate(-50%,-50%)";
      $videoBox.style.webkitTransform = "translate(-50%,-50%)";
      $videoBox.style.mozTransform = "translate(-50%,-50%)";
      $videoBox.style.zIndex = "20160901";
      // 展示时的透明背景层样式
      $videoBoxBg.style.position = "fixed";
      $videoBoxBg.style.top = "0";
      $videoBoxBg.style.left = "0";
      $videoBoxBg.style.width = "100%";
      $videoBoxBg.style.height = "100%";
      $videoBoxBg.style.background = "#000";
      $videoBoxBg.style.opacity = "0";
      $videoBoxBg.style.zIndex = "20160900";
      $videoBoxBg.style.overflow = "hidden";
  }
  window.onresize = function () {
      onresize && onresize();
      var sele = document.querySelector("#" + SET_IMAGE_PREVIEW_OBG.SImgPreviewBoxBg);
      var ele = document.querySelector("#" + SET_IMAGE_PREVIEW_OBG.imgPreviewBoxBg);
      var vele = document.querySelector("#" + SET_IMAGE_PREVIEW_OBG.videoPreviewBoxBg);
      SET_IMAGE_PREVIEW_OBG.imgPreviewWidth = window.innerWidth;
      SET_IMAGE_PREVIEW_OBG.imgPreviewHeight = window.innerHeight;
      if (ele) {
          ele.style.width = "100%";
          ele.style.height = "100%";
          try {
              SET_IMAGE_PREVIEW_OBG.previewEvents.trigger(imgResize, document.querySelector("#" + SET_IMAGE_PREVIEW_OBG.imgPreviewId).getAttribute("data-viewer"));
          }
          catch (e) { }
      }
      if (sele) {
          sele.style.width = "100%";
          sele.style.height = "100%";
          try {
              SET_IMAGE_PREVIEW_OBG.previewEvents.trigger(sImgResize, document.querySelector("#" + SET_IMAGE_PREVIEW_OBG.SImgPreviewId).getAttribute("data-viewer"));
          }
          catch (e) { }
      }
      if (vele) {
          vele.style.width = "100%";
          vele.style.height = "100%";
          SET_IMAGE_PREVIEW_OBG.previewEvents.trigger(videoResize);
      }
  };
  var imgPreview = function (options) {
      if (!options.parentEle)
          return;
      //初始化参数
      var optionObj = mergeOptions({}, {
          isPaging: true,
          key: "img",
          prevBgImg: "https://imgs.wbp5.com/api/secrecymaster/html_up/2018/10/20181009152904076.png",
          nextBgImg: "https://imgs.wbp5.com/api/secrecymaster/html_up/2018/10/20181009152928779.png",
          closeBgImg: "https://imgs.wbp5.com/api/secrecymaster/html_up/2019/11/20191112190957661.png",
          bigBgImg: "https://imgs.wbp5.com/api/secrecymaster/html_up/2019/11/20191112192601224.png",
          smallBgImg: "https://imgs.wbp5.com/api/secrecymaster/html_up/2019/11/20191112192603317.png",
          parentEle: "",
          IsBox: true,
          titleUp: false,
          titlePosition: 1,
          videoWidth: 1170,
      }, options);
      createPreviewDom(options.key, optionObj.titleUp, optionObj.closeBgImg); //生成预览框dom，注册事件
      var eleAry = Object.prototype.toString.call(options.parentEle) === "[object Array]" ? options.parentEle : [options.parentEle]; //判断传入的是不是数组如果不是则转为数组
      for (var i = 0; i < eleAry.length; i++) {
          var ele = eleAry[i];
          if (!/\[object HTML.*Element\]/.test(Object.prototype.toString.call(ele))) {
              ele = document.querySelector(ele);
          }
          if (!ele)
              break;
          var object = JSON.parse(JSON.stringify(optionObj));
          object.parentEle = ele;
          object.clickCallback = optionObj.clickCallback ? optionObj.clickCallback : null;
          new imgMagnificationFn(object);
      }
  };

  imgPreview({
      parentEle: document.getElementById("img_list"),
      key: "img",
      titleUp: true,
      clickCallback: function (dom, ev) {
          if (ev.target.parentNode.tagName === "A") {
              return false;
          }
          else {
              return true;
          }
      }
  });
  imgPreview({
      parentEle: document.getElementById("imgs"),
      key: "simg",
      titleUp: false,
      IsBox: false,
      titlePosition: 2,
      nextBgImg: "https://imgs.wbp5.com/api/secrecymaster/html_up/2020/1/20200113155738458.png",
      prevBgImg: "https://imgs.wbp5.com/api/secrecymaster/html_up/2020/1/20200113155730317.png",
      closeBgImg: "https://imgs.wbp5.com/api/secrecymaster/html_up/2018/12/20181214092752161.png"
  });
  imgPreview({
      parentEle: document.getElementById("video_box"),
      key: "video",
      videoWdith: 900,
  });
  setTimeout(function () {
      var img = document.createElement("img");
      img.src = "https://img.wbp5.com/upload/images/firstnews/2020/07/06/110109700.jpg";
      img.setAttribute("data-viewer", "https://img.wbp5.com/upload/images/firstnews/2020/07/06/110109700.jpg");
      img.setAttribute("data-item", "1");
      document.getElementById("img_list").appendChild(img);
  }, 10000);

})));
//# sourceMappingURL=index.js.map
