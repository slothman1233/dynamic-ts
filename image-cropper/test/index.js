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

  function IMG_CROPPER_BOX_TEMPLATE(type) {
      return "<div class=\"cropper-container\">\n                <div class=\"cropper-wrap-box\">\n                    <div class=\"cropper-canvas\"></div>\n                </div>\n                <div class=\"cropper-drag-box\"></div>\n                <div class=\"cropper-crop-box\">\n                    <span class=\"cropper-view-box\"></span>\n                    <span class=\"cropper-dashed dashed-h\"></span>\n                    <span class=\"cropper-dashed dashed-v\"></span>\n                    <span class=\"cropper-center\"></span>\n                    <span class=\"cropper-face\"></span>\n                    <span class=\"cropper-line line-e" + (type === 1 ? "" : " cropper-auto") + "\" data-action=\"e\"></span>\n                    <span class=\"cropper-line line-n" + (type === 1 ? "" : " cropper-auto") + "\" data-action=\"n\"></span>\n                    <span class=\"cropper-line line-w" + (type === 1 ? "" : " cropper-auto") + "\" data-action=\"w\"></span>\n                    <span class=\"cropper-line line-s" + (type === 1 ? "" : " cropper-auto") + "\" data-action=\"s\"></span>\n                    " + (type === 1 ? "<span class=\"cropper-point point-e\" data-action=\"e\"></span>\n                                <span class=\"cropper-point point-n\" data-action=\"n\"></span>\n                                <span class=\"cropper-point point-w\" data-action=\"w\"></span>\n                                <span class=\"cropper-point point-s\" data-action=\"s\"></span>\n                                <span class=\"cropper-point point-ne\" data-action=\"ne\"></span>\n                                <span class=\"cropper-point point-nw\" data-action=\"nw\"></span>\n                                <span class=\"cropper-point point-sw\" data-action=\"sw\"></span>\n                                <span class=\"cropper-point point-se\" data-action=\"se\"></span>"
          : "") + "\n                </div>\n            </div>";
  }
  //样式表
  var IMG_CROPPER_STYLE_STRING = ".cropper-input-box{width:108px;height:86px;position:relative;left:50%;top:50%;transform:translate(-50%,-50%);\n                                    background:url(https://imgs.wbp5.com/api/secrecymaster/html_up/2018/12/20181222150023236.png) no-repeat;background-size:100% 100%;}\n                                .cropper-input-box .cropper-input{width:108px;height:86px;position:absolute;top:0;left:0;display:block;opacity:0;}\n                                .cropper-container {font-size: 0;line-height: 0;position: relative;-webkit-user-select: none;-moz-user-select: none;\n                                    -ms-user-select: none;user-select: none;direction: ltr;-ms-touch-action: none;touch-action: none;display:none;}\n                                .cropper-container img {display: block;min-width: 0 !important;max-width: none !important;min-height: 0 !important;\n                                    max-height: none !important;width: 100%;height: auto;image-orientation: 0deg}\n                                .cropper-wrap-box,.cropper-canvas,.cropper-drag-box,.cropper-crop-box,.cropper-modal {\n                                    position: absolute;top: 0;right: 0;bottom: 0;left: 0;}\n                                .cropper-wrap-box {overflow: hidden;}\n                                .cropper-drag-box {opacity: 0;background-color: #fff;}\n                                .cropper-modal {opacity: .5;background-color: #000;} \n                                .cropper-view-box {display: block;overflow: hidden;width: 100%;height: 100%;outline: 1px solid #39f;outline-color: rgba(51, 153, 255, 0.75);} \n                                .cropper-dashed {position: absolute;display: block;opacity: .5;border: 0 dashed #eee}\n                                .cropper-dashed.dashed-h {top: 33.33333%;left: 0;width: 100%;height: 33.33333%;border-top-width: 1px;border-bottom-width: 1px}\n                                .cropper-dashed.dashed-v {top: 0;left: 33.33333%;width: 33.33333%;height: 100%;border-right-width: 1px;border-left-width: 1px}\n                                .cropper-center {position: absolute;top: 50%;left: 50%;display: block;width: 0;height: 0;opacity: .75} \n                                .cropper-center:before,.cropper-center:after {position: absolute;display: block;content: ' ';background-color: #eee}\n                                .cropper-center:before {top: 0;left: -3px;width: 7px;height: 1px}\n                                .cropper-center:after {top: -3px;left: 0;width: 1px;height: 7px}  \n                                .cropper-face,.cropper-line,.cropper-point {\n                                    position: absolute;display: block;width: 100%;height: 100%;opacity: .1;}\n                                .cropper-face {top: 0;left: 0;background-color: #fff;}\n                                .cropper-line {background-color: #39f}\n                                .cropper-line.line-e {top: 0;right: -3px;width: 5px;cursor: e-resize}\n                                .cropper-line.line-n {top: -3px;left: 0;height: 5px;cursor: n-resize}\n                                .cropper-line.line-w {top: 0;left: -3px;width: 5px;cursor: w-resize}\n                                .cropper-line.line-s {bottom: -3px;left: 0;height: 5px;cursor: s-resize}\n                                .cropper-point {width: 5px;height: 5px;opacity: .75;background-color: #39f}\n                                .cropper-point.point-e {top: 50%;right: -3px;margin-top: -3px;cursor: e-resize}\n                                .cropper-point.point-n {top: -3px;left: 50%;margin-left: -3px;cursor: n-resize} \n                                .cropper-point.point-w {top: 50%;left: -3px;margin-top: -3px;cursor: w-resize}\n                                .cropper-point.point-s {bottom: -3px;left: 50%;margin-left: -3px;cursor: s-resize}\n                                .cropper-point.point-ne {top: -3px;right: -3px;cursor: ne-resize}\n                                .cropper-point.point-nw {top: -3px;left: -3px;cursor: nw-resize}\n                                .cropper-point.point-sw {bottom: -3px;left: -3px;cursor: sw-resize}\n                                .cropper-point.point-se {right: -3px;bottom: -3px;width: 20px;height: 20px;cursor: se-resize;opacity: 1}  \n                                @media (min-width: 768px) {\n                                    .cropper-point.point-se {width: 15px;height: 15px}\n                                }  \n                                @media (min-width: 992px) { \n                                    .cropper-point.point-se {width: 10px;height: 10px}\n                                }\n                                @media (min-width: 1200px) {\n                                    .cropper-point.point-se {width: 5px;height: 5px;opacity: .75}\n                                }\n                                .cropper-point.point-se:before {\n                                    position: absolute;right: -50%;bottom: -50%;display: block;width: 200%;height: 200%;content: ' ';opacity: 0;background-color: #39f\n                                }  \n                                .cropper-invisible {opacity: 0;} \n                                .cropper-bg {\n                                    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC');\n                                }\n                                .cropper-hide {position: absolute;display: block;width: 0;height: 0;}\n                                .cropper-hidden {display: none !important;}\n                                .cropper-move {cursor: move;}\n                                .cropper-auto{cursor:auto !import;}\n                                .cropper-crop {cursor: crosshair; }\n                                .cropper-disabled .cropper-drag-box,.cropper-disabled .cropper-face,.cropper-disabled .cropper-line,.cropper-disabled .cropper-point {cursor: not-allowed;} ";

  function addStyleFn() {
      var styleList = document.getElementsByTagName("style");
      for (var i = 0; i < styleList.length; i++) { //如果已经添加了样式则不再添加
          if (styleList[i].getAttribute("name") === "imageCropper")
              return;
      }
      var styleLable = document.createElement("style");
      styleLable.tyle = "text/css";
      styleLable.setAttribute("name", "imageCropper");
      styleLable.innerHTML = IMG_CROPPER_STYLE_STRING;
      document.getElementsByTagName("head")[0].appendChild(styleLable);
  }
  function IE_VERSION() {
      var USER_AGENT = window.navigator && window.navigator.userAgent || '';
      var isIE = USER_AGENT.indexOf("compatible") > -1 && USER_AGENT.indexOf("MSIE") > -1; //判断是否IE<11浏览器  
      if (isIE) {
          var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
          reIE.test(USER_AGENT);
          var fIEVersion = parseFloat(RegExp["$1"]);
          return fIEVersion >= 7 ? fIEVersion : 6;
      }
      var isEdge = USER_AGENT.indexOf("Edge") > -1; //判断是否IE的Edge浏览器  
      if (isEdge) {
          return 'edge'; //edge
      }
      var isIE11 = USER_AGENT.indexOf('Trident') > -1 && USER_AGENT.indexOf("rv:11.0") > -1;
      if (isIE11) {
          return 11; //IE11  
      }
      return -1; //不是ie浏览器
  }
  function getImageSize(src, fn) {
      var that = this;
      var img = new Image();
      img.src = src;
      img.onload = function () {
          var size = { width: img.width, height: img.height };
          if (fn) {
              return fn.call(that, size);
          }
          return size;
      };
  }
  function getTransform(dom, val) {
      dom.style.transform = val;
      dom.style.msTransform = val;
      dom.style.mozTransform = val;
      dom.style.webkitTransform = val;
      dom.style.oTransform = val;
  }

  var imageCropper = /** @class */ (function () {
      function imageCropper(optionObj) {
          this.dragPosition = { x: 0, y: 0 }; //拖拽的起始位置
          this.zoom = 1; //图片当前缩放比例
          this.imgSize = {}; //裁剪的图片原尺寸
          this.canvasSize = {}; //图片的尺寸对象
          this.initCanvasSize = {}; //初始的图片尺寸对象
          this.cropperSize = {}; //裁剪框尺寸对象
          this.previewObj = []; //预览框尺寸对象数组
          this.magnifyFn = function () { }; //放大图片的回调方法
          this.shrinkFn = function () { }; //缩小图片的回调方法
          this.moveLeftFn = function () { }; //裁剪框左移的回调方法
          this.moveRightFn = function () { }; //裁剪框右移的回调方法
          this.moveUpFn = function () { }; //裁剪框上移的回调方法
          this.moveDownFn = function () { }; //裁剪框下移的回调方法
          this.initOption(optionObj); //初始化参数
          if (this.option.addStyle) { //通过js的方式添加样式
              addStyleFn();
          }
          this.initFn(); //初始化方法
      }
      imageCropper.prototype.initOption = function (option) {
          var obj = {
              addStyle: true,
              zoomMultiple: 20,
              zoomScale: 0.05,
              cropperBoxWidth: 200,
              cropperBoxHeight: 200,
              fixedCropSize: false,
              moveStep: 10,
              getImgCallback: null,
          };
          this.option = mergeOptions({}, obj, option);
      };
      imageCropper.prototype.initFn = function () {
          var that = this, type = that.option.fixedCropSize ? 2 : 1;
          that.cropperScale = that.option.cropperBoxWidth / that.option.cropperBoxHeight;
          that.option.ele.innerHTML = IMG_CROPPER_BOX_TEMPLATE(type);
          that.getDom(); //获取dom及父元素尺寸
          that.getContainerStyle();
          that.option.cropInitComplete && that.option.cropInitComplete.call(that); //裁剪框元素初始化完成的回调
          if (that.option.src) { //如果传入了初始化图片则添加图片
              that.fileSrc = that.option.src;
              getImageSize.call(that, that.fileSrc, that.inputFn); //获取上传的图片尺寸
          }
          if (that.option.inputBox) { //如果传入了上传图片标签则添加上传图片事件
              if (that.option.inputBox.tagName !== "INPUT" || that.option.inputBox.type !== "file")
                  return console.log("上传图片标签不是input标签或者type不为file");
              that.$inputBox = that.option.inputBox;
              that.addInputEvent();
          }
          that.stateCallback(); //声明回调方法
      };
      imageCropper.prototype.changeImg = function (src) {
          var that = this;
          that.fileSrc = src;
          getImageSize.call(that, that.fileSrc, that.inputFn); //获取上传的图片尺寸
      };
      imageCropper.prototype.getContainerStyle = function () {
          var that = this;
          that.$cropperContainer.className += " cropper-bg"; //设置裁剪框背景
          that.$cropperContainer.style.width = that.width + "px"; //设置裁剪背景框尺寸
          that.$cropperContainer.style.height = that.height + "px";
          that.$cropperDragBox.className += " cropper-modal cropper-move"; //设置透明背景层
          that.$cropperFaceBox.className += " cropper-move";
      };
      imageCropper.prototype.getDom = function () {
          var that = this;
          var parentDom = that.option.ele;
          that.width = parentDom.clientWidth;
          that.height = parentDom.clientHeight;
          that.$cropperContainer = parentDom.getElementsByClassName("cropper-container")[0];
          that.$cropperCropBox = parentDom.getElementsByClassName("cropper-crop-box")[0];
          that.$cropperViewBox = that.$cropperCropBox.getElementsByClassName("cropper-view-box")[0];
          that.$cropperCanvasBox = parentDom.getElementsByClassName("cropper-canvas")[0];
          that.$cropperDragBox = parentDom.getElementsByClassName("cropper-drag-box")[0];
          that.$cropperFaceBox = that.$cropperCropBox.getElementsByClassName("cropper-face")[0];
          that.$cropperLineE = that.$cropperCropBox.getElementsByClassName("line-e")[0];
          that.$cropperPointE = that.$cropperCropBox.getElementsByClassName("point-e")[0];
          that.$cropperPointNe = that.$cropperCropBox.getElementsByClassName("point-ne")[0];
          that.$cropperLineN = that.$cropperCropBox.getElementsByClassName("line-n")[0];
          that.$cropperPointN = that.$cropperCropBox.getElementsByClassName("point-n")[0];
          that.$cropperPointNw = that.$cropperCropBox.getElementsByClassName("point-nw")[0];
          that.$cropperLineW = that.$cropperCropBox.getElementsByClassName("line-w")[0];
          that.$cropperPointW = that.$cropperCropBox.getElementsByClassName("point-w")[0];
          that.$cropperPointSw = that.$cropperCropBox.getElementsByClassName("point-sw")[0];
          that.$cropperLineS = that.$cropperCropBox.getElementsByClassName("line-s")[0];
          that.$cropperPointS = that.$cropperCropBox.getElementsByClassName("point-s")[0];
          that.$cropperPointSe = that.$cropperCropBox.getElementsByClassName("point-se")[0];
      };
      imageCropper.prototype.addInputEvent = function () {
          var that = this;
          addEvent(that.$inputBox, "input", function (e) {
              var ie_version = IE_VERSION();
              if (ie_version !== "edge" && ie_version > 0 && ie_version < 10) {
                  that.fileSrc = e.target.value;
              }
              else {
                  var file = this.files[0];
                  that.fileSrc = file ? URL.createObjectURL(file) : ""; //获取上传的图片
              }
              e.target.type = "text";
              e.target.type = "file";
              that.option.inputImgComplete && that.option.inputImgComplete.call(that, this);
              if (that.fileSrc && that.fileSrc !== "") {
                  getImageSize.call(that, that.fileSrc, that.inputFn); //获取上传的图片尺寸
              }
          });
      };
      imageCropper.prototype.inputFn = function (size) {
          var that = this;
          that.dragPosition = { x: 0, y: 0 }; //拖拽的起始位置
          that.zoom = 1; //图片当前缩放比例
          that.zoomNumber = 0; //当前放大或缩小的值
          that.computeCanvasSize(size);
          that.computeCropperSize();
          show(that.$cropperContainer); //显示裁剪框
          that.addCropperEvent();
          that.previewImg();
      };
      imageCropper.prototype.previewImg = function () {
          var that = this;
          if (!that.option.previewBox)
              return;
          if (that.previewObj.length > 0) {
              for (var y = 0; y < that.previewObj.length; y++) {
                  that.previewObj[y].imgBox.src = that.fileSrc;
                  that.getPreviewImgSize(y);
              }
          }
          else {
              that.previewList = (Object.prototype.toString.call(that.option.previewBox) === "[object HTMLCollection]" || Object.prototype.toString.call(that.option.previewBox) === "[object Array]") ?
                  that.option.previewBox : [that.option.previewBox];
              for (var i = 0; i < that.previewList.length; i++) {
                  that.addPreviewImg(that.previewList[i], i);
              }
          }
      };
      imageCropper.prototype.addPreviewImg = function (dom, index) {
          var that = this;
          that.previewObj.push({
              previewWidth: dom.clientWidth,
              previewHeight: dom.clientHeight,
              imgBox: document.createElement("img")
          });
          var imgBox = that.previewObj[index].imgBox;
          imgBox.src = that.fileSrc;
          that.getPreviewImgSize(index);
          dom.appendChild(imgBox);
      };
      imageCropper.prototype.updatePreviewImgSize = function () {
          var that = this;
          if (that.previewObj.length === 0)
              return;
          for (var i = 0; i < that.previewObj.length; i++) {
              that.getPreviewImgSize(i);
          }
      };
      imageCropper.prototype.getPreviewImgSize = function (index) {
          var that = this, imgBox = that.previewObj[index].imgBox;
          imgBox.style.width = (that.canvasSize.width * that.previewObj[index].previewWidth / that.cropperSize.width) + "px";
          imgBox.style.height = (that.canvasSize.height * that.previewObj[index].previewHeight / that.cropperSize.height) + "px";
          getTransform(imgBox, "translate(" + (that.canvasSize.x - that.cropperSize.x) * that.previewObj[index].previewWidth / that.cropperSize.width + "px,\n                            " + (that.canvasSize.y - that.cropperSize.y) * that.previewObj[index].previewHeight / that.cropperSize.height + "px)");
      };
      imageCropper.prototype.computeCanvasSize = function (size) {
          var that = this;
          that.imgSize.width = size.width;
          that.imgSize.height = size.height;
          var aspectRatio = size.width / size.height; //获取图片的宽高比例
          var canvasWidth = that.width;
          var canvasHeight = that.height;
          if (that.width * aspectRatio > that.height) { //计算裁剪框背景图片的宽高
              canvasHeight = that.width / aspectRatio;
          }
          else {
              canvasWidth = that.height * aspectRatio;
          }
          that.canvasSize = {
              width: canvasWidth,
              height: canvasHeight,
              x: that.width > canvasWidth ? (that.width - canvasWidth) / 2 : 0,
              y: that.height > canvasHeight ? (that.height - canvasHeight) / 2 : 0,
          };
          that.initCanvasSize = JSON.parse(JSON.stringify(that.canvasSize)); //保存裁剪框背景图片宽高的初始值
          that.addImage(canvasWidth, canvasHeight); //添加图片
          that.getCanvasSize(); //设置背景框尺寸
      };
      imageCropper.prototype.computeCropperSize = function () {
          var that = this;
          that.cropperSize = {
              width: that.option.cropperBoxWidth,
              height: that.option.cropperBoxHeight,
              x: (that.width - that.option.cropperBoxWidth) / 2,
              y: (that.height - that.option.cropperBoxHeight) / 2
          };
          that.getCropperSize(); //设置裁剪框尺寸
      };
      imageCropper.prototype.addImage = function (canvasWidth, canvasHeight) {
          var that = this;
          var imgStr = "<img src=\"" + that.fileSrc + "\" style=\"width:" + canvasWidth + "px;height:" + canvasHeight + "px\" />";
          that.$cropperViewBox.innerHTML = imgStr; //添加图片
          that.$cropperCanvasBox.innerHTML = imgStr;
      };
      imageCropper.prototype.getCanvasSize = function (key) {
          var that = this;
          that.$cropperCanvasBox.style.width = that.canvasSize.width + "px"; //设置图片尺寸
          that.$cropperCanvasBox.style.height = that.canvasSize.height + "px";
          getTransform(that.$cropperCanvasBox, "translate(" + that.canvasSize.x + "px, " + that.canvasSize.y + "px)");
          if (key) {
              var canvasImgDom = that.$cropperCanvasBox.getElementsByTagName("img")[0];
              canvasImgDom.style.width = that.canvasSize.width + "px";
              canvasImgDom.style.height = that.canvasSize.height + "px";
          }
      };
      imageCropper.prototype.getCropperSize = function () {
          var that = this;
          that.$cropperCropBox.style.width = that.cropperSize.width + "px";
          that.$cropperCropBox.style.height = that.cropperSize.height + "px";
          getTransform(that.$cropperCropBox, "translate(" + that.cropperSize.x + "px, " + that.cropperSize.y + "px)");
          that.getCropperImgSize();
      };
      imageCropper.prototype.getCropperImgSize = function (key) {
          var that = this;
          var cropperImg = that.$cropperCropBox.getElementsByTagName("img")[0];
          getTransform(cropperImg, "translate(" + (that.canvasSize.x - that.cropperSize.x) + "px, " + (that.canvasSize.y - that.cropperSize.y) + "px)");
          if (key) {
              cropperImg.style.width = that.canvasSize.width + "px";
              cropperImg.style.height = that.canvasSize.height + "px";
          }
      };
      imageCropper.prototype.addCropperEvent = function () {
          var that = this;
          var USER_AGENT = window.navigator && window.navigator.userAgent || '';
          var IS_FIREFOX = (/Firefox/i).test(USER_AGENT); //判断是否是火狐浏览器
          //-------滚动鼠标滚轮----
          var onMousewheel = function (event) {
              var ev = event || window.event;
              that.mousewheelFn.call(that, ev);
              that.updatePreviewImgSize();
          };
          if (IS_FIREFOX) { //滚动鼠标滚轮放大图片兼容火狐浏览器
              removeEvent(that.option.ele, "DOMMouseScroll", onMousewheel);
              addEvent(that.option.ele, "DOMMouseScroll", onMousewheel);
          }
          else {
              removeEvent(that.option.ele, "mousewheel", onMousewheel);
              addEvent(that.option.ele, "mousewheel", onMousewheel);
          }
          //-------拖拽-----
          var onMousedown = function (event) {
              var ev = event || window.event;
              that.dragDom = ev.target;
              that.dragPosition = {
                  x: ev.clientX,
                  y: ev.clientY,
              };
          };
          removeEvent(that.option.ele, "mousedown", onMousedown);
          addEvent(that.option.ele, "mousedown", onMousedown); //鼠标按下事件
          var onMousemove = function (event) {
              if (!that.dragDom)
                  return;
              var ev = event || window.event;
              var dragDistance = {
                  x: ev.clientX - that.dragPosition.x,
                  y: ev.clientY - that.dragPosition.y,
              };
              that.dragPosition.x = ev.clientX;
              that.dragPosition.y = ev.clientY;
              that.mousemoveTypeFn(dragDistance);
              that.updatePreviewImgSize();
          };
          removeEvent(document, "mousemove", onMousemove);
          addEvent(document, "mousemove", onMousemove); //拖拽事件
          var onMouseup = function () {
              that.dragDom = null;
              that.dragPosition = { x: 0, y: 0, };
          };
          removeEvent(document, "mouseup", onMouseup);
          addEvent(document, "mouseup", onMouseup); //鼠标松开事件
      };
      imageCropper.prototype.mousewheelFn = function (event) {
          try {
              if (event && event.preventDefault) {
                  event.preventDefault(); //阻止默认浏览器动作(W3C)
              }
              else {
                  window.event.returnValue = false; //IE中阻止函数器默认动作的方式 
              }
          }
          catch (e) { }
          var that = this, down;
          try {
              down = event.wheelDelta || -event.detail;
          }
          catch (e) { }
          that.zoomNumber = down > 0 ? that.option.zoomScale : -that.option.zoomScale; //计算缩放比例
          var newZoom = that.zoom + that.zoomNumber;
          that.imgZoomFn(newZoom);
      };
      imageCropper.prototype.imgZoomFn = function (newZoom) {
          var that = this;
          if (newZoom < 1 / that.option.zoomMultiple || newZoom > that.option.zoomMultiple)
              return "已超出最大缩放尺寸";
          that.zoom = newZoom;
          that.canvasSize.width = that.initCanvasSize.width * that.zoom;
          that.canvasSize.height = that.initCanvasSize.height * that.zoom;
          that.canvasSize.x -= that.initCanvasSize.width * that.zoomNumber / 2;
          that.canvasSize.y -= that.initCanvasSize.height * that.zoomNumber / 2;
          that.getCanvasSize(true);
          that.getCropperImgSize(true);
      };
      imageCropper.prototype.mousemoveTypeFn = function (dragDistance) {
          var that = this;
          if (that.option.fixedCropSize) { //如果固定
              switch (that.dragDom) {
                  case that.$cropperDragBox: //拖拽图片
                      that.mousemoveImgFn(dragDistance);
                      break;
                  case that.$cropperFaceBox: //拖拽裁剪框内部
                      that.mousemoveCropperFn(dragDistance);
                      break;
              }
          }
          else {
              switch (that.dragDom) {
                  case that.$cropperDragBox: //拖拽图片
                      that.mousemoveImgFn(dragDistance);
                      break;
                  case that.$cropperFaceBox: //拖拽裁剪框内部
                      that.mousemoveCropperFn(dragDistance);
                      break;
                  case that.$cropperLineE:
                  case that.$cropperPointE: //右
                      that.cropperRight(dragDistance);
                      that.cropperTransform();
                      break;
                  case that.$cropperLineS:
                  case that.$cropperPointS: //下
                      that.cropperDown(dragDistance);
                      that.cropperTransform();
                      break;
                  case that.$cropperPointSe: //右下角
                      that.cropperRightDown(dragDistance);
                      break;
                  case that.$cropperPointNe: //右上角
                      that.cropperRightUp(dragDistance);
                      that.cropperTransform();
                      break;
                  case that.$cropperLineN:
                  case that.$cropperPointN: //上
                      that.cropperUp(dragDistance);
                      that.cropperTransform();
                      break;
                  case that.$cropperLineW:
                  case that.$cropperPointW: //左
                      that.cropperLeft(dragDistance);
                      that.cropperTransform();
                      break;
                  case that.$cropperPointNw: //左上角
                      that.cropperLeftUp(dragDistance);
                      that.cropperTransform();
                      break;
                  case that.$cropperPointSw: //左下角
                      that.cropperLeftDown(dragDistance);
                      that.cropperTransform();
                      break;
              }
          }
      };
      imageCropper.prototype.moveReturn = function () {
          var that = this;
          that.dragDom = null;
          that.dragPosition = {
              x: 0,
              y: 0,
          };
      };
      imageCropper.prototype.cropperRight = function (dragDistance) {
          var that = this;
          if (that.cropperSize.y - dragDistance.x / (2 * that.cropperScale) <= 0)
              return; //裁剪框上边超出
          if (that.cropperRightDown(dragDistance))
              that.cropperSize.y -= (dragDistance.x / (2 * that.cropperScale));
      };
      imageCropper.prototype.cropperDown = function (dragDistance) {
          var that = this;
          if (that.cropperSize.x - dragDistance.y * that.cropperScale / 2 <= 0)
              return; //裁剪框左边超出
          if (that.cropperSize.width + dragDistance.y * that.cropperScale / 2 + that.cropperSize.x >= that.width)
              return; //裁剪框右边超出
          if (that.cropperSize.height + dragDistance.y + that.cropperSize.y >= that.height)
              return; //裁剪框下边超出
          if (that.cropperSize.width + dragDistance.y * that.cropperScale <= 10 || that.cropperSize.height + dragDistance.y <= 10)
              return; //裁剪框高宽为0
          that.cropperSize.x -= (dragDistance.y * that.cropperScale / 2);
          that.cropperSize.width += dragDistance.y * that.cropperScale;
          that.cropperSize.height += dragDistance.y;
          that.$cropperCropBox.style.width = that.cropperSize.width + "px";
          that.$cropperCropBox.style.height = that.cropperSize.height + "px";
      };
      imageCropper.prototype.cropperUp = function (dragDistance) {
          var that = this;
          if (that.cropperSize.x + dragDistance.y * that.cropperScale / 2 <= 0)
              return; //裁剪框左边超出
          if (that.cropperRightUp(dragDistance))
              that.cropperSize.x += (dragDistance.y * that.cropperScale / 2);
      };
      imageCropper.prototype.cropperLeft = function (dragDistance) {
          var that = this;
          if (that.cropperSize.y + dragDistance.x / (2 * that.cropperScale) <= 0)
              return; //裁剪框上边超出
          if (that.cropperLeftDown(dragDistance))
              that.cropperSize.y += (dragDistance.x / (2 * that.cropperScale));
      };
      imageCropper.prototype.cropperRightDown = function (dragDistance) {
          var that = this;
          if (that.cropperSize.width + dragDistance.x <= 10 || that.cropperSize.height + dragDistance.x / that.cropperScale <= 10)
              return false; //裁剪框高宽为0
          if (that.cropperSize.width + dragDistance.x + that.cropperSize.x >= that.width)
              return false; //裁剪框右边超出
          if (that.cropperSize.height + dragDistance.x / that.cropperScale + that.cropperSize.y >= that.height)
              return false; //裁剪框下边超出
          that.cropperSize.width += dragDistance.x;
          that.cropperSize.height += dragDistance.x / that.cropperScale;
          that.$cropperCropBox.style.width = that.cropperSize.width + "px";
          that.$cropperCropBox.style.height = that.cropperSize.height + "px";
          return true;
      };
      imageCropper.prototype.cropperLeftDown = function (dragDistance) {
          var that = this;
          if (that.cropperSize.width - dragDistance.x <= 10 || that.cropperSize.height - dragDistance.x / that.cropperScale <= 10)
              return false; //裁剪框高宽为0
          if (that.cropperSize.x + dragDistance.x <= 0)
              return false; //裁剪框左边超出
          if (that.cropperSize.y + that.cropperSize.height - dragDistance.x / that.cropperScale >= that.height)
              return false; //裁剪框下边超出
          that.cropperSize.x += dragDistance.x;
          that.cropperSize.width -= dragDistance.x;
          that.cropperSize.height -= dragDistance.x / that.cropperScale;
          that.$cropperCropBox.style.width = that.cropperSize.width + "px";
          that.$cropperCropBox.style.height = that.cropperSize.height + "px";
          return true;
      };
      imageCropper.prototype.cropperRightUp = function (dragDistance) {
          var that = this;
          if (that.cropperSize.width - dragDistance.y * that.cropperScale <= 10 || that.cropperSize.height - dragDistance.y <= 10)
              return false; //裁剪框高宽为0
          if (that.cropperSize.y + dragDistance.y <= 0)
              return false; //裁剪框上边超出
          if (that.cropperSize.x + that.cropperSize.width - dragDistance.y * that.cropperScale >= that.width)
              return false; //裁剪框右边超出
          that.cropperSize.y += dragDistance.y;
          that.cropperSize.width -= dragDistance.y * that.cropperScale;
          that.cropperSize.height -= dragDistance.y;
          that.$cropperCropBox.style.width = that.cropperSize.width + "px";
          that.$cropperCropBox.style.height = that.cropperSize.height + "px";
          return true;
      };
      imageCropper.prototype.cropperLeftUp = function (dragDistance) {
          var that = this;
          if (that.cropperSize.width - dragDistance.y * that.cropperScale <= 10 || that.cropperSize.height - dragDistance.y <= 10)
              return false; //裁剪框高宽为0
          if (that.cropperSize.y + dragDistance.y <= 0)
              return false; //裁剪框上边超出
          if (that.cropperSize.x + dragDistance.y * that.cropperScale <= 0)
              return false; //裁剪框左边超出
          that.cropperSize.x += dragDistance.y * that.cropperScale;
          that.cropperSize.y += dragDistance.y;
          that.cropperSize.width -= dragDistance.y * that.cropperScale;
          that.cropperSize.height -= dragDistance.y;
          that.$cropperCropBox.style.width = that.cropperSize.width + "px";
          that.$cropperCropBox.style.height = that.cropperSize.height + "px";
          return true;
      };
      imageCropper.prototype.cropperTransform = function () {
          var that = this;
          getTransform(that.$cropperCropBox, "translate(" + that.cropperSize.x + "px, " + that.cropperSize.y + "px)");
          that.getCropperImgSize();
      };
      imageCropper.prototype.mousemoveImgFn = function (distance) {
          var that = this;
          that.initCanvasSize.x = that.canvasSize.x += distance.x;
          that.initCanvasSize.y = that.canvasSize.y += distance.y;
          getTransform(that.$cropperCanvasBox, "translate(" + that.canvasSize.x + "px, " + that.canvasSize.y + "px)");
          that.getCropperImgSize();
      };
      imageCropper.prototype.mousemoveCropperFn = function (distance) {
          var that = this, cropperRightMax = that.width - that.cropperSize.width - 1, cropperDownMax = that.height - that.cropperSize.height - 1, cropperDragX = that.cropperSize.x + distance.x, cropperDragY = that.cropperSize.y + distance.y;
          that.cropperSize.x = cropperDragX < 1 ? 1 : cropperDragX > cropperRightMax ? cropperRightMax : cropperDragX;
          that.cropperSize.y = cropperDragY < 1 ? 1 : cropperDragY > cropperDownMax ? cropperDownMax : cropperDragY;
          getTransform(that.$cropperCropBox, "translate(" + that.cropperSize.x + "px, " + that.cropperSize.y + "px)");
          that.getCropperImgSize();
      };
      imageCropper.prototype.stateCallback = function () {
          var that = this;
          that.magnifyFn = function () {
              if (!that.fileSrc)
                  return;
              that.zoomNumber = that.option.zoomScale;
              var newZoom = that.zoom + that.zoomNumber;
              that.imgZoomFn(newZoom);
              that.updatePreviewImgSize();
          };
          that.shrinkFn = function () {
              if (!that.fileSrc)
                  return;
              that.zoomNumber = -that.option.zoomScale;
              var newZoom = that.zoom + that.zoomNumber;
              that.imgZoomFn(newZoom);
              that.updatePreviewImgSize();
          };
          that.moveRightFn = function () {
              if (!that.fileSrc)
                  return;
              var obj = { x: that.option.moveStep, y: 0 };
              that.mousemoveCropperFn(obj);
              that.updatePreviewImgSize();
          };
          that.moveUpFn = function () {
              if (!that.fileSrc)
                  return;
              var obj = { x: 0, y: -that.option.moveStep };
              that.mousemoveCropperFn(obj);
              that.updatePreviewImgSize();
          };
          that.moveLeftFn = function () {
              if (!that.fileSrc)
                  return;
              var obj = { x: -that.option.moveStep, y: 0 };
              that.mousemoveCropperFn(obj);
              that.updatePreviewImgSize();
          };
          that.moveDownFn = function () {
              if (!that.fileSrc)
                  return;
              var obj = { x: 0, y: that.option.moveStep };
              that.mousemoveCropperFn(obj);
              that.updatePreviewImgSize();
          };
          if (that.option.magnifyBtn) {
              addEvent(that.option.magnifyBtn, "click", that.magnifyFn);
          }
          if (that.option.shrinkBtn) {
              addEvent(that.option.shrinkBtn, "click", that.shrinkFn);
          }
          if (that.option.moveLeftBtn) {
              addEvent(that.option.moveLeftBtn, "click", that.moveLeftFn);
          }
          if (that.option.moveRightBtn) {
              addEvent(that.option.moveRightBtn, "click", that.moveRightFn);
          }
          if (that.option.moveUpBtn) {
              addEvent(that.option.moveUpBtn, "click", that.moveUpFn);
          }
          if (that.option.moveDownBtn) {
              addEvent(that.option.moveDownBtn, "click", that.moveDownFn);
          }
          if (that.option.getImgBtn) {
              addEvent(that.option.getImgBtn, "click", function () {
                  that.getCropSize(that.option.getImgCallback);
              });
          }
      };
      imageCropper.prototype.getCropSize = function (fn) {
          var that = this;
          var canvas = document.createElement("canvas");
          var scale = that.imgSize.width / that.canvasSize.width;
          var imgSrc = that.$cropperCropBox.getElementsByTagName("img")[0].src;
          var img = new Image();
          img.src = imgSrc;
          img.crossorigin = "anonymous";
          canvas.width = that.cropperSize.width * scale;
          canvas.height = that.cropperSize.height * scale;
          var ctx = canvas.getContext("2d");
          img.onload = function () {
              ctx.drawImage(img, (that.cropperSize.x - that.canvasSize.x) * scale, (that.cropperSize.y - that.canvasSize.y) * scale, that.cropperSize.width * scale, that.cropperSize.height * scale, 0, 0, that.cropperSize.width * scale, that.cropperSize.height * scale);
              try {
                  fn && fn.call(that, canvas.toDataURL("image/png"));
              }
              catch (e) {
                  var obj = {
                      width: that.cropperSize.width * scale,
                      height: that.cropperSize.height * scale,
                      x: (that.cropperSize.x - that.canvasSize.x) * scale,
                      y: (that.cropperSize.y - that.canvasSize.y) * scale,
                      src: that.fileSrc
                  };
                  fn && fn.call(that, obj);
              }
          };
      };
      return imageCropper;
  }());

  var cropperBox = document.getElementById("img_cropper");
  var fd = document.getElementById("fd");
  var sx = document.getElementById("sx");
  var yy = document.getElementById("yy");
  var zy = document.getElementById("zy");
  var sy = document.getElementById("sy");
  var xy = document.getElementById("xy");
  var imgCropper = new imageCropper({
      ele: cropperBox,
      inputBox: document.getElementById("input_box"),
      src: "https://img.wbp5.com/upload/images/master/2020/08/18/111237247.png",
      previewBox: document.getElementsByClassName("yl"),
      cropperBoxWidth: 300,
      cropperBoxHeight: 200,
      magnifyBtn: fd,
      shrinkBtn: sx,
      moveLeftBtn: zy,
      moveRightBtn: yy,
      moveUpBtn: sy,
      moveDownBtn: xy,
      getImgBtn: document.getElementById("getCrop"),
      getImgCallback: getSrc,
  });
  // addEvent(document.getElementById("input_box"),"input",function(){
  //     const file:any = this.files[0];
  //     let fileSrc:any = file?URL.createObjectURL(file):"";//获取上传的图片
  //     imgCropper.changeImg(fileSrc);
  // })
  function getSrc(src) {
      document.getElementById("show_img").src = src;
  }

})));
//# sourceMappingURL=index.js.map
