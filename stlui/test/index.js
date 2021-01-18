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
  function setTransitionFn(dom, val, type) {
      dom.style.transition = "all " + (val ? val : 0) + "ms " + (type ? type : "ease") + " 0s";
      dom.style.MozTransition = "all " + (val ? val : 0) + "ms " + (type ? type : "ease") + " 0s";
      dom.style.webkitTransition = "all " + (val ? val : 0) + "ms " + (type ? type : "ease") + " 0s";
      dom.style.OTransition = "all " + (val ? val : 0) + "ms " + (type ? type : "ease") + " 0s";
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
   * 是否是object类型
   */
  function isObject(value) {
      return !!value && typeof value === "object";
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

  var StlBg = /** @class */ (function () {
      function StlBg(obj) {
          this.bg = null;
          this.parameter = obj;
          this.parent = this.parameter.parent || document.body;
      }
      StlBg.prototype.showBg = function (box, type) {
          var that = this;
          this.bg = createEl('<div class="' + this.parameter.className + ' stlui-action"></div>');
          var dom = box ? box : this.parameter.closeDom;
          this.parent.appendChild(this.bg);
          setTimeout(function () {
              addClass(that.bg, that.parameter.actionClassName);
          }, 0);
          this.addBgEvent(dom, type);
      };
      StlBg.prototype.addBgEvent = function (dom, type) {
          var that = this;
          addEvent(this.bg, "click", function () {
              that.closeBgFn();
              that.parameter.callback && that.parameter.callback(dom, type);
          });
      };
      StlBg.prototype.closeBgFn = function () {
          var that = this;
          removeClass(this.bg, this.parameter.actionClassName);
          setTimeout(function () {
              try {
                  that.parent.removeChild(that.bg);
              }
              catch (e) { }
              that.bg = null;
          }, that.parameter.time | 300);
      };
      return StlBg;
  }());

  var CanvasWrap = /** @class */ (function () {
      function CanvasWrap() {
          this.wrapperKey = false; //侧滑栏当前是否显示
          this.eventKey = false; //事件执行的锁
          this.parent = document.getElementsByClassName("stl-off-canvas-wrap")[0];
          this.parentClassName = this.parent.className, this.parentWidth = this.parent.clientWidth;
          this.wrapBox = document.getElementById("stlInnerWrapper");
          this.canvesBox = document.getElementById("stlCanvasSide");
          this.getDirection();
          this.bgParameter = { parent: this.wrapBox, closeDom: this.wrapBox, className: "stl-wrap-backdrop", actionClassName: "stl-wrap-backdrop-active", callback: this.closeBg() };
          this.bgObj = new StlBg(this.bgParameter);
          this.getType();
          this.getMouse();
      }
      CanvasWrap.prototype.getDirection = function () {
          var className = this.canvesBox.className;
          this.wrapDirection = className.split("stl-off-canvas-")[1].split(" ")[0];
      };
      CanvasWrap.prototype.getMouse = function () {
          var _this = this;
          var that = this;
          if (that.parentClassName.indexOf("stl-warp-mouse") < 0)
              return;
          that.touchendFn = function (event) {
              var len = Math.abs(that.startX - event.changedTouches[0].clientX); //滑动总距离
              var speedScale = len / that.parentWidth; //滑动距离展元素宽度的比例
              that.moveKey = false, that.endTime = new Date().getTime(); //滑动总时长
              var duration = that.endTime - that.startTime; //滑动时长
              //console.log(speedScale,duration,len)
              if (speedScale > 0.4 || (duration < 300 && len > 20)) {
                  that.wrapperKey ? that.closeFn() : that.motionFn(true);
              }
              else {
                  that.wrapperKey ? that.motionFn(true) : that.closeFn();
              }
              that.closeEventKey();
          };
          that.touchmoveFn = function (event) {
              // console.log("move")
              var changeTouches = event.changedTouches[0];
              var len = that.startX - changeTouches.clientX, top = that.startY - changeTouches.clientY;
              if (!that.moveKey)
                  that.moveAngle = 180 * Math.atan2(Math.abs(top), Math.abs(len)) / Math.PI, that.moveKey = true, that.eventKey = true; //根据拖动的角度是否小于45度判断是否唤起侧滑栏
              if (that.moveAngle <= 45) { //小于45度表明是横向滑动
                  addEvent(that.parent, "touchend", that.touchendFn);
                  var moveDirection = Math.abs(len) / len; //滑动方向 -1表示往右滑 1表示往左滑
                  var openKey = (moveDirection > 0 && that.wrapDirection == "right") || (moveDirection < 0 && that.wrapDirection == "left");
                  var closeKey = (moveDirection > 0 && that.wrapDirection == "left") || (moveDirection < 0 && that.wrapDirection == "right");
                  if (!that.wrapperKey && openKey) { //判断侧滑栏是否已展开
                      addClass(_this.parent, "stl-wrap-active");
                      that.moveInFn(-len);
                  }
                  else if (that.wrapperKey && closeKey) {
                      that.moveOutFn(-len);
                  }
                  else {
                      that.moveKey = false;
                      removeEvent(that.parent, "touchend", that.touchendFn);
                  }
              }
              else {
                  that.moveKey = false;
                  removeEvent(that.parent, "touchend", that.touchendFn);
              }
          };
          addEvent(that.parent, "touchstart", function (event) {
              if (that.eventKey)
                  return;
              var changeTouches = event.changedTouches[0];
              that.startTime = new Date().getTime(), that.moveAngle = 90;
              that.startX = changeTouches.clientX, that.startY = changeTouches.clientY;
              addEvent(that.parent, "touchmove", that.touchmoveFn);
          });
      };
      CanvasWrap.prototype.closeEventKey = function () {
          var that = this;
          setTimeout(function () {
              that.eventKey = false;
          }, 300);
      };
      CanvasWrap.prototype.getType = function () {
          if (this.parentClassName.indexOf("stl-wrap-in") >= 0)
              return this.motionFn = this.getWrapIn, this.closeFn = this.closeWrapIn, this.moveInFn = this.getMoveIn, this.moveOutFn = this.closeMoveIn;
          if (this.parentClassName.indexOf("stl-wrap-out") >= 0)
              return this.motionFn = this.getWrapOut, this.closeFn = this.closeWrapOut, this.moveInFn = this.getMoveOut, this.moveOutFn = this.closeMoveOut;
          if (this.parentClassName.indexOf("stl-wrap-all") >= 0)
              return this.motionFn = this.getWrapAll, this.closeFn = this.closeWrapAll, this.moveInFn = this.getMoveAll, this.moveOutFn = this.closeMoveAll;
          if (this.parentClassName.indexOf("stl-wrap-scal") >= 0)
              return this.motionFn = this.getWrapScal, this.closeFn = this.closeWrapScal, this.moveInFn = this.getMoveScal, this.moveOutFn = this.closeMoveScal;
      };
      CanvasWrap.prototype.getTransformX = function (dom) {
          var val = getTransformFn(dom).split(",")[4];
          return val ? parseFloat(val) : null;
      };
      CanvasWrap.prototype.motionCallback = function () {
          if (this.eventKey)
              return;
          this.eventKey = true;
          this.motionFn();
          this.closeEventKey();
      };
      CanvasWrap.prototype.closeCallback = function () {
          if (this.eventKey)
              return;
          this.eventKey = true;
          this.closeFn();
          this.closeEventKey();
      };
      CanvasWrap.prototype.closeBg = function () {
          var that = this;
          if (this.parentClassName.indexOf("stl-wrap-out") >= 0) {
              return function (box) {
                  box.style.transform = "translate3d(0,0,0)";
                  setTimeout(function () {
                      removeClass(that.parent, "stl-wrap-active");
                  }, 300);
              };
          }
          else if (this.parentClassName.indexOf("stl-wrap-in") >= 0) {
              return function (box, type) {
                  var width = type === "left" ? -box.offsetWidth : box.offsetWidth;
                  box.style.transform = "translate3d(" + width + "px,0,0)";
                  setTimeout(function () {
                      removeClass(that.parent, "stl-wrap-active");
                  }, 300);
              };
          }
          else if (this.parentClassName.indexOf("stl-wrap-all")) {
              return function (box) {
                  box.style.transform = "translate3d(0,0,0)";
                  setTimeout(function () {
                      removeClass(that.parent, "stl-wrap-active");
                  }, 300);
              };
          }
      };
      CanvasWrap.prototype.getMoveIn = function (val) {
          var num = this.getTransformX(this.canvesBox) || this.parentWidth;
          setTransitionFn(this.canvesBox);
          console.log(num, val);
          setTransformFn(this.canvesBox, "translate3d(" + (num + val) + "px,0,0)");
      };
      CanvasWrap.prototype.getMoveOut = function (val) {
          setTransitionFn(this.wrapBox);
          setTransformFn(this.wrapBox, "translate3d(" + val + "px,0,0)");
      };
      CanvasWrap.prototype.getMoveAll = function (val) {
      };
      CanvasWrap.prototype.getMoveScal = function (val) {
      };
      CanvasWrap.prototype.closeMoveIn = function (val) {
          var num = getTransformFn(this.canvesBox).split(",")[4];
          setTransitionFn(this.canvesBox);
          setTransformFn(this.canvesBox, "translate3d(" + (val + num) + "px,0,0)");
      };
      CanvasWrap.prototype.closeMoveOut = function (val) {
          var num = parseInt(getTransformFn(this.wrapBox).split(",")[4]);
          setTransitionFn(this.wrapBox);
          setTransformFn(this.wrapBox, "translate3d(" + (val + num) + "px,0,0)");
      };
      CanvasWrap.prototype.closeMoveAll = function (val) {
      };
      CanvasWrap.prototype.closeMoveScal = function (val) {
      };
      CanvasWrap.prototype.addParentClass = function (box) {
          addClass(this.parent, "stl-wrap-active");
          this.wrapperKey = true;
      };
      CanvasWrap.prototype.getWrapOut = function (type) {
          type || this.addParentClass();
          var width = this.wrapDirection === "left" ? this.canvesBox.offsetWidth : -this.canvesBox.offsetWidth;
          setTransitionFn(this.wrapBox, 350, "cubic-bezier(.165,.84,.44,1)");
          setTransformFn(this.wrapBox, "translate3d(" + width + "px,0,0)");
          if (!this.bgObj.bg)
              this.bgObj.showBg();
      };
      CanvasWrap.prototype.getWrapIn = function (type) {
          var that = this;
          type || this.addParentClass();
          setTimeout(function () {
              setTransitionFn(that.canvesBox, 350, "cubic-bezier(.165,.84,.44,1)");
              setTransformFn(that.canvesBox, "translate3d(0,0,0)");
              if (!that.bgObj.bg)
                  that.bgObj.showBg(that.canvesBox, that.wrapDirection);
          }, 0);
      };
      CanvasWrap.prototype.getWrapAll = function (type) {
          var that = this;
          type || this.addParentClass();
          var width = this.wrapDirection === "left" ? this.canvesBox.offsetWidth : -this.canvesBox.offsetWidth;
          this.wrapDom = this.parent.getElementsByClassName("stl-canvas-wrap")[0];
          setTimeout(function () {
              setTransitionFn(that.wrapDom, 350, "cubic-bezier(.165,.84,.44,1)");
              setTransformFn(that.wrapDom, "translate3d" + width + "px,0,0)");
              if (!that.bgObj.bg)
                  that.bgObj.showBg(that.wrapDom, that.wrapDirection);
          }, 0);
      };
      CanvasWrap.prototype.getWrapScal = function () {
      };
      CanvasWrap.prototype.closeWrap = function (box, val) {
          var that = this;
          setTransitionFn(box, 350, "cubic-bezier(.165,.84,.44,1)");
          setTransformFn(box, val ? val : "translate3d(0,0,0)");
          console.log(this.bgObj.bg);
          if (this.bgObj.bg)
              this.bgObj.closeBgFn();
          that.wrapperKey = false;
          setTimeout(function () {
              removeClass(that.parent, "stl-wrap-active");
          }, 300);
      };
      CanvasWrap.prototype.closeWrapIn = function () {
          var width = this.wrapDirection === "left" ? -this.canvesBox.offsetWidth : this.canvesBox.offsetWidth;
          this.closeWrap(this.canvesBox, "translate3d(" + width + "px,0,0)");
      };
      CanvasWrap.prototype.closeWrapOut = function () {
          this.closeWrap(this.wrapBox);
      };
      CanvasWrap.prototype.closeWrapAll = function () {
          this.closeWrap(this.wrapDom);
      };
      CanvasWrap.prototype.closeWrapScal = function () {
      };
      return CanvasWrap;
  }());
  var canvasWrap = new CanvasWrap();

  //import { actionsheet } from "../src/actionsheet"
  // let box = document.getElementById("open");
  // box.addEventListener("click",function(){
  //     actionsheet.showPopover(document.getElementById("actionsheet"))
  // })
  var box = document.getElementById("canvasWrap");
  box.addEventListener("click", function () {
      canvasWrap.motionCallback();
  });
  var close = document.getElementById("close-canvas-right");
  close.addEventListener("click", function () {
      canvasWrap.closeCallback();
  });

})));
//# sourceMappingURL=index.js.map
