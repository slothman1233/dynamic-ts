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
  * 数组元素交换位置
  * @param {array} arr 数组
  * @param {number} index1 添加项目的位置
  * @param {number} index2 删除项目的位置
  * @return {array} 返回交换后的数组
  * index1和index2分别是两个数组的索引值，即是两个要交换元素位置的索引值，如1，5就是数组中下标为1和5的两个元素交换位置
  */
  function swapArray(arr, index1, index2) {
      arr[index1] = arr.splice(index2, 1, arr[index1])[0];
      return arr;
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
          this.data = {};
          this.dragStartBol = false; //是否开始拖拽了
          this.data.dragEnd = data.dragEnd || function () { };
          this.data.dragSelector = data.dragSelector || null;
          this.data.dragMove = data.dragMove || "li";
          this.data.placeHolderTemplate = data.placeHolderTemplate || "<li></li>";
          this.addEvents();
      }
      //初始化填充元素
      dragsortFn.prototype.getfill = function () {
          var ele = createEl("div", {
              innerHTML: this.data.placeHolderTemplate
          });
          this.fillDom = ele.firstElementChild;
      };
      dragsortFn.prototype.addEvents = function () {
          var that = this;
          var parent = document.querySelectorAll(this.data.dragMove)[0].parentElement;
          var domDown = parent.onmousedown;
          parent.onmousedown = function (e) {
              domDown && domDown(e);
              that.domAll = that.NodeListToArray(document.querySelectorAll(that.data.dragMove));
              var ev = e || event;
              var path = eventsPath(ev);
              outerloop: for (var i = 0; i < path.length; i++) {
                  if (path[i].nodeName === "#document")
                      return;
                  if (that.data.dragSelector) {
                      for (var j = 0; j < that.domAll.length; j++) {
                          if (that.domAll[j].querySelector(that.data.dragSelector) === path[i]) {
                              that.dragStart.call(that, ev, that.domAll[j]);
                              break outerloop;
                          }
                      }
                  }
                  else {
                      if (that.domAll.indexOf(path[i]) >= 0) {
                          that.dragStart.call(that, ev, path[i]);
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
          that.dragStartBol = true;
          this.getfill();
          that.domAll = that.getItem.call(that);
          insertAfter(that.fillDom, that.thatDom);
          that.addCss.call(that, {
              position: "absolute",
              zIndex: "999",
              opacity: "0.8",
              cursor: "pointer",
              top: that.thatDom.offsetTop + "px",
              left: that.thatDom.offsetLeft + "px"
          });
          that.disx = ev.clientX - parseInt(that.thatDom.style.left); //记录鼠标当前的位置
          that.disy = ev.clientY - parseInt(that.thatDom.style.top);
      };
      //推拽过程中
      dragsortFn.prototype.dragMove = function (e) {
          var event = e || event;
          var that = this;
          that.swapItems.call(that, event);
          that.thatDom.style.left = event.clientX - that.disx + "px";
          that.thatDom.style.top = event.clientY - that.disy + "px";
      };
      //推拽结束
      dragsortFn.prototype.dragEnd = function (e) {
          var that = this;
          if (!this.domAll || this.domAll.indexOf(that.thatDom) === -1)
              return;
          that.dragStartBol = false;
          that.addCss.call(that, {});
          insertAfter(that.thatDom, that.fillDom);
          remove(that.fillDom);
          that.data.dragEnd && that.data.dragEnd();
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
          var eleAry = this.NodeListToArray(document.querySelectorAll(this.data.dragMove));
          return eleAry;
      };
      //切换位置
      dragsortFn.prototype.swapItems = function (event) {
          var that = this;
          var thatEleIndex = that.domAll.indexOf(that.thatDom);
          for (var i = 0; i < that.domAll.length; i++) {
              var dom = that.domAll[i];
              if (dom === that.thatDom)
                  continue;
              var domoffset = getOffset(dom);
              var domLeft = domoffset.left;
              var domTop = domoffset.top;
              var offsetRight = domLeft + dom.offsetWidth;
              var offsetBottom = domTop + dom.offsetHeight;
              //判断是否触碰到了其他的元素
              if (event.clientX >= domLeft && event.clientX <= offsetRight &&
                  event.clientY >= domTop && event.clientY <= offsetBottom) {
                  if (i > thatEleIndex) {
                      insertAfter(that.fillDom, dom);
                  }
                  else {
                      insertBefore(that.fillDom, dom);
                  }
                  //重排数组里面的位置
                  swapArray(that.domAll, i, thatEleIndex);
              }
          }
      };
      return dragsortFn;
  }());
  function lineDragSort(data) {
      var dragsort = new dragsortFn(data);
      return dragsort;
  }

  var data = {
      dragMove: "#line_dragsort > li",
      dragSelector: "#line_dragsort > li > em",
      dragEnd: function () {
          console.log("拖动结束");
      },
      placeHolderTemplate: "<li>123456</li>"
  };
  lineDragSort(data);
  /**
   * 单行拖拽的控件
   * @param {object} data { dragSelector: "#solo > .Imgms" ,  dragEnd: function () { }, placeHolderTemplate: "<div class='Imgms'></div>" }
          * @param {string} dragMove CSS选择器内的元素的列表项的移动手柄。
          * @param {string} dragSelector 拖动手柄必须要是dragMove子级的元素，如果是自身就不用传
          * @param {function} dragEnd 拖动结束后将被调用的回调函数
          * @param {string} placeHolderTemplate 拖动列表的HTML部分。
   */

})));
//# sourceMappingURL=index.js.map
