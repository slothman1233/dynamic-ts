!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).indexjs={})}(this,function(e){"use strict";function t(e){return!!e&&"object"==typeof e}function r(e){return t(e)&&"[object Object]"===Object.prototype.toString.call(e)&&e.constructor===Object}var o=function(e){return t(e)?Object.keys(e):[]};function i(t,n){o(t).forEach(function(e){return n(t[e],e)})}function d(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];var n={};return e.forEach(function(e){e&&i(e,function(e,t){r(e)?(r(n[t])||(n[t]={}),n[t]=d(n[t],e)):n[t]=e})}),n}var p={timeOut:"请求超时",noAuthority:"没有权限",parameterError:"参数有误"},re="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};function oe(){throw new Error("Dynamic requires are not currently supported by rollup-plugin-commonjs")}var n,s=(function(e){e.exports=function(){function r(e){var t=typeof e;return e!==null&&(t==="object"||t==="function")}function u(e){return typeof e==="function"}var e=void 0;if(Array.isArray){e=Array.isArray}else{e=function(e){return Object.prototype.toString.call(e)==="[object Array]"}}var n=e,o=0,t=void 0,i=void 0,s=function e(t,n){g[o]=t;g[o+1]=n;o+=2;if(o===2){if(i){i(_)}else{T()}}};function a(e){i=e}function c(e){s=e}var f=typeof window!=="undefined"?window:undefined,l=f||{},d=l.MutationObserver||l.WebKitMutationObserver,p=typeof self==="undefined"&&typeof process!=="undefined"&&{}.toString.call(process)==="[object process]",h=typeof Uint8ClampedArray!=="undefined"&&typeof importScripts!=="undefined"&&typeof MessageChannel!=="undefined";function v(){return function(){return process.nextTick(_)}}function y(){if(typeof t!=="undefined"){return function(){t(_)}}return w()}function m(){var e=0;var t=new d(_);var n=document.createTextNode("");t.observe(n,{characterData:true});return function(){n.data=e=++e%2}}function b(){var e=new MessageChannel;e.port1.onmessage=_;return function(){return e.port2.postMessage(0)}}function w(){var e=setTimeout;return function(){return e(_,1)}}var g=new Array(1e3);function _(){for(var e=0;e<o;e+=2){var t=g[e];var n=g[e+1];t(n);g[e]=undefined;g[e+1]=undefined}o=0}function j(){try{var e=Function("return this")().require("vertx");t=e.runOnLoop||e.runOnContext;return y()}catch(e){return w()}}var T=void 0;if(p){T=v()}else if(d){T=m()}else if(h){T=b()}else if(f===undefined&&typeof oe==="function"){T=j()}else{T=w()}function E(e,t){var n=this;var r=new this.constructor(S);if(r[x]===undefined){I(r)}var o=n._state;if(o){var i=arguments[o-1];s(function(){return G(o,r,i,n._result)})}else{Y(n,r,e,t)}return r}function O(e){var t=this;if(e&&typeof e==="object"&&e.constructor===t){return e}var n=new t(S);q(n,e);return n}var x=Math.random().toString(36).substring(2);function S(){}var A=void 0,P=1,C=2;function F(){return new TypeError("You cannot resolve a promise with itself")}function M(){return new TypeError("A promises callback cannot return that same promise.")}function R(e,t,n,r){try{e.call(t,n,r)}catch(e){return e}}function L(e,r,o){s(function(t){var n=false;var e=R(o,r,function(e){if(n){return}n=true;if(r!==e){q(t,e)}else{H(t,e)}},function(e){if(n){return}n=true;N(t,e)},"Settle: "+(t._label||" unknown promise"));if(!n&&e){n=true;N(t,e)}},e)}function U(t,e){if(e._state===P){H(t,e._result)}else if(e._state===C){N(t,e._result)}else{Y(e,undefined,function(e){return q(t,e)},function(e){return N(t,e)})}}function k(e,t,n){if(t.constructor===e.constructor&&n===E&&t.constructor.resolve===O){U(e,t)}else{if(n===undefined){H(e,t)}else if(u(n)){L(e,t,n)}else{H(e,t)}}}function q(t,e){if(t===e){N(t,F())}else if(r(e)){var n=void 0;try{n=e.then}catch(e){N(t,e);return}k(t,e,n)}else{H(t,e)}}function D(e){if(e._onerror){e._onerror(e._result)}z(e)}function H(e,t){if(e._state!==A){return}e._result=t;e._state=P;if(e._subscribers.length!==0){s(z,e)}}function N(e,t){if(e._state!==A){return}e._state=C;e._result=t;s(D,e)}function Y(e,t,n,r){var o=e._subscribers;var i=o.length;e._onerror=null;o[i]=t;o[i+P]=n;o[i+C]=r;if(i===0&&e._state){s(z,e)}}function z(e){var t=e._subscribers;var n=e._state;if(t.length===0){return}var r=void 0,o=void 0,i=e._result;for(var s=0;s<t.length;s+=3){r=t[s];o=t[s+n];if(r){G(n,r,o,i)}else{o(i)}}e._subscribers.length=0}function G(e,t,n,r){var o=u(n),i=void 0,s=void 0,a=true;if(o){try{i=n(r)}catch(e){a=false;s=e}if(t===i){N(t,M());return}}else{i=r}if(t._state!==A);else if(o&&a){q(t,i)}else if(a===false){N(t,s)}else if(e===P){H(t,i)}else if(e===C){N(t,i)}}function J(n,e){try{e(function e(t){q(n,t)},function e(t){N(n,t)})}catch(e){N(n,e)}}var Q=0;function X(){return Q++}function I(e){e[x]=Q++;e._state=undefined;e._result=undefined;e._subscribers=[]}function K(){return new Error("Array Methods must be provided an Array")}var W=function(){function e(e,t){this._instanceConstructor=e;this.promise=new e(S);if(!this.promise[x]){I(this.promise)}if(n(t)){this.length=t.length;this._remaining=t.length;this._result=new Array(this.length);if(this.length===0){H(this.promise,this._result)}else{this.length=this.length||0;this._enumerate(t);if(this._remaining===0){H(this.promise,this._result)}}}else{N(this.promise,K())}}e.prototype._enumerate=function e(t){for(var n=0;this._state===A&&n<t.length;n++){this._eachEntry(t[n],n)}};e.prototype._eachEntry=function e(t,n){var r=this._instanceConstructor;var o=r.resolve;if(o===O){var i=void 0;var s=void 0;var a=false;try{i=t.then}catch(e){a=true;s=e}if(i===E&&t._state!==A){this._settledAt(t._state,n,t._result)}else if(typeof i!=="function"){this._remaining--;this._result[n]=t}else if(r===te){var u=new r(S);if(a){N(u,s)}else{k(u,t,i)}this._willSettleAt(u,n)}else{this._willSettleAt(new r(function(e){return e(t)}),n)}}else{this._willSettleAt(o(t),n)}};e.prototype._settledAt=function e(t,n,r){var o=this.promise;if(o._state===A){this._remaining--;if(t===C){N(o,r)}else{this._result[n]=r}}if(this._remaining===0){H(o,this._result)}};e.prototype._willSettleAt=function e(t,n){var r=this;Y(t,undefined,function(e){return r._settledAt(P,n,e)},function(e){return r._settledAt(C,n,e)})};return e}();function B(e){return new W(this,e).promise}function V(o){var i=this;if(n(o))return new i(function(e,t){for(var n=o.length,r=0;r<n;r++)i.resolve(o[r]).then(e,t)});else return new i(function(e,t){return t(new TypeError("You must pass an array to race."))})}function Z(e){var t=new this(S);return N(t,e),t}function $(){throw new TypeError("You must pass a resolver function as the first argument to the promise constructor")}function ee(){throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.")}var te=function(){function t(e){this[x]=X();this._result=this._state=undefined;this._subscribers=[];if(S!==e){typeof e!=="function"&&$();this instanceof t?J(this,e):ee()}}t.prototype.catch=function e(t){return this.then(null,t)};t.prototype.finally=function e(t){var n=this;var r=n.constructor;if(u(t)){return n.then(function(e){return r.resolve(t()).then(function(){return e})},function(e){return r.resolve(t()).then(function(){throw e})})}return n.then(t,t)};return t}();function ne(){var e=void 0;if(void 0!==re)e=re;else if("undefined"!=typeof self)e=self;else try{e=Function("return this")()}catch(e){throw new Error("polyfill failed because global object is unavailable in this environment")}var t=e.Promise;if(t){var n=null;try{n=Object.prototype.toString.call(t.resolve())}catch(e){}if("[object Promise]"===n&&!t.cast)return}e.Promise=te}return te.prototype.then=E,te.all=function(e){return new W(this,e).promise},te.race=function(o){var i=this;return n(o)?new i(function(e,t){for(var n=o.length,r=0;r<n;r++)i.resolve(o[r]).then(e,t)}):new i(function(e,t){return t(new TypeError("You must pass an array to race."))})},te.resolve=O,te.reject=function(e){var t=new this(S);return N(t,e),t},te._setScheduler=function(e){i=e},te._setAsap=function(e){s=e},te._asap=s,te.polyfill=function(){var e=void 0;if(void 0!==re)e=re;else if("undefined"!=typeof self)e=self;else try{e=Function("return this")()}catch(e){throw new Error("polyfill failed because global object is unavailable in this environment")}var t=e.Promise;if(t){var n=null;try{n=Object.prototype.toString.call(t.resolve())}catch(e){}if("[object Promise]"===n&&!t.cast)return}e.Promise=te},te.Promise=te}()}(n={exports:{}}),n.exports),a=window;window.Promise||s.polyfill();var h={ajax:function(e,o,i){var t;if(void 0===e&&(e={}),(t=d({url:"",type:"GET",dataType:"json",async:!0,data:null,headers:{},timeout:1e4,isFromdata:!1,beforeSend:function(e){},complete:function(e,t){}},e)).url&&t.type&&t.data&&t.dataType){var s=new XMLHttpRequest;s.addEventListener("loadstart",function(e){t.beforeSend(s)}),s.addEventListener("load",function(e){var t=s.status;if(200<=t&&t<=300||304===t){var n=void 0;if("text"===s.responseType)try{n=s.responseText}catch(e){n=null}else if("document"===s.responseType)n=s.responseXML;else if(s.response){n="";try{n="[object String]"===Object.prototype.toString.call(s.response)?JSON.parse(s.response):s.response}catch(e){n=s.response}}else{n="";try{n="[object String]"===Object.prototype.toString.call(s.responseText)?JSON.parse(s.responseText):s.responseText}catch(e){try{n=s.responseText}catch(e){n=null}}}o(n)}else{var r=h.getErrorObj("请求错误","ERR0003",t);i(r)}}),s.addEventListener("loadend",function(e){t.complete(s,s.status)}),s.addEventListener("error",function(e){var t=h.getErrorObj("请求错误","ERR0003",s.status);i(t)}),s.addEventListener("timeout",function(e){var t=h.getErrorObj("请求超时","ERR0002",408);i(t)});var n,r=!1,a=t.type.toUpperCase();"GET"!==a&&"DELETE"!==a||(r=!0,t.url+=h.getUrlParam(t.url,t.data));try{s.open(t.type,t.url,t.async)}catch(e){var u=h.getErrorObj("初始化请求错误","ERR0001",s.status);return void i(u)}if(t.async&&(s.responseType=t.dataType),t.headers)for(var c=0,f=Object.keys(t.headers);c<f.length;c++){var l=f[c];s.setRequestHeader(l,t.headers[l])}t.async&&t.timeout&&(s.timeout=t.timeout),n=t.isFromdata?t.data:r?null:t.headers["Content-Type"]&&0<=t.headers["Content-Type"].indexOf("application/json")?JSON.stringify(t.data):h.getQueryString(t.data),s.send(n)}else p.parameterError},getErrorObj:function(e,t,n){return{bodyMessage:null,code:"-1",message:e,subCode:t,status:n}},getUrlParam:function(e,t){if(!t)return"";var n=t instanceof Object?h.getQueryString(t):t;return-1!==e.indexOf("?")?n:"?"+n},getQueryString:function(e){var r=[];return e instanceof Object&&i(e,function(e,t){var n=e;r.push(encodeURIComponent(t)+"="+encodeURIComponent(n))}),r.join("&")},request:function(e){void 0===e&&(e={});function r(e,t){401===t?p.noAuthority:408===t&&p.timeOut}e.beforeSend=(e.beforeSend||function(){}).before(function(e){});var o=e.success;e.success=function(e,t,n){e&&e instanceof Object&&1!==e.code?r(0,t):o&&o(e,t,n)},e.error=(e.error||function(){}).before(function(e,t,n){r(0,t)}),e.complete=(e.complete||function(){}).after(function(e,t){}),h.ajax.before(h.addAuthorizationHeader)(e)},addAuthorizationHeader:function(e){e.headers=e.headers||{};var t="Authorization";Object.keys(e.headers).some(function(e){return e===t})||(e.headers[t]="test")}};Function.prototype.before=function(n){var r=a;return function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];n.apply(a,e),r.apply(a,e)}},Function.prototype.after=function(n){var r=a;return function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];r.apply(a,e),n.apply(a,e)}};var u=function(e){this.dataType="json",this.data={},this.headers={},this.beforeSend=function(){},this.complete=function(){},this.headers=e.headers,this.type=e.type,this.isFromdata=e.isFromdata||!1},c={get:function(e,t,n){var r=d(new u({headers:{},type:"GET"}),e);return!1===r.async?h.ajax(r,t,n):new Promise(function(e,t){h.ajax(r,e,t)})},delete:function(e,t,n){var r=d(new u({headers:{},type:"DELETE"}),e);return!1===r.async?h.ajax(r,t,n):new Promise(function(e,t){h.ajax(r,e,t)})},post:function(e,t,n){var r=d(new u({headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},type:"POST"}),e);return!1===r.async?h.ajax(r,t,n):new Promise(function(e,t){h.ajax(r,e,t)})},put:function(e,t,n){var r=d(new u({headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8","X-HTTP-Method-Override":"put"},type:"POST"}),e);return!1===r.async?h.ajax(r,t,n):new Promise(function(e,t){h.ajax(r,e,t)})},postbody:function(e,t,n){var r=d(new u({headers:{"Content-Type":"application/json; charset=UTF-8"},type:"POST"}),e);return!1===r.async?h.ajax(r,t,n):new Promise(function(e,t){h.ajax(r,e,t)})},fromData:function(e,t,n){var r=d(new u({headers:{},type:"POST",isFromdata:!0}),e);return!1===r.async?h.ajax(r,t,n):new Promise(function(e,t){h.ajax(r,e,t)})}};e.http=c,Object.defineProperty(e,"__esModule",{value:!0})});
