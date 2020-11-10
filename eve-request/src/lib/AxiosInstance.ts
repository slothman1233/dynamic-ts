/*
 * @Description:
 * @Version: 0.1
 * @Author: EveChee
 * @Date: 2020-05-08 14:10:12
 * @LastEditTime: 2020-11-10 14:30:51
 */
import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios'
// 控制跳转中心
import { ResponseData, ReqBaseConfig, Codes } from '..'
import merge from './merge'
import { parse } from 'qs'

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
  token?: Function
  tokenHeaderKey: string
  logout?: Function
  signHeaders?: Function
  requestSet?: Function
  responseSet?: Function
  errorFn?: Function
  codes?:Codes
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
    this.errorFn = options?.errorFn
    this.token = (options && options.getToken) || undefined
    this.logout = (options && options.logout) || undefined
    this.tokenHeaderKey = options?.tokenHeaderKey || 'Authorization'
    this.codes = options?.codes || {}
    this.instance = axios.create({
      timeout: this.timeout,
      baseURL,
      headers: options?.headers,
    })
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

  mergeSignHeaders(config: any) {
    // 合并且生成签名到请求头 调用signHeaders方法
    if (this.signHeaders) {
      let data = config.data || config.params
      if (config.queryType === 'forms') {
        data = parse(data)
      } else if (typeof data === 'string') {
        data = JSON.parse(data)
      }
      config.headers = merge({}, this.signHeaders(data), config.headers)
    }
  }

  // 拦截设置
  initInterceptors = () => {
    // 请求拦截器
    this.instance.interceptors.request.use(
      // 请求成功
      (config: any) => {
        try {
          config.msgPack &&
            this.supportMsg &&
            merge(config, this.msgPackAxiosOptions)
          this.mergeSignHeaders(config)
          this.requestSet && this.requestSet(config)
          if (this.token) {
            config.headers[this.tokenHeaderKey] = this.token()
          }
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
        error: any
      ) => {
        const { response, config } = error
        const errorFn =
          response?.config?.errorFn || config?.errorFn || this.errorFn
        errorFn && errorFn(error)
        if (response && response.status === 401) {
          this.logout && this.logout()
          this.MsgUI?.error('未登录或登录过期!')
          Promise.reject(error)
          return
        }
        if (response && response.config.unErrorMsg) return
        this.MsgUI?.error('请求异常,请稍后再试!')
      }
    )
  }

  checkCode = (res: any): ResponseData<any> | undefined => {
    // 如果code异常(这里已经包括网络错误，服务器错误，后端抛出的错误)，可以弹出一个错误提示，告诉用户
    const { data, status, msg, config } = res
    if (status === -404) {
      this.MsgUI?.error(msg)
      return
    }
    if (!data) return
    const codes = config?.codes || this.codes
    // 兼容后端code不规范
    if (data.code) {
      data.code = +data.code
    }

    const notSure = codes.sures && !this.codeEqual(codes.sures, data.subCode)
    if (data.code !== 0 || notSure) {
      // 失败 在自行处理错误subCode里面的
      const isAutoError = this.codeEqual(codes.err, data.subCode)
      if (isAutoError) {
        this.MsgUI?.error(data.message)
        return
      }
      Promise.reject(data)
    }
    // 成功
    try {
      const { bodyMessage } = data
      if (bodyMessage && typeof bodyMessage === 'string') {
        data.bodyMessage = JSON.parse(data.bodyMessage)
      }
    } catch (e) {
      console.error('bodyMessage not a JSON String!')
    }
    return data
  }

  codeEqual = (arr: any[], subCode: string) =>
    arr && arr.find((code) => subCode.indexOf(code) !== -1)

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
