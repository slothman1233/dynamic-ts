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
  /**
   * 元素是否是str所值的元素
   * @param {Element} ele 比对的元素
   * @param {String} str  元素的字符串  #id   .class  aa[data-id=aa] [data-id]
   */
  function eleEqualStr(ele, str) {
      var eleString = str;
      //判断属性是否相同
      //判断 [data-id] [data-id=aa] 是否正确
      if (str.indexOf("[") >= 0 && str.indexOf("]") > 0) {
          var isb = onlyAttrbuite();
          if (!isb)
              return false;
          //[data-id] [data-id=aa]
          if (str.indexOf("[") == 0 && str.indexOf("]") === str.length - 1 && isb)
              return true;
          eleString = str.slice(0, str.indexOf("["));
      }
      //id的情况
      if (eleString.charAt(0) === "#" && ele.id === eleString.slice(1)) {
          return true;
          //class的情况
      }
      else if (eleString.charAt(0) === "." && hasClass(ele, eleString.slice(1))) {
          return true;
          //标签的情况
      }
      else if (ele.nodeName && ele.nodeName.toUpperCase() === str.toUpperCase()) {
          return true;
      }
      //判断 [data-id] [data-id=aa] 是否正确
      function onlyAttrbuite() {
          var ary = getTagName(str.slice(str.indexOf("[")));
          //[data-id]
          if (ele.getAttribute(ary[0]) && ary[1] === null)
              return true;
          // [data-id=aa]
          if (ary[1] && ele.getAttribute(ary[0]) && ele.getAttribute(ary[0]) === ary[1])
              return true;
          return false;
      }
      return false;
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
   * 类具有非法空格字符
   * @param {string} str 字符串
   * @return {boolean}
   */
  function throwIfWhitespace(str) {
      if ((/\s/).test(str)) {
          throw new Error("" + cn.dom.throwWhitespace);
      }
  }
  /**
   * 正则表达式化
   * @param {string} className 正则的匹配内容
   * @return {RegExp} 正则表达式对象
   */
  function classRegExp(className) {
      return new RegExp('(^|\\s)' + className + '($|\\s)');
  }
  /**
   * 检索元素的类中是否包含该类
   * @param {Element} element  查找的元素
   * @param {String} classToCheck 需要匹配的类
   * @return {boolean} true包含  false包含
   */
  function hasClass(element, classToCheck) {
      if (!element)
          return false;
      throwIfWhitespace(classToCheck);
      if (element.classList) {
          return element.classList.contains(classToCheck);
      }
      return classRegExp(classToCheck).test(element.className);
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
   * 向当前元素的之后插入一个元素节点
   * @param {Node} newEl 插入的节点
   * @param {Node} targetEl 当前的节点
   * @return {Node} 返回插入的节点
   */
  function insertAfter(newEl, targetEl) {
      var parentEl = targetEl.parentNode;
      if (parentEl.lastChild == targetEl) {
          parentEl.appendChild(newEl);
      }
      else {
          parentEl.insertBefore(newEl, targetEl.nextSibling);
      }
      // targetEl.insertAdjacentElement("afterEnd", newEl);
      return newEl;
  }
  /**
   * 向当前元素的之前插入一个元素节点
   * @param {Node} newEl 插入的节点
   * @param {Node} targetEl 当前的节点
   * @return {Node} 返回插入的节点
   */
  function insertBefore(newEl, targetEl) {
      // let parentEl = targetEl.parentNode;
      targetEl.insertAdjacentElement("beforeBegin", newEl);
      //parentEl.insertBefore(newEl, targetEl);
      return newEl;
  }
  /**
   * 返回指定的父级元素
   * @param {Element} ele 当前元素
   * @param {string} tag 返回元素的名
   * @return {Element | null} 返回指定的元素，没有则返回null
   */
  function parent(ele, tag) {
      if (!tag || tag.length <= 0)
          return null;
      var d = ele.parentElement;
      do {
          if (eleEqualStr(d, tag)) {
              return d;
          }
          if (d.nodeName === "HTML")
              return null;
          d = d.parentElement;
      } while (d);
      return null;
  }
  /**
   * 获取元素的偏移量 相对计算 相对于上一个定位元素的计算
   * @param {Node} Node 当前元素节点
   * @param {Element} ele 终止的节点
   * @return {object} {top:top,left:left}
        * @param {number} top 元素节点离顶部的距离
        * @param {number} left 元素节点离左部的距离
   */
  function getOffset(Node, ele) {
      var offset = { top: 0, left: 0 };
      offsets(Node, offset);
      function offsets(Node, offset) {
          if ((ele && Node === ele) || Node == document.body || !Node) {
              //当该节点为body节点时，结束递归        
              return offset;
          }
          offset.top += Node.offsetTop;
          offset.left += Node.offsetLeft;
          return offsets(Node.offsetParent, offset); //向上累加offset里的值
      }
      return offset;
  }
  /**
   * 获取元素偏移的滚动条距离 相对计算 相对于html的滚动条的距离
   * @param {Element} ele 当前元素
   * @return {object} {top:top,left:left}
        * @param {number} top 元素节点离顶部的滚动条距离
        * @param {number} left 元素节点离左部的滚动条距离
   */
  function AllScroll(ele) {
      var scroll = { left: 0, top: 0 };
      while (ele) {
          scroll.top += ele.scrollTop;
          scroll.left += ele.scrollLeft;
          ele = ele.parentElement;
      }
      return scroll;
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

  var dragsortFn = /** @class */ (function () {
      function dragsortFn(data) {
          this.data = { bodyMessage: [], Maxlevel: "1" };
          this.dragStartBol = false; //是否开始拖拽了
          this.scroll = { left: 0, top: 0 }; //滚动条Y轴的高度
          this.dragMoveL = true;
          this.thatPosition = [-1, -1]; //位置 [0]1是父级 2是子级   [1]1上面 2是下面
          if (data.bodyMessage.length <= 0)
              return;
          data.dragParent = Object.prototype.toString.call(data.dragParent) === "[object String]" ? document.querySelector(data.dragParent) : data.dragParent;
          var ele = data.dragParent;
          if (!ele)
              return;
          this.data.dragEle = Object.prototype.toString.call(data.dragEle) === "[object String]" ? data.dragEle : ".containe";
          this.data.Maxlevel = data.Maxlevel;
          this.data.bodyMessage = data.bodyMessage;
          this.data.dragEnd = data.dragEnd || function () { };
          this.data.dragParent = data.dragParent;
          this.data.dragLevel = data.dragLevel || "0";
          this.data.dragSelector = data.dragLevel == "0" ? ".containe" : data.dragLevel == "1" ? ".containe_head" : data.dragLevel == "2" ? ".containe_content" : this.data.dragEle;
          this.data.placeHolderTemplate = data.placeHolderTemplate || "<li></li>";
          ele.appendChild(this.getHtml());
          this.data.dragParent.querySelector("ul").style.position = "relative";
          this.addEvents();
      }
      dragsortFn.prototype.getHtml = function () {
          /**
           * 递归获取内容的元素
           * @param bodyMessage
           */
          function getHead(bodyMessage) {
              var that = this;
              var HTMLEle = document.createElement("ul");
              for (var i = 0; i < bodyMessage.length; i++) {
                  var data = bodyMessage[i];
                  var containe_head = createEl("div", {
                      className: "containe_head"
                  }, {}, [data.headEle]);
                  var containe_content = createEl("div", {
                      className: "containe_content"
                  }, {}, [data.contentEle]);
                  var containe = createEl("div", {
                      className: "containe"
                  }, {}, [containe_head, containe_content]);
                  var isdrag = data.isDrag == false ? false : true;
                  var li = createEl("li", {}, {}, [containe]);
                  li.setAttribute("data-id", data.id);
                  li.setAttribute("data-drag", "" + isdrag);
                  if (data.children) {
                      li.appendChild(getHead.call(that, data.children));
                  }
                  HTMLEle.appendChild(li);
              }
              return HTMLEle;
          }
          return getHead.call(this, this.data.bodyMessage);
      };
      //初始化填充元素
      dragsortFn.prototype.getfill = function () {
          var ele = createEl("div", {
              innerHTML: this.data.placeHolderTemplate
          });
          this.fillDom = ele.firstElementChild;
      };
      dragsortFn.prototype.addEvents = function () {
          var that = this;
          that.parentsEle = that.data.dragParent;
          var domDown = that.parentsEle.onmousedown;
          that.parentsEle.onmousedown = function (e) {
              domDown && domDown(e);
              that.domAll = that.NodeListToArray(that.data.dragParent.querySelectorAll(that.data.dragSelector));
              var ev = e || event;
              var path = eventsPath(ev);
              outerloop: for (var i = 0; i < path.length; i++) {
                  if (path[i].nodeName === "#document" || path[i] === this)
                      return;
                  for (var j = 0; j < that.domAll.length; j++) {
                      if (that.domAll[j] === path[i]) {
                          var ele = parent(that.domAll[j], "li");
                          if (!ele.getAttribute("data-drag") || ele.getAttribute("data-drag") === "false")
                              return;
                          that.thatdragEle = that.domAll[j];
                          that.dragStart.call(that, ev, ele);
                          break outerloop;
                      }
                  }
              }
              return false;
          };
          var documentMove = document.onmousemove;
          var documentUp = document.onmouseup;
          document.onmousemove = function (e) {
              documentMove && documentMove(e);
              if (!that.dragStartBol)
                  return;
              that.dragMove.call(that, e);
          };
          document.onmouseup = function (e) {
              documentUp && documentUp(e);
              if (!that.dragStartBol)
                  return;
              that.dragEnd.call(that, e);
          };
      };
      //推拽开始
      dragsortFn.prototype.dragStart = function (e, ele) {
          var that = this;
          var ev = e || event;
          that.thatDom = ele;
          that.thatPosition = [-1, -1];
          that.dragEleChildrenSize = that.ChildrenSize.call(that);
          hide(that.thatDom.lastElementChild);
          that.dragStartBol = true;
          this.getfill();
          that.domAll = that.getItem.call(that);
          var el = that.data.dragParent.querySelector("ul");
          var scroll = getOffset(that.thatDom, el);
          insertAfter(that.fillDom, that.thatDom);
          el.appendChild(that.thatDom);
          that.addCss.call(that, {
              position: "absolute",
              zIndex: "999",
              opacity: "0.8",
              cursor: "pointer",
              top: scroll.top + "px",
              left: scroll.left + "px"
          });
          that.disx = ev.clientX - parseInt(that.thatDom.style.left); //记录鼠标当前的位置
          that.disy = ev.clientY - parseInt(that.thatDom.style.top);
          that.parsentScrollLeft = that.parentsEle.scrollLeft;
          that.parsentScrollTop = that.parentsEle.scrollTop;
      };
      //推拽过程中
      dragsortFn.prototype.dragMove = function (e) {
          var event = e || event;
          var that = this;
          that.swapItems.call(that, event);
          var scrollLeft = that.parentsEle.scrollLeft - that.parsentScrollLeft;
          var scrollTop = that.parentsEle.scrollTop - that.parsentScrollTop;
          that.thatDom.style.left = event.clientX - that.disx + scrollLeft + "px";
          that.thatDom.style.top = event.clientY - that.disy + scrollTop + "px";
      };
      //推拽结束
      dragsortFn.prototype.dragEnd = function (e) {
          var that = this;
          that.dragStartBol = false;
          if (!this.domAll || this.domAll.indexOf(that.thatDom.querySelector(that.data.dragSelector)) === -1)
              return;
          show(that.thatDom.lastElementChild);
          that.addCss.call(that, {});
          insertAfter(that.thatDom, that.fillDom);
          remove(that.fillDom);
          that.data.dragEnd && that.data.dragEnd(that.thatdragEle, that.thatReplaceEle, that.thatPosition);
      };
      //样式添加
      dragsortFn.prototype.addCss = function (data) {
          this.thatDom.style.position = data.position || "";
          this.thatDom.style.zIndex = data.zIndex || "";
          this.thatDom.style.opacity = data.opacity || "";
          this.thatDom.style.cursor = data.cursor || "";
          this.thatDom.style.top = data.top || "";
          this.thatDom.style.left = data.left || "";
      };
      dragsortFn.prototype.NodeListToArray = function (nodes) {
          var array = null;
          var that = this;
          try {
              array = Array.prototype.slice.call(nodes, 0);
          }
          catch (ex) {
              array = new Array();
              for (var i = 0, len = nodes.length; i < len; i++) {
                  if (that.fillDom === nodes[i])
                      continue;
                  array.push(nodes[i]);
              }
          }
          return array;
      };
      //获取所有的元素
      dragsortFn.prototype.getItem = function () {
          var eleAry = this.NodeListToArray(document.querySelectorAll(this.data.dragSelector));
          return eleAry;
      };
      //切换位置
      dragsortFn.prototype.swapItems = function (event) {
          var that = this;
          if (!this.dragMoveL)
              return;
          for (var i = 0; i < that.domAll.length; i++) {
              var dom = that.domAll[i];
              if (!hasClass(dom, "containe")) {
                  dom = parent(dom, ".containe");
              }
              if (dom === that.thatDom.firstElementChild)
                  continue;
              var OffsetScroll = AllScroll(dom);
              var Offset = getOffset(dom);
              var domLeft = Offset.left - OffsetScroll.left;
              var domTop = Offset.top - OffsetScroll.top;
              var offsetRight = domLeft + dom.offsetWidth;
              var offsetBottom = domTop + dom.offsetHeight;
              //判断是否触碰到了其他的元素
              if (event.clientX >= domLeft && event.clientX <= offsetRight &&
                  event.clientY >= domTop && event.clientY <= offsetBottom) {
                  //中间位置的坐标
                  var middlePosition = domTop + (offsetBottom - domTop) / 2;
                  // true为上半部分
                  // false为下半部分
                  var isDownOrUp = event.clientY <= middlePosition ? true : false;
                  that.SameOrLower.call(that, that.fillDom, dom, event, isDownOrUp);
                  this.dragMoveL = false;
              }
          }
          setTimeout(function () {
              that.dragMoveL = true;
          }, 500);
      };
      //判断是添加在同级还是在下级
      dragsortFn.prototype.SameOrLower = function (fillDom, dom, event, isDownOrUp) {
          var that = this;
          var headEle = dom.querySelector(".containe_head");
          var headOffsetScroll = AllScroll(headEle);
          var headOffset = getOffset(headEle);
          var domLeft = headOffset.left - headOffsetScroll.left;
          var domTop = headOffset.top - headOffsetScroll.top;
          var offsetRight = domLeft + headEle.offsetWidth;
          var offsetBottom = domTop + headEle.offsetHeight;
          //拖动在头部的位置
          if (event.clientX >= domLeft && event.clientX <= offsetRight &&
              event.clientY >= domTop && event.clientY <= offsetBottom) {
              var dargLevel = that.eleLevel.call(that, dom); //替换的元素的位置层级
              //最大可拖动的层级不够
              if (dargLevel + that.dragEleChildrenSize > that.data.Maxlevel)
                  return;
              that.thatReplaceEle = dom.parentElement;
              that.thatPosition[1] = isDownOrUp ? 1 : 2;
              that.thatPosition[0] = 1;
              if (event.clientY)
                  if (isDownOrUp) {
                      insertBefore(that.fillDom, dom.parentElement);
                  }
                  else {
                      insertAfter(that.fillDom, dom.parentElement);
                  }
          }
          else { //拖动在内容的位置
              var dargLevel = that.eleLevel.call(that, dom) + 1; //替换的元素的位置层级
              //最大可拖动的层级不够
              if (dargLevel + that.dragEleChildrenSize > that.data.Maxlevel)
                  return;
              that.thatReplaceEle = dom.parentElement;
              that.thatPosition[1] = isDownOrUp ? 1 : 2;
              that.thatPosition[0] = 2;
              if (dom.nextElementSibling) {
                  if (dom.nextElementSibling.firstElementChild) {
                      insertBefore(fillDom, dom.nextElementSibling.firstElementChild);
                  }
                  else {
                      dom.nextElementSibling.appendChild(fillDom);
                  }
              }
              else {
                  var ul = document.createElement("ul");
                  ul.appendChild(fillDom);
                  insertAfter(ul, dom);
              }
          }
      };
      //元素是在第几级别
      dragsortFn.prototype.eleLevel = function (ele) {
          var level = 0;
          while (ele !== this.data.dragParent) {
              if (ele.nodeName === "UL") {
                  level += 1;
              }
              ele = ele.parentElement;
          }
          return level;
      };
      //元素有几个子元素
      dragsortFn.prototype.ChildrenSize = function () {
          var that = this;
          var level = 0;
          var li = that.thatDom;
          var cache = [li];
          function getLevel(parent) {
              var c = [];
              for (var i = 0; i < parent.length; i++) {
                  var ul = parent[i].lastElementChild;
                  if (ul.children.length > 0) {
                      for (var j = 0; j < ul.childElementCount; j++) {
                          c.push(ul.children[j]);
                      }
                  }
              }
              if (c.length > 0) {
                  level++;
                  cache = c;
                  getLevel(cache);
              }
          }
          getLevel(cache);
          return level;
      };
      return dragsortFn;
  }());
  function dragsort(data) {
      var dragsort = new dragsortFn(data);
      return dragsort;
  }
  /**
   * 拖拽的控件
    * @param {object} data { dragParent: document.querySelector("#id") | "string",  dragEnd: function () { }, placeHolderTemplate: "<div class='Imgms'></div>" }
           * @param {Element | string} dragParent 父级的元素获取元素的id class。
           * @param {string} dragLevel 触发拖动的部分 1为containe本身 2级为 head部分  3级为 content部分   -1为使用dragEle为拖拽的元素
           * @param {string} dragEle  当dragLevel为4时的拖拽元素的 id class
           * @param {function} dragEnd(thatdragEle,thatReplaceEle,thatPosition) 拖动结束后将被调用的回调函数
                          thatdragEle // 当前拖拽的元素
                          thatReplaceEle //替换的元素
                          thatPosition = [-1, -1] //位置 [0]1是父级 2是子级   [1]1上面 2是下面
           * @param {string} placeHolderTemplate 拖动列表的填充部分。
           * @param {string | number} Maxlevel 允许最大拖动的层级
           * @param {object} bodyMessage [{headEle:headEle,contentEle:contentEle,isDrag:true,id:id,children:[{headEle:headEle,contentEle:contentEle,isDrag:true,children[]}]}]
                * @param {string} id 标识
                * @param {Element} headEle 标题部分内容的元素
                * @param {Element} contentEle 主体部分内容的元素
                * @param {boolean} isDrag 是否允许拖拽 默认为true
                * @param {Array<object>} children 当前条目的子级 [{headEle:headEle,contentEle:contentEle,isDrag:true,id:id,children:[{headEle:headEle,contentEle:contentEle,isDrag:true,children[]}]}]
   */

  var data = {
      dragParent: document.getElementById("list"),
      dragLevel: 0,
      dragEnd: function (thatdragEle, thatReplaceEle, thatPosition) {
          console.log(thatdragEle, thatReplaceEle, thatPosition);
      },
      placeHolderTemplate: "<div>12121212121212121</div>",
      Maxlevel: 1,
      bodyMessage: [{
              id: "1",
              isDrag: true,
              headEle: "head1",
              contentEle: "content1",
              children: []
          },
          {
              id: "2",
              isDrag: true,
              headEle: "head2",
              contentEle: "content2",
              children: []
          },
          {
              id: "3",
              isDrag: true,
              headEle: "head3",
              contentEle: "content3",
              children: [
                  {
                      id: "4",
                      isDrag: false,
                      headEle: "children3head",
                      contentEle: "childern3content",
                      children: []
                  }
              ]
          }]
  };
  dragsort(data);

})));
//# sourceMappingURL=index.js.map
