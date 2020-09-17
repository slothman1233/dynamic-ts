/*
 * @Description:
 * @Version: 0.1
 * @Author: EveChee
 * @Date: 2020-05-08 14:40:09
 * @LastEditTime: 2020-07-27 14:50:20
 */
// import '@babel/polyfill'
import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import Intercept from './AxiosInstance'
import { stringify, IStringifyOptions } from 'qs'
import merge from './merge'
const HEADERS_MAP = new Map([
  [
    'text',
    {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  ],
  [
    'json',
    {
      'Content-Type': 'application/json',
    },
  ],
  [
    'formd',
    {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  ],
  [
    'forms',
    {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  ],
])
class HttpService {
  private axios: AxiosInstance

  constructor(baseURL: string = '', options?: ReqBaseConfig) {
    this.axios = new Intercept(baseURL, options).getInterceptors()
  }

  public get<T>(
    url: string,
    options: AxiosOptions = {}
  ): Promise<ResponseData<T> | undefined> {
    const { queryType = 'text', data, params, queryOptions } = options
    if (queryType === 'text') {
      options.params = params || data
    } else {
      options.paramsSerializer = (params) =>
        HttpService.queryParse(params || data, queryType, queryOptions)
    }
    const opts: AxiosOptions = merge(
      {},
      { headers: HEADERS_MAP.get(queryType) },
      options
    )
    return this.axios.get(url, opts)
  }

  /**
   * @description: Post
   * @param {type}
   * @return: Promise<ResponseData | undefined>
   * @author: EveChee
   */
  public post<T>(
    url: string,
    data?: any,
    options: AxiosOptions = {}
  ): Promise<ResponseData<T> | undefined> {
    const { queryType = 'json', params, queryOptions } = options
    if (queryType === 'text') {
      options.params = params || data
    } else {
      options.data = HttpService.queryParse(data, queryType, queryOptions)
    }
    const opts: AxiosOptions = merge(
      {},
      { headers: HEADERS_MAP.get(queryType) },
      options
    )
    return this.axios.post(url, data, opts)
  }

  /**
   * @description: Put
   * @param {type}
   * @return: Promise<ResponseData | undefined>
   * @author: EveChee
   */
  public put<T>(
    url: string,
    data?: any,
    options: AxiosOptions = {}
  ): Promise<ResponseData<T> | undefined> {
    const { queryType = 'json', queryOptions } = options
    if (queryType === 'text') {
      options.params = data
    } else {
      options.data = HttpService.queryParse(data, queryType, queryOptions)
    }
    const opts: AxiosOptions = merge(
      {},
      { headers: HEADERS_MAP.get(queryType) },
      options
    )
    return this.axios.put(url, options.data, opts)
  }

  /**
   * @description: Delete
   * @param {type}
   * @return: Promise<AxiosResponse<any>>
   * @author: EveChee
   */
  public delete<T>(
    url: string,
    options: AxiosOptions = {}
  ): Promise<ResponseData<T> | undefined> {
    const { queryType = 'text', data, queryOptions } = options
    options.params = data
    options.paramsSerializer = (params) =>
      HttpService.queryParse(params, queryType, queryOptions)
    const opts: AxiosOptions = merge(
      {},
      { headers: HEADERS_MAP.get(queryType) },
      options
    )
    return this.axios.delete(url, opts)
  }

  // 参数格式转化
  public static queryParse(
    data: any,
    type?: string,
    options?: IStringifyOptions
  ) {
    let dataOpts: any
    if (type === 'formd' && data) {
      const form = new FormData()
      for (let key in data) {
        const val = data[key]
        !Array.isArray(val)
          ? form.append(key, val)
          : val.forEach((item) => form.append(`${key}[]`, item))
      }
      dataOpts = form
    } else if (type === 'json') {
      /*
        axios 未解决的 数组变键值对BUG 起因是 util.deepMerge函数错误
        issue: https://github.com/axios/axios/issues/2813
        */
      dataOpts = JSON.stringify(data)
    } else if (type === 'forms') {
      // 兼容json数组
      dataOpts = stringify(data, options)
    } else {
      dataOpts = data
    }
    return dataOpts
  }
}

export default HttpService

interface DataOptions {
  params?: any
  data?: any
}

// 请求额外配置
export interface AxiosOptions extends DataOptions, AxiosRequestConfig {
  headers?: any
  codes?: Codes
  unErrorMsg?: boolean
  queryType?: 'text' | 'json' | 'formd' | 'forms'
  queryOptions?: IStringifyOptions
  msgPack?: boolean
  oth?: AxiosRequestConfig
}

// codes
interface Codes {
  sures?: Array<string>
  err?: Array<string>
}

export interface ResponseData<T> {
  code: number | string
  subCode: string
  bodyMessage: T
}

export type ReqBaseConfig = {
  // UI插件
  msgUI?: any
  // 登出方法
  logout?: Function
  // 默认超时时间
  timeout?: number
  // 凭证获取
  getToken?: Function
  // 默认请求头tokenKey
  tokenHeaderKey?: string
  // 签名方法 返回头部
  signHeaders?: Function
  // 请求拦截方法
  requestSet?: Function
  // 响应拦截方法
  responseSet?: Function
  // 错误回调
  errorFn?:Function
}
