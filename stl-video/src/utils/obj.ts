

/**
 * 是否是object类型
 */
export function isObject(value: any) {
  //return !!value && typeof value === "object";
  // return Object.prototype.toString.call(value) === "[Object Object]";
  if(value){
    return typeof value === "object";
  }
  return false;
}

/**
 * 判断是否是数组对象类型
 * @param value 值
 */
export function isPlain(value: any) {
  // return isObject(value) &&
  //   toString.call(value) === '[object Object]' &&
  //   value.constructor === Object;
  Object.prototype.toString.call(value)
}



const keys = function (object: any) {
  return isObject(object) ? Object.keys(object) : [];
};


export function each(object: any, fn: Function) {
  keys(object).forEach(key => fn(object[key], key));
}
