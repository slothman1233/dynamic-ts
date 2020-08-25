/*
 * @Description:
 * @Version: 0.1
 * @Author: EveChee
 * @Date: 2020-07-07 11:04:01
 * @LastEditTime: 2020-08-25 15:32:16
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
export default class PowerPlugin {
  // 项目名称
  projectId: number
  // token键
  tokenKey: string
  // 用户信息存储键
  userInfoKey: string
  // 登录页路径
  loginPath: string
  // 无需鉴权白名单
  whiteList?: string[]
  router: VueRouter
  // 无需匹配就存在的路由
  staticRoutes?: RouteConfig[]
  // 需要匹配的路由
  routes: RouteConfig[]
  // 匹配好的路由
  matchRoutes: RouteConfig[] = []
  // 请求体
  http: HttpService
  // 请求地址
  baseUrlList = new Map([
    ['dev', 'http://47.113.105.208:8089/'],
    ['test', ''],
    ['pre', ''],
    ['prod', ''],
  ])
  // 基础地址
  baseUrl?: string = ''
  // 当前环境
  mode: string
  constructor(options: PowerOptions) {
    if (!options.projectId) {
      throw new Error('projectId is undefined!')
    }
    if (!options.router) {
      throw new Error('VueRouter is undefined!')
    }
    if (!options.routes) {
      throw new Error('routes is undefined!')
    }
    this.projectId = options.projectId
    this.tokenKey = options.tokenKey || 'token'
    this.userInfoKey = options.userInfoKey || `__${this.projectId}__user_info`
    this.loginPath = options.loginPath || '/login'
    this.whiteList = options.whiteList || [this.loginPath]
    this.router = options.router
    this.routes = options.routes
    this.staticRoutes = options.staticRoutes || []
    this.mode = options.mode || 'dev'
    this.baseUrl = options.baseUrl
    this.http = new HttpService(
      this.baseUrl || this.baseUrlList.get(this.mode) || '',
      {
        msgUI: Message,
        logout: this.logout,
        getToken: () => this.token,
        tokenHeaderKey: this.tokenKey,
      }
    )
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
      routes.forEach((route) => {
        if (route.meta && item.id === route.meta.id) {
          let children
          if (route.children) {
            children = this.checkMenuList(item.children, route.children)
          }
          _routes.push(
            Object.assign({}, route, children ? { children } : undefined)
          )
        }
      })
    })
    return _routes
  }

  async login(data: LoginParams) {
    const res = await login(this.http, data).catch((e: Error) =>
      console.log('登录失败', e)
    )
    if (!res) return
    this.token = res.bodyMessage.token
    await this.getUserInfo()
    return res
  }

  async logout() {
    await logout(this.http, { token: this.token || '' })
    this.token = null
    this.userInfo = null
    this.router.replace(this.loginPath)
  }
  async getUserInfo() {
    const res = await getAdminInfo(this.http, { projectId: this.projectId })
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
  projectId: number
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
