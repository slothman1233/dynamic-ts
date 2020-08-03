
# STL 网络请求插件

包含 get,post,put,delete 四个封装方法
如果不够用可以使用实例后的 axios 属性进行原始请求

## 内置导出 HttpService 类

实例化参数(\*为必传) 两个参数

|  参数   |     类型      |   说明   | 默认值 |
| :-----: | :-----------: | :------: | :----: |
| baseURL |    String     | 基础路径 |   ''   |
| options | ReqBaseConfig | 基础配置 |  none  |

下面是 ReqBaseConfig 的说明 如果传了 options 则下方\*必传

|    参数     |   类型   |              说明              |   默认值   |
| :---------: | :------: | :----------------------------: | :--------: |
|    msgUI    |   any    |          提示 UI 插件          |    none    |
|  \* logout  | Function |            登出方法            |    none    |
|   timeout   |  Number  |          默认超时时间          | 1000 \* 12 |
| \* getToken | Function |          获取凭证方法          |    none    |
| signHeaders | Function |  签名方法(返回需要设置的头部)  |    none    |
| requestSet  | Function |       请求拦截执行的方法       |    none    |
| responseSet | Function | 响应拦截执行的方法(基本用不到) |    none    |

```js
import HttpService from '@stl/request'
const http = new HttpService()
// 如果有基础路径也可以
const http2 = new HttpService('baseUrl')
```

## 实例属性与方法说明

@Prop: axios 初始请求模块

```
就是Axios的原始实例化对象
```

@Method: get get 请求

```
参数说明:
@Param url:string 地址
@Param options:AxiosOptions 请求其他配置(下面会有类型说明)
@Return ResponseData | undefined
```

```js
// GET示例代码
export function getList(params: Params) {
  return http.get('url', { params })
}
```

@Method: post post 请求

```
参数说明:
@Param url:string 地址
@Param data:any 参数
@Param options:AxiosOptions 请求其他配置(下面会有类型说明)
@Return ResponseData | undefined
```

```js
// POST示例代码
export function sendPost(data: Params) {
  return http.post('url', data, options)
}
```

@Method: put put 请求

```
参数说明:
@Param url:string 地址
@Param data:any 参数
@Param options:AxiosOptions 请求其他配置(下面会有类型说明)
@Return ResponseData | undefined
```

```js
// PUT示例代码
export function sendPut(data: Params) {
  return http.put('url', data, options)
}
```

@Method: delete delete 请求

```
参数说明:
@Param url:string 地址
@Param options:AxiosOptions 请求其他配置(下面会有类型说明)
@Return ResponseData | undefined
```

```js
// PUT示例代码
export function sendDelete(params: Params) {
  return http.delete('url', { params })
}
```

AxiosOptions 说明 除说明的部分以外 同 Axios 原配置

|     属性     |  类型   |                                    说明                                    | 默认值 |
| :----------: | :-----: | :------------------------------------------------------------------------: | :----: |
|    codes     |  Codes  |                         对应的 subCode 值放置对象                          |  none  |
|  queryType   | string  | json&#124;formd(FormData)&#124;forms(qs 模式)&#124;text(get,put 默认 text) |  none  |
|   msgPack    | boolean |                      若支持 msgPack 是否以此形式发送                       |  none  |
| queryOptions | object  |                          同 qs 模块序列化设置一致                          |  none  |

Codes 说明

| 属性  |     类型      |                      说明                      | 默认值 |
| :---: | :-----------: | :--------------------------------------------: | :----: |
| sures | Array<String> |           对应的正确 subCode 值集合            |  none  |
|  err  | Array<String> | 对应错误且需要自动报 msg 的错误 subCode 值集合 |  none  |

```js
// CODES示例代码
export function sendPost(data: Params) {
  return http.post('url', data, {
    codes: {
      sures: ['正确的SubCode'],
      err: ['我是错误且需要报消息的SubCode'],
    },
  })
}
```

```js
// queryType示例代码
// queryType:text
export function sendPost(data: Params) {
  return http.post('url', data, {
    queryType: 'text',
  })
}
/*
会将参数同时赋值在params中
url?content=qweqw&productType=16
*/
```

```js
// queryType:json
export function sendPost(data: Params) {
  return http.post('url', data, {
    queryType: 'json',
  })
}
/*
会将data中的参数序列化一次再返回 以保证正确的JSON传递

*/
```

![tvBCbK.png](https://t1.picb.cc/uploads/2020/07/27/tvBCbK.png)

```js
// queryType:formd
export function sendPost(data: Params) {
  return http.post('url', data, {
    queryType: 'formd',
  })
}
/*
会以FormData的形式传递数据
但是默认是以 application/x-www-form-urlencoded的类型
如果上传文件 需要自己改成 multipart/form-data 同样在options传递headers即可
*/
```

```js
// queryType:forms
export function sendPost(data: Params) {
  return http.post('url', data, {
    queryType: 'forms',
  })
}
/*
会将参数以qs模块进行序列化再进行传递数据
默认就是直接序列化  如果有特殊参数需求 可以传入queryOptions
同 qs的设置一致
*/
```
