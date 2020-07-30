<!--
 * @Description:
 * @Version: 0.1
 * @Author: EveChee
 * @Date: 2020-07-27 16:37:23
 * @LastEditTime: 2020-07-29 15:02:36
-->

# STL 后台管理权限集中处理插件

包含路由权限，按钮权限，和单点登录，登出的处理

## 内置导出 PowerPlugin 类

实例化参数(\*为必传)

|     参数     |        类型         |          说明           |   默认值    |
| :----------: | :-----------------: | :---------------------: | :---------: |
| \* projectId |       Number        |         项目 ID         |    none     |
|  \* router   |      VueRouter      |        路由对象         |    none     |
|  \* routes   | Array<RouterConfig> |     动态路由对照表      |    none     |
|   tokenKey   |       string        | token 自定义 Key 暂无用 |    token    |
|  loginPath   |       string        |       登录页地址        |   /login    |
|  whiteList   |    Array<string>    |     无需鉴权白名单      | [loginPath] |
| staticRoutes | Array<RouterConfig> |    与权限无关的路由     |     []      |
|     mode     |       string        |    dev,test,pre,prod    |     dev     |
|     baseUrl     |       string        |    请求权限的基础地质    |     ''     |

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
行为：直接存好 token
```

@Method: logout 注销

```
无参数;
无返回值;
行为：消除 token 和 permissions 并跳转至登录页
```

@Prop: permissions 权限数据

```
包含了权限的所有原始数据
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
