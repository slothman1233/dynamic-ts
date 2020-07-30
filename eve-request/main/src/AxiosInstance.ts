/*
 * @Description:
 * @Version: 0.1
 * @Author: EveChee
 * @Date: 2020-05-08 14:10:12
 * @LastEditTime: 2020-07-28 11:23:05
 */
import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios'
// 控制跳转中心
import { ResponseData, ReqBaseConfig } from '.'
import merge from 'lodash/merge'

// const BASE_URL = ''
// const BASE_URL = '/api'
// const AUTO_ERROR = 'AUTO_ERROR' // Symbol('AUTO_ERROR')
const CODES = 'CODES'
export default class Intercept {
  // 唯一实例
  public instance: AxiosInstance

  // Http状态判断
  private NORMAL_STATUS = [200, 304, 400]

  // 提示UI插件
  MsgUI?: any
  // 默认超时 12秒
  timeout: number
  token: Function
  logout: Function
  signHeaders?: Function
  requestSet?: Function
  responseSet?: Function
  constructor(baseURL: string = '', options?: ReqBaseConfig) {
    try {
      this.supportMsg = new Uint8Array([])
    } catch {
      this.supportMsg = false
    }
    // 创建axios实例
    this.MsgUI = options?.msgUI
    this.timeout = options?.timeout || 1000 * 12
    this.signHeaders = options?.signHeaders
    this.requestSet = options?.requestSet
    this.responseSet = options?.responseSet
    this.token = () => options?.getToken() || ''
    this.logout = () => options?.logout()
    this.instance = axios.create({ timeout: this.timeout, baseURL })
    // 初始化拦截器
    this.initInterceptors()
  }

  // 获取初始化好的axios实例
  public getInterceptors() {
    return this.instance
  }

  supportMsg: any
  msgPackAxiosOptions: AxiosRequestConfig = {
    headers: {
      Accept: 'application/x-msgpack',
      'Content-Type': 'application/json',
    },
    responseType: 'arraybuffer',
  }

  // 拦截设置
  initInterceptors = () => {
    // 请求拦截器
    this.instance.interceptors.request.use(
      // 请求成功
      (config: any) => {
        try {
          config.msgPack && this.supportMsg && merge(config, this.msgPackAxiosOptions)
          if (this.signHeaders) {
            config.headers = Object.assign(
              {},
              this.signHeaders(config.data || config.params),
              config.headers
            )
          }
          this.requestSet && this.requestSet(config)
          config.headers['Authorization'] = 'Bearer ' + this.token()
        } catch (e) {
          console.log(e)
        }
        return config
      }
    )
    // 响应拦截器
    this.instance.interceptors.response.use(
      (
        // 请求成功
        res: any
      ) => {
        return this.responseSet
          ? this.responseSet(res)
          : (this.checkCode(this.checkStatus(res)) as any)
      },
      (
        // 请求失败
        error: { response: any }
      ) => {
        const { response } = error
        console.log(error)
        if (response) {
          response.status === 401 && this.MsgUI?.error('未登录或登录过期!') && this.logout()
          return response
        }
        this.MsgUI?.error('请求异常,请稍后再试!')
      }
    )
  }

  checkCode = (res: any): ResponseData | undefined => {
    // 如果code异常(这里已经包括网络错误，服务器错误，后端抛出的错误)，可以弹出一个错误提示，告诉用户
    const { data, status, msg, config } = res
    if (status === -404) {
      this.MsgUI?.error(msg)
      return
    }
    if (!data) return
    const codes = config?.codes || {}
    // 兼容后端code不规范
    data.code = +data.code
    if (data.code !== 0 || (codes.sures && !this.codeEqual(codes.sures, data.subCode))) {
      // 失败 并且不在自行处理code里面的
      this.codeEqual(codes.err, data.subCode) ? this.MsgUI?.error(data.message) : data
      return
    }
    // 成功
    try {
      data.bodyMessage = data.bodyMessage ? JSON.parse(data.bodyMessage) : null
    } catch (e) {
      console.log('bodyMessage not a JSON Data!')
    }
    return data
  }

  codeEqual = (arr: any[], subCode: string) => arr && arr.find(code => subCode.indexOf(code) !== -1)

  checkStatus = (response: AxiosResponse) => {
    // loading
    return this.NORMAL_STATUS.includes(response.status)
      ? response
      : {
          status: -404,
          msg: response.data ? response.data.message : '网络异常',
        }
  }
}
