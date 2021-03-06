(function (factory) {
	typeof define === 'function' && define.amd ? define(factory) :
	factory();
}(function () { 'use strict';

	function unwrapExports (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x.default : x;
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var classCallCheck = createCommonjsModule(function (module, exports) {

	exports.__esModule = true;

	exports.default = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};
	});

	var _classCallCheck = unwrapExports(classCallCheck);

	var _global = createCommonjsModule(function (module) {
	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self
	  // eslint-disable-next-line no-new-func
	  : Function('return this')();
	if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef
	});

	var _core = createCommonjsModule(function (module) {
	var core = module.exports = { version: '2.6.1' };
	if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef
	});
	var _core_1 = _core.version;

	var _aFunction = function (it) {
	  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
	  return it;
	};

	// optional / simple context binding

	var _ctx = function (fn, that, length) {
	  _aFunction(fn);
	  if (that === undefined) return fn;
	  switch (length) {
	    case 1: return function (a) {
	      return fn.call(that, a);
	    };
	    case 2: return function (a, b) {
	      return fn.call(that, a, b);
	    };
	    case 3: return function (a, b, c) {
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function (/* ...args */) {
	    return fn.apply(that, arguments);
	  };
	};

	var _isObject = function (it) {
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

	var _anObject = function (it) {
	  if (!_isObject(it)) throw TypeError(it + ' is not an object!');
	  return it;
	};

	var _fails = function (exec) {
	  try {
	    return !!exec();
	  } catch (e) {
	    return true;
	  }
	};

	// Thank's IE8 for his funny defineProperty
	var _descriptors = !_fails(function () {
	  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
	});

	var document$1 = _global.document;
	// typeof document.createElement is 'object' in old IE
	var is = _isObject(document$1) && _isObject(document$1.createElement);
	var _domCreate = function (it) {
	  return is ? document$1.createElement(it) : {};
	};

	var _ie8DomDefine = !_descriptors && !_fails(function () {
	  return Object.defineProperty(_domCreate('div'), 'a', { get: function () { return 7; } }).a != 7;
	});

	// 7.1.1 ToPrimitive(input [, PreferredType])

	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	var _toPrimitive = function (it, S) {
	  if (!_isObject(it)) return it;
	  var fn, val;
	  if (S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
	  if (typeof (fn = it.valueOf) == 'function' && !_isObject(val = fn.call(it))) return val;
	  if (!S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
	  throw TypeError("Can't convert object to primitive value");
	};

	var dP = Object.defineProperty;

	var f = _descriptors ? Object.defineProperty : function defineProperty(O, P, Attributes) {
	  _anObject(O);
	  P = _toPrimitive(P, true);
	  _anObject(Attributes);
	  if (_ie8DomDefine) try {
	    return dP(O, P, Attributes);
	  } catch (e) { /* empty */ }
	  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
	  if ('value' in Attributes) O[P] = Attributes.value;
	  return O;
	};

	var _objectDp = {
		f: f
	};

	var _propertyDesc = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};

	var _hide = _descriptors ? function (object, key, value) {
	  return _objectDp.f(object, key, _propertyDesc(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};

	var hasOwnProperty = {}.hasOwnProperty;
	var _has = function (it, key) {
	  return hasOwnProperty.call(it, key);
	};

	var PROTOTYPE = 'prototype';

	var $export = function (type, name, source) {
	  var IS_FORCED = type & $export.F;
	  var IS_GLOBAL = type & $export.G;
	  var IS_STATIC = type & $export.S;
	  var IS_PROTO = type & $export.P;
	  var IS_BIND = type & $export.B;
	  var IS_WRAP = type & $export.W;
	  var exports = IS_GLOBAL ? _core : _core[name] || (_core[name] = {});
	  var expProto = exports[PROTOTYPE];
	  var target = IS_GLOBAL ? _global : IS_STATIC ? _global[name] : (_global[name] || {})[PROTOTYPE];
	  var key, own, out;
	  if (IS_GLOBAL) source = name;
	  for (key in source) {
	    // contains in native
	    own = !IS_FORCED && target && target[key] !== undefined;
	    if (own && _has(exports, key)) continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
	    // bind timers to global for call from export context
	    : IS_BIND && own ? _ctx(out, _global)
	    // wrap global constructors for prevent change them in library
	    : IS_WRAP && target[key] == out ? (function (C) {
	      var F = function (a, b, c) {
	        if (this instanceof C) {
	          switch (arguments.length) {
	            case 0: return new C();
	            case 1: return new C(a);
	            case 2: return new C(a, b);
	          } return new C(a, b, c);
	        } return C.apply(this, arguments);
	      };
	      F[PROTOTYPE] = C[PROTOTYPE];
	      return F;
	    // make static versions for prototype methods
	    })(out) : IS_PROTO && typeof out == 'function' ? _ctx(Function.call, out) : out;
	    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
	    if (IS_PROTO) {
	      (exports.virtual || (exports.virtual = {}))[key] = out;
	      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
	      if (type & $export.R && expProto && !expProto[key]) _hide(expProto, key, out);
	    }
	  }
	};
	// type bitmap
	$export.F = 1;   // forced
	$export.G = 2;   // global
	$export.S = 4;   // static
	$export.P = 8;   // proto
	$export.B = 16;  // bind
	$export.W = 32;  // wrap
	$export.U = 64;  // safe
	$export.R = 128; // real proto method for `library`
	var _export = $export;

	// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
	_export(_export.S + _export.F * !_descriptors, 'Object', { defineProperty: _objectDp.f });

	var $Object = _core.Object;
	var defineProperty = function defineProperty(it, key, desc) {
	  return $Object.defineProperty(it, key, desc);
	};

	var defineProperty$1 = createCommonjsModule(function (module) {
	module.exports = { "default": defineProperty, __esModule: true };
	});

	unwrapExports(defineProperty$1);

	var createClass = createCommonjsModule(function (module, exports) {

	exports.__esModule = true;



	var _defineProperty2 = _interopRequireDefault(defineProperty$1);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
	    }
	  }

	  return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) defineProperties(Constructor, staticProps);
	    return Constructor;
	  };
	}();
	});

	var _createClass = unwrapExports(createClass);

	var boundEvent = function () {
	    function boundEvent() {
	        _classCallCheck(this, boundEvent);

	        this.addEvent = null;
	        this.removeEvent = null;
	        if (window.addEventListener) {
	            this.addEvent = function (elem, type, handler) {
	                elem.addEventListener(type, handler, false);
	            };
	            this.removeEvent = function (elem, type, handler) {
	                elem.removeEventListener(type, handler, false);
	            };
	        } else if (window.attachEvent) {
	            this.addEvent = function (elem, type, handler) {
	                elem.attachEvent('on' + type, handler);
	            };
	            this.removeEvent = function (elem, type, handler) {
	                elem.detachEvent('on' + type, handler);
	            };
	        }
	    }

	    _createClass(boundEvent, null, [{
	        key: 'bind',
	        value: function bind() {
	            if (this.instance === null) {
	                this.instance = new boundEvent();
	            }
	            return this.instance;
	        }
	    }]);

	    return boundEvent;
	}();

	boundEvent.instance = null;
	var addObj = boundEvent.bind();
	function IsFirefox() {
	    if (window.navigator.userAgent.toLowerCase().indexOf('firefox') >= 0) return true;else return false;
	}

	function addTransformFn(dom, val) {
	    dom.style.transform = val;
	    dom.style.webkitTransform = val;
	    dom.style.msTransform = val;
	    dom.style.mozTransform = val;
	    dom.style.oTransform = val;
	}
	function scrollScale(that, type) {
	    var scrollObj = {
	        scrollRange: that.contentDomScrollSize[type] - that.contentDomSize[type],
	        sliderRange: that.scrollDomSize[type] - that.sliderDomSize[type],
	        scrollNumber: that.scrollBox.scrollTop,
	        scrollType: "scrollTop",
	        transformType: "translateY"
	    };
	    if (type === "x") {
	        scrollObj.scrollNumber = that.scrollBox.scrollLeft;
	        scrollObj.scrollType = "scrollLeft";
	        scrollObj.transformType = "translateX";
	    }
	    return scrollObj;
	}
	function getScrollValue(event, that, scrollNumber, scrollRange, sliderRange) {
	    var key = event.wheelDelta ? event.wheelDelta > 0 : event.detail < 0; //??????????????????????????????????????????????????????  true????????????  false????????????   
	    if (key) {
	        if (scrollNumber <= 0) return null;
	        try {
	            event.preventDefault();
	        } catch (e) {}
	        scrollNumber -= that.options.wheelDis;
	    } else {
	        if (scrollNumber >= scrollRange) return null;
	        try {
	            event.preventDefault();
	        } catch (e) {}
	        scrollNumber += that.options.wheelDis;
	    }
	    scrollNumber = scrollNumber < 0 ? 0 : scrollNumber > scrollRange ? scrollRange : scrollNumber;
	    return {
	        scrollNumber: scrollNumber,
	        sliderScale: scrollNumber * sliderRange / scrollRange
	    };
	}
	function getMoveValue(event, moveNumber, scrollNumber, scrollRange, sliderRange) {
	    try {
	        event.preventDefault();
	    } catch (e) {}
	    if (scrollNumber <= 0 && moveNumber < 0 || scrollNumber >= scrollRange && moveNumber > 0) return null;
	    scrollNumber += moveNumber * scrollRange / sliderRange;
	    scrollNumber = scrollNumber < 0 ? 0 : scrollNumber > scrollRange ? scrollRange : scrollNumber;
	    return {
	        scrollNumber: scrollNumber,
	        sliderScale: scrollNumber * sliderRange / scrollRange
	    };
	}
	function mousewheelFn(event, that, type) {
	    if (that.contentDomScrollSize[type] <= that.contentDomSize[type]) {
	        return;
	    } //???????????????????????????????????????????????????
	    var scaleObj = scrollScale(that, type);
	    var scrollNumberObj = getScrollValue(event, that, scaleObj.scrollNumber, scaleObj.scrollRange, scaleObj.sliderRange);
	    if (scrollNumberObj) {
	        that.scrollBox[scaleObj.scrollType] = scrollNumberObj.scrollNumber; //?????????????????????????????????
	        addTransformFn(that.sliderDom[type], scaleObj.transformType + "(" + scrollNumberObj.sliderScale * 100 / that.sliderDomSize[type] + "%)"); //??????????????????????????????
	    }
	}
	function mouseMoveFn(event, that, type) {
	    var clientNumber = type === "y" ? event.clientY : event.clientX;
	    var moveNumber = clientNumber - that.startClient[type]; //??????????????????
	    that.startClient[type] = clientNumber; //???????????????
	    var scaleObj = scrollScale(that, type);
	    var scrollNumberObj = getMoveValue(event, moveNumber, scaleObj.scrollNumber, scaleObj.scrollRange, scaleObj.sliderRange);
	    if (scrollNumberObj) {
	        that.scrollBox[scaleObj.scrollType] = scrollNumberObj.scrollNumber;
	        addTransformFn(that.sliderDom[type], scaleObj.transformType + "(" + scrollNumberObj.sliderScale * 100 / that.sliderDomSize[type] + "%)");
	    }
	}
	function clickScrollY(event, that) {
	    if (event.target.className.indexOf("stl_yscroll_box") < 0) {
	        return;
	    }
	    var clickOffset = event.offsetY - that.sliderDomSize["y"] / 2;
	    clickOffset = clickOffset < 0 ? 0 : clickOffset > that.scrollDomSize["y"] - that.sliderDomSize["y"] ? that.scrollDomSize["y"] - that.sliderDomSize["y"] : clickOffset;
	    var clickScroll = (that.contentDomScrollSize["y"] - that.contentDomSize["y"]) * clickOffset / (that.scrollDomSize["y"] - that.sliderDomSize["y"]);
	    that.scrollBox.scrollTop = clickScroll;
	    addTransformFn(that.sliderDom["y"], "translateY(" + clickOffset * 100 / that.sliderDomSize["y"] + "%)");
	}
	function clickScrollX(event, that) {
	    if (event.target.className.indexOf("stl_xscroll_box") < 0) {
	        return;
	    }
	    var clickOffset = event.offsetX - that.sliderDomSize["x"] / 2;
	    clickOffset = clickOffset < 0 ? 0 : clickOffset > that.scrollDomSize["x"] - that.sliderDomSize["x"] ? that.scrollDomSize["x"] - that.sliderDomSize["x"] : clickOffset;
	    var clickScroll = (that.contentDomScrollSize["x"] - that.contentDomSize["x"]) * clickOffset / (that.scrollDomSize["x"] - that.sliderDomSize["x"]);
	    that.scrollBox.scrollLeft = clickScroll;
	    addTransformFn(that.sliderDom["x"], "translateX(" + clickOffset * 100 / that.sliderDomSize["x"] + "%)");
	}
	function scrollSpecifiedPosition(obj) {
	    if (obj.hasOwnProperty("left")) {
	        var maxLeft = this.contentDomScrollSize.x - this.contentDomSize.x;
	        this.scrollBox.scrollLeft = obj.left > maxLeft ? maxLeft : obj.left;
	        var clickOffset = this.scrollBox.scrollLeft * (this.scrollDomSize["x"] - this.sliderDomSize["x"]) / (this.contentDomScrollSize["x"] - this.contentDomSize["x"]);
	        addTransformFn(this.sliderDom["x"], "translateX(" + clickOffset * 100 / this.sliderDomSize["x"] + "%)");
	    }
	    if (obj.hasOwnProperty("top")) {
	        var maxTop = this.contentDomScrollSize.y - this.contentDomSize.y;
	        this.scrollBox.scrollTop = obj.top > maxTop ? maxTop : obj.top;
	        var _clickOffset = this.scrollBox.scrollTop * (this.scrollDomSize["y"] - this.sliderDomSize["y"]) / (this.contentDomScrollSize["y"] - this.contentDomSize["y"]);
	        addTransformFn(this.sliderDom["y"], "translateY(" + _clickOffset * 100 / this.sliderDomSize["y"] + "%)");
	    }
	}

	function bindMouseMove(type, dom) {
	    var that = this;
	    var documentDom = document.documentElement;
	    var mousemoveCallback = function mousemoveCallback(evn) {
	        var event = evn || window.event;
	        mouseMoveFn(event, that, type);
	    };
	    var mouseupCallback = function mouseupCallback(evn) {
	        var event = evn || window.event;
	        if (dom.className.indexOf("stl_scroll_move_box") >= 0) {
	            //???????????????????????????
	            dom.className = dom.className.replace(" stl_scroll_move_box", "");
	        }
	        that.startClient = { "x": 0, "y": 0 };
	        that.isScrollMove = 0;
	        addObj.removeEvent(documentDom, "mousemove", mousemoveCallback); //??????????????????mousemove???mouseup????????????
	        addObj.removeEvent(documentDom, "mouseup", mouseupCallback);
	        if (IsFirefox()) {
	            dom.parentElement.parentElement.className = dom.parentElement.parentElement.className.replace(" stl_scroll_unselect", ""); //????????????????????????firefox
	        } else {
	            dom.parentElement.parentElement.onselectstart = function () {
	                return true;
	            };
	        }
	    };
	    addObj.addEvent(documentDom, "mousemove", mousemoveCallback);
	    addObj.addEvent(documentDom, "mouseup", mouseupCallback);
	}
	function bindMouseDown(type, dom) {
	    var that = this;
	    addObj.addEvent(dom, "mousedown", function (evn) {
	        var event = evn || window.event;
	        if (IsFirefox()) {
	            dom.parentElement.parentElement.className = dom.parentElement.parentElement.className + " stl_scroll_unselect"; //????????????????????????firefox
	        } else {
	            dom.parentElement.parentElement.onselectstart = function () {
	                return false;
	            };
	        }
	        if (dom.className.indexOf("stl_scroll_move_box") < 0) {
	            //???????????????????????????
	            dom.className = dom.className + " stl_scroll_move_box";
	        }
	        that.startClient[type] = type === "y" ? event.clientY : event.clientX; //???????????????????????????
	        bindMouseMove.call(that, type, dom); //?????????????????????????????????????????????
	    });
	}
	function boundEventFn(type) {
	    var that = this;
	    var mouseScrollKey = IsFirefox() ? "DOMMouseScroll" : "mousewheel"; //??????????????????????????????firefox?????????
	    if (type === "y" || this.options.direction === "x" && this.options.xMousewheel) {
	        //??????????????????????????????
	        addObj.addEvent(that.scrollBox, mouseScrollKey, function () {
	            var ev = event || window.event;
	            mousewheelFn.call(this, ev, that, type);
	        });
	        addObj.addEvent(that.scrollDom[type], mouseScrollKey, function () {
	            var ev = event || window.event;
	            mousewheelFn.call(this, ev, that, type);
	        });
	    }
	    addObj.addEvent(that.scrollDom[type], "click", function () {
	        var ev = event || window.event;
	        if (type === "y") {
	            clickScrollY.call(this, ev, that, type);
	        } else {
	            clickScrollX.call(this, ev, that, type);
	        }
	    });
	    bindMouseDown.call(this, type, this.sliderDom[type]); //???????????????????????????
	}

	function initAddScrollJudgment(type, domAttr, scrollAttr) {
	    getScrollContentHeight.call(this, type, domAttr, scrollAttr); //????????????????????????/?????? ????????????????????????/??????
	    if (this.contentDomScrollSize[type] > this.contentDomSize[type]) {
	        //??????????????????????????????
	        createScrollDom.call(this, type); //???????????????dom
	        getScrollDomSize.call(this, type, domAttr); //?????????????????????
	    }
	}
	function refreshAddScrollJudgment(type, domAttr, scrollAttr) {
	    // getScrollContentHeight.call(this,type,domAttr,scrollAttr);//????????????????????????/?????? ????????????????????????/??????
	    if (this.contentDomScrollSize[type] <= this.contentDomSize[type]) {
	        //???????????????
	        if (this.scrollDom[type]) //????????????????????????
	            this.scrollDom[type].style.display = "none";
	        return;
	    }
	    if (this.contentDomSize[type]) {
	        //???????????????????????????????????????
	        if (this.scrollDom[type].style.display === "none") this.scrollDom[type].style.display = "block";
	        getScrollDomSize.call(this, type, domAttr);
	    } else {
	        //?????????????????????????????????
	        createScrollDom.call(this, type); //???????????????dom
	        getScrollDomSize.call(this, type, domAttr); //?????????????????????
	    }
	}
	function getScrollContentHeight(type, domAttr, scrollAttr) {
	    this.contentDomSize[type] = this.scrollBox[domAttr];
	    this.contentDomScrollSize[type] = this.scrollBox[scrollAttr];
	}
	function createScrollDom(type) {
	    var className = "stl_" + type + "scroll_box";
	    this.scrollDom[type] = document.createElement("div");
	    this.sliderDom[type] = document.createElement("div");
	    this.scrollDom[type].className = this.options.className === "" ? className : className + " " + this.options.className; //????????????
	    if (type === "y") {
	        //????????????????????????/??????
	        this.scrollDom[type].style.width = this.options.size + "px";
	    } else {
	        this.scrollDom[type].style.height = this.options.size + "px";
	    }
	    this.scrollDom[type].appendChild(this.sliderDom[type]);
	    this.scrollParent.appendChild(this.scrollDom[type]);
	    boundEventFn.call(this, type); //????????????
	}
	function getScrollDomSize(type, domAttr) {
	    this.scrollDomSize[type] = this.scrollDom[type][domAttr];
	    var scrollDomSize = this.contentDomSize[type] * this.scrollDomSize[type] / this.contentDomScrollSize[type];
	    this.sliderDomSize[type] = scrollDomSize > this.options.smallSize ? scrollDomSize : this.options.smallSize;
	    if (type === "x") {
	        this.sliderDom[type].style.width = this.sliderDomSize[type] + "px";
	    } else {
	        this.sliderDom[type].style.height = this.sliderDomSize[type] + "px";
	    }
	}
	function addStyle() {
	    var parentStyle = getComputedStyle(this.scrollParent, null);
	    if (parentStyle.position !== "relative") {
	        //?????????????????????
	        this.scrollParent.style.position = "relative";
	    }
	    // const scrollStyle:any = getComputedStyle(this.scrollBox,null)
	    // if(scrollStyle.overflow!=="hidden"){
	    //     this.scrollBox.style.overflow = "hidden";
	    // };
	}
	function initScrollDom() {
	    switch (this.options.direction) {
	        case "x":
	            initAddScrollJudgment.call(this, "x", "clientWidth", "scrollWidth");
	            break;
	        case "y":
	            initAddScrollJudgment.call(this, "y", "clientHeight", "scrollHeight");
	            break;
	        case "xy":
	            initAddScrollJudgment.call(this, "x", "clientWidth", "scrollWidth");
	            initAddScrollJudgment.call(this, "y", "clientHeight", "scrollHeight");
	            break;
	        default:
	            initAddScrollJudgment.call(this, "y", "clientHeight", "scrollHeight");
	    }
	}
	function refreshScrollDom() {
	    switch (this.options.direction) {
	        case "x":
	            this.contentDomScrollSize["x"] = this.scrollBox.scrollWidth; //?????????????????????????????????
	            refreshAddScrollJudgment.call(this, "x", "clientWidth", "scrollWidth");
	            break;
	        case "y":
	            this.contentDomScrollSize["y"] = this.scrollBox.scrollHeight;
	            refreshAddScrollJudgment.call(this, "y", "clientHeight", "scrollHeight");
	            break;
	        case "xy":
	            this.contentDomScrollSize["x"] = this.scrollBox.scrollWidth;
	            this.contentDomScrollSize["y"] = this.scrollBox.scrollHeight;
	            refreshAddScrollJudgment.call(this, "x", "clientWidth", "scrollWidth");
	            refreshAddScrollJudgment.call(this, "y", "clientHeight", "scrollHeight");
	            break;
	        default:
	            this.contentDomScrollSize["y"] = this.scrollBox.scrollHeight;
	            refreshAddScrollJudgment.call(this, "y", "clientHeight", "scrollHeight");
	    }
	}

	// function debounce(method:any,delay:number){//????????????
	//     let timer:any = null,that = this;
	//     return function(){
	//         if(timer){
	//             clearTimeout(timer);
	//             timer = null;
	//         }
	//         timer = setTimeout(function(){
	//             method.call(that)
	//         },delay)
	//     }
	// }
	/**
	 * ?????????????????????????????????
	 * @param id   ????????????????????????id
	 * @param callback  ????????????????????????????????????
	 * @param config?  ?????????????????? ???????????????config??????
	 */
	function domResize(id, callback, config) {
	    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
	    var that = this;
	    // let debounceFn = debounce.call(that,callback,100)
	    var target = document.getElementById(id); // ??????????????????
	    if (MutationObserver) {
	        // ?????????????????????
	        var observer = new MutationObserver(function (mutations) {
	            mutations.forEach(function (mutation) {
	                // debounceFn.call(that);
	                callback.call(that);
	            });
	        });
	        // ??????????????????:
	        var configs = config || {
	            attributes: true,
	            childList: true,
	            characterData: true //???????????????????????????????????????
	        };
	        observer.observe(target, configs);
	    } else {
	        target.addEventListener("DOMNodeRemoved", function (event) {
	            // debounceFn.call(that);
	            callback.call(that);
	        }, false);
	        target.addEventListener("DOMNodeInserted", function (event) {
	            // debounceFn.call(that);
	            callback.call(that);
	        }, false);
	    }
	}

	var scrollBar = function () {
	    function scrollBar(options) {
	        _classCallCheck(this, scrollBar);

	        this.contentDomSize = { "x": 0, "y": 0 }; //?????????????????????(y)/??????(x)
	        this.contentDomScrollSize = { "x": 0, "y": 0 }; //???????????????scrollHeight(y)/scrollWidth(x)
	        this.scrollDom = { "x": null, "y": null }; //?????????????????????
	        this.sliderDom = { "x": null, "y": null }; //????????????????????????
	        this.scrollDomSize = { "x": 0, "y": 0 }; //??????????????????
	        this.sliderDomSize = { "x": 0, "y": 0 }; //?????????????????????
	        // isScrollMove:number = 0//??????????????????????????? 0??????????????????  1??????
	        this.startClient = { "x": 0, "y": 0 }; //???????????????????????????
	        this.initOption(options); //???????????????
	        addStyle.call(this); //?????????????????????????????????????????????
	        initScrollDom.call(this); //??????????????????
	        if (this.options.autoRefresh) {
	            //????????????????????????
	            domResize.call(this, this.options.id, refreshScrollDom);
	        }
	    }

	    _createClass(scrollBar, [{
	        key: "initOption",
	        value: function initOption(options) {
	            this.options = {
	                id: options.id,
	                autoRefresh: options.autoRefresh === undefined ? true : options.autoRefresh,
	                size: options.size || 5,
	                direction: options.direction || "y",
	                className: options.className || "",
	                smallSize: options.smallSize === undefined ? 20 : options.smallSize,
	                xMousewheel: options.xMousewheel === undefined ? true : options.xMousewheel,
	                wheelDis: options.wheelDis || 40
	            };
	            this.scrollBox = document.getElementById(options.id);
	            this.scrollParent = this.scrollBox.parentNode;
	        }
	    }, {
	        key: "refresh",
	        value: function refresh() {
	            refreshScrollDom.call(this);
	        }
	    }, {
	        key: "fixedPointScroll",
	        value: function fixedPointScroll(obj) {
	            scrollSpecifiedPosition.call(this, obj);
	        }
	    }]);

	    return scrollBar;
	}();
	//  let ScrollBar:any = new scrollBar({id:"box2",smallSize:40,wheelDis:20,autoRefresh:false})
	//  let index:number = 20;
	//  let domObj:any = document.getElementById("box2");
	//  let timer = setInterval(function(){
	//     index--;
	//     let childDom:any = document.createElement("p");
	//     childDom.innerText = "????????????"+index;
	//     domObj.appendChild(childDom)
	//     if(index<0){
	//         clearInterval(timer);
	//         ScrollBar.refresh();
	//     }
	//  },500)
	//   let ScrollBar1:any = new scrollBar({id:"box4",direction:"x",size:10,xMousewheel:false})
	//  let ScrollBar2:any = new scrollBar({id:"box6",direction:"xy",className:"scroll_class"})

	var scrollBar1 = new scrollBar({ id: "box2" });
	console.log(scrollBar1);
	var btn = document.getElementById("btn");
	var btn1 = document.getElementById("btn1");
	btn.addEventListener("click", function () {
	    scrollBar1.fixedPointScroll({ top: 3000 });
	});
	btn1.addEventListener("click", function () {
	    scrollBar1.fixedPointScroll({ top: 0 });
	});
	// var ScrollBar2:any;
	// let btn = document.getElementById("btn");
	// document.getElementById("box6").style.display = "block"
	// ScrollBar2 = new scrollBar({id:"box6",direction:"x",className:"scroll_class"})
	// btn.addEventListener("click",function(){
	//     // ScrollBar2.fixedPointScroll({top:1000})
	//     if(!ScrollBar2){
	//     }
	// })
	// let btn1 = document.getElementById("btn1")
	// btn1.addEventListener("click",function(){
	//     // ScrollBar2.fixedPointScroll({top:1000})
	//     document.getElementById("box6").style.display = "none"
	// })

}));
//# sourceMappingURL=index.js.map
