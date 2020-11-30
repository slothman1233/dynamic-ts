(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
}((function () { 'use strict';

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

  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation.

  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.

  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** */
  /* global Reflect, Promise */

  var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
          function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
      return extendStatics(d, b);
  };

  function __extends(d, b) {
      extendStatics(d, b);
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }

  var QR8bitByte = /** @class */ (function () {
      function QR8bitByte(data) {
          this.mode = QRMode.MODE_8BIT_BYTE;
          this.data = data;
          this.parsedData = [];
          // Added to support UTF-8 Characters
          for (var i = 0, l = this.data.length; i < l; i++) {
              var byteArray = [];
              var code = this.data.charCodeAt(i);
              if (code > 0x10000) {
                  byteArray[0] = 0xF0 | ((code & 0x1C0000) >>> 18);
                  byteArray[1] = 0x80 | ((code & 0x3F000) >>> 12);
                  byteArray[2] = 0x80 | ((code & 0xFC0) >>> 6);
                  byteArray[3] = 0x80 | (code & 0x3F);
              }
              else if (code > 0x800) {
                  byteArray[0] = 0xE0 | ((code & 0xF000) >>> 12);
                  byteArray[1] = 0x80 | ((code & 0xFC0) >>> 6);
                  byteArray[2] = 0x80 | (code & 0x3F);
              }
              else if (code > 0x80) {
                  byteArray[0] = 0xC0 | ((code & 0x7C0) >>> 6);
                  byteArray[1] = 0x80 | (code & 0x3F);
              }
              else {
                  byteArray[0] = code;
              }
              this.parsedData.push(byteArray);
          }
          this.parsedData = Array.prototype.concat.apply([], this.parsedData);
          if (this.parsedData.length != this.data.length) {
              this.parsedData.unshift(191);
              this.parsedData.unshift(187);
              this.parsedData.unshift(239);
          }
      }
      QR8bitByte.prototype.getLength = function (buffer) {
          return this.parsedData.length;
      };
      QR8bitByte.prototype.write = function (buffer) {
          for (var i = 0, l = this.parsedData.length; i < l; i++) {
              buffer.put(this.parsedData[i], 8);
          }
      };
      return QR8bitByte;
  }());
  var QRCodeModel = /** @class */ (function () {
      function QRCodeModel(typeNumber, errorCorrectLevel) {
          this.modules = null;
          this.moduleCount = 0;
          this.dataCache = null;
          this.dataList = [];
          this.PAD0 = 0xEC;
          this.PAD1 = 0x11;
          this.typeNumber = typeNumber;
          this.errorCorrectLevel = errorCorrectLevel;
      }
      QRCodeModel.prototype.addData = function (data) {
          var newData = new QR8bitByte(data);
          this.dataList.push(newData);
          this.dataCache = null;
      };
      QRCodeModel.prototype.isDark = function (row, col) {
          if (row < 0 || this.moduleCount <= row || col < 0 || this.moduleCount <= col) {
              throw new Error(row + "," + col);
          }
          return this.modules[row][col];
      };
      QRCodeModel.prototype.getModuleCount = function () {
          return this.moduleCount;
      };
      QRCodeModel.prototype.make = function () {
          this.makeImpl(false, this.getBestMaskPattern());
      };
      QRCodeModel.prototype.makeImpl = function (test, maskPattern) {
          this.moduleCount = this.typeNumber * 4 + 17;
          this.modules = new Array(this.moduleCount);
          for (var row = 0; row < this.moduleCount; row++) {
              this.modules[row] = new Array(this.moduleCount);
              for (var col = 0; col < this.moduleCount; col++) {
                  this.modules[row][col] = null;
              }
          }
          this.setupPositionProbePattern(0, 0);
          this.setupPositionProbePattern(this.moduleCount - 7, 0);
          this.setupPositionProbePattern(0, this.moduleCount - 7);
          this.setupPositionAdjustPattern();
          this.setupTimingPattern();
          this.setupTypeInfo(test, maskPattern);
          if (this.typeNumber >= 7) {
              this.setupTypeNumber(test);
          }
          if (this.dataCache == null) {
              this.dataCache = this.createData(this.typeNumber, this.errorCorrectLevel, this.dataList);
          }
          this.mapData(this.dataCache, maskPattern);
      };
      QRCodeModel.prototype.setupPositionProbePattern = function (row, col) {
          for (var r = -1; r <= 7; r++) {
              if (row + r <= -1 || this.moduleCount <= row + r)
                  continue;
              for (var c = -1; c <= 7; c++) {
                  if (col + c <= -1 || this.moduleCount <= col + c)
                      continue;
                  if ((0 <= r && r <= 6 && (c == 0 || c == 6)) || (0 <= c && c <= 6 && (r == 0 || r == 6)) || (2 <= r && r <= 4 && 2 <= c && c <= 4)) {
                      this.modules[row + r][col + c] = true;
                  }
                  else {
                      this.modules[row + r][col + c] = false;
                  }
              }
          }
      };
      QRCodeModel.prototype.getBestMaskPattern = function () {
          var minLostPoint = 0;
          var pattern = 0;
          for (var i = 0; i < 8; i++) {
              this.makeImpl(true, i);
              var lostPoint = QRUtil.getLostPoint(this);
              if (i == 0 || minLostPoint > lostPoint) {
                  minLostPoint = lostPoint;
                  pattern = i;
              }
          }
          return pattern;
      };
      QRCodeModel.prototype.createMovieClip = function (target_mc, instance_name, depth) {
          var qr_mc = target_mc.createEmptyMovieClip(instance_name, depth);
          var cs = 1;
          this.make();
          for (var row = 0; row < this.modules.length; row++) {
              var y = row * cs;
              for (var col = 0; col < this.modules[row].length; col++) {
                  var x = col * cs;
                  var dark = this.modules[row][col];
                  if (dark) {
                      qr_mc.beginFill(0, 100);
                      qr_mc.moveTo(x, y);
                      qr_mc.lineTo(x + cs, y);
                      qr_mc.lineTo(x + cs, y + cs);
                      qr_mc.lineTo(x, y + cs);
                      qr_mc.endFill();
                  }
              }
          }
          return qr_mc;
      };
      QRCodeModel.prototype.setupTimingPattern = function () {
          for (var r = 8; r < this.moduleCount - 8; r++) {
              if (this.modules[r][6] != null) {
                  continue;
              }
              this.modules[r][6] = (r % 2 == 0);
          }
          for (var c = 8; c < this.moduleCount - 8; c++) {
              if (this.modules[6][c] != null) {
                  continue;
              }
              this.modules[6][c] = (c % 2 == 0);
          }
      };
      QRCodeModel.prototype.setupPositionAdjustPattern = function () {
          var pos = QRUtil.getPatternPosition(this.typeNumber);
          for (var i = 0; i < pos.length; i++) {
              for (var j = 0; j < pos.length; j++) {
                  var row = pos[i];
                  var col = pos[j];
                  if (this.modules[row][col] != null) {
                      continue;
                  }
                  for (var r = -2; r <= 2; r++) {
                      for (var c = -2; c <= 2; c++) {
                          if (r == -2 || r == 2 || c == -2 || c == 2 || (r == 0 && c == 0)) {
                              this.modules[row + r][col + c] = true;
                          }
                          else {
                              this.modules[row + r][col + c] = false;
                          }
                      }
                  }
              }
          }
      };
      QRCodeModel.prototype.setupTypeNumber = function (test) {
          var bits = QRUtil.getBCHTypeNumber(this.typeNumber);
          for (var i = 0; i < 18; i++) {
              var mod = (!test && ((bits >> i) & 1) == 1);
              this.modules[Math.floor(i / 3)][i % 3 + this.moduleCount - 8 - 3] = mod;
          }
          for (var i = 0; i < 18; i++) {
              var mod = (!test && ((bits >> i) & 1) == 1);
              this.modules[i % 3 + this.moduleCount - 8 - 3][Math.floor(i / 3)] = mod;
          }
      };
      QRCodeModel.prototype.setupTypeInfo = function (test, maskPattern) {
          var data = (this.errorCorrectLevel << 3) | maskPattern;
          var bits = QRUtil.getBCHTypeInfo(data);
          for (var i = 0; i < 15; i++) {
              var mod = (!test && ((bits >> i) & 1) == 1);
              if (i < 6) {
                  this.modules[i][8] = mod;
              }
              else if (i < 8) {
                  this.modules[i + 1][8] = mod;
              }
              else {
                  this.modules[this.moduleCount - 15 + i][8] = mod;
              }
          }
          for (var i = 0; i < 15; i++) {
              var mod = (!test && ((bits >> i) & 1) == 1);
              if (i < 8) {
                  this.modules[8][this.moduleCount - i - 1] = mod;
              }
              else if (i < 9) {
                  this.modules[8][15 - i - 1 + 1] = mod;
              }
              else {
                  this.modules[8][15 - i - 1] = mod;
              }
          }
          this.modules[this.moduleCount - 8][8] = (!test);
      };
      QRCodeModel.prototype.mapData = function (data, maskPattern) {
          var inc = -1;
          var row = this.moduleCount - 1;
          var bitIndex = 7;
          var byteIndex = 0;
          for (var col = this.moduleCount - 1; col > 0; col -= 2) {
              if (col == 6)
                  col--;
              while (true) {
                  for (var c = 0; c < 2; c++) {
                      if (this.modules[row][col - c] == null) {
                          var dark = false;
                          if (byteIndex < data.length) {
                              dark = (((data[byteIndex] >>> bitIndex) & 1) == 1);
                          }
                          var mask = QRUtil.getMask(maskPattern, row, col - c);
                          if (mask) {
                              dark = !dark;
                          }
                          this.modules[row][col - c] = dark;
                          bitIndex--;
                          if (bitIndex == -1) {
                              byteIndex++;
                              bitIndex = 7;
                          }
                      }
                  }
                  row += inc;
                  if (row < 0 || this.moduleCount <= row) {
                      row -= inc;
                      inc = -inc;
                      break;
                  }
              }
          }
      };
      QRCodeModel.prototype.createData = function (typeNumber, errorCorrectLevel, dataList) {
          var QRRSBlocks = new QRRSBlock(typeNumber, errorCorrectLevel);
          var rsBlocks = QRRSBlocks.getRSBlocks(typeNumber, errorCorrectLevel);
          var buffer = new QRBitBuffer();
          for (var i = 0; i < dataList.length; i++) {
              var data = dataList[i];
              buffer.put(data.mode, 4);
              buffer.put(data.getLength(), QRUtil.getLengthInBits(data.mode, typeNumber));
              data.write(buffer);
          }
          var totalDataCount = 0;
          for (var i = 0; i < rsBlocks.length; i++) {
              totalDataCount += rsBlocks[i].dataCount;
          }
          if (buffer.getLengthInBits() > totalDataCount * 8) {
              throw new Error("code length overflow. (" + buffer.getLengthInBits() + ">" + totalDataCount * 8 + ")");
          }
          if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) {
              buffer.put(0, 4);
          }
          while (buffer.getLengthInBits() % 8 != 0) {
              buffer.putBit(false);
          }
          while (true) {
              if (buffer.getLengthInBits() >= totalDataCount * 8) {
                  break;
              }
              buffer.put(this.PAD0, 8);
              if (buffer.getLengthInBits() >= totalDataCount * 8) {
                  break;
              }
              buffer.put(this.PAD1, 8);
          }
          return this.createBytes(buffer, rsBlocks);
      };
      QRCodeModel.prototype.createBytes = function (buffer, rsBlocks) {
          var offset = 0;
          var maxDcCount = 0;
          var maxEcCount = 0;
          var dcdata = new Array(rsBlocks.length);
          var ecdata = new Array(rsBlocks.length);
          for (var r = 0; r < rsBlocks.length; r++) {
              var dcCount = rsBlocks[r].dataCount;
              var ecCount = rsBlocks[r].totalCount - dcCount;
              maxDcCount = Math.max(maxDcCount, dcCount);
              maxEcCount = Math.max(maxEcCount, ecCount);
              dcdata[r] = new Array(dcCount);
              for (var i = 0; i < dcdata[r].length; i++) {
                  dcdata[r][i] = 0xff & buffer.buffer[i + offset];
              }
              offset += dcCount;
              var rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount);
              var rawPoly = new QRPolynomial(dcdata[r], rsPoly.getLength() - 1);
              var modPoly = rawPoly.mod(rsPoly);
              ecdata[r] = new Array(rsPoly.getLength() - 1);
              for (var i = 0; i < ecdata[r].length; i++) {
                  var modIndex = i + modPoly.getLength() - ecdata[r].length;
                  ecdata[r][i] = (modIndex >= 0) ? modPoly.get(modIndex) : 0;
              }
          }
          var totalCodeCount = 0;
          for (var i = 0; i < rsBlocks.length; i++) {
              totalCodeCount += rsBlocks[i].totalCount;
          }
          var data = new Array(totalCodeCount);
          var index = 0;
          for (var i = 0; i < maxDcCount; i++) {
              for (var r = 0; r < rsBlocks.length; r++) {
                  if (i < dcdata[r].length) {
                      data[index++] = dcdata[r][i];
                  }
              }
          }
          for (var i = 0; i < maxEcCount; i++) {
              for (var r = 0; r < rsBlocks.length; r++) {
                  if (i < ecdata[r].length) {
                      data[index++] = ecdata[r][i];
                  }
              }
          }
          return data;
      };
      return QRCodeModel;
  }());
  var QRMode = { MODE_NUMBER: 1 << 0, MODE_ALPHA_NUM: 1 << 1, MODE_8BIT_BYTE: 1 << 2, MODE_KANJI: 1 << 3 };
  var QRErrorCorrectLevel = { L: 1, M: 0, Q: 3, H: 2 };
  var QRMaskPattern = { PATTERN000: 0, PATTERN001: 1, PATTERN010: 2, PATTERN011: 3, PATTERN100: 4, PATTERN101: 5, PATTERN110: 6, PATTERN111: 7 };
  var QRUtil = {
      PATTERN_POSITION_TABLE: [[], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34], [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50], [6, 30, 54], [6, 32, 58], [6, 34, 62], [6, 26, 46, 66], [6, 26, 48, 70], [6, 26, 50, 74], [6, 30, 54, 78], [6, 30, 56, 82], [6, 30, 58, 86], [6, 34, 62, 90], [6, 28, 50, 72, 94], [6, 26, 50, 74, 98], [6, 30, 54, 78, 102], [6, 28, 54, 80, 106], [6, 32, 58, 84, 110], [6, 30, 58, 86, 114], [6, 34, 62, 90, 118], [6, 26, 50, 74, 98, 122], [6, 30, 54, 78, 102, 126], [6, 26, 52, 78, 104, 130], [6, 30, 56, 82, 108, 134], [6, 34, 60, 86, 112, 138], [6, 30, 58, 86, 114, 142], [6, 34, 62, 90, 118, 146], [6, 30, 54, 78, 102, 126, 150], [6, 24, 50, 76, 102, 128, 154], [6, 28, 54, 80, 106, 132, 158], [6, 32, 58, 84, 110, 136, 162], [6, 26, 54, 82, 110, 138, 166], [6, 30, 58, 86, 114, 142, 170]],
      G15: (1 << 10) | (1 << 8) | (1 << 5) | (1 << 4) | (1 << 2) | (1 << 1) | (1 << 0),
      G18: (1 << 12) | (1 << 11) | (1 << 10) | (1 << 9) | (1 << 8) | (1 << 5) | (1 << 2) | (1 << 0),
      G15_MASK: (1 << 14) | (1 << 12) | (1 << 10) | (1 << 4) | (1 << 1),
      getBCHTypeInfo: function (data) {
          var d = data << 10;
          while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15) >= 0) {
              d ^= (QRUtil.G15 << (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15)));
          }
          return ((data << 10) | d) ^ QRUtil.G15_MASK;
      },
      getBCHTypeNumber: function (data) {
          var d = data << 12;
          while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G18) >= 0) {
              d ^= (QRUtil.G18 << (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G18)));
          }
          return (data << 12) | d;
      },
      getBCHDigit: function (data) {
          var digit = 0;
          while (data != 0) {
              digit++;
              data >>>= 1;
          }
          return digit;
      },
      getPatternPosition: function (typeNumber) {
          return QRUtil.PATTERN_POSITION_TABLE[typeNumber - 1];
      },
      getMask: function (maskPattern, i, j) {
          switch (maskPattern) {
              case QRMaskPattern.PATTERN000: return (i + j) % 2 == 0;
              case QRMaskPattern.PATTERN001: return i % 2 == 0;
              case QRMaskPattern.PATTERN010: return j % 3 == 0;
              case QRMaskPattern.PATTERN011: return (i + j) % 3 == 0;
              case QRMaskPattern.PATTERN100: return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 == 0;
              case QRMaskPattern.PATTERN101: return (i * j) % 2 + (i * j) % 3 == 0;
              case QRMaskPattern.PATTERN110: return ((i * j) % 2 + (i * j) % 3) % 2 == 0;
              case QRMaskPattern.PATTERN111: return ((i * j) % 3 + (i + j) % 2) % 2 == 0;
              default: throw new Error("bad maskPattern:" + maskPattern);
          }
      },
      getErrorCorrectPolynomial: function (errorCorrectLength) {
          var a = new QRPolynomial([1], 0);
          for (var i = 0; i < errorCorrectLength; i++) {
              a = a.multiply(new QRPolynomial([1, QRMath.gexp(i)], 0));
          }
          return a;
      },
      getLengthInBits: function (mode, type) {
          if (1 <= type && type < 10) {
              switch (mode) {
                  case QRMode.MODE_NUMBER: return 10;
                  case QRMode.MODE_ALPHA_NUM: return 9;
                  case QRMode.MODE_8BIT_BYTE: return 8;
                  case QRMode.MODE_KANJI: return 8;
                  default: throw new Error("mode:" + mode);
              }
          }
          else if (type < 27) {
              switch (mode) {
                  case QRMode.MODE_NUMBER: return 12;
                  case QRMode.MODE_ALPHA_NUM: return 11;
                  case QRMode.MODE_8BIT_BYTE: return 16;
                  case QRMode.MODE_KANJI: return 10;
                  default: throw new Error("mode:" + mode);
              }
          }
          else if (type < 41) {
              switch (mode) {
                  case QRMode.MODE_NUMBER: return 14;
                  case QRMode.MODE_ALPHA_NUM: return 13;
                  case QRMode.MODE_8BIT_BYTE: return 16;
                  case QRMode.MODE_KANJI: return 12;
                  default: throw new Error("mode:" + mode);
              }
          }
          else {
              throw new Error("type:" + type);
          }
      },
      getLostPoint: function (qrCode) {
          var moduleCount = qrCode.getModuleCount();
          var lostPoint = 0;
          for (var row = 0; row < moduleCount; row++) {
              for (var col = 0; col < moduleCount; col++) {
                  var sameCount = 0;
                  var dark = qrCode.isDark(row, col);
                  for (var r = -1; r <= 1; r++) {
                      if (row + r < 0 || moduleCount <= row + r) {
                          continue;
                      }
                      for (var c = -1; c <= 1; c++) {
                          if (col + c < 0 || moduleCount <= col + c) {
                              continue;
                          }
                          if (r == 0 && c == 0) {
                              continue;
                          }
                          if (dark == qrCode.isDark(row + r, col + c)) {
                              sameCount++;
                          }
                      }
                  }
                  if (sameCount > 5) {
                      lostPoint += (3 + sameCount - 5);
                  }
              }
          }
          for (var row = 0; row < moduleCount - 1; row++) {
              for (var col = 0; col < moduleCount - 1; col++) {
                  var count = 0;
                  if (qrCode.isDark(row, col))
                      count++;
                  if (qrCode.isDark(row + 1, col))
                      count++;
                  if (qrCode.isDark(row, col + 1))
                      count++;
                  if (qrCode.isDark(row + 1, col + 1))
                      count++;
                  if (count == 0 || count == 4) {
                      lostPoint += 3;
                  }
              }
          }
          for (var row = 0; row < moduleCount; row++) {
              for (var col = 0; col < moduleCount - 6; col++) {
                  if (qrCode.isDark(row, col) && !qrCode.isDark(row, col + 1) && qrCode.isDark(row, col + 2) && qrCode.isDark(row, col + 3) && qrCode.isDark(row, col + 4) && !qrCode.isDark(row, col + 5) && qrCode.isDark(row, col + 6)) {
                      lostPoint += 40;
                  }
              }
          }
          for (var col = 0; col < moduleCount; col++) {
              for (var row = 0; row < moduleCount - 6; row++) {
                  if (qrCode.isDark(row, col) && !qrCode.isDark(row + 1, col) && qrCode.isDark(row + 2, col) && qrCode.isDark(row + 3, col) && qrCode.isDark(row + 4, col) && !qrCode.isDark(row + 5, col) && qrCode.isDark(row + 6, col)) {
                      lostPoint += 40;
                  }
              }
          }
          var darkCount = 0;
          for (var col = 0; col < moduleCount; col++) {
              for (var row = 0; row < moduleCount; row++) {
                  if (qrCode.isDark(row, col)) {
                      darkCount++;
                  }
              }
          }
          var ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
          lostPoint += ratio * 10;
          return lostPoint;
      }
  };
  var QRMath = {
      glog: function (n) {
          if (n < 1) {
              throw new Error("glog(" + n + ")");
          }
          return QRMath.LOG_TABLE[n];
      },
      gexp: function (n) {
          while (n < 0) {
              n += 255;
          }
          while (n >= 256) {
              n -= 255;
          }
          return QRMath.EXP_TABLE[n];
      },
      EXP_TABLE: new Array(256),
      LOG_TABLE: new Array(256)
  };
  for (var i = 0; i < 8; i++) {
      QRMath.EXP_TABLE[i] = 1 << i;
  }
  for (var i = 8; i < 256; i++) {
      QRMath.EXP_TABLE[i] = QRMath.EXP_TABLE[i - 4] ^ QRMath.EXP_TABLE[i - 5] ^ QRMath.EXP_TABLE[i - 6] ^ QRMath.EXP_TABLE[i - 8];
  }
  for (var i = 0; i < 255; i++) {
      QRMath.LOG_TABLE[QRMath.EXP_TABLE[i]] = i;
  }
  var QRPolynomial = /** @class */ (function () {
      function QRPolynomial(num, shift) {
          if (num.length == undefined) {
              throw new Error(num.length + "/" + shift);
          }
          var offset = 0;
          while (offset < num.length && num[offset] == 0) {
              offset++;
          }
          this.num = new Array(num.length - offset + shift);
          for (var i = 0; i < num.length - offset; i++) {
              this.num[i] = num[i + offset];
          }
      }
      QRPolynomial.prototype.get = function (index) { return this.num[index]; };
      QRPolynomial.prototype.getLength = function () { return this.num.length; };
      QRPolynomial.prototype.multiply = function (e) {
          var num = new Array(this.getLength() + e.getLength() - 1);
          for (var i = 0; i < this.getLength(); i++) {
              for (var j = 0; j < e.getLength(); j++) {
                  num[i + j] ^= QRMath.gexp(QRMath.glog(this.get(i)) + QRMath.glog(e.get(j)));
              }
          }
          return new QRPolynomial(num, 0);
      };
      QRPolynomial.prototype.mod = function (e) {
          if (this.getLength() - e.getLength() < 0) {
              return this;
          }
          var ratio = QRMath.glog(this.get(0)) - QRMath.glog(e.get(0));
          var num = new Array(this.getLength());
          for (var i = 0; i < this.getLength(); i++) {
              num[i] = this.get(i);
          }
          for (var i = 0; i < e.getLength(); i++) {
              num[i] ^= QRMath.gexp(QRMath.glog(e.get(i)) + ratio);
          }
          return new QRPolynomial(num, 0).mod(e);
      };
      return QRPolynomial;
  }());
  var QRRSBlock = /** @class */ (function () {
      function QRRSBlock(totalCount, dataCount) {
          this.RS_BLOCK_TABLE = [[1, 26, 19], [1, 26, 16], [1, 26, 13], [1, 26, 9], [1, 44, 34], [1, 44, 28], [1, 44, 22], [1, 44, 16], [1, 70, 55], [1, 70, 44], [2, 35, 17], [2, 35, 13], [1, 100, 80], [2, 50, 32], [2, 50, 24], [4, 25, 9], [1, 134, 108], [2, 67, 43], [2, 33, 15, 2, 34, 16], [2, 33, 11, 2, 34, 12], [2, 86, 68], [4, 43, 27], [4, 43, 19], [4, 43, 15], [2, 98, 78], [4, 49, 31], [2, 32, 14, 4, 33, 15], [4, 39, 13, 1, 40, 14], [2, 121, 97], [2, 60, 38, 2, 61, 39], [4, 40, 18, 2, 41, 19], [4, 40, 14, 2, 41, 15], [2, 146, 116], [3, 58, 36, 2, 59, 37], [4, 36, 16, 4, 37, 17], [4, 36, 12, 4, 37, 13], [2, 86, 68, 2, 87, 69], [4, 69, 43, 1, 70, 44], [6, 43, 19, 2, 44, 20], [6, 43, 15, 2, 44, 16], [4, 101, 81], [1, 80, 50, 4, 81, 51], [4, 50, 22, 4, 51, 23], [3, 36, 12, 8, 37, 13], [2, 116, 92, 2, 117, 93], [6, 58, 36, 2, 59, 37], [4, 46, 20, 6, 47, 21], [7, 42, 14, 4, 43, 15], [4, 133, 107], [8, 59, 37, 1, 60, 38], [8, 44, 20, 4, 45, 21], [12, 33, 11, 4, 34, 12], [3, 145, 115, 1, 146, 116], [4, 64, 40, 5, 65, 41], [11, 36, 16, 5, 37, 17], [11, 36, 12, 5, 37, 13], [5, 109, 87, 1, 110, 88], [5, 65, 41, 5, 66, 42], [5, 54, 24, 7, 55, 25], [11, 36, 12], [5, 122, 98, 1, 123, 99], [7, 73, 45, 3, 74, 46], [15, 43, 19, 2, 44, 20], [3, 45, 15, 13, 46, 16], [1, 135, 107, 5, 136, 108], [10, 74, 46, 1, 75, 47], [1, 50, 22, 15, 51, 23], [2, 42, 14, 17, 43, 15], [5, 150, 120, 1, 151, 121], [9, 69, 43, 4, 70, 44], [17, 50, 22, 1, 51, 23], [2, 42, 14, 19, 43, 15], [3, 141, 113, 4, 142, 114], [3, 70, 44, 11, 71, 45], [17, 47, 21, 4, 48, 22], [9, 39, 13, 16, 40, 14], [3, 135, 107, 5, 136, 108], [3, 67, 41, 13, 68, 42], [15, 54, 24, 5, 55, 25], [15, 43, 15, 10, 44, 16], [4, 144, 116, 4, 145, 117], [17, 68, 42], [17, 50, 22, 6, 51, 23], [19, 46, 16, 6, 47, 17], [2, 139, 111, 7, 140, 112], [17, 74, 46], [7, 54, 24, 16, 55, 25], [34, 37, 13], [4, 151, 121, 5, 152, 122], [4, 75, 47, 14, 76, 48], [11, 54, 24, 14, 55, 25], [16, 45, 15, 14, 46, 16], [6, 147, 117, 4, 148, 118], [6, 73, 45, 14, 74, 46], [11, 54, 24, 16, 55, 25], [30, 46, 16, 2, 47, 17], [8, 132, 106, 4, 133, 107], [8, 75, 47, 13, 76, 48], [7, 54, 24, 22, 55, 25], [22, 45, 15, 13, 46, 16], [10, 142, 114, 2, 143, 115], [19, 74, 46, 4, 75, 47], [28, 50, 22, 6, 51, 23], [33, 46, 16, 4, 47, 17], [8, 152, 122, 4, 153, 123], [22, 73, 45, 3, 74, 46], [8, 53, 23, 26, 54, 24], [12, 45, 15, 28, 46, 16], [3, 147, 117, 10, 148, 118], [3, 73, 45, 23, 74, 46], [4, 54, 24, 31, 55, 25], [11, 45, 15, 31, 46, 16], [7, 146, 116, 7, 147, 117], [21, 73, 45, 7, 74, 46], [1, 53, 23, 37, 54, 24], [19, 45, 15, 26, 46, 16], [5, 145, 115, 10, 146, 116], [19, 75, 47, 10, 76, 48], [15, 54, 24, 25, 55, 25], [23, 45, 15, 25, 46, 16], [13, 145, 115, 3, 146, 116], [2, 74, 46, 29, 75, 47], [42, 54, 24, 1, 55, 25], [23, 45, 15, 28, 46, 16], [17, 145, 115], [10, 74, 46, 23, 75, 47], [10, 54, 24, 35, 55, 25], [19, 45, 15, 35, 46, 16], [17, 145, 115, 1, 146, 116], [14, 74, 46, 21, 75, 47], [29, 54, 24, 19, 55, 25], [11, 45, 15, 46, 46, 16], [13, 145, 115, 6, 146, 116], [14, 74, 46, 23, 75, 47], [44, 54, 24, 7, 55, 25], [59, 46, 16, 1, 47, 17], [12, 151, 121, 7, 152, 122], [12, 75, 47, 26, 76, 48], [39, 54, 24, 14, 55, 25], [22, 45, 15, 41, 46, 16], [6, 151, 121, 14, 152, 122], [6, 75, 47, 34, 76, 48], [46, 54, 24, 10, 55, 25], [2, 45, 15, 64, 46, 16], [17, 152, 122, 4, 153, 123], [29, 74, 46, 14, 75, 47], [49, 54, 24, 10, 55, 25], [24, 45, 15, 46, 46, 16], [4, 152, 122, 18, 153, 123], [13, 74, 46, 32, 75, 47], [48, 54, 24, 14, 55, 25], [42, 45, 15, 32, 46, 16], [20, 147, 117, 4, 148, 118], [40, 75, 47, 7, 76, 48], [43, 54, 24, 22, 55, 25], [10, 45, 15, 67, 46, 16], [19, 148, 118, 6, 149, 119], [18, 75, 47, 31, 76, 48], [34, 54, 24, 34, 55, 25], [20, 45, 15, 61, 46, 16]];
          this.totalCount = totalCount;
          this.dataCount = dataCount;
      }
      QRRSBlock.prototype.getRSBlocks = function (typeNumber, errorCorrectLevel) {
          var rsBlock = this.getRsBlockTable(typeNumber, errorCorrectLevel);
          if (rsBlock == undefined) {
              throw new Error("bad rs block @ typeNumber:" + typeNumber + "/errorCorrectLevel:" + errorCorrectLevel);
          }
          var length = rsBlock.length / 3;
          var list = [];
          for (var i = 0; i < length; i++) {
              var count = rsBlock[i * 3 + 0];
              var totalCount = rsBlock[i * 3 + 1];
              var dataCount = rsBlock[i * 3 + 2];
              for (var j = 0; j < count; j++) {
                  list.push(new QRRSBlock(totalCount, dataCount));
              }
          }
          return list;
      };
      QRRSBlock.prototype.getRsBlockTable = function (typeNumber, errorCorrectLevel) {
          switch (errorCorrectLevel) {
              case QRErrorCorrectLevel.L: return this.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0];
              case QRErrorCorrectLevel.M: return this.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1];
              case QRErrorCorrectLevel.Q: return this.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2];
              case QRErrorCorrectLevel.H: return this.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3];
              default: return undefined;
          }
      };
      return QRRSBlock;
  }());
  var QRBitBuffer = /** @class */ (function () {
      function QRBitBuffer() {
          this.buffer = [];
          this.length = 0;
      }
      QRBitBuffer.prototype.get = function (index) { var bufIndex = Math.floor(index / 8); return ((this.buffer[bufIndex] >>> (7 - index % 8)) & 1) == 1; };
      QRBitBuffer.prototype.put = function (num, length) { for (var i = 0; i < length; i++) {
          this.putBit(((num >>> (length - i - 1)) & 1) == 1);
      } };
      QRBitBuffer.prototype.getLengthInBits = function () { return this.length; };
      QRBitBuffer.prototype.putBit = function (bit) {
          var bufIndex = Math.floor(this.length / 8);
          if (this.buffer.length <= bufIndex) {
              this.buffer.push(0);
          }
          if (bit) {
              this.buffer[bufIndex] |= (0x80 >>> (this.length % 8));
          }
          this.length++;
      };
      return QRBitBuffer;
  }());
  var QRCodeLimitLength = [[17, 14, 11, 7], [32, 26, 20, 14], [53, 42, 32, 24], [78, 62, 46, 34], [106, 84, 60, 44], [134, 106, 74, 58], [154, 122, 86, 64], [192, 152, 108, 84], [230, 180, 130, 98], [271, 213, 151, 119], [321, 251, 177, 137], [367, 287, 203, 155], [425, 331, 241, 177], [458, 362, 258, 194], [520, 412, 292, 220], [586, 450, 322, 250], [644, 504, 364, 280], [718, 560, 394, 310], [792, 624, 442, 338], [858, 666, 482, 382], [929, 711, 509, 403], [1003, 779, 565, 439], [1091, 857, 611, 461], [1171, 911, 661, 511], [1273, 997, 715, 535], [1367, 1059, 751, 593], [1465, 1125, 805, 625], [1528, 1190, 868, 658], [1628, 1264, 908, 698], [1732, 1370, 982, 742], [1840, 1452, 1030, 790], [1952, 1538, 1112, 842], [2068, 1628, 1168, 898], [2188, 1722, 1228, 958], [2303, 1809, 1283, 983], [2431, 1911, 1351, 1051], [2563, 1989, 1423, 1093], [2699, 2099, 1499, 1139], [2809, 2213, 1579, 1219], [2953, 2331, 1663, 1273]];
  function _isSupportCanvas() {
      return typeof CanvasRenderingContext2D != "undefined";
  }
  // android 2.x doesn't support Data-URI spec
  function _getAndroid() {
      var android = false;
      var sAgent = navigator.userAgent;
      if (/android/i.test(sAgent)) { // android
          android = true;
          var aMat = sAgent.toString().match(/android ([0-9]\.[0-9])/i);
          if (aMat && aMat[1]) {
              android = parseFloat(aMat[1]);
          }
      }
      return android;
  }
  var Drawing1 = /** @class */ (function () {
      function Drawing1(el, htOption) {
          this._el = el;
          this._htOption = htOption;
      }
      Drawing1.prototype.draw = function (oQRCode) {
          var _htOption = this._htOption;
          var _el = this._el;
          var nCount = oQRCode.getModuleCount();
          var nWidth = Math.floor(_htOption.width / nCount);
          var nHeight = Math.floor(_htOption.height / nCount);
          this.clear();
          function makeSVG(tag, attrs) {
              var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
              for (var k in attrs)
                  if (attrs.hasOwnProperty(k))
                      el.setAttribute(k, attrs[k]);
              return el;
          }
          var svg = makeSVG("svg", { 'viewBox': '0 0 ' + String(nCount) + " " + String(nCount), 'width': '100%', 'height': '100%', 'fill': _htOption.colorLight });
          svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
          _el.appendChild(svg);
          svg.appendChild(makeSVG("rect", { "fill": _htOption.colorLight, "width": "100%", "height": "100%" }));
          svg.appendChild(makeSVG("rect", { "fill": _htOption.colorDark, "width": "1", "height": "1", "id": "template" }));
          for (var row = 0; row < nCount; row++) {
              for (var col = 0; col < nCount; col++) {
                  if (oQRCode.isDark(row, col)) {
                      var child = makeSVG("use", { "x": String(col), "y": String(row) });
                      child.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#template");
                      svg.appendChild(child);
                  }
              }
          }
      };
      Drawing1.prototype.clear = function () {
          while (this._el.hasChildNodes())
              this._el.removeChild(this._el.lastChild);
      };
      return Drawing1;
  }());
  var Drawing2 = /** @class */ (function () {
      function Drawing2(el, htOption) {
          this._el = el;
          this._htOption = htOption;
      }
      Drawing2.prototype.draw = function (oQRCode) {
          var _htOption = this._htOption;
          var _el = this._el;
          var nCount = oQRCode.getModuleCount();
          var nWidth = Math.floor(_htOption.width / nCount);
          var nHeight = Math.floor(_htOption.height / nCount);
          var aHTML = ['<table style="border:0;border-collapse:collapse;">'];
          for (var row = 0; row < nCount; row++) {
              aHTML.push('<tr>');
              for (var col = 0; col < nCount; col++) {
                  aHTML.push('<td style="border:0;border-collapse:collapse;padding:0;margin:0;width:' + nWidth + 'px;height:' + nHeight + 'px;background-color:' + (oQRCode.isDark(row, col) ? _htOption.colorDark : _htOption.colorLight) + ';"></td>');
              }
              aHTML.push('</tr>');
          }
          aHTML.push('</table>');
          _el.innerHTML = aHTML.join('');
          // Fix the margin values as real size.
          var elTable = _el.childNodes[0];
          var nLeftMarginTable = (_htOption.width - elTable.offsetWidth) / 2;
          var nTopMarginTable = (_htOption.height - elTable.offsetHeight) / 2;
          if (nLeftMarginTable > 0 && nTopMarginTable > 0) {
              elTable.style.margin = nTopMarginTable + "px " + nLeftMarginTable + "px";
          }
      };
      Drawing2.prototype.clear = function () {
          this._el.innerHTML = '';
      };
      return Drawing2;
  }());
  function _onMakeImage() {
      this._elImage.src = this._elCanvas.toDataURL("image/png");
      this._elImage.style.display = "block";
      this._elCanvas.style.display = "none";
  }
  function _safeSetDataURI(fSuccess, fFail) {
      var self = this;
      self._fFail = fFail;
      self._fSuccess = fSuccess;
      // Check it just once
      if (self._bSupportDataURI === null) {
          var el = document.createElement("img");
          var fOnError = function () {
              self._bSupportDataURI = false;
              if (self._fFail) {
                  self._fFail.call(self);
              }
          };
          var fOnSuccess = function () {
              self._bSupportDataURI = true;
              if (self._fSuccess) {
                  self._fSuccess.call(self);
              }
          };
          el.onabort = fOnError;
          el.onerror = fOnError;
          el.onload = fOnSuccess;
          el.src = "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=="; // the Image contains 1px data.
          return;
      }
      else if (self._bSupportDataURI === true && self._fSuccess) {
          self._fSuccess.call(self);
      }
      else if (self._bSupportDataURI === false && self._fFail) {
          self._fFail.call(self);
      }
  }
  var Drawing3 = /** @class */ (function () {
      function Drawing3(el, htOption) {
          this._bIsPainted = false;
          this._bSupportDataURI = null;
          this._android = _getAndroid();
          this._htOption = htOption;
          this._elCanvas = document.createElement("canvas");
          this._elCanvas.width = htOption.width;
          this._elCanvas.height = htOption.height;
          el.appendChild(this._elCanvas);
          this._el = el;
          this._oContext = this._elCanvas.getContext("2d");
          this._bIsPainted = false;
          this._elImage = document.createElement("img");
          this._elImage.alt = "Scan me!";
          this._elImage.style.display = "none";
          this._el.appendChild(this._elImage);
      }
      Drawing3.prototype.draw = function (oQRCode) {
          var _elImage = this._elImage;
          var _oContext = this._oContext;
          var _htOption = this._htOption;
          var nCount = oQRCode.getModuleCount();
          var nWidth = _htOption.width / nCount;
          var nHeight = _htOption.height / nCount;
          var nRoundedWidth = Math.round(nWidth);
          var nRoundedHeight = Math.round(nHeight);
          _elImage.style.display = "none";
          this.clear();
          for (var row = 0; row < nCount; row++) {
              for (var col = 0; col < nCount; col++) {
                  var bIsDark = oQRCode.isDark(row, col);
                  var nLeft = col * nWidth;
                  var nTop = row * nHeight;
                  _oContext.strokeStyle = bIsDark ? _htOption.colorDark : _htOption.colorLight;
                  _oContext.lineWidth = 1;
                  _oContext.fillStyle = bIsDark ? _htOption.colorDark : _htOption.colorLight;
                  _oContext.fillRect(nLeft, nTop, nWidth, nHeight);
                  // 안티 앨리어싱 방지 처리
                  _oContext.strokeRect(Math.floor(nLeft) + 0.5, Math.floor(nTop) + 0.5, nRoundedWidth, nRoundedHeight);
                  _oContext.strokeRect(Math.ceil(nLeft) - 0.5, Math.ceil(nTop) - 0.5, nRoundedWidth, nRoundedHeight);
              }
          }
          this._bIsPainted = true;
      };
      Drawing3.prototype.makeImage = function () {
          if (this._bIsPainted) {
              _safeSetDataURI.call(this, _onMakeImage);
          }
      };
      Drawing3.prototype.isPaintedfunction = function () {
          return this._bIsPainted;
      };
      Drawing3.prototype.clear = function () {
          this._oContext.clearRect(0, 0, this._elCanvas.width, this._elCanvas.height);
          this._bIsPainted = false;
      };
      Drawing3.prototype.round = function (nNumber) {
          if (!nNumber) {
              return nNumber;
          }
          return Math.floor(nNumber * 1000) / 1000;
      };
      return Drawing3;
  }());
  var useSVG = document.documentElement.tagName.toLowerCase() === "svg";
  var Drawing = /** @class */ (function (_super) {
      __extends(Drawing, _super);
      function Drawing() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      return Drawing;
  }((useSVG ? Drawing1 : !_isSupportCanvas() ? Drawing2 : Drawing3)));
  function _getTypeNumber(sText, nCorrectLevel) {
      var nType = 1;
      var length = _getUTF8Length(sText);
      for (var i = 0, len = QRCodeLimitLength.length; i <= len; i++) {
          var nLimit = 0;
          switch (nCorrectLevel) {
              case QRErrorCorrectLevel.L:
                  nLimit = QRCodeLimitLength[i][0];
                  break;
              case QRErrorCorrectLevel.M:
                  nLimit = QRCodeLimitLength[i][1];
                  break;
              case QRErrorCorrectLevel.Q:
                  nLimit = QRCodeLimitLength[i][2];
                  break;
              case QRErrorCorrectLevel.H:
                  nLimit = QRCodeLimitLength[i][3];
                  break;
          }
          if (length <= nLimit) {
              break;
          }
          else {
              nType++;
          }
      }
      if (nType > QRCodeLimitLength.length) {
          throw new Error("Too long data");
      }
      return nType;
  }
  function _getUTF8Length(sText) {
      var replacedText = encodeURI(sText).toString().replace(/\%[0-9a-fA-F]{2}/g, 'a');
      return replacedText.length + (replacedText.length != sText ? 3 : 0);
  }
  var qrcode = /** @class */ (function () {
      function qrcode(el, vOption) {
          this._htOption = {
              width: 256,
              height: 256,
              typeNumber: 4,
              colorDark: "#000000",
              colorLight: "#ffffff",
              correctLevel: QRErrorCorrectLevel.H
          };
          this.CorrectLevel = QRErrorCorrectLevel;
          if (typeof vOption === 'string') {
              vOption = {
                  text: vOption
              };
          }
          if (vOption) {
              for (var i in vOption) {
                  this._htOption[i] = vOption[i];
              }
          }
          if (typeof el == "string") {
              el = document.getElementById(el);
          }
          if (this._htOption.useSVG) {
              var Drawing_1 = /** @class */ (function (_super) {
                  __extends(Drawing, _super);
                  function Drawing() {
                      return _super !== null && _super.apply(this, arguments) || this;
                  }
                  return Drawing;
              }(Drawing1));
          }
          this._android = _getAndroid();
          this._el = el;
          this._oQRCode = null;
          this._oDrawing = new Drawing(this._el, this._htOption);
          if (this._htOption.text) {
              this.makeCode(this._htOption.text);
          }
      }
      qrcode.prototype.makeCode = function (sText) {
          this._oQRCode = new QRCodeModel(_getTypeNumber(sText, this._htOption.correctLevel), this._htOption.correctLevel);
          this._oQRCode.addData(sText);
          this._oQRCode.make();
          this._el.title = sText;
          this._oDrawing.draw(this._oQRCode);
          this.makeImage();
      };
      qrcode.prototype.makeImage = function () {
          if (typeof this._oDrawing.makeImage == "function" && (!this._android || this._android >= 3)) {
              this._oDrawing.makeImage();
          }
      };
      qrcode.prototype.clear = function () {
          this._oDrawing.clear();
      };
      return qrcode;
  }());

  var share = /** @class */ (function () {
      function share(parameter) {
          this.weibo = "http://service.weibo.com/share/share.php";
          this.qq = "http://connect.qq.com/widget/shareqq/index.html";
          this.qzone = "https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey";
          this.qrcodeObj = null;
          this.popQrcodeObj = null;
          this.qrcodeKey = false;
          this.qrcodeParent = null;
          this.popQrcodeBox = null;
          var that = this;
          that.parameter = parameter;
          on({
              agent: document.body,
              events: "click",
              ele: "[data-bshare]",
              fn: function (e) {
                  var ev = e || window.event.target;
                  that.clickFn.call(that, ev);
              }
          });
          this.initQrcode();
      }
      share.prototype.initQrcode = function (url) {
          var that = this;
          if (that.parameter.qrcodeBox) {
              var obj = that.getBshare(that.parameter.qrcodeBox);
              if (!obj && !url)
                  return;
              this.qrcodeObj = new qrcode(this.parameter.qrcodeBox, mergeOptions({}, this.parameter.qrcodeDeploy, { text: url ? url : obj.url }));
          }
      };
      share.prototype.getBshare = function (dom) {
          var shareData = dom.getAttribute("data-bshare");
          var obj = shareData && shareData !== "" ? eval("(" + shareData + ")") : null;
          if (obj && obj.url === "")
              obj.url = location.href;
          return obj ? obj : null;
      };
      share.prototype.clickFn = function (ev) {
          var obj = this.getBshare(ev);
          if (!obj)
              return;
          switch (obj.type) {
              case "weixin":
                  this.weixinFn(obj);
                  break;
              case "weibo":
                  this.weiboFn(obj);
                  break;
              case "qzone":
                  this.qzoneFn(obj);
                  break;
              case "copy":
                  this.copyFn(obj);
                  break;
              case "qq":
                  this.qqFn(obj);
                  break;
          }
      };
      share.prototype.weixinFn = function (obj) {
          // if(this.parameter.qrcodeBox)return;
          if (obj.pop) {
              if (!this.popQrcodeObj) {
                  this.getQrcodeDom();
                  this.popQrcodeUrl = obj.url;
                  var data = { text: this.popQrcodeUrl, width: 200, height: 200 };
                  this.popQrcodeObj = new qrcode(this.popQrcodeBox, data);
              }
              else {
                  if (this.popQrcodeUrl != obj.url)
                      this.popQrcodeObj.makeCode(obj.url), this.popQrcodeUrl = obj.url;
              }
              if (this.qrcodeKey && this.qrcodeParent)
                  show(this.qrcodeParent);
          }
      };
      share.prototype.getQrcodeDom = function () {
          var that = this;
          var html = "<div id='qrcHtml' style='width:200px;height:200px;margin:auto;'></div>\n                    <div style='text-align: center;margin-top:5px;'>\u4F7F\u7528\u5FAE\u4FE1\u626B\u4E00\u626B</div>\n                    <a href='javascript:;' id='qrcClose' style='width: 16px; height: 16px;position: absolute; right: 0;top: 0;color: #999;text-decoration: none;font-size: 16px;'>\u00D7</a>";
          this.qrcodeParent = document.createElement("div");
          this.qrcodeParent.id = "QRcode";
          var styles = 'position:fixed;left:50%;top:50%;margin:-224px 0 0 -150px;padding:40px;width:220px !important;height:228px !important;background:#fff;border:solid 1px #d8d8d8;z-index:11001; font-size:12px;';
          this.qrcodeParent.setAttribute("style", styles);
          this.qrcodeParent.innerHTML = html;
          document.body.appendChild(this.qrcodeParent);
          this.popQrcodeBox = document.getElementById("qrcHtml");
          addEvent(document.getElementById("qrcClose"), "click", function () {
              hide(that.qrcodeParent);
          });
          this.qrcodeKey = true;
      };
      share.prototype.qqFn = function (obj) {
          var href = this.qq + "?url=" + this.isUndefined(obj.url) + "&sharesource=qzone&title=" + this.isUndefined(obj.title) + "&pics=" + this.isUndefined(obj.images) + "&summary=" + this.isUndefined(obj.summary) + "&desc=" + this.isUndefined(obj.desc);
          this.bashreHref(href);
      };
      share.prototype.qzoneFn = function (obj) {
          var href = this.qzone + "?url=" + this.isUndefined(obj.url) + "&sharesource=qzone&title=" + this.isUndefined(obj.title) + "&pics=" + this.isUndefined(obj.images) + "&summary=" + this.isUndefined(obj.summary) + "&desc=" + this.isUndefined(obj.desc);
          this.bashreHref(href);
      };
      share.prototype.weiboFn = function (obj) {
          var href = this.weibo + "?url=" + this.isUndefined(obj.url) + "&pic=" + this.isUndefined(obj.images) + "&type=button&language=zh_cn&style=simple&searchPic=true&title=" + this.isUndefined(obj.summary) + "&appkey=";
          this.bashreHref(href);
      };
      share.prototype.copyFn = function (obj) {
          var text = obj.url;
          var input = document.createElement("input");
          input.value = text;
          document.body.appendChild(input);
          input.select();
          document.execCommand("copy");
          input.remove();
          this.parameter.copyCallback && this.parameter.copyCallback.call(this);
      };
      share.prototype.bashreHref = function (href) {
          window.open(href, '_blank', 'width=800,height=800,left=10,top=10,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no');
      };
      share.prototype.isUndefined = function (v) {
          if (v == undefined || !v) {
              return "";
          }
          return v;
      };
      share.prototype.changeQrcode = function (url) {
          if (this.qrcodeUrl == url)
              return;
          this.qrcodeUrl = url;
          if (this.qrcodeObj) {
              this.qrcodeObj.makeCode(url);
          }
          else {
              this.initQrcode(url);
          }
      };
      return share;
  }());

  var shareObj = new share({
      qrcodeBox: document.getElementById("qrcode"),
      // qrcodeDeploy:"http://www.baidu.com"
      qrcodeDeploy: {
          width: 200,
          height: 200,
          colorDark: "#0000ff",
      }
  });
  document.getElementById("btn").addEventListener("click", function () {
      document.getElementById("weixin_share").setAttribute("data-bshare", '{type:"weixin",url:"http://www.baidu.com",title:"百度",desc:"分享百度",summary:"一个很牛逼的网站",images:"https://imgs.wbp5.com/api/secrecymaster/html_up/2020/3/20200327115851614.png"}');
      document.getElementById("qzone_share").setAttribute("data-bshare", '{type:"qzone",url:"http://www.baidu.com",title:"百度",desc:"分享百度",summary:"一个很牛逼的网站",images:"https://imgs.wbp5.com/api/secrecymaster/html_up/2020/3/20200327115851614.png"}');
      document.getElementById("weibo_share").setAttribute("data-bshare", '{type:"weibo",url:"http://www.baidu.com",title:"百度",desc:"分享百度",summary:"一个很牛逼的网站",images:"https://imgs.wbp5.com/api/secrecymaster/html_up/2020/3/20200327115851614.png"}');
      document.getElementById("copy_share").setAttribute("data-bshare", '{type:"copy",url:"http://www.baidu.com",title:"百度",desc:"分享百度",summary:"一个很牛逼的网站",images:"https://imgs.wbp5.com/api/secrecymaster/html_up/2020/3/20200327115851614.png"}');
      shareObj.changeQrcode("http://www.baidu.com");
      document.getElementById("share").style.display = "block";
  });
  // setTimeout(function(){
  //     shareObj.changeQrcode("http://www.juejin.im")
  // },10000)

})));
//# sourceMappingURL=index.js.map
