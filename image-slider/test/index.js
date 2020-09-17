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

  var imageSlider = /** @class */ (function () {
      function imageSlider(option) {
          this.sportTimeout = null; //运动的延时器
          this.intervalTimeout = null; //间隔的延时器
          this.timer = 30; //运动每一帧的时长
          this.nowClass = "now_slier_item";
          this.isChangeSport = false; //是否正在进行切换
          //实时改变的属性
          this.changeType = undefined; //切换的type
          this.index = 0; //当前显示的图片下标
          this.translateVal = 0; //当前运动值
          this.nowDistance = 0; //当前已运动的距离
          this.mouseKey = false; //鼠标是否在轮播区
          this.nowDistanceNumber = 0; //当前已执行的帧数
          this.initOption(option);
          this.getDom();
          this.getExerciseValue();
          this.addDom();
          this.cloneFn(0);
          this.option.auto && this.startSportFn();
          this.addEventFn();
      }
      imageSlider.prototype.initOption = function (option) {
          var optionObj = { distance: "auto", step: 2, time: 300, auto: true, item: true, switch: true, direction: "left", hover: true, switchType: "auto" };
          this.option = mergeOptions({}, optionObj, option);
          if (!this.option.auto)
              this.option.intervals = 1500, this.option.hover = false; //当设置为不自动轮播时则为间隔轮播且hover时不会停止运动
          if (!this.option.intervals)
              this.option.item = false, this.option.switch = false; //当为无缝滚动是不会显示左右切换和下标按钮
      };
      imageSlider.prototype.getDom = function () {
          this.$parent = document.getElementById(this.option.sliderWindowId);
          this.$sliderDom = this.option.sliderDomId ? document.getElementById(this.option.sliderDomId) : this.$parent.firstElementChild;
          this.$sliderList = this.getSliderList();
      };
      imageSlider.prototype.getSliderList = function () {
          if (!this.option.sliderListName)
              return this.$sliderDom.children;
          var type = this.option.sliderListName.substring(0, 1); //判断传入的是className还是tagName
          if (type === ".")
              return this.$sliderDom.getElementsByClassName(this.option.sliderListName.slice(1));
          return this.$sliderDom.getElementsByTagName(this.option.sliderListName);
      };
      imageSlider.prototype.getExerciseValue = function () {
          this.sliderLength = this.$sliderList.length; //轮播列表的长度
          switch (this.option.direction) {
              case "left":
              case "right":
                  this.totalDistance = this.$sliderDom.scrollWidth; //轮播的总距离
                  this.propertyName = "translateX"; //改变的属性名
                  this.parentSize = this.$parent.clientWidth; //父窗口的尺寸
                  break;
              case "top":
              case "bottom":
                  this.totalDistance = this.$sliderDom.scrollHeight;
                  this.propertyName = "translateY";
                  this.parentSize = this.$parent.clientHeight;
                  break;
          }
          switch (this.option.direction) {
              case "left":
              case "top":
                  this.index = 0; //初始化当前显示的下标值
                  this.directionType = -1; //运动方向的变量
                  this.step = -this.option.step; //根据方向设置步长
                  break;
              case "right":
              case "bottom":
                  this.index = this.sliderLength - 1;
                  this.directionType = 1;
                  this.step = this.option.step;
                  break;
          }
          if (this.option.intervals) {
              this.distanceNumber = Math.ceil(this.option.time / this.timer); //间隔轮播时每次切换执行的帧数
              this.sportSetTimeoutFn = this.intervalSportFn; //根据轮播类型声明不同的运动方法
              this.startSportFn = this.intervalsFn; //初始执行的运动方法
          }
          else {
              this.sportSetTimeoutFn = this.ordinarySportFn; //根据轮播类型声明不同的运动方法
              this.startSportFn = this.sportFn;
          }
          this.distance = this.oneDistance = this.getDistance(); //计算当前这次轮播要运动的总距离
      };
      imageSlider.prototype.getDistance = function (end) {
          //往左或往上运动时distance为负数，反之为整数
          var len = end === undefined ? this.directionType : typeof end === "string" ? -JSON.parse(end) : this.index - end; //获取当前这次运动要切换的图片张数以计算总距离
          if (this.option.distance === "auto")
              return this.parentSize * len;
          return this.option.distance * len;
      };
      imageSlider.prototype.addDom = function () {
          var itemString = "", listStr = "", leftRight = this.option.switch ? "<div class=\"slider_left_btn " + (this.option.switchType === "auto" ? "" : "slider_btn_hide") + "\"></div>\n                                              <div class=\"slider_right_btn " + (this.option.switchType === "auto" ? "" : "slider_btn_hide") + "\"></div>" : ""; //左右切换按钮
          if (this.option.item) { //下标元素
              for (var i = 0; i < this.sliderLength; i++) {
                  listStr += "<li class=\"slider_item_btn " + (i === this.index ? this.nowClass : "") + "\" index=\"" + i + "\"></li>";
              }
              itemString = "<ul class=\"slider_item_list\">" + listStr + "</ul>";
          }
          if (leftRight !== "" || itemString !== "") {
              var sliderDom = document.createElement("div");
              sliderDom.className = "slider_switch_box";
              sliderDom.innerHTML = leftRight + itemString;
              this.$parent.appendChild(sliderDom);
              this.getBtn();
          }
      };
      imageSlider.prototype.getBtn = function () {
          this.$itemList = this.$parent.getElementsByClassName("slider_item_btn");
          if (this.option.switch) {
              this.$prevDom = this.$parent.getElementsByClassName("slider_left_btn")[0];
              this.$nextDom = this.$parent.getElementsByClassName("slider_right_btn")[0];
          }
      };
      imageSlider.prototype.cloneFn = function (index) {
          var dom = this.$sliderList[index].cloneNode(true);
          this.$sliderDom.appendChild(dom);
          //if(index)return this.$sliderDom.insertBefore(dom,this.$sliderDom.firstChild);
      };
      imageSlider.prototype.sportFn = function (index) {
          var that = this;
          that.cleatTimeoutFn("sport");
          that.sportTimeout = setTimeout(function () {
              that.sportSetTimeoutFn.call(that, index);
          }, that.timer);
      };
      imageSlider.prototype.intervalsFn = function () {
          var that = this;
          that.cleatTimeoutFn("interval");
          that.intervalTimeout = setTimeout(function () {
              that.sportFn.call(that);
          }, that.option.intervals);
      };
      imageSlider.prototype.calculateDistance = function () {
          return this.distance / this.distanceNumber;
      };
      imageSlider.prototype.intervalSportFn = function (index) {
          this.translateVal += this.calculateDistance(); //往上和往左运动时 this.translateVal值越来越小
          if (Math.abs(this.translateVal - this.nowDistance) >= Math.abs(this.distance)) { //判断是否到达了当前运动的距离
              this.translateVal = this.nowDistance += this.distance; //将轮播元素的位置设置为要移动到的位置
              this.updateIndex(index);
              if (this.index === 0) { //下标为0时将 如果是向左或向上轮播则将轮播元素的位置设置到初始位置，如果是向右或向下则设置到复制出来的元素的位置
                  this.translateVal = this.nowDistance = this.directionType < 0 ? 0 : -this.oneDistance;
              }
              this.isChangeSport = false;
              if (this.changeType !== undefined) { //如果有切换操作则执行切换操作
                  this.clickInitFn();
                  this.changeFn();
              }
              else {
                  this.distance = this.getDistance();
                  this.option.auto ? this.afterSportFn.call(this, "all", this.intervalsFn) : this.afterSportFn.call(this, "all");
              }
          }
          else {
              this.sportFn(index);
          }
          this.$sliderDom.style.transform = this.propertyName + "(" + this.translateVal + "px)";
      };
      imageSlider.prototype.ordinarySportFn = function () {
          this.translateVal += this.step;
          //往左或往上移动时 translateX(-totalDistance)则置为0, 往右或往下移动时 translateX(this.totalDistance-this.oneDistance)则置为-oneDistance
          var totalVal = this.directionType < 0 ? this.totalDistance : this.totalDistance - this.oneDistance;
          var value = this.directionType < 0 ? 0 : -this.oneDistance;
          if (Math.abs(this.translateVal) >= totalVal)
              this.translateVal = value;
          this.$sliderDom.style.transform = this.propertyName + "(" + this.translateVal + "px)";
          this.afterSportFn.call(this, "sport", this.sportFn); //继续执行下一帧运动
      };
      imageSlider.prototype.updateIndex = function (index) {
          var oldIndex = this.index;
          if (index === undefined) { //正常轮播的情况
              this.index = this.option.direction === "left" || this.option.direction === "top" ? this.index >= (this.sliderLength - 1) ? 0 : this.index + 1 : this.index <= 0 ? (this.sliderLength - 1) : this.index - 1;
          }
          else if (typeof index === "number") { //点击下标的情况
              this.index = index;
          }
          else { //左右切换的情况
              this.index = index === "-1" ? this.index === 0 ? (this.sliderLength - 1) : this.index - 1 : this.index === (this.sliderLength - 1) ? 0 : this.index + 1;
          }
          if (this.option.item) { //更新下标的样式
              removeClass(this.$itemList[oldIndex], this.nowClass);
              addClass(this.$itemList[this.index], this.nowClass);
          }
      };
      imageSlider.prototype.afterSportFn = function (type, fn) {
          if (this.mouseKey)
              return this.cleatTimeoutFn(type); //鼠标移入则停止轮播
          fn ? fn.call(this) : this.cleatTimeoutFn("all");
      };
      imageSlider.prototype.cleatTimeoutFn = function (key) {
          if ((key === "all" || key === "sport") && this.sportTimeout)
              clearTimeout(this.sportTimeout);
          this.sportTimeout = null;
          if ((key === "all" || key === "interval") && this.intervalTimeout) {
              clearTimeout(this.intervalTimeout);
              this.intervalTimeout = null;
          }
      };
      imageSlider.prototype.changeFn = function () {
          this.distance = this.getDistance(this.changeType); //获取要轮播的距离
          this.cleatTimeoutFn("interval"); //关闭间隔延时器
          this.isChangeSport = true;
          this.sportFn(this.changeType); //开启轮播运动的延时器
          this.changeType = undefined;
      };
      imageSlider.prototype.clickInitFn = function () {
          var that = this;
          if (that.changeType === "-1" && that.index === 0 && that.directionType < 0) { //如果向左向上轮播index=0时 切换到上一张即最后一张图片 则要先将轮播图位置移到最后
              that.translateVal = that.nowDistance = -that.totalDistance;
              that.$sliderDom.style.transform = that.propertyName + "(" + that.translateVal + "px)";
          }
          //如果向右向下轮播index=0时，切换到下一张即第二张图片或者点击下标   则要先将轮播图位置移到最前
          if ((that.changeType === "1" || typeof that.changeType === "number") && that.index === 0 && that.directionType > 0) {
              that.translateVal = that.nowDistance = that.totalDistance - that.oneDistance;
              that.$sliderDom.style.transform = that.propertyName + "(" + that.translateVal + "px)";
          }
      };
      imageSlider.prototype.addEventFn = function () {
          var that = this;
          addEvent(that.$parent, "mouseover", function () {
              if (that.option.hover) {
                  that.mouseKey = true;
                  that.cleatTimeoutFn.call(that, "interval");
              }
              if (that.option.switchType === "hover") {
                  removeClass(that.$prevDom, "slider_btn_hide");
                  removeClass(that.$nextDom, "slider_btn_hide");
              }
          });
          addEvent(that.$parent, "mouseout", function () {
              if (that.option.hover) {
                  that.mouseKey = false;
                  that.startSportFn.call(that);
              }
              if (that.option.switchType === "hover") {
                  addClass(that.$prevDom, "slider_btn_hide");
                  addClass(that.$nextDom, "slider_btn_hide");
              }
          });
          if (that.option.switch) {
              addEvent(that.$prevDom, "click", function () {
                  if (that.isChangeSport)
                      return; //如果正在执行切换操作则return
                  that.changeType = "-1";
                  if (!that.sportTimeout)
                      that.clickInitFn(), that.changeFn();
              });
              addEvent(that.$nextDom, "click", function () {
                  if (that.isChangeSport)
                      return;
                  that.changeType = "1";
                  if (!that.sportTimeout)
                      that.clickInitFn(), that.changeFn();
              });
          }
          if (that.option.item) {
              for (var i = 0; i < that.sliderLength; i++) {
                  addEvent(that.$itemList[i], "click", function () {
                      if (that.isChangeSport)
                          return;
                      that.changeType = JSON.parse(this.getAttribute("index"));
                      if (!that.sportTimeout)
                          that.clickInitFn(), that.changeFn();
                  });
              }
          }
      };
      return imageSlider;
  }());

  var imgSlider = new imageSlider({
      sliderWindowId: "slider_parent",
      distance: 540,
      intervals: 1500,
  });
  var scrollSlider = new imageSlider({
      sliderWindowId: "scroll_parent",
      sliderDomId: "scroll_dom",
      sliderListName: "li",
      step: 4,
  });
  var scrollSliders = new imageSlider({
      sliderWindowId: "scroll_parents",
      step: 3,
      intervals: 1000,
      item: false,
      switch: false,
      direction: "top"
  });
  var imgSliders = new imageSlider({
      sliderWindowId: "slider_parents",
      intervals: 1500,
      time: 1000,
      hover: false,
      switchType: "hover",
      direction: "bottom",
      sliderDomId: "slider_doms",
      sliderListName: ".slider_list",
  });
  var imgSlidera = new imageSlider({
      sliderWindowId: "slider_parenta",
      auto: false,
  });

})));
//# sourceMappingURL=index.js.map
