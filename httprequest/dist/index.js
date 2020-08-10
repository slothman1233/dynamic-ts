(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.indexjs = {}));
}(this, (function (exports) { 'use strict';

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

  var log = function (value) {
      console.log(value);
  };

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

  var _this = window;
  //-----------------单元测试使用  测试完成需注释----------------------
  // const mergeOptions:any = compatible.mergeOptions
  // const each:any = obj.each
  var https = {
      /**
         * js封装ajax请求
         * >>使用new XMLHttpRequest 创建请求对象,所以不考虑低端IE浏览器(IE6及以下不支持XMLHttpRequest)
         * >>使用es6语法,如果需要在正式环境使用,则可以用babel转换为es5语法 https://babeljs.cn/docs/setup/#installation
         *  @param settings 请求参数模仿jQuery ajax
         *  调用该方法,data参数需要和请求头Content-Type对应
         *  Content-Type                        data                                     描述
         *  application/x-www-form-urlencoded   'name=哈哈&age=12'或{name:'哈哈',age:12}  查询字符串,用&分割
         *  application/json                     name=哈哈&age=12'                        json字符串
         *  multipart/form-data                  new FormData()                           FormData对象,当为FormData类型,不要手动设置Content-Type
         *  注意:请求参数如果包含日期类型.是否能请求成功需要后台接口配合
         */
      ajax: function (settings, resolve, reject) {
          if (settings === void 0) { settings = {}; }
          var _s;
          _s = mergeOptions({
              url: "",
              type: "GET",
              dataType: "json",
              async: true,
              data: null,
              headers: {},
              timeout: 10000,
              isFromdata: false,
              beforeSend: function (xhr) { },
              // success: (result:any, status:any, xhr:any) => { },
              // error: (xhr:any, status:any, error:any) => { },
              complete: function (xhr, status) { }
          }, settings);
          //验证参数
          if (!_s.url || !_s.type || !_s.data || !_s.dataType) {
              log(cn.httprequest.parameterError);
              return;
          }
          //创建请求
          var xhr = new XMLHttpRequest();
          //请求开始回调函数
          xhr.addEventListener('loadstart', function (e) {
              _s.beforeSend(xhr);
          });
          //请求成功
          xhr.addEventListener("load", function (e) {
              var status = xhr.status;
              if ((status >= 200 && status <= 300) || status === 304) {
                  var result = void 0;
                  if (xhr.responseType === "text") {
                      result = xhr.responseText;
                  }
                  else if (xhr.responseType === "document") {
                      result = xhr.responseXML;
                  }
                  else {
                      if (xhr.response) {
                          result = "";
                          try {
                              result = Object.prototype.toString.call(xhr.response) === "[object String]" ? JSON.parse(xhr.response) : xhr.response;
                          }
                          catch (e) {
                              result = xhr.response;
                          }
                      }
                      else {
                          result = "";
                          try {
                              result = Object.prototype.toString.call(xhr.responseText) === "[object String]" ? JSON.parse(xhr.responseText) : xhr.responseText;
                          }
                          catch (e) {
                              result = xhr.responseText;
                          }
                      }
                  }
                  //_s.success(result, status, xhr);
                  resolve(result);
              }
              else {
                  //_s.error(xhr, status, e);
                  var errObj = https.getErrorObj("请求错误", "ERR0003", status);
                  reject(errObj);
              }
          });
          //请求结束
          xhr.addEventListener("loadend", function (e) {
              _s.complete(xhr, xhr.status);
          });
          //请求错误
          xhr.addEventListener("error", function (e) {
              // _s.error(xhr, xhr.status, e)
              var errObj = https.getErrorObj("请求错误", "ERR0003", xhr.status);
              reject(errObj);
          });
          //请求超时
          xhr.addEventListener("timeout", function (e) {
              // _s.error(xhr, 408, e)
              var errObj = https.getErrorObj("请求超时", "ERR0002", 408);
              reject(errObj);
          });
          var useUrlParam = false;
          var sType = _s.type.toUpperCase();
          //如果是简单的请求，则把data参数组装在URL上
          if (sType === "GET" || sType === "DELETE") {
              useUrlParam = true;
              _s.url += https.getUrlParam(_s.url, _s.data);
          }
          //初始化请求
          try {
              xhr.open(_s.type, _s.url, _s.async);
          }
          catch (e) {
              //_s.error(xhr, xhr.status, e);
              var errObj = https.getErrorObj("初始化请求错误", "ERR0001", xhr.status);
              reject(errObj);
              return;
          }
          //设置返回类型
          xhr.responseType = _s.dataType;
          //设置请求头
          if (_s.headers) {
              for (var _i = 0, _a = Object.keys(_s.headers); _i < _a.length; _i++) {
                  var key = _a[_i];
                  xhr.setRequestHeader(key, _s.headers[key]);
              }
          }
          //设置超时时间
          if (_s.async && _s.timeout) {
              xhr.timeout = _s.timeout;
          }
          //发送请求.如果是简单请求,请求参数应为null.否则,请求参数类型需要和请求头Content-Type对应
          var sendData;
          if (_s.isFromdata) {
              sendData = _s.data;
          }
          else {
              if (useUrlParam) {
                  sendData = null;
              }
              else if (_s.headers["Content-Type"] && _s.headers["Content-Type"].indexOf("application/json") >= 0) {
                  sendData = JSON.stringify(_s.data);
              }
              else {
                  sendData = https.getQueryString(_s.data);
              }
          }
          xhr.send(sendData);
      },
      //请求错误时返回的对象
      getErrorObj: function (message, subCode, status) {
          return {
              bodyMessage: null,
              code: "-1",
              message: message,
              subCode: subCode,
              status: status
          };
      },
      getUrlParam: function (url, data) {
          if (!data) {
              return "";
          }
          var paramStr = data instanceof Object ? https.getQueryString(data) : data;
          return (url.indexOf("?") !== -1) ? paramStr : "?" + paramStr;
      },
      // 把对象转为查询字符串
      getQueryString: function (data) {
          var parasArr = [];
          if (data instanceof Object) {
              each(data, function (value, key) {
                  var val = value;
                  parasArr.push(encodeURIComponent(key) + '=' + encodeURIComponent(val));
              });
          }
          return parasArr.join("&");
      },
      /**
       * 根据实际业务情况装饰 ajax 方法
       * 如:统一异常处理,添加http请求头,请求展示loading等
       * @param settings
       */
      request: function (settings) {
          if (settings === void 0) { settings = {}; }
          //统一异常处理
          var errorHandle = function (xhr, status) {
              if (status === 401) {
                  log(cn.httprequest.noAuthority);
              }
              else if (status === 408) {
                  log(cn.httprequest.timeOut);
              }
          };
          // 使用before拦截参数的 beforeSend 回调函数
          settings.beforeSend = (settings.beforeSend || function () {
          }).before(function (xhr) {
              log("request show loading...");
          });
          // 保存参数success回调函数
          var successFn = settings.success;
          // 覆盖参数success回调函数
          settings.success = function (result, status, xhr) {
              // todo 根据后台api判断是否请求成功
              if (result && result instanceof Object && result.code !== 1) {
                  errorHandle(xhr, status);
              }
              else {
                  //log("request success");
                  successFn && successFn(result, status, xhr);
              }
          };
          // 拦截参数的 error
          settings.error = (settings.error || function () {
          })
              .before(function (result, status, xhr) {
              errorHandle(xhr, status);
          });
          // 拦截参数的 complete
          settings.complete = (settings.complete || function () {
          }).after(function (xhr, status) {
              log('request hide loading...');
          });
          // 请求添加权限头,然后调用http.ajax方法
          (https.ajax.before(https.addAuthorizationHeader))(settings);
      },
      // 添加权限请求头
      addAuthorizationHeader: function (settings) {
          settings.headers = settings.headers || {};
          var headerKey = 'Authorization'; // todo 权限头名称
          // 判断是否已经存在权限header
          var hasAuthorization = Object.keys(settings.headers).some(function (key) {
              return key === headerKey;
          });
          if (!hasAuthorization) {
              settings.headers[headerKey] = 'test'; // todo 从缓存中获取headerKey的值
          }
      }
  };
  Function.prototype.before = function (beforeFn) {
      var _self = _this;
      return function () {
          var arg = [];
          for (var _i = 0; _i < arguments.length; _i++) {
              arg[_i] = arguments[_i];
          }
          beforeFn.apply(_this, arg);
          _self.apply(_this, arg);
      };
  };
  Function.prototype.after = function (afterFn) {
      var _self = _this;
      return function () {
          var arg = [];
          for (var _i = 0; _i < arguments.length; _i++) {
              arg[_i] = arguments[_i];
          }
          _self.apply(_this, arg);
          afterFn.apply(_this, arg);
      };
  };
  var dataModel = /** @class */ (function () {
      // error: any = function () { }
      function dataModel(data) {
          this.dataType = 'json';
          this.data = {};
          this.headers = {};
          // success: any = function () { }
          this.beforeSend = function () { };
          this.complete = function () { };
          this.headers = data.headers;
          this.type = data.type;
          this.isFromdata = data.isFromdata || false;
      }
      return dataModel;
  }());
  var http = {
      get: function (data) {
          var d = mergeOptions(new dataModel({ headers: {}, type: 'GET' }), data);
          return new Promise(function (resolve, reject) {
              https.ajax(d, resolve, reject);
          });
      },
      delete: function (data) {
          var d = mergeOptions(new dataModel({ headers: {}, type: 'DELETE' }), data);
          return new Promise(function (resolve, reject) {
              https.ajax(d, resolve, reject);
          });
      },
      // 调用此方法,参数data应为查询字符串或普通对象
      post: function (data) {
          var d = mergeOptions(new dataModel({ headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }, type: 'POST' }), data);
          return new Promise(function (resolve, reject) {
              https.ajax(d, resolve, reject);
          });
      },
      put: function (data) {
          var d = mergeOptions(new dataModel({ headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'X-HTTP-Method-Override': 'put' }, type: 'POST' }), data);
          return new Promise(function (resolve, reject) {
              https.ajax(d, resolve, reject);
          });
      },
      // 调用此方法,参数data应为json字符串
      postbody: function (data) {
          var d = mergeOptions(new dataModel({ headers: { 'Content-Type': 'application/json; charset=UTF-8' }, type: 'POST' }), data);
          return new Promise(function (resolve, reject) {
              https.ajax(d, resolve, reject);
          });
      },
      fromData: function (data) {
          var d = mergeOptions(new dataModel({ headers: {}, type: 'POST', isFromdata: true }), data);
          return new Promise(function (resolve, reject) {
              https.ajax(d, resolve, reject);
          });
      },
  };
  http.post({
      url: "http://testmswebapi.tostar.top//api/NoticesApiMobile/GetNoticesById",
      data: { id: 41134 },
      beforeSend: function (a) { console.log("beforeSend:请求开始", a); },
      complete: function (a, b) { console.log("complete:请求结束", a, b); },
  }).then(function (a) {
      console.log("resolve:请求完成");
      console.log(a);
  }).catch(function (e) {
      console.log("reject:请求失败");
      console.log(e);
  });

  exports.http = http;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=index.js.map
