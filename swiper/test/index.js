(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
}((function () { 'use strict';

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
   * 添加元素的类
   * @param {Element} ele 元素
   * @param {string} className 类名
   * @return {Element}
   */
  function addClass(ele, className) {
      var type = getDataType(ele);
      if (!/\[object HTML.*Element\]/.test(type)) {
          throw new Error("" + cn.dom.notElement);
      }
      var classAry = ele.className.split(" ");
      if (classAry.indexOf(className) === -1)
          classAry.push(className);
      ele.className = classAry.join(" ");
      return ele;
  }

  /**
   * 删除元素的类
   * @param {Element} ele 元素
   * @param {string} className 类名
   * @return {Element}
   */
  function removeClass(ele, className) {
      var type = getDataType(ele);
      if (!/\[object HTML.*Element\]/.test(type)) {
          throw new Error("" + cn.dom.notElement);
      }
      var classAry = ele.className.split(" ");
      if (classAry.indexOf(className) >= 0)
          classAry.splice(classAry.indexOf(className), 1);
      ele.className = classAry.join(" ");
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

  function setTransitionFn(dom, val, type) {
      dom.style.transition = "all " + (val ? val : 0) + "ms " + (type ? type : "ease") + " 0s";
      dom.style.MozTransition = "all " + (val ? val : 0) + "ms " + (type ? type : "ease") + " 0s";
      dom.style.webkitTransition = "all " + (val ? val : 0) + "ms " + (type ? type : "ease") + " 0s";
      dom.style.OTransition = "all " + (val ? val : 0) + "ms " + (type ? type : "ease") + " 0s";
  }
  function setTransformFn(dom, val) {
      dom.style.transform = val;
      dom.style.MozTransform = val;
      dom.style.webkitTransform = val;
      dom.style.OTransform = val;
  }
  function getTransformFn(dom) {
      return window.getComputedStyle(dom, null).transform ||
          window.getComputedStyle(dom, null).webkitTransform ||
          window.getComputedStyle(dom, null).MozTransform ||
          window.getComputedStyle(dom, null).OTransform;
  }

  var stlSwiper = /** @class */ (function () {
      function stlSwiper(parent, obj) {
          this.movekey = false; //move事件的锁
          this.item = 0; //当前显示的下标
          this.wrapperClassName = "stl-switch-wrapper";
          this.sliderClassName = "stl-switch-slider";
          this.thumbsClassName = "stl-switch-thumbs";
          this.scrollBox = null;
          this.scrollNav = null;
          this.scrollClassName = "stl-switch-scroll";
          this.thumbsStartTransform = 0;
          this.thumbsMoveKey = false;
          this.autoPlayKey = true;
          this.autoPlayTimeout = null;
          this.motionKey = false;
          this.initParameter = { slidesPerView: 1, autoHeight: false, speed: 300, loop: false, };
          this.parent = parent;
          this.parameter = mergeOptions(this.initParameter, obj); //初始化参数
          this.parentWidth = this.parent.clientWidth; //获取父元素的宽度
          this.parentScrollWidth = this.parent.scrollWidth; //获取父元素内容的宽度
          this.wrapperDom = this.parent.getElementsByClassName(this.wrapperClassName)[0]; //获取滚动元素
          this.sliderList = NodeListToArray(this.parent.querySelectorAll("." + this.sliderClassName)); //获取table切换元素列表
          this.length = this.sliderList.length;
          if (this.parameter.loop) {
              this.loopInit();
          }
          else {
              addClass(this.sliderList[0], "stl-switch-slider-active");
          } //判断是否允许循环切换
          if (obj) {
              if (obj.autoHeight)
                  addClass(this.parent, "stl-switch-autoheight"), this.wrapperDom.style.height = this.sliderList[this.item].offsetHeight + "px";
              if (obj.scrollBar)
                  this.getScrollBar(obj.scrollBar);
              if (obj.autoplay && this.parameter.slidesPerView < this.length)
                  this.autoPlayFn(obj.autoplay);
          }
          if (obj.thumbs && this.parent.getElementsByClassName(this.thumbsClassName).length > 0) {
              this.thumbsBox = this.parent.getElementsByClassName(this.thumbsClassName)[0];
              this.getThumbsFn(obj.thumbs);
          }
          if (obj.pagination)
              this.getPagination(obj.pagination);
          if (obj.navigation)
              this.getNavigation(obj.navigation, this.parameter.loop);
          if (this.parameter.slidesPerView < this.length)
              this.addTouchFn();
      }
      stlSwiper.prototype.loopInit = function () {
          var sliderList = this.parent.getElementsByClassName(this.sliderClassName);
          var width = sliderList[sliderList.length - 1].offsetWidth;
          var firstNode = sliderList[0].cloneNode(true);
          var laseNode = sliderList[sliderList.length - 1].cloneNode(true);
          addClass(this.sliderList[0], "stl-switch-slider-active");
          this.wrapperDom.appendChild(firstNode);
          this.wrapperDom.insertBefore(laseNode, sliderList[0]);
          this.wrapperDom.style.left = -width + "px";
      };
      stlSwiper.prototype.updateItem = function (item, move) {
          removeClass(this.sliderList[this.item], "stl-switch-slider-active");
          var items = item < 0 ? (move && !this.parameter.loop ? 0 : this.length - 1) : item > this.length - 1 ? (move && !this.parameter.loop ? this.length - 1 : 0) : item;
          if (this.parameter.thumbs) {
              this.updateThumbsItem(items);
          }
          else {
              this.item = items;
          }
          addClass(this.sliderList[this.item], "stl-switch-slider-active");
          var index = this.item;
          if (this.parameter.loop) {
              var start = -1, end = this.length;
              index = item < start ? this.length - 1 : item > end ? 0 : item;
          }
          if (move && this.parameter.thumbs && this.parameter.thumbs.thumbsPerview && this.parameter.thumbs.thumbsPerview < this.length)
              this.updateThumbsPosition();
          if (this.parameter.pagination)
              this.updatePagination();
          return -index * this.parentWidth;
      };
      stlSwiper.prototype.addTouchFn = function () {
          var _this = this;
          var that = this;
          this.touchmoveFn = function (event) {
              var len = _this.startLeft - event.changedTouches[0].clientX;
              var top = _this.startTop - event.changedTouches[0].clientY;
              if (!that.moveKey)
                  that.moveAngle = 180 * Math.atan2(Math.abs(top), Math.abs(len)) / Math.PI, that.moveKey = true; //根据拖动的角度是否小于45度判断是否为切换table
              if (that.moveAngle <= 45) {
                  event.preventDefault();
                  setTransformFn(that.wrapperDom, "translate3d(" + (-len + JSON.parse(that.startTransform)) + "px,0px,0px)");
                  if (that.scrollBox) {
                      var val = len * that.scrollWidth / that.parentScrollWidth + JSON.parse(that.scrollTransform);
                      var num = val < 0 ? 0 : val > that.scrollWidth - that.scrollNavWidth ? that.scrollWidth - that.scrollNavWidth : val;
                      setTransformFn(that.scrollNav, "translate3d(" + num + "px,0px,0px)");
                  }
              }
          };
          this.touchendFn = function (event) {
              that.moveKey = false;
              if (that.moveAngle <= 45) {
                  var len = _this.startLeft - event.changedTouches[0].clientX;
                  if (that.parameter.slidesPerView === 1) {
                      that.endTime = new Date().getTime();
                      var num = len === 0 ? 0 : Math.round(Math.abs(len) / that.parentWidth) * (Math.abs(len) / len); //四舍五入取切换值 当切换距离大于一个table的50%时 则切换到上（下）一张
                      if ((that.endTime - that.startTime < 300) && num < 1 && (len > 20 || len < -20))
                          num = Math.abs(len) / len; //时间小于300ms且移动距离大于20px则切换到下（上）一张
                      var item = that.item + num;
                      var number = that.updateItem.call(that, item, true);
                      that.updatePosition.call(that, number);
                      that.updateScroll();
                  }
                  else {
                      var step = -len + JSON.parse(that.startTransform);
                      var val = step > 0 ? 0 : step < -that.parentScrollWidth + that.parentWidth ? -that.parentScrollWidth + that.parentWidth : step;
                      that.updatePosition.call(that, val);
                  }
              }
              if (that.parameter.autoplay)
                  _this.autoPlayFn(that.parameter.autoplay);
              removeEvent(that.wrapperDom, "touchmove", that.touchmoveFn);
              removeEvent(that.wrapperDom, "touchend", that.touchendFn);
          };
          addEvent(that.wrapperDom, "touchstart", function (event) {
              if (that.motionKey)
                  return;
              that.autoPlayTimeout && (clearTimeout(that.autoPlayTimeout), that.autoPlayTimeout = null); //如果开启了自动切换则关闭自动切换
              that.parameter.sliderStart && that.parameter.sliderStart(); //初始化的回调
              that.startTime = new Date().getTime();
              that.moveAngle = 90;
              that.startLeft = event.changedTouches[0].clientX;
              that.startTop = event.changedTouches[0].clientY;
              that.startTransform = getTransformFn(that.wrapperDom).split(",")[4];
              if (that.scrollBox)
                  that.scrollTransform = getTransformFn(that.scrollNav).split(",")[4]; //是否进度条
              addEvent(that.wrapperDom, "touchmove", that.touchmoveFn);
              addEvent(that.wrapperDom, "touchend", that.touchendFn);
          });
      };
      stlSwiper.prototype.updatePosition = function (number) {
          var that = this;
          that.motionKey = true;
          setTransitionFn(that.wrapperDom, that.parameter.speed);
          setTransformFn(that.wrapperDom, "translate3d(" + number + "px,0px,0px)");
          setTimeout(function () {
              that.motionKey = false;
              if (that.parameter.loop) {
                  var max = -that.parentWidth * (that.length - 1);
                  if (number > 0)
                      setTransformFn(that.wrapperDom, "translate3d(" + max + "px,0px,0px)");
                  if (number < max)
                      setTransformFn(that.wrapperDom, "translate3d(" + 0 + "px,0px,0px)");
              }
              setTransitionFn(that.wrapperDom);
          }, that.parameter.speed);
          if (that.parameter.autoHeight)
              this.wrapperDom.style.height = this.sliderList[this.item].offsetHeight + "px";
          this.parameter.sliderEnd && this.parameter.sliderEnd.call(this);
      };
      stlSwiper.prototype.updateScroll = function () {
          var that = this;
          if (that.scrollBox) {
              setTransitionFn(that.scrollNav, that.parameter.speed);
              var val = that.item * that.scrollNavWidth;
              setTransformFn(that.scrollNav, "translate3d(" + val + "px,0px,0px)");
              setTimeout(function () {
                  setTransitionFn(that.scrollNav);
              }, 300);
          }
      };
      stlSwiper.prototype.getScrollBar = function (obj) {
          this.scrollBox = obj.el ? obj.el : this.scrollBox = document.createElement("div");
          addClass(this.scrollBox, this.scrollClassName);
          var scrollStr = "<div class=\"stl-switch-scroll-bar\" style=\"width:" + 100 / this.length + "%\"><span style=\"width:" + (obj.dragSize ? obj.dragSize : "100%") + "\"></span></div>";
          this.scrollBox.innerHTML = scrollStr;
          this.parent.appendChild(this.scrollBox);
          this.scrollNav = this.scrollBox.getElementsByClassName("stl-switch-scroll-bar")[0];
          this.scrollWidth = this.scrollBox.scrollWidth;
          this.scrollNavWidth = this.scrollNav.clientWidth;
      };
      stlSwiper.prototype.autoPlayFn = function (obj) {
          var that = this;
          that.autoPlayTimeout && (clearTimeout(that.autoPlayTimeout), that.autoPlayTimeout = null);
          that.autoPlayTimeout = setTimeout(function () {
              var index = that.item + 1;
              var number = that.updateItem.call(that, index, false);
              that.updatePosition.call(that, number);
              that.updateScroll();
              that.autoPlayFn(obj);
          }, obj.delay || 3000);
      };
      stlSwiper.prototype.getThumbsFn = function (obj) {
          var str = "";
          for (var i = 0; i < this.length; i++) {
              str += "<div class=\"stl-switch-thumbs-slider " + (i === 0 ? "stl-switch-thumbs-active" : "") + "\" data-item=\"" + i + "\" style=\"width:" + ((obj.thumbsPerview ? 100 / obj.thumbsPerview : 100 / this.length) + "%") + "\">" + (obj.list[i] ? obj.list[i] : "") + "</div>";
          }
          var domStr = "<div class=\"stl-switch-thumbs-list\">" + str + "</div>";
          this.thumbsBox.innerHTML = domStr;
          this.thumbsDom = this.thumbsBox.getElementsByClassName("stl-switch-thumbs-list")[0];
          this.thumbsList = this.thumbsDom.getElementsByClassName("stl-switch-thumbs-slider");
          this.addThumbsEvent(obj);
          if (obj.thumbsPerview && !this.parameter.autoplay && obj.thumbsPerview < this.length) {
              this.thumbsMaxScroll = this.thumbsDom.scrollWidth - this.thumbsBox.clientWidth;
              this.addThumbsSwitch();
          }
      };
      stlSwiper.prototype.updateThumbsItem = function (val) {
          removeClass(this.thumbsList[this.item], "stl-switch-thumbs-active");
          this.item = val;
          addClass(this.thumbsList[this.item], "stl-switch-thumbs-active");
      };
      stlSwiper.prototype.updateThumbsPosition = function () {
          var width = this.thumbsList[0].offsetWidth;
          if (this.thumbsStartTransform - width > -width * this.item) {
              this.thumbsStartTransform = -width * (this.item - this.parameter.thumbs.thumbsPerview + 1);
              this.updateThumbsTransform.call(this, this.parameter.speed, "ease");
          }
          else if (this.thumbsStartTransform < -width * this.item) {
              this.thumbsStartTransform = -width * (this.item > 0 ? this.item - 1 : 0);
              this.updateThumbsTransform.call(this, this.parameter.speed, "ease");
          }
      };
      stlSwiper.prototype.addThumbsEvent = function (obj) {
          var that = this;
          on({
              agent: that.thumbsBox,
              events: "click",
              ele: ".stl-switch-thumbs-slider",
              fn: function (event) {
                  that.motionKey = true;
                  var item = JSON.parse(event.getAttribute("data-item"));
                  that.updateThumbsItem.call(that, item);
                  var number = -that.item * that.parentWidth;
                  that.updatePosition(number);
                  that.updateScroll();
                  obj.clickCallback && obj.clickCallback.call(that);
              }
          });
      };
      stlSwiper.prototype.updateThumbsTransform = function (time, timing) {
          var that = this;
          setTransitionFn(this.thumbsDom, time, timing);
          setTransformFn(this.thumbsDom, "translate3d(" + this.thumbsStartTransform + "px,0px,0px)");
          setTimeout(function () {
              setTransitionFn(that.thumbsDom);
          }, time);
      };
      stlSwiper.prototype.addThumbsSwitch = function () {
          var _this = this;
          var that = this;
          that.thumbsMoveFn = function (event) {
              if (!that.thumbsMoveKey)
                  that.thumbsMoveStart = new Date().getTime(), that.thumbsMoveKey = true;
              var len = _this.thumbsStartLeft - event.changedTouches[0].clientX;
              var top = _this.thumbsStartTop - event.changedTouches[0].clientY;
              var moveAngle = 180 * Math.atan2(Math.abs(top), Math.abs(len)) / Math.PI;
              if (moveAngle <= 45) {
                  event.preventDefault();
                  setTransformFn(that.thumbsDom, "translate3d(" + (that.thumbsStartTransform - len) + "px,0px,0px)");
              }
              else {
                  removeEvent(that.thumbsBox, "touchend", that.thumbsEndFn);
              }
          };
          that.thumbsEndFn = function (event) {
              that.thumbsMoveKey = false;
              that.thumbsMoveEnd = new Date().getTime();
              var times = (that.thumbsMoveEnd - that.thumbsMoveStart) / 1000;
              var time = times > 1 ? 1 : times;
              var len = _this.thumbsStartLeft - event.changedTouches[0].clientX;
              var speed = Math.abs(len) / time;
              var step = -(len + len * speed * 0.0015) + that.thumbsStartTransform;
              that.thumbsStartTransform = step > 0 ? 0 : step < -that.thumbsMaxScroll ? -that.thumbsMaxScroll : step;
              that.updateThumbsTransform.call(that, 500, "cubic-bezier(0,0.58,0.58,1)");
              removeEvent(that.thumbsBox, "touchmove", that.thumbsMoveFn);
              removeEvent(that.thumbsBox, "touchend", that.thumbsEndFn);
          };
          addEvent(that.thumbsBox, "touchstart", function (event) {
              that.thumbsStartLeft = event.changedTouches[0].clientX;
              that.thumbsStartTop = event.changedTouches[0].clientY;
              that.startTransform = getTransformFn(that.thumbsDom).split(",")[4];
              addEvent(that.thumbsBox, "touchmove", that.thumbsMoveFn);
              addEvent(that.thumbsBox, "touchend", that.thumbsEndFn);
          });
      };
      stlSwiper.prototype.getPagination = function (obj) {
          var str = "";
          for (var i = 0; i < this.length; i++) {
              str += "<em class=\"stl-switch-pagination-item " + (i == 0 ? "stl-switch-pagination-active" : "") + "\"></em>";
          }
          this.paginationBox = obj.ele ? obj.ele : createEl("div", { className: "stl-switch-pagination" });
          this.paginationBox.innerHTML = str;
          if (!obj.ele)
              this.parent.appendChild(this.paginationBox);
          this.paginationList = this.paginationBox.getElementsByClassName("stl-switch-pagination-item");
      };
      stlSwiper.prototype.updatePagination = function () {
          removeClass(this.paginationBox.querySelector(".stl-switch-pagination-active"), "stl-switch-pagination-active");
          addClass(this.paginationList[this.item], "stl-switch-pagination-active");
      };
      stlSwiper.prototype.getNavigation = function (obj, loop) {
          this.navigatorLeftDom = obj.prevEl ? obj.prevEl : createEl("div", { className: "stl_swiper_prev_btn stl_swiper_hide_btn", innerHTML: "〈" });
          this.navigatorRightDom = obj.nextEl ? obj.nextEl : createEl("div", { className: "stl_swiper_next_btn", innerHTML: "〉" });
          this.parent.appendChild(this.navigatorLeftDom);
          this.parent.appendChild(this.navigatorRightDom);
          this.navigationClickFn(obj, loop);
      };
      stlSwiper.prototype.navigationClickFn = function (obj, loop) {
          var that = this;
          addEvent(that.navigatorLeftDom, "click", function () {
              var item;
              if (!loop) {
                  if (that.item == 0)
                      return;
                  item = that.item - 1 < 0 ? 0 : that.item - 1;
                  if (item == 0) {
                      if (obj.autoHide)
                          addClass(that.navigatorLeftDom, "stl_swiper_hide_btn");
                  }
              }
              else {
                  item = that.item - 1 < 0 ? that.length - 1 : that.item - 1;
              }
              that.autoPlayTimeout && (clearTimeout(that.autoPlayTimeout), that.autoPlayTimeout = null); //如果开启了自动切换则关闭自动切换
              var number = that.updateItem.call(that, item, true);
              that.updatePosition.call(that, number);
              that.updateScroll();
              removeClass(that.navigatorRightDom, "stl_swiper_hide_btn");
          });
          addEvent(that.navigatorRightDom, "click", function () {
              var item;
              if (!loop) {
                  if (that.item == that.length - 1)
                      return;
                  item = that.item + 1 > that.length - 1 ? that.length - 1 : that.item + 1;
                  if (item == that.length - 1) {
                      if (obj.autoHide)
                          addClass(that.navigatorRightDom, "stl_swiper_hide_btn");
                  }
              }
              else {
                  item = that.item + 1 > that.length - 1 ? 0 : that.item + 1;
              }
              that.autoPlayTimeout && (clearTimeout(that.autoPlayTimeout), that.autoPlayTimeout = null); //如果开启了自动切换则关闭自动切换
              var number = that.updateItem.call(that, item, true);
              that.updatePosition.call(that, number);
              that.updateScroll();
              removeClass(that.navigatorLeftDom, "stl_swiper_hide_btn");
          });
      };
      return stlSwiper;
  }());

  var prevDom = document.getElementById("left_btn");
  var nextDom = document.getElementById("right_btn");
  new stlSwiper(document.getElementById("page"), {
      //slidesPerView:3,
      autoHeight: true,
      //autoplay:{},
      thumbs: {
          list: ["第一个", "<a>第二个</a>", "第三个", "第四个", "第五个", "第六个", "第七个"],
      },
      //loop:true,
      //scrollBar:{dragSize:"50%"},
      //pagination:{}
      navigation: {
          nextEl: nextDom,
          prevEl: prevDom,
          autoHide: true
      },
      sliderEnd: function () {
          // if(this.item ==0 ){
          //     prevDom.className += " hide_btn"
          // }else if(this.item == this.length-1){
          //     nextDom.className += " hide_btn"
          // }else{
          //     nextDom.className = nextDom.className.replace(" hide_btn","")
          //     prevDom.className = prevDom.className.replace(" hide_btn","")
          // }
          // console.log(this.item,this.length)
      }
  });

})));
//# sourceMappingURL=index.js.map
