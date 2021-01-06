//现代浏览器的支持
import "fetch-polyfill2"
// import "bluebird"
// 将对象拼接成 key1=val1&key2=val2&key3=val3 的字符串形式
function obj2params(obj: any) {
    let result = '';
    let item;
    for (item in obj) {
        result += '&' + item + '=' + encodeURIComponent(obj[item]);
    }

    if (result) {
        result = result.slice(1);
    }

    return result;
}

const get = (url: any, params: any = {}) => {
    let result = fetch(url, params)
    return result;
}

const post = (url: any, paramsObj: any) => {
    let result = fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: obj2params(paramsObj)
    });
    return result
}

export {
    get,
    post
}



