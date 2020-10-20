# ajax请求插件

### 使用方法
```
npm install @stl/httprequset

import { http } from "@stl/httprequest"

http.get(
    {
        url:url,
        data:data,
        beforeSend:function(xhr:any){console.log("请求开始回调函数",xhr)},
        complete:function(xhr:any,status:any){console.log("请求结束回调函数",xhr,status)},
        ......
    }
).then(
    function(a:any){//请求成功的回调
        console.log(a)
    },
    function(e:any){//请求失败的回调
        console.log(e)
    }
)
或者
http.post(
    {
        url:url,
        data:data,
        beforeSend:function(xhr:any){console.log("请求开始回调函数",xhr)},
        complete:function(xhr:any,status:any){console.log("请求结束回调函数",xhr,status)},
    }
).then(
    function(a:any){//请求成功的回调
        console.log(a)
    },
).catch(
    function(e:any){//请求失败的回调
        console.log(e)
    }
)
```

### 方法说明
```
http.get();
http.post();调用此方法,参数data应为查询字符串或普通对象
http.put();
http.delete();
http.fromData();
http.postbody();//调用此方法,参数data应为json字符串
```

### 参数介绍
|  name         |  type     |  default    |  description                                                                                   |
| :----------:  | :-------: |  :--------: |  :------------------------------------------------------------------------------------------:  |
|  url          |  string   |     ""      |  请求地址                                                                   |
|  type         |  string   |    "GET"    |  请求类型 GET POST DELETE     |
|  dataType     |  string   |     "json"  |  返回的数据类型 json text document ...                                      |
|  async        |  boolean  |    true     |  true:异步请求 false:同步请求    |
|  data         |  object   |     null    |  请求的参数                                                                 |
|  headers      |  object   |     {}      |  请求头                                                    |
|  timeout      |  number   |     10000   |  请求超时时间                                                      |
|  isFromdata  |  boolean  |     false    |                             |
|  beforeSend  |  function  |  (xhr:any) => { }    |       请求开始回调函数                      |
|  complete  |  function  |  (xhr:any) => { }    |       请求结束回调函数                      |
