(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
}((function () { 'use strict';

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

  /**
   * 判断是否是字符串
   * @param value 值
   */
  function isString(value) {
      return Object.prototype.toString.call(value) === "[object String]";
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

  ///<reference path="../../indexModel.d.ts" />
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

  var event = installEvents(); //没有代理对象的缓存
  /**
   * 兼容 e.path方法
   * @param {Event} e 需要获取的指针
   */
  function eventsPath(e) {
      var ev = e || event;
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

  ///<reference path="../../indexModel.d.ts" />
  var event$1 = installEvents(); //没有代理对象的缓存
  function LoopBinding(ele, cb) {
      if (/\[object HTML.*Element\]/.test(ele))
          ele = [ele];
      for (var i = 0; i < ele.length; i++) {
          (function (i) { cb(i); })(i);
      }
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

  var NoticeRemind = /** @class */ (function () {
      function NoticeRemind(option) {
          this.noticeDom = {};
          this.noticeTimeout = {};
          this.index = 0;
          this.showIndex = 0;
          this.cancelKey = true;
          this.noticeList = [];
          this.initOption = { close: false, cancel: true, autoClose: true, closeTime: 3000, number: 1, top: 195, right: 23, };
          this.option = mergeOptions({}, this.initOption, option);
          this.getParent();
          this.addEvent();
      }
      NoticeRemind.prototype.getParent = function () {
          this.noticeParent = document.createElement("div");
          this.noticeParent.id = "notice_remind_parent";
          if (this.option.bottom)
              this.noticeParent.style.bottom = this.option.bottom + "px";
          else
              this.noticeParent.style.top = this.option.top + "px";
          if (this.option.left)
              this.noticeParent.style.left = this.option.left + "px";
          else
              this.noticeParent.style.right = this.option.right + "px";
          document.body.appendChild(this.noticeParent);
      };
      NoticeRemind.prototype.addEvent = function () {
          var that = this;
          if (this.option.cancel) {
              on({
                  agent: that.noticeParent,
                  events: "click",
                  ele: ".notice_cancel",
                  fn: function () {
                      that.closeAll.call(that);
                      that.cancelKey = false;
                      that.option.cancelCallback && that.option.cancelCallback();
                  }
              });
          }
          if (this.option.close) {
              on({
                  agent: that.noticeParent,
                  events: "click",
                  ele: ".notice_close_box",
                  fn: function (e) {
                      var item = e.getAttribute("type");
                      that.closeOnce.call(that, item);
                  }
              });
          }
      };
      NoticeRemind.prototype.closeAll = function () {
          if (this.option.autoClose) {
              each(this.noticeTimeout, function (value) {
                  clearTimeout(value);
              });
          }
          this.noticeParent.innerHTML = "";
          this.noticeTimeout = {};
          this.noticeDom = {};
          this.showIndex = 0;
      };
      NoticeRemind.prototype.closeOnce = function (index) {
          this.noticeParent.removeChild(this.noticeDom[index]);
          delete this.noticeDom[index];
          try {
              clearTimeout(this.noticeTimeout[index]);
          }
          catch (e) { }
          delete this.noticeTimeout[index];
          this.showIndex--;
          this.addNextNotice.call(this);
      };
      NoticeRemind.prototype.getNoticeDom = function (str) {
          var dom = document.createElement("div");
          dom.className = "notice_remind notice_remind" + this.index;
          dom.innerHTML = str;
          this.noticeDom[this.index] = dom;
          this.noticeParent.appendChild(this.noticeDom[this.index]);
          this.autoCloseFn(this.index);
          this.index++;
          this.showIndex++;
          if (this.showIndex < this.option.number) {
              this.addNextNotice();
          }
      };
      NoticeRemind.prototype.getNewNotice = function (obj) {
          var closeStr = this.option.close ? "<i class=\"notice_close_box\" type=\"" + this.index + "\">\u00D7</i>" : "";
          var cancelStr = this.option.cancel ? "<div class=\"notice_cancel_box\"><i class=\"notice_cancel\"></i><span>\u4E0D\u518D\u5F39\u7A97</span></div>" : "";
          var str = "" + closeStr + cancelStr + "\n      <div class=\"notice_head_box " + (this.option.cancel ? 'notice_head_cancel' : '') + "\">" + (obj.headStr ? obj.headStr : "") + "</div>\n      <div class=\"notice_content_box\">" + obj.contentStr + "</div>\n      <div class=\"notice_bottom_box\">" + (obj.footStr ? obj.footStr : "") + "</div>";
          this.getNoticeDom(str);
          this.option.showCallback && this.option.showCallback(obj);
      };
      NoticeRemind.prototype.autoCloseFn = function (index) {
          if (!this.option.autoClose)
              return;
          var that = this;
          this.noticeTimeout[index] = setTimeout(function () {
              that.closeOnce.call(that, index);
          }, this.option.closeTime);
      };
      NoticeRemind.prototype.addNextNotice = function () {
          if (this.noticeList.length > 0) {
              var obj = this.noticeList.shift();
              this.getNewNotice(obj);
          }
      };
      NoticeRemind.prototype.addNewNotice = function (obj) {
          if (!this.cancelKey)
              return;
          if (getDataType(obj) === "[object Object]") {
              this.addNoice(obj);
          }
          else if (getDataType(obj) === "[object Array]") {
              for (var i = 0; i < obj.length; i++) {
                  var item = obj[i];
                  this.addNoice(item);
              }
          }
      };
      NoticeRemind.prototype.addNoice = function (obj) {
          if (this.showIndex < this.option.number) {
              this.getNewNotice(obj);
          }
          else {
              this.noticeList.push(obj);
          }
      };
      return NoticeRemind;
  }());

  var stlNoticeRemind = new NoticeRemind({ number: 3, closeTime: 5000, left: 50, bottom: 50, showCallback: function (obj) { console.log(obj); } });
  var dom$1 = document.getElementById("btn");
  var doms = document.getElementById("btns");
  var index = 0;
  // addEvent(dom,"click",function(){
  //     stlNoticeRemind.addNewNotice(obj);
  //     index++;
  // })
  dom$1.addEventListener("click", function () {
      var obj = {
          contentStr: "内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容",
          headStr: "标题标题标题标题标题标题标题标题标题标题" + index,
          id: index
      };
      stlNoticeRemind.addNewNotice(obj);
      index++;
  });
  doms.addEventListener("click", function () {
      var arr = [{
              contentStr: "内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容",
              headStr: "标题标题标题标题标题标题标题标题标题标题11",
              id: 11
          }, {
              contentStr: "内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容",
              headStr: "标题标题标题标题标题标题标题标题标题标题12",
              id: 12
          }, {
              contentStr: "内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容",
              headStr: "标题标题标题标题标题标题标题标题标题标题13",
              id: 13
          }, {
              contentStr: "内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容",
              headStr: "标题标题标题标题标题标题标题标题标题标题14",
              id: 14
          }];
      stlNoticeRemind.addNewNotice(arr);
  });

})));
//# sourceMappingURL=index.js.map
