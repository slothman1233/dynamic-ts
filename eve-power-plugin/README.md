<!--
 * @Description:
 * @Version: 0.1
 * @Author: EveChee
 * @Date: 2020-07-27 16:37:23
 * @LastEditTime: 2020-10-29 16:24:02
-->

# STL 后台管理权限集中处理插件

包含路由权限，按钮权限，和单点登录，登出的处理

## 0.2 版本更新说明

@delete:剔除了 permissions 集成到了 userInfo 内部
@add:增加了 react hooks 版本

## 1.2+ 版本更新说明

！！！vue模式增加了微前端版本 react未增加  请使用1.1(不包含)以下

## 内置导出 PowerPlugin 类

(安装说明:
如果已标签的形式加载
前置的[@stl/request](http://47.113.105.208:8088/-/web/detail/@stl/request)是需要自己引入的)

实例化参数(\*为必传)

|     参数     |        类型         |          说明           |            默认值            |
| :----------: | :-----------------: | :---------------------: | :--------------------------: |
| \* projectId |       Number        |         项目 ID         |             none             |
|  \* router   |      VueRouter      |        路由对象         |             none             |
|  \* routes   | Array<RouterConfig> |     动态路由对照表      |             none             |
|   tokenKey   |       string        | token 自定义 Key 暂无用 |            token             |
| userInfoKey  |       string        |   用户信息自定义 Key    | \_\_{projectId}\_\_user_info |
|  loginPath   |       string        |       登录页地址        |            /login            |
|  whiteList   |    Array<string>    |     无需鉴权白名单      |         [loginPath]          |
| staticRoutes | Array<RouterConfig> |    与权限无关的路由     |              []              |
|     mode     |       string        |    dev,test,pre,prod    |             dev              |
|   baseUrl    |       string        |   请求权限的基础地质    |              ''              |

## 实例属性与方法说明

@Method: init 初始化方法

```
无参数;
无返回值;
行为：初始化对路由的挂载
实例化之后手动调用才会对权限和路由进行处理
```

@Method: login 单点登录

```
参数说明:
@Param username:string 用户名
@Param pwd:string 密码
@Return ResponseData | undefined
(ResponseData .d.ts 有定义)
行为1:直接存好 token
行为2:会请求一次用户信息
```

@Method: logout 注销

```
无参数;
无返回值;
行为：消除 token 和 permissions 并跳转至登录页
```

@Prop: token 凭证

```
项目所需的 token 存放
```

@Prop: userInfo 管理员用户信息

```
当前登录的管理员信息
```

@Method: getUserInfo 获取管理员用户信息

```
无参数；
@return:Promise<ResponseData>
写入userInfo
并返回请求结果
```

@Decorator HasBtn 按钮鉴权

```
参数说明：
@Param key:string
行为：对目标进行鉴权赋值 有无权限对应 true|false
```

## React 版

实例化参数(\*为必传)

|     参数     |        类型         |          说明           |            默认值            |
| :----------: | :-----------------: | :---------------------: | :--------------------------: |
| \* projectId |       Number        |         项目 ID         |             none             |
|  \* routes   | Array<RouterConfig> |     动态路由对照表      |             none             |
|   tokenKey   |       string        | token 自定义 Key 暂无用 |            token             |
| userInfoKey  |       string        |   用户信息自定义 Key    | \_\_{projectId}\_\_user_info |
| staticRoutes | Array<RouterConfig> |    与权限无关的路由     |              []              |
|     mode     |       string        |    dev,test,pre,prod    |             dev              |
|   baseUrl    |       string        |   请求权限的基础地质    |              ''              |

```
这里比vue要少传一些参数  随之也少了自动跳转登录的功能 转而由开发者自行决定何时跳转逻辑
```

示例代码：

```js
const staticRoutes = useMemo(() => [], []) //静态路由
const [rs, obj] = usePower({
  projectId: 1,
  staticRoutes,
  routes: routers, // 动态鉴权的所有路由
})
useEffect(() => {
  ;(async () => {
    // 模拟登陆操作
    await obj.login({ username: 'admin0', pwd: '123456' })
  })()
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [])
```

## 实例属性与方法说明

暴露出 usePower 的 Hooks
返回[matchRoutes,powerObj]
matchRoutes 是所匹配完成的路由数组

powerObj 说明如下

@Method: login 单点登录

```
参数说明:
@Param username:string 用户名
@Param pwd:string 密码
@Return ResponseData | undefined
(ResponseData .d.ts 有定义)
行为1:直接存好 token
行为2:会请求一次用户信息
```

@Method: logout 注销

```
无参数;
无返回值;
行为：消除 token 和 permissions 并跳转至登录页
```

@Prop: token 凭证

```
项目所需的 token 存放
```

@Prop: userInfo 管理员用户信息

```
当前登录的管理员信息
```

@Method: getUserInfo 获取管理员用户信息

```
无参数；
@return:Promise<ResponseData>
写入userInfo
并返回请求结果
```

@Decorator HasBtn 按钮鉴权

```
参数说明：
@Param key:string
行为：对目标进行鉴权赋值 有无权限对应 true|false
```
