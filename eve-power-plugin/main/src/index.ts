/*
 * @Description:
 * @Version: 0.1
 * @Author: EveChee
 * @Date: 2020-07-07 11:04:01
 * @LastEditTime: 2020-10-29 16:21:40
 */
import VueRouter, { RouteConfig } from 'vue-router'
import HttpService from '@stl/request'
// 弹窗消息UI组件
import { Message } from 'element-ui'
// 进度条
import NProgress from 'nprogress' // progress bar
import { login, logout, LoginParams, getAdminInfo } from './api'
import { setCacheAddTime, getCacheCheckTime } from './utils'
import { Permissions, Menu } from './data'
// 微前端模式
const isInMFE = (<any>window).__SINGLE_SPA_MFE__
export default class PowerPlugin {
  // 项目名称
  projectId!: number | string
  // token键
  tokenKey!: string
  // 用户信息存储键
  userInfoKey!: string
  // 登录页路径
  loginPath!: string
  // 无需鉴权白名单
  whiteList?: string[]
  router!: VueRouter
  // 无需匹配就存在的路由
  staticRoutes?: RouteConfig[]
  // 需要匹配的路由
  routes!: RouteConfig[]
  // 匹配好的路由
  matchRoutes: RouteConfig[] = []
  // 请求体
  public static http: HttpService
  // 请求地址
  baseUrlList = new Map([
    ['dev', 'http://47.113.105.208:8089/'],
    ['test', 'http://47.113.105.208:8189/'],
    ['pre', 'http://47.113.105.208:8087/'],
    ['prod', 'http://47.113.105.208:8086/'],
  ])
  // 基础地址
  baseUrl?: string = ''
  // 当前环境
  mode!: string
  // 单例模式
  private static instance: PowerPlugin | null = null
  public static getInstance(options: PowerOptions) {
    if (!PowerPlugin.instance) {
      return (PowerPlugin.instance = new PowerPlugin(options))
    } else {
      return PowerPlugin.instance
    }
  }
  private mfeOptionsInit(options: PowerOptions) {
    this.projectId = 'mfe__main'
  }
  private singleOptionsInit(options: PowerOptions) {
    this.projectId = options.projectId || ''
  }
  private optionsInit(options: PowerOptions) {
    if (isInMFE) {
      this.mfeOptionsInit(options)
    } else {
      this.singleOptionsInit(options)
    }
    this.tokenKey = options.tokenKey || 'token'
    this.userInfoKey = options.userInfoKey || `__${this.projectId}__user_info`
    this.loginPath = options.loginPath || '/login'
    this.whiteList = options.whiteList || [this.loginPath]
    this.router = options.router
    this.routes = options.routes
    this.staticRoutes = options.staticRoutes || []
    this.mode = options.mode || 'dev'
    this.baseUrl = options.baseUrl
    PowerPlugin.http =
      PowerPlugin.http ||
      new HttpService(this.baseUrl || this.baseUrlList.get(this.mode) || '', {
        msgUI: Message,
        logout: () => this.logout(),
        getToken: () => this.token,
        tokenHeaderKey: this.tokenKey,
      })
  }
  constructor(options: PowerOptions) {
    if (!options.router) {
      throw new Error('VueRouter is undefined!')
    }
    if (!options.routes) {
      throw new Error('routes is undefined!')
    }
    this.optionsInit(options)
  }
  get token() {
    return localStorage.getItem(this.authKey)
  }
  set token(val) {
    if (val) {
      localStorage.setItem(this.authKey, val)
    } else {
      localStorage.removeItem(this.authKey)
    }
  }
  get userInfo(): any {
    return getCacheCheckTime(this.userInfoKey)
  }
  set userInfo(val) {
    setCacheAddTime(this.userInfoKey, val)
  }
  // 用户信息
  get authKey() {
    return `__${this.projectId}__${this.tokenKey}`
  }

  // 入口实例化之后 调用初始化 对router挂载
  async init() {
    if (this.userInfo) {
      // 先使用缓存
      this.routerUpdate()
    }
    this.routerHooks()
  }

  routerUpdate() {
    this.matchRoutes = this.checkMenuList(this.userInfo.menuList)
    ;(this.router as any).matcher = (new VueRouter({
      routes: this.staticRoutes,
    }) as any).matcher
    this.router.addRoutes(this.matchRoutes)
  }

  private routerHooks() {
    this.router.beforeEach(async (to, from, next) => {
      NProgress.start()
      // 白名单忽略
      if (this.whiteList && this.whiteList.includes(to.path)) {
        next()
        NProgress.done()
        return
      }
      // 未登录 跳登录页
      if (!this.token) {
        next({ path: this.loginPath })
        NProgress.done()
        return
      }
      if (!this.userInfo) {
        // 更新最新权限
        const res = await this.getUserInfo()
        if (!res) {
          // 404
          next({ path: this.loginPath })
          NProgress.done()
          Message.error('获取权限失败,请重新登录尝试')
          throw new Error('获取权限失败,请重新登录尝试')
          return
        }
      }
      next()
      NProgress.done()
    })
  }

  checkMenuList(
    list: Menu[],
    routes: RouteConfig[] = this.routes
  ): RouteConfig[] {
    if (!list) return []
    const _routes: RouteConfig[] = []
    list.forEach((item) => {
      const { type, menuName, children, permission } = item
      // 首先检查是否目录
      const isDir = type === 1
      // 检测是否包含子菜单
      const hasChildren = children && !!children.length
      routes.forEach((route) => {
        // 如果是目录则只比对名字 菜单则比对标识
        const hasRoute = isDir
          ? route?.meta?.title === menuName
          : route?.meta?.permission === permission
        const { children: _children } = route
        let tempChildren
        if (hasRoute && hasChildren && _children && _children.length) {
          // 如果路由存在并且有子菜单 进行子菜单的比对
          tempChildren = this.checkMenuList(children, _children)
        }
        hasRoute &&
          _routes.push(
            Object.assign(
              {},
              route,
              tempChildren ? { children: tempChildren } : undefined
            )
          )
      })
    })
    return _routes
  }

  async login(data: LoginParams) {
    const res = await login(PowerPlugin.http, data).catch((e: Error) =>
      console.log('登录失败', e)
    )
    if (!res) return
    this.token = res.bodyMessage.token
    await this.getUserInfo()
    return res
  }

  async logout() {
    const nowIsLogin = this.router?.currentRoute.fullPath === this.loginPath
    //  异步多次出现401 后续解决
    // this.token && !nowIsLogin && await logout(PowerPlugin.http, { token: this.token })
    this.token = null
    this.userInfo = null
    !nowIsLogin && this.router.replace(this.loginPath)
  }
  async getUserInfo() {
    const res = await getAdminInfo(PowerPlugin.http, {
      projectId: this.projectId,
    })
    if (res) {
      this.userInfo = res.bodyMessage
      this.routerUpdate()
    }
    return res
  }

  HasBtn(key: string) {
    return (target: any, propName: string) => {
      if (!this.userInfo) return
      target[propName] = this.userInfo?.permissionList.includes(key)
    }
  }
}

type PowerOptions = {
  tokenKey?: string
  userInfoKey?: string
  loginPath?: string
  projectId: number | string
  whiteList?: string[]
  mode?: string
  router: VueRouter
  routes: RouteConfig[]
  staticRoutes?: RouteConfig[]
  baseUrl?: string
}
type PowerInitOptions = {
  // 是否每次跳转都去获取最新权限
  each?: boolean
}
