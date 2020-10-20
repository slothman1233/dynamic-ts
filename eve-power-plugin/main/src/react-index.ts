import {
  useMemo,
  useCallback,
  useReducer,
  useEffect,
  useState,
} from 'react'
import HttpService from '@stl/request'
import { logout, login, LoginParams, getAdminInfo } from './api'
import { setCacheAddTime, getCacheCheckTime } from './utils'
import { Menu } from './data'
import { RouteProps } from 'react-router-dom'
// 进度条
const baseUrlList = new Map([
  ['dev', 'http://47.113.105.208:8089/'],
  ['test', ''],
  ['pre', ''],
  ['prod', ''],
])
type PowerOptions = {
  tokenKey?: string
  userInfoKey?: string
  loginPath?: string
  projectId: number
  mode?: string
  routes: RouteProps[]
  staticRoutes?: RouteProps[]
  baseUrl?: string
  msgUI?: any
}
const usePower = (options: PowerOptions): any[] => {
  const {
    projectId,
    tokenKey = 'token',
    staticRoutes = [],
    routes,
    baseUrl = '',
    mode = 'dev',
    msgUI = null,
  } = options
  if (!projectId) {
    throw new Error('projectId is undefined!')
  }
  if (!routes) {
    throw new Error('routes is undefined!')
  }
  const userInfoKey = useMemo(() => `__${projectId}__user_info`, [projectId])
  const authKey = useMemo(() => `__${projectId}__${tokenKey}`, [
    projectId,
    tokenKey,
  ])
  const tokenReducer = (state: any, action: { type: any; value?: any }) => {
    switch (action.type) {
      case 'set':
        if (action.value) {
          localStorage.setItem(authKey, action.value)
        } else {
          localStorage.removeItem(authKey)
        }
        return localStorage.getItem(authKey)
      case 'get':
        return localStorage.getItem(authKey)
      default:
        throw new Error()
    }
  }
  const [token, dispatchToken] = useReducer(tokenReducer, '')
  const [userInfo, dispatchUserInfo] = useCacheData(userInfoKey, '')
  const logoutFunc = useCallback(
    async (http) => {
      await logout(http, { token: token as string })
      dispatchToken({ type: 'set', value: null })
      dispatchUserInfo({ type: 'set', value: null })
    },
    [dispatchUserInfo, token]
  )
  const http = useMemo(() => {
    return new HttpService(baseUrl || baseUrlList.get(mode) || '', {
      msgUI,
      logout: () => logoutFunc(http),
      getToken: () => token,
      tokenHeaderKey: tokenKey,
    })
  }, [baseUrl, logoutFunc, mode, msgUI, token, tokenKey])
  const [matchRoutes, setMatchRoutes] = useState(staticRoutes)

  async function loginFunc(data: LoginParams) {
    const res = await login(http, data).catch((e: Error) =>
      console.log('登录失败', e)
    )
    if (!res) return
    dispatchToken({ type: 'set', value: res.bodyMessage.token })
    return res
  }

  const getUserInfo = useCallback(async () => {
    if (!token) return
    const res = await getAdminInfo(http, { projectId })
    if (res) {
      dispatchUserInfo({ type: 'set', value: res.bodyMessage })
    }
    return res
  }, [token, http, projectId, dispatchUserInfo])
  // 入口实例化之后 调用初始化 对router挂载
  useEffect(() => {
    ;(async () => {
      if (userInfo) {
        // 先使用缓存
        setMatchRoutes([
          ...checkMenuList(userInfo.menuList, routes),
          ...staticRoutes,
        ])
      } else {
        await getUserInfo()
      }
    })()
  }, [userInfo, routes, staticRoutes, getUserInfo])

  const HasBtn = useCallback(
    (key: string) => {
      return (target: any, propName: string) => {
        if (!userInfo) return
        target[propName] = userInfo?.permissionList.includes(key)
      }
    },
    [userInfo]
  )

  return [
    matchRoutes,
    {
      login: loginFunc,
      logout: logoutFunc,
      userInfo,
      getUserInfo,
      token,
      HasBtn,
    },
  ]
}

function checkMenuList(list: Menu[], routes: any[]): any[] {
  if (!list) return []
  const _routes: any[] = []
  list.forEach((item) => {
    routes.forEach((route) => {
      if (item.id === route.meta.id) {
        let children
        if (route.children) {
          children = checkMenuList(item.children, route.children)
        }
        _routes.push(
          Object.assign({}, route, children ? { children } : undefined)
        )
      }
    })
  })
  return _routes
}

function useCacheData(key: string, initValue?: any) {
  const cacheDataReducer = (
    state: any,
    action: { type: string; value: any }
  ): any => {
    switch (action.type) {
      case 'set':
        setCacheAddTime(key, action.value)
        return getCacheCheckTime(key)
      case 'get':
        return getCacheCheckTime(key)
      default:
        throw new Error()
    }
  }
  return useReducer(cacheDataReducer, initValue)
}
export default usePower
