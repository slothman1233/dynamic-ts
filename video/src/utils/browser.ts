
const USER_AGENT = window.navigator && window.navigator.userAgent || '';
const webkitVersionMap = (/AppleWebKit\/([\d.]+)/i).exec(USER_AGENT);
const appleWebkitVersion = webkitVersionMap ? parseFloat(webkitVersionMap.pop()) : null;


/**
 * 是否是ipad
 *
 * @static
 * @const
 * @type {Boolean}
 */
export const IS_IPAD = (/iPad/i).test(USER_AGENT);


/**
 * 是否是iPhone
 *

 * @return {Boolean}
 */
export const IS_IPHONE = (/iPhone/i).test(USER_AGENT) && !IS_IPAD;


/**
 * 是否是iPod
 *
 * @static
 * @const
 * @return {Boolean}
 */
export const IS_IPOD = (/iPod/i).test(USER_AGENT);

/**
 * 是否是ios
 *
 * @return {Boolean}
 */
export const IS_IOS = IS_IPHONE || IS_IPAD || IS_IPOD;

/**
 * ios的版本号 没有则返回null
 *
 * @return {string|null}
 */
export const IOS_VERSION = (function() {
    const match = USER_AGENT.match(/OS (\d+)_/i);
  
    if (match && match[1]) {
      return match[1];
    }
    return null;
}());

/**
 * 是否是android
 *
 * @return {Boolean}
 */
export const IS_ANDROID = (/Android/i).test(USER_AGENT);

/**
 * android的版本号 没有则返回null
 *
 * @return {number|string|null}
 */
export const ANDROID_VERSION = (function() {

    const match = USER_AGENT.match(/Android (\d+)(?:\.(\d+))?(?:\.(\d+))*/i);
  
    if (!match) {
      return null;
    }
  
    const major = match[1] && parseFloat(match[1]);
    const minor = match[2] && parseFloat(match[2]);
  
    if (major && minor) {
      return parseFloat(match[1] + '.' + match[2]);
    } else if (major) {
      return major;
    }
    return null;
  }());

/**
 * 这是否是本机Android浏览器
 *
 * @return {Boolean}
 */
export const IS_NATIVE_ANDROID = IS_ANDROID && ANDROID_VERSION < 5 && appleWebkitVersion < 537;

/**
 * 是否是火狐浏览器
 *
 * @return {Boolean}
 */
export const IS_FIREFOX = (/Firefox/i).test(USER_AGENT);




/**
 * IE的版本号 没有则返回-1
 *
 * @return {Number|String|null}
        -1 不是ie浏览器 Number
         6/7/8/9/10/11 浏览器的版本 Number
         'edge'  ie的edge浏览器 String
 */
export const IE_VERSION = (function() {
    var isIE = USER_AGENT.indexOf("compatible") > -1 && USER_AGENT.indexOf("MSIE") > -1; //判断是否IE<11浏览器  
    var isEdge = USER_AGENT.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器  
    var isIE11 = USER_AGENT.indexOf('Trident') > -1 && USER_AGENT.indexOf("rv:11.0") > -1;
    if(isIE) {
        var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
        reIE.test(USER_AGENT);
        var fIEVersion = parseFloat(RegExp["$1"]);
        if(fIEVersion == 7) {
            return 7;
        } else if(fIEVersion == 8) {
            return 8;
        } else if(fIEVersion == 9) {
            return 9;
        } else if(fIEVersion == 10) {
            return 10;
        } else {
            return 6;//IE版本<=7
        }   
    } else if(isEdge) {
        return 'edge';//edge
    } else if(isIE11) {
        return 11; //IE11  
    }else{
        return -1;//不是ie浏览器
    }
}());


/**
 * 是否是Edge
 *
 * @return {Boolean}
 */
export const IS_EDGE = (/Edge/i).test(USER_AGENT);

  /**
 * 是否是Chrome
 *
 * @return {Boolean}
 */
export const IS_CHROME = !IS_EDGE && ((/Chrome/i).test(USER_AGENT) || (/CriOS/i).test(USER_AGENT));

/**
 * Chrome的版本号 没有则返回null
 *
 * @return {number|string|null}
 */
export const CHROME_VERSION = (function() {
    const match = USER_AGENT.match(/(Chrome|CriOS)\/(\d+)/);
  
    if (match && match[2]) {
      return parseFloat(match[2]);
    }
    return null;
}());

/**
 * 是否是ios下的Safari
 *
 * @return {Boolean}
 */
export const IS_IOS_SAFARI = (/Safari/i).test(USER_AGENT) && !IS_CHROME && !IS_ANDROID && !IS_EDGE;

/**
 * 是否是Safari
 *
 * @return {Boolean}
 */
export const IS_SAFARI = (IS_IOS_SAFARI || IS_IOS) && !IS_CHROME;



