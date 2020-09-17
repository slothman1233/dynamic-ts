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
   * 判断是否是字符串
   * @param value 值
   */
  function isString(value) {
      return Object.prototype.toString.call(value) === "[object String]";
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

  var AllData = []; //缓存数据
  var thatEleDom; //当前右键元素的数据
  var parentEle = createEl("div", {
      id: "contextmeun_parent"
  });
  parentEle.style.position = "absolute";
  setTimeout(function () {
      document.body && document.body.appendChild(parentEle);
      //点击列表的方法
      on({
          agent: parentEle,
          events: "click",
          ele: "li",
          fn: function (e) {
              var id = e.firstElementChild.getAttribute("data-id");
              var obj = getThatObj(id);
              if (!obj)
                  return;
              obj.callback(thatEleDom.ele);
          }
      });
  }, 0);
  //获取当前点击的对象
  function getThatObj(id) {
      var obj = thatEleDom.data;
      function getObj(ary) {
          for (var i = 0; i < ary.length; i++) {
              var d = ary[i];
              if (d.id == id) {
                  return d;
              }
              if (d.children.length > 0) {
                  var obj_1 = getObj(d.children);
                  if (obj_1)
                      return obj_1;
              }
          }
      }
      return getObj(obj);
  }
  //右键事件
  function contextmeunFn(data) {
      var ele = getHtml(data.data);
      parentEle.innerHTML = "";
      parentEle.appendChild(ele);
      parentEle.style.display = "block";
      //获取整个html的元素
      function getHtml(data) {
          var HTMLEle = document.createElement("ul");
          for (var i = 0; i < data.length; i++) {
              var dt = data[i];
              dt.id = contextmenu_uuid().toString();
              var content = createEl("div", {
                  className: "content",
                  innerHTML: dt.content
              });
              content.setAttribute("data-id", dt.id);
              var li = createEl("li", {}, {}, [content]);
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
      var DomCahe = []; // 用于去重
      var cacheData = [];
      for (var i = AllData.length - 1; i >= 0; i--) {
          var data = AllData[i];
          var e = [];
          var type = Object.prototype.toString.call(data.ele);
          if (type === "[object String]") {
              e = NodeListToArray(document.querySelectorAll(data.ele));
          }
          else if (type === "[object NodeList]") {
              e = NodeListToArray(data.ele);
          }
          else if (type === "[object Array]") {
              e = data.ele;
          }
          else if (/\[object HTML.*Element\]/.test(type)) {
              e = [data.ele];
          }
          for (var j = 0; j < e.length; j++) {
              if (DomCahe.indexOf(e[j]) < 0) {
                  DomCahe.push(e[j]);
                  cacheData.push({ ele: e[j], data: data.data, callback: data.callback });
              }
          }
      }
      return cacheData;
  }
  var contextmenus = document.oncontextmenu; //储存右击事件
  document.oncontextmenu = function (ev) {
      contextmenus && contextmenus(); //如果已经存在右击事件则先执行
      var e = ev || event;
      //let thatEle = e.target || e.srcElement;
      var path = eventsPath(e); //获取冒泡过程的所有元素
      var eleData;
      var _loop_1 = function (i) {
          if (path[i].nodeName === "BODY")
              return "break";
          eleData = existEle().find(function (e) { return e.ele === path[i]; });
          if (eleData)
              return "break";
      };
      for (var i = 0; i < path.length; i++) {
          var state_1 = _loop_1(i);
          if (state_1 === "break")
              break;
      }
      parentEle.style.display = "none";
      if (!eleData)
          return;
      e.preventDefault();
      parentEle.style.left = e.pageX + "px";
      parentEle.style.top = e.pageY + "px";
      thatEleDom = eleData;
      contextmeunFn(eleData);
      eleData.callback(eleData.ele);
  };
  var scroll = document.onscroll;
  document.onscroll = function () {
      scroll && scroll();
      parentEle.style.display = "none";
  };
  var click = document.onclick;
  document.onclick = function () {
      click && click();
      parentEle.style.display = "none";
  };
  function contextmenu(data) {
      AllData.push({ ele: data.ele, data: data.data, callback: data.callback });
  }
  var contextmenu_uuid = function () {
      var i = 0;
      return function () {
          return i++;
      };
  }();

  var obj = {
      ele: document.getElementById("contextmenu"),
      callback: function () {
          console.log("右击了");
      },
      data: [
          {
              content: "<p>复制</p>",
              children: [],
              callback: function (ele) {
                  console.log("复制", ele);
              }
          },
          {
              content: "<p>粘贴</p>",
              children: [],
              callback: function (ele) {
                  console.log("粘贴", ele);
              }
          },
          {
              content: "<p>删除</p>",
              children: [],
              callback: function (ele) {
                  console.log("删除", ele);
              },
          },
          {
              content: "单元格格式",
              children: [
                  {
                      content: "合并单元格",
                      children: [],
                      callback: function (ele) {
                          console.log("合并单元格", ele);
                      }
                  },
                  {
                      content: "拆分单元格",
                      children: [],
                      callback: function (ele) {
                          console.log("粘贴", ele);
                      }
                  }
              ],
              callback: function (ele) {
                  console.log("单元格格式", ele);
              },
          }
      ]
  };
  contextmenu(obj);

})));
//# sourceMappingURL=index.js.map
