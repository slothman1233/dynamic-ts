/*
 * @Description:
 * @Version: 0.1
 * @Author: EveChee
 * @Date: 2020-07-07 11:04:01
 * @LastEditTime: 2020-07-30 10:18:45
 */
import VueRouter, { RouteConfig } from 'vue-router'
import HttpService from '@stl/request'
// 弹窗消息UI组件
import {Message} from 'element-ui'
// 进度条
import NProgress from 'nprogress' // progress bar
import { login, logout, getPower,LoginParams, getAdminInfo } from './api'
export default class PowerPlugin {
    // 项目名称
    projectId: number
    // token键
    tokenKey: string
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
    userInfo: any
    // 用户信息
    baseUrlList = new Map([
        ['dev', 'http://47.113.105.208:8089/'],
        ['test', ''],
        ['pre', ''],
        ['prod', ''],
    ])
    // 基础地址
    baseUrl?:string = ''
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
        this.loginPath = options.loginPath || '/login'
        this.whiteList = options.whiteList || [this.loginPath]
        this.router = options.router
        this.routes = options.routes
        this.staticRoutes = options.staticRoutes || []
        this.mode = options.mode || 'dev'
        this.baseUrl = options.baseUrl
        this.http = new HttpService(this.baseUrl || this.baseUrlList.get(this.mode) || '', {
            msgUI: Message,
            logout: this.logout,
            getToken: () => this.token,
        })
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

    get powerKey() {
        return `__${this.projectId}__permissions`
    }
    get authKey() {
        return `__${this.projectId}__${this.tokenKey}`
    }

    get permissions(): any {
        let res = localStorage.getItem(this.powerKey)
        if (!res) return null
        const cache = res.split('__time__')
        const time = +cache[1]
        if (new Date().getTime() - time > 30 * 60 * 1000) {
            // 缓存30m过期
            res = null
        } else {
            res = JSON.parse(cache[0])
        }
        return res
    }
    set permissions(val) {
        if (val) {
            localStorage.setItem(this.powerKey, `${JSON.stringify(val)}__time__${new Date().getTime()}`)
        } else {
            localStorage.removeItem(this.powerKey)
        }
    }

    // 入口实例化之后 调用初始化 对router挂载
    async init() {
        if (this.permissions) {
            // 先使用缓存
            this.matchRoutes = this.checkMenuList(this.permissions.menuList)
            ;(this.router as any).matcher = (new VueRouter({ routes: this.staticRoutes }) as any).matcher
            this.router.addRoutes(this.matchRoutes)
        }
        this.routerHooks()
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
            if (!this.permissions) {
                // 更新最新权限
                const res = await this.reqPowerData()
                if (!res) {
                    // 404
                    next({ path: this.loginPath })
                    NProgress.done()
                    Message.error('获取权限失败,请重新登录尝试')
                    throw new Error('获取权限失败,请重新登录尝试')
                    return
                }
                (this.router as any).matcher = (new VueRouter({
                    routes: this.staticRoutes,
                }) as any).matcher
                this.router.addRoutes(this.matchRoutes)
            }
            next()
            NProgress.done()
        })
    }

    async reqPowerData() {
        if (!this.token) return
        const res = await getPower(this.http, this.token, {projectId: this.projectId})
        if (res) {
            // 更新到最新数据 匹配本地路由
            this.matchRoutes = this.checkMenuList(res.bodyMessage.menuList)
            this.permissions = res.bodyMessage
        }
        return res
    }

    checkMenuList(list: Menu[], routes: RouteConfig[] = this.routes): RouteConfig[] {
        if (!list) return []
        const _routes: RouteConfig[] = []
        list.forEach((item) => {
            routes.forEach((route) => {
                if (item.id === route.meta.id) {
                    let children
                    if (route.children) {
                        children = this.checkMenuList(item.children, route.children)
                    }
                    _routes.push(Object.assign({}, route, { children }))
                }
            })
        })
        return _routes
    }

    async login(data: LoginParams) {
        const res = await login(this.http, data).catch((e: Error) => console.log('登录失败', e))
        if (!res) {
            return
        } else {
            this.token = res.bodyMessage.token
        }
        await this.getUserInfo()
        return res
    }

    async logout() {
        await logout(this.http, { token: this.token || '' }).catch((e: Error) => console.log('登录失败', e))
        this.token = null
        this.permissions = null
        this.router.replace(this.loginPath)
    }
    async getUserInfo(){
        const res = await getAdminInfo(this.http, this.token || '', {projectId: this.projectId})
        if (res) {
            this.userInfo = res.bodyMessage
        }
        return res
    }

    HasBtn(key: string) {
        return (target: any, propName: string) => {
            target[propName] = this.permissions?.permissionList.includes(key)
        }
    }
}

type PowerOptions = {
    tokenKey?: string
    loginPath?: string
    projectId: number
    whiteList?: string[]
    mode?: string
    router: VueRouter
    routes: RouteConfig[]
    staticRoutes?: RouteConfig[]
    baseUrl?:string
}
type PowerInitOptions = {
    // 是否每次跳转都去获取最新权限
    each?: boolean
}

type Permissions = {
    id: number
    username: string
    realName: string
    avatar: string
    phone: string
    email: string
    userStatus: number
    menuList: Menu[]
}

type Menu = {
    id: number
    parentId: number
    menuIdx: number
    menuName: string
    menuIcon: string
    permission: string
    type: number
    routePath: string
    componentName: string
    componentPath: string
    remark: any
    outside: number
    show: number
    cached: number
    createTime: string
    children: Menu[]
    authorized: boolean
}
