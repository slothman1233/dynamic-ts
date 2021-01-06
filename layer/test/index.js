(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.indexjs = {}));
}(this, (function (exports) { 'use strict';

  /**
   * 异步加载css文件
   * @param {Array<string>} fileAry css文件的数组
   */
  function addLinkLoad(fileAry) {
      recursion(fileAry, 0);
      function recursion(fileAry, i) {
          if (fileAry.length > 0) {
              ScriptModel(fileAry[i]).onload = function () {
                  if (fileAry.length - 1 != i) {
                      recursion.call(this, fileAry, ++i);
                  }
              };
          }
          function ScriptModel(src) {
              var link = document.createElement('link');
              link.href = src;
              link.rel = "stylesheet";
              document.getElementsByTagName('head')[0].appendChild(link);
              return link;
          }
          return false;
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

  var stlLayer = /** @class */ (function () {
      function stlLayer() {
          this.times = 1;
          this.iconfontSrc = layerIconfontUrl != null && layerIconfontUrl != "" && layerIconfontUrl != undefined ? layerIconfontUrl + "/iconfont/build/layer/iconfont.css?v=888" : "https://js.wbp5.com/iconfont/build/layer/iconfont.css?v=888";
          this.iconList = {
              11: "&#xA001;", 12: "&#xA002;",
              21: "&#xA003;", 22: "&#xA004;",
              31: "&#xA006;", 32: "&#xA007;",
              41: "&#xA008;", 42: "&#xA009;",
              1110: "&#xA005;",
          };
          this.iconColorList = {
              11: "#21d37d", 12: "#21d37d",
              21: "#d5375a", 22: "#d5375a",
              31: "#26d1e0", 32: "#26d1e0",
              41: "#e8a02e", 42: "#e8a02e",
              1110: "rgba(0, 0, 0, 0.75)",
          };
          this.msgObj = {
              className: "stl-layer-msg stl-layer-shadow stl-layer-centered stl-layer-transition",
              iconClassName: "stl-layer-msg-icon",
              paddingClassName: "stl-layer-msg-padding",
              iconPaddingClassName: "stl-layer-icon-msg-padding",
              time: 3000
          };
          this.hasTitleAlertObj = {
              iconClassName: "stl-layer-title-alert-icon",
              btnClassName: "stl-layer-alert-btn stl-layer-alert-hastitle-btn",
              titleClassName: "stl-layer-alert-title",
              textClassName: "stl-layer-alert-hastitle-text",
          };
          this.noTitleAlertObj = {
              btnClassName: "stl-layer-alert-btn stl-layer-alert-notitle-btn",
              iconClassName: "stl-layer-alert-icon",
              textClassName: "stl-layer-alert-text",
          };
          this.alertObj = {
              time: 3000,
              closeClassName: "stl-layer-alert-close",
              className: "stl-layer-alert stl-layer-centered stl-layer-transition",
              paddingClassName: "stl-layer-alert-padding",
              iconPaddingClassName: "stl-layer-icon-alert-padding",
              contentClassName: "stl-layer-content  stl-layer-border stl-layer-alert",
          };
          this.openObj = {
              className: "stl-layer-shadow stl-layer-centered stl-layer-open stl-layer-transition",
              bgClassName: "stl-layer-open-bg stl-layer-transition",
              classNameTwo: "stl-layer-open-two",
              contentPadding: "stl-layer-open-padding stl-layer-open-content",
              iconContentPadding: "stl-layer-icon-open-padding stl-layer-open-content",
              iconClassName: "stl-layer-open-icon",
              titleClassName: "stl-layer-open-title",
              iconTitleClassName: "stl-layer-open-icon-title",
              textClassName: "stl-layer-open-text",
              iconTextClassName: "stl-layer-open-icon-text",
              closeClassName: "stl-layer-open-close",
              btnClassName: "stl-layer-open-btn",
              btnBoxClassName: "stl-layer-open-btn-box",
              determineClassName: "stl-layer-open-btn-determine",
              cancelClassName: "stl-layer-open-btn-cancel",
              textNoBtnClassName: "stl-layer-open-text-nobtn",
              parameter: {
                  type: 1, autoClose: false, hasClose: true, determineBtn: false, determineText: "确定", cancelBtn: false, cancelText: "取消", bg: true, bgClose: true,
              }
          };
          this.modalObj = {
              className: "stl-layer-shadow stl-layer-centered stl-layer-modal stl-layer-transition",
              bgClassName: "stl-layer-modal-bg stl-layer-transition",
              headClassName: "stl-layer-modal-head",
              titleClassName: "stl-layer-modal-title",
              contentClassName: "stl-layer-modal-content",
              textClassName: "stl-layer-modal-text",
              footClassName: "stl-layer-modal-foot",
              btnClassName: "stl-layer-modal-btn",
              determineClassName: "stl-layer-open-btn-determine",
              cancelClassName: "stl-layer-open-btn-cancel",
              closeClassName: "stl-layer-modal-close",
              parameter: {
                  hasClose: true, determineBtn: true, determineText: "确定", cancelBtn: true, cancelText: "取消", bg: true, bgClose: true,
              }
          };
          this.loadObj = {
              className: "stl-layer-loading",
              bgClassName: "stl-layer-loading-bg",
              pClassName: "stl-layer-parent-loading",
              pBgClassName: "stl-layer-parent-loading-bg",
              parameter: { bg: true, width: 40, height: 40, }
          };
          this.tipObj = {
              parameter: { position: "top", time: 3000, },
              hideClassName: "stl-layer-tip-hide",
              className: "stl-layer-tip",
              transitionClassName: "stl-layer-transition",
              ContentClassName: "stl-layer-tip-content",
          };
          this.customObj = {
              parameter: { hasClose: true, determineBtn: false, determineText: "确定", cancelBtn: false, cancelText: "取消", bg: true, bgClose: true },
              className: "stl-layer-shadow stl-layer-centered stl-layer-custom stl-layer-transition",
              bgClassName: "stl-layer-custom-bg stl-layer-transition",
              contentClassName: "stl-layer-custom-content",
              closeClassName: "stl-layer-custom-close",
              determineClassName: "stl-layer-custom-btn-determine",
              cancelClassName: "stl-layer-custom-btn-cancel",
              footClassName: "stl-layer-custom-foot"
          };
          this.bgDom = null;
          this.timeoutList = {
              msg: null,
              alert: null,
          };
          var arr = [this.iconfontSrc];
          addLinkLoad(arr);
      }
      stlLayer.prototype.getBgDom = function (className) {
          var dom = document.createElement("div");
          dom.className = "stl-layer-shade " + className;
          dom.id = "stl-layer-shade" + this.times;
          dom.setAttribute("times", "" + this.times);
          return dom;
      };
      stlLayer.prototype.getDomStr = function (content, className) {
          var dom = document.createElement("div");
          dom.className = "stl-layer stl-layer" + this.times + " " + className;
          dom.id = "stl-layer" + this.times;
          // dom.setAttribute("times",""+this.times);
          if (typeof content === "string") {
              dom.innerHTML = content;
          }
          else {
              dom.appendChild(content);
          }
          return dom;
      };
      stlLayer.prototype.getIconStr = function (className, icon, iconColor) {
          var iconColorStr = iconColor && iconColor !== "" ? iconColor : this.iconColorList[icon];
          return icon && this.iconList[icon] ? "<i class=\"" + className + " iconfont_layer\" style=\"color:" + iconColorStr + "\">" + this.iconList[icon] + "</i>" : "";
      };
      stlLayer.prototype.getCloseStr = function (className) {
          return "<i class=\"iconfont_layer " + className + "\">&#xA005;</i>";
      };
      stlLayer.prototype.deduplication = function (className, type) {
          var domList = document.getElementsByClassName(className);
          if (domList.length > 0) {
              document.body.removeChild(domList[0]);
              clearTimeout(this.timeoutList[type]);
              this.timeoutList[type] = null;
          }
      };
      stlLayer.prototype.removeHide = function (dom) {
          setTimeout(function () { dom.style.opacity = "1"; }, 0);
      };
      stlLayer.prototype.closeBoxFn = function (dom, parent) {
          var par = parent ? parent : document.body;
          dom.style.opacity = "0";
          setTimeout(function () {
              par.removeChild(dom);
          }, 300);
      };
      stlLayer.prototype.addBgDom = function (end, bgClose) {
          this.appendDom(this.bgDom);
          this.removeHide(this.bgDom);
          bgClose && this.addBgEvent(this.bgDom, end);
      };
      stlLayer.prototype.msgStr = function (content, icon, iconColor) {
          var iconStr = "", className = this.msgObj.paddingClassName;
          if (icon)
              iconStr = this.getIconStr(this.msgObj.iconClassName, icon, iconColor), className = this.msgObj.iconPaddingClassName;
          return "<div id=\"\" class=\"stl-layer-content " + className + "\">" + iconStr + content + "</div>";
      };
      stlLayer.prototype.msg = function (content, options, end) {
          this.deduplication("stl-layer-msg", "msg");
          var type = typeof options === "function", time = this.msgObj.time, icon = 0, iconColor = "";
          if (options && !type) {
              time = options.time ? options.time : time;
              icon = options.icon ? options.icon : icon;
              iconColor = options.iconColor ? options.iconColor : "";
          }
          var contentStr = this.msgStr(content, icon, iconColor);
          var dom = this.getDomStr(contentStr, this.msgObj.className);
          this.appendDom(dom);
          this.removeHide(dom);
          this.times++;
          this.autoClose("msg", dom, time, end);
      };
      stlLayer.prototype.hasTitleAlertStr = function (obj) {
          var iconStr = "", skinClassName = "", btnStr = "", closeStr = "", className = this.alertObj.paddingClassName, iconColor = obj.iconColor ? obj.iconColor : "";
          if (obj.icon)
              iconStr = this.getIconStr(this.hasTitleAlertObj.iconClassName, obj.icon, iconColor), skinClassName = "stl-layer-skin" + obj.icon, className = this.alertObj.iconPaddingClassName;
          if (obj.btnStr)
              btnStr = "<div class=\"" + this.hasTitleAlertObj.btnClassName + "\">" + obj.btnStr + "</div>";
          closeStr = obj.autoClose ? "" : this.getCloseStr(this.alertObj.closeClassName);
          var titleStr = "<p class=\"" + this.hasTitleAlertObj.titleClassName + "\">" + obj.title + "</p>";
          var contentStr = "<p class=\"" + this.hasTitleAlertObj.textClassName + "\">" + obj.content + "</p>";
          return "<div id=\"\" class=\"" + this.alertObj.contentClassName + " " + className + " " + skinClassName + "\">\n                " + iconStr + titleStr + contentStr + btnStr + closeStr + "</div>";
      };
      stlLayer.prototype.noTitleAlertStr = function (obj) {
          var iconStr = "", skinClassName = "", btnStr = "", closeStr = "", className = this.msgObj.paddingClassName, iconColor = obj.iconColor ? obj.iconColor : "";
          if (obj.icon)
              iconStr = this.getIconStr(this.noTitleAlertObj.iconClassName, obj.icon, iconColor), skinClassName = "stl-layer-skin" + obj.icon, className = this.msgObj.iconPaddingClassName;
          if (obj.btnStr) {
              btnStr = "<div class=\"" + this.noTitleAlertObj.btnClassName + "\">" + obj.btnStr + "</div>";
          }
          else {
              closeStr = obj.autoClose ? "" : this.getCloseStr(this.alertObj.closeClassName);
          }
          var content = "<p class=\"" + this.noTitleAlertObj.textClassName + "\">" + obj.content + "</p>";
          return "<div id=\"\" class=\"" + this.alertObj.contentClassName + " " + className + " " + skinClassName + "\">\n                " + iconStr + content + btnStr + closeStr + "</div>";
      };
      stlLayer.prototype.addAlertBtnEvent = function (dom, key, fn) {
          var that = this, btnClassName = key ? that.hasTitleAlertObj.btnClassName : that.noTitleAlertObj.btnClassName;
          that.alertBtnCallback = function (e) {
              var ev = e || window.event;
              removeEvent(dom.getElementsByClassName(btnClassName)[0], "click", that.alertBtnCallback);
              try {
                  fn && fn.call(that, ev);
              }
              catch (e) {
                  console.log(e);
              }
              document.body.removeChild(dom);
              that.alertBtnCallback = null;
          };
          addEvent(dom.getElementsByClassName(btnClassName)[0], "click", that.alertBtnCallback);
      };
      stlLayer.prototype.alert = function (obj) {
          this.deduplication("stl-layer-alert", "alert");
          var contentStr = "", className = this.alertObj.className, hasTitle = false;
          if (obj.title) {
              contentStr = this.hasTitleAlertStr(obj),
                  //className = this.alertObj.className,
                  hasTitle = true;
          }
          else {
              contentStr = this.noTitleAlertStr(obj);
          }
          if (obj.className)
              className += (" " + obj.className);
          var dom = this.getDomStr(contentStr, className);
          var end = obj.endCallback ? obj.endCallback : null;
          this.appendDom(dom);
          this.removeHide(dom);
          try {
              obj.showCallback && obj.showCallback.call(this);
          }
          catch (e) { }
          this.times++;
          if (obj.btnStr && obj.btnCallback)
              this.addAlertBtnEvent(dom, hasTitle, obj.btnCallback);
          if (obj.autoClose) {
              return this.autoClose("alert", dom, this.alertObj.time, end);
          }
          else if (!obj.btnStr || obj.title) {
              var closeDom = dom.getElementsByClassName(this.alertObj.closeClassName)[0];
              this.addCloseEventFn(closeDom, end);
          }
      };
      stlLayer.prototype.getOpenStr = function (obj, iconStr) {
          var contentClassName = this.openObj.contentPadding, titleClassName = this.openObj.titleClassName, textClassName = this.openObj.textClassName, btnStr = "";
          if (iconStr !== "") {
              contentClassName = this.openObj.iconContentPadding, titleClassName = this.openObj.iconTitleClassName,
                  textClassName = this.openObj.iconTextClassName;
          }
          var noBtnClassName = this.openObj.textNoBtnClassName;
          if (obj.determineBtn || obj.cancelBtn) {
              noBtnClassName = "";
              var determineBtnStr = obj.determineBtn ? "<span class=\"" + this.openObj.btnBoxClassName + " " + this.openObj.determineClassName + "\">" + obj.determineText + "</span>" : "", cancelBtnStr = obj.cancelBtn ? "<span class=\"" + this.openObj.btnBoxClassName + " " + this.openObj.cancelClassName + "\">" + obj.cancelText + "</span>" : "";
              btnStr = "<div class=\"" + this.openObj.btnClassName + "\">" + cancelBtnStr + determineBtnStr + "</div>";
          }
          var titleStr = "<p class=\"" + titleClassName + "\">" + obj.title + "</p>", textStr = "<p class=\"" + textClassName + " " + noBtnClassName + "\">" + obj.content + "</p>";
          return "<div id=\"\" class=\"" + contentClassName + "\">" + titleStr + textStr + btnStr + "</div>";
      };
      stlLayer.prototype.open = function (data) {
          var obj = mergeOptions({}, this.openObj.parameter, data), end = obj.end ? obj.end : null, iconColor = obj.iconColor ? obj.iconColor : "";
          var iconStr = obj.icon ? this.getIconStr(this.openObj.iconClassName, obj.icon, iconColor) : "", closeStr = obj.hasClose ? this.getCloseStr(this.openObj.closeClassName) : "";
          var contentStr = this.getOpenStr(obj, iconStr);
          var openTypeClassName = obj.type === 2 ? this.openObj.classNameTwo : "";
          var dom = this.getDomStr(contentStr + iconStr + closeStr, this.openObj.className + " " + openTypeClassName);
          if (obj.bg)
              this.bgDom = this.getBgDom(this.openObj.bgClassName), this.addBgDom(end, obj.bgClose);
          this.appendDom(dom);
          this.removeHide(dom);
          this.times++;
          try {
              obj.showCallback && obj.showCallback.call(this);
          }
          catch (e) { }
          if (closeStr !== "") {
              var closeDom = dom.getElementsByClassName(this.openObj.closeClassName)[0];
              this.addCloseEventFn(closeDom, end);
          }
          if (obj.determineBtn) {
              var determineBox = dom.getElementsByClassName(this.openObj.determineClassName)[0];
              this.addOpenBtnFn(determineBox, obj.determineFn, end);
          }
          if (obj.cancelBtn) {
              var cancelBox = dom.getElementsByClassName(this.openObj.cancelClassName)[0];
              this.addOpenBtnFn(cancelBox, obj.cancelFn, end);
          }
      };
      stlLayer.prototype.getModalFn = function (data) {
          var closeStr = data.hasClose ? this.getCloseStr(this.modalObj.closeClassName) : "";
          var headStr = "<div class=\"" + this.modalObj.headClassName + "\">\n                <p class=\"" + this.modalObj.titleClassName + "\">" + data.title + "</p>" + closeStr + "\n            </div>";
          var contentStr = "<div class=\"" + this.modalObj.contentClassName + "\">\n                <p class=\"" + this.modalObj.textClassName + "\">" + data.content + "</p>\n            </div>";
          var determineBtnStr = data.determineBtn ? "<span class=\"" + this.modalObj.btnClassName + " " + this.modalObj.determineClassName + "\">" + data.determineText + "</span>" : "", cancelBtnStr = data.cancelBtn ? "<span class=\"" + this.modalObj.btnClassName + " " + this.modalObj.cancelClassName + "\">" + data.cancelText + "</span>" : "";
          var btnStr = "<div class=\"" + this.modalObj.footClassName + "\">" + cancelBtnStr + determineBtnStr + "</div>";
          return headStr + contentStr + btnStr;
      };
      stlLayer.prototype.modal = function (data) {
          var obj = mergeOptions({}, this.modalObj.parameter, data), end = obj.end ? obj.end : null;
          var contentStr = this.getModalFn(obj);
          var dom = this.getDomStr(contentStr, this.modalObj.className);
          if (obj.bg)
              this.bgDom = this.getBgDom(this.modalObj.bgClassName), this.addBgDom(end, obj.bgClose);
          this.appendDom(dom);
          this.removeHide(dom);
          this.times++;
          try {
              obj.showCallback && obj.showCallback.call(this);
          }
          catch (e) { }
          if (obj.hasClose) {
              var closeDom = dom.getElementsByClassName(this.modalObj.closeClassName)[0];
              this.addCloseEventFn(closeDom, end);
          }
          if (obj.determineBtn) {
              var determineBox = dom.getElementsByClassName(this.openObj.determineClassName)[0];
              this.addOpenBtnFn(determineBox, obj.determineFn, end);
          }
          if (obj.cancelBtn) {
              var cancelBox = dom.getElementsByClassName(this.openObj.cancelClassName)[0];
              this.addOpenBtnFn(cancelBox, obj.cancelFn, end);
          }
      };
      stlLayer.prototype.addBgEvent = function (dom, end) {
          var that = this;
          addEvent(dom, "click", function () {
              var id = dom.getAttribute("times");
              var box = document.getElementsByClassName("stl-layer" + id)[0];
              that.closeBoxFn(dom);
              that.closeBoxFn(box);
              // document.body.removeChild(dom);
              // document.body.removeChild(box);
              that.bgDom = null;
              try {
                  end && end();
              }
              catch (e) { }
          });
      };
      stlLayer.prototype.addOpenBtnFn = function (dom, fn, end) {
          var that = this;
          var clickFn = function (e) {
              var ev = e || window.event;
              fn && fn.call(that, ev.target);
              that.closeFn.call(that, ev.target);
              try {
                  end && end.call(that);
              }
              catch (e) { }
          };
          addEvent(dom, "click", clickFn);
      };
      stlLayer.prototype.addCloseEventFn = function (dom, end) {
          var that = this;
          var closeCallback = function (e) {
              var ev = e || window.event;
              that.closeFn.call(that, ev.target);
              try {
                  end && end.call(that);
              }
              catch (e) { }
          };
          addEvent(dom, "click", closeCallback);
      };
      stlLayer.prototype.closeFn = function (dom) {
          // removeEvent(dom,"click",this.closeCallback);
          // this.closeCallback = null;
          //document.body.removeChild(parent(dom,".stl-layer"));
          var box = parent(dom, ".stl-layer");
          this.closeBoxFn(box);
          if (this.bgDom)
              this.closeBoxFn(this.bgDom), this.bgDom = null;
          // let that:any = this;
          // if(type){
          //     each(this.btnDom,function(value:any,key:any){
          //         value&&removeEvent(value,"click",that.btnFn[key]),that.btnDom[key] = null,that.btnFn[key] = null;
          //     })
          // }
      };
      stlLayer.prototype.appendDom = function (dom, parent) {
          var parentDom = parent ? parent : document.body;
          parentDom.appendChild(dom);
      };
      stlLayer.prototype.autoClose = function (type, dom, time, end) {
          var that = this;
          this.timeoutList[type] = setTimeout(function () {
              //document.body.removeChild(dom);
              //if(that.bgDom)document.body.removeChild(that.bgDom),that.bgDom = null;
              that.closeBoxFn(dom);
              if (that.bgDom)
                  that.closeBoxFn(that.bgDom), that.bgDom = null;
              that.timeoutList[type] = null;
              try {
                  end && end();
              }
              catch (e) { }
          }, time);
      };
      stlLayer.prototype.loading = function (data) {
          var obj = mergeOptions({}, this.loadObj.parameter, data);
          if (data.parent) {
              this.parentLoad(obj);
          }
          else {
              this.noParentLoad(obj);
          }
      };
      stlLayer.prototype.getLoadDom = function (obj, className) {
          var imgStr = "<img src=\"" + obj.img + "\" style=\"width:" + obj.width + "px;height:" + obj.height + "px;display:block;\" />";
          return this.getDomStr(imgStr, className);
      };
      stlLayer.prototype.parentLoad = function (obj) {
          var dom = this.getLoadDom(obj, this.loadObj.pClassName);
          var bg = this.getBgDom(this.loadObj.pBgClassName);
          this.appendDom(bg, obj.parent);
          this.appendDom(dom, obj.parent);
          this.times++;
      };
      stlLayer.prototype.noParentLoad = function (obj) {
          var load = document.getElementsByClassName("stl-layer-loading");
          if (load.length > 0)
              return;
          var dom = this.getLoadDom(obj, this.loadObj.className);
          if (obj.bg) {
              var bg = this.getBgDom(this.loadObj.bgClassName);
              this.appendDom(bg);
          }
          this.appendDom(dom);
          this.times++;
      };
      stlLayer.prototype.closeLoad = function (parent) {
          var parentDom = document, removeDom = document.body, ClassName = "stl-layer-loading", BgClassName = "stl-layer-loading-bg";
          if (parent) {
              parentDom = parent,
                  removeDom = parent,
                  ClassName = "stl-layer-parent-loading",
                  BgClassName = "stl-layer-parent-loading-bg";
          }
          var load = parentDom.getElementsByClassName(ClassName);
          var dom = parentDom.getElementsByClassName(BgClassName);
          if (load.length > 0)
              removeDom.removeChild(load[0]);
          if (dom.length > 0)
              removeDom.removeChild(dom[0]);
      };
      stlLayer.prototype.tips = function (that, content, data, end) {
          if (data === void 0) { data = {}; }
          var obj = mergeOptions({}, this.tipObj.parameter, data);
          var styleStr = obj.maxWidth ? "max-width:" + obj.maxWidth + "px" : "";
          var str = "<div class=\"" + this.tipObj.ContentClassName + "\">\n                <p class=\"" + this.tipObj.className + "-p\" style=\"" + styleStr + "\">" + content + "</p>\n                <em class=\"" + this.tipObj.className + "-em " + this.tipObj.className + "-em-" + obj.position + "\"></em>\n            </div>";
          var dom = this.getDomStr(str, this.tipObj.className + " " + this.tipObj.hideClassName + " " + this.tipObj.transitionClassName);
          this.getTipPosition(dom, that, obj);
          this.times++;
          this.autoClose("tips", dom, obj.time, end);
      };
      // closeTips(dom:HTMLElement){
      //     dom.removeChild(document.getElementsByClassName("stl-layer-tip")[0])
      // }
      stlLayer.prototype.getTipPosition = function (dom, that, obj) {
          var left = that.getBoundingClientRect().left;
          var top = that.getBoundingClientRect().top;
          var width = that.offsetWidth;
          var height = that.offsetHeight;
          document.body.appendChild(dom);
          this.removeHide(dom);
          var domWidth = dom.offsetWidth;
          var domHeight = dom.offsetHeight;
          var leftNum = left + width / 2 - domWidth / 2;
          var domLeft = leftNum < 0 ? 0 : leftNum;
          var topNum = top + height / 2 - domHeight / 2;
          var domTop = topNum < 0 ? 0 : topNum;
          var emDom = dom.getElementsByClassName(this.tipObj.className + "-em")[0];
          switch (obj.position) {
              case "top":
                  var positionTop = top - domHeight - 8;
                  dom.style.left = domLeft + "px";
                  if (top + positionTop < 0)
                      dom.style.top = (top + height + 8) + "px",
                          removeClass(emDom, this.tipObj.className + "-em-" + obj.position),
                          addClass(emDom, this.tipObj.className + "-em-bottom");
                  else
                      dom.style.top = positionTop + "px";
                  break;
              case "bottom":
                  var positionBottom = top + height + 8;
                  dom.style.left = domLeft + "px";
                  if (top + positionBottom + domHeight > document.body.clientHeight)
                      dom.style.top = (top - domHeight - 8) + "px",
                          removeClass(emDom, this.tipObj.className + "-em-" + obj.position),
                          addClass(emDom, this.tipObj.className + "-em-top");
                  else
                      dom.style.top = positionBottom + "px";
                  break;
              case "right":
                  var positionLeft = left + width + 8;
                  dom.style.top = domTop + "px";
                  if (left + positionLeft + domWidth > document.body.clientWidth)
                      dom.style.left = (left - domWidth - 8) + "px",
                          removeClass(emDom, this.tipObj.className + "-em-" + obj.position),
                          addClass(emDom, this.tipObj.className + "-em-left");
                  else
                      dom.style.left = positionLeft + "px";
                  break;
              case "left":
                  var positionRight = left - domWidth - 8;
                  dom.style.top = domTop + "px";
                  if (left + positionRight < 0)
                      dom.style.left = (left + width + 8) + "px",
                          removeClass(emDom, this.tipObj.className + "-em-" + obj.position),
                          addClass(emDom, this.tipObj.className + "-em-right");
                  else
                      dom.style.left = positionRight + "px";
          }
          removeClass(dom, "stl-layer-tip-hide");
      };
      stlLayer.prototype.custom = function (data) {
          var obj = mergeOptions({}, this.customObj.parameter, data), end = obj.endCallback ? obj.endCallback : null;
          var closeStr = obj.hasClose ? this.getCloseStr(this.customObj.closeClassName) : "";
          var dom = this.getDomStr(closeStr, this.customObj.className);
          var content = this.getCustomFn(obj);
          dom.appendChild(content);
          if (obj.bg)
              this.bgDom = this.getBgDom(this.customObj.bgClassName), this.addBgDom(end, obj.bgClose);
          this.appendDom(dom);
          this.removeHide(dom);
          this.times++;
          try {
              obj.showCallback && obj.showCallback.call(this);
          }
          catch (e) { }
          if (obj.hasClose) {
              var closeDom = dom.getElementsByClassName(this.customObj.closeClassName)[0];
              this.addCloseEventFn(closeDom, end);
          }
          if (obj.determineBtn) {
              var determineBox = dom.getElementsByClassName(this.customObj.determineClassName)[0];
              this.addOpenBtnFn(determineBox, obj.determineFn, end);
          }
          if (obj.cancelBtn) {
              var cancelBox = dom.getElementsByClassName(this.customObj.cancelClassName)[0];
              this.addOpenBtnFn(cancelBox, obj.cancelFn, end);
          }
      };
      stlLayer.prototype.getCustomFn = function (obj) {
          var dom = document.createElement("div");
          dom.className = this.customObj.contentClassName;
          if (typeof obj.content === "string") {
              dom.innerHTML = obj.content;
          }
          else {
              dom.appendChild(obj.content);
          }
          this.getCustomBtnFn(dom, obj);
          return dom;
      };
      stlLayer.prototype.getCustomBtnFn = function (dom, obj) {
          if (obj.determineBtn || obj.cancelBtn) {
              var box = document.createElement("div");
              box.className = this.customObj.footClassName;
              var str = (obj.determineBtn ? "<div class=\"stl-layer-custom-btn " + this.customObj.determineClassName + "\">" + obj.determineText + "</div>" : "") + "\n                        " + (obj.cancelBtn ? "<div class=\"stl-layer-custom-btn " + this.customObj.cancelClassName + "\">" + obj.cancelText + "</div>" : "");
              box.innerHTML = str;
              dom.appendChild(box);
          }
      };
      return stlLayer;
  }());
  var layer = new stlLayer();

  /**
   * 绑定方法
   * @param {Element} obj 绑定的元素
   * @param {String} type 方法名称
   * @param {function} fn  绑定的方法
   */
  var addEvent$1 = function (obj, type, fn) {
      if (obj.addEventListener) {
          obj.addEventListener(type, fn, false);
      }
      else {
          obj['e' + type + fn] = fn;
          obj[type + fn] = function () { obj['e' + type + fn](window.event); };
          obj.attachEvent('on' + type, obj[type + fn]);
      }
  };
  var btn = document.getElementById("btn");
  var btn1 = document.getElementById("btn1");
  var btn2 = document.getElementById("btn2");
  var btn3 = document.getElementById("btn3");
  var btn4 = document.getElementById("btn4");
  var btn5 = document.getElementById("btn5");
  var btn6 = document.getElementById("btn6");
  addEvent$1(btn, "click", function () {
      layer.msg("不开心。。。", { icon: 11, time: 3000 });
  });
  addEvent$1(btn1, "click", function () {
      layer.alert({
          icon: 11,
          className: "abcedf",
          content: "这是一个自定义alert",
          //title:"这是一个标题",
          autoClose: true,
          btnStr: "<p data-link='https://www.baidu.com' style='padding:0;margin:0'>查看详情</p>",
          btnCallback: function (e) {
              console.log(e.target);
          }
      });
  });
  addEvent$1(btn2, "click", function () {
      layer.open({
          title: "这是一个标题",
          content: "这是一段内容这是一段内容这是一段内容这是一段内容这是一段内容这是一段内容这是一段内容",
          icon: 11,
          iconColor: "#00ff00",
          determineBtn: true,
          type: 2,
          cancelBtn: true,
          determineFn: function () {
              console.log("点击了确定");
          },
          cancelFn: function () {
              console.log("点击了取消");
          }
      });
  });
  addEvent$1(btn3, "click", function () {
      layer.msg("msg...", { icon: 11 });
      // layer.modal({
      //     title:"这是一个标题",
      //     content:"这是一段内容这是一段内容这是一段内容这是一段内容这是一段内容这是一段内容这是一段内容",
      //     determineFn:()=>{
      //         console.log("点击了确定")
      //     },
      //     cancelFn:()=>{
      //         console.log("点击了取消")
      //     }
      // })
  });
  addEvent$1(btn4, "click", function () {
      layer.loading({
          img: "./loading.gif",
          width: 60,
          height: 60,
          parent: document.getElementById("parent_box")
      });
  });
  addEvent$1(btn5, "click", function () {
      layer.tips(this, "这是一条tips这是一条tips这是一条tips这是一条tips这是一条tips", { position: "left" });
  });
  addEvent$1(btn6, "click", function () {
      layer.custom({
          content: "<p>523423423423423423423423<p><p>523423423423423423423423<p><p>523423423423423423423423<p><p>523423423423423423423423<p><p>523423423423423423423423<p>",
          determineBtn: true,
          cancelBtn: true
      });
  });

  exports.addEvent = addEvent$1;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=index.js.map
