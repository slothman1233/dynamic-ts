/*
 * @Description:
 * @Version: 0.1
 * @Author: EveChee
 * @Date: 2020-05-08 14:40:09
 * @LastEditTime: 2020-11-24 11:10:20
 */
// import '@babel/polyfill'
import { AxiosInstance, AxiosRequestConfig } from 'axios'
import Intercept from './lib/AxiosInstance'
import QueryParse,{FILENAME} from './lib/QueryParse'
import { IStringifyOptions } from 'qs'
import merge from './lib/merge'
export const SYMBOL_FILENAME = FILENAME
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
    let endData = data
    if (queryType === 'text') {
      options.params = params || data
    } else {
      endData = HttpService.queryParse(data, queryType, queryOptions)
      options.data = endData
    }
    const isUpload = data[FILENAME]
    let defaultConfig:any = { headers: HEADERS_MAP.get(queryType) }
    if(isUpload){
      defaultConfig = {}
      delete options.data
      // ??????axios????????????
    }
    const opts: AxiosOptions = merge(
      {},
      defaultConfig,
      options
    )
    return this.axios.post(url, isUpload?endData:data, opts)
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
    const { queryType = 'text', data,params, queryOptions } = options
    options.params = data || params
    if(queryType !== 'text'){
      options.paramsSerializer = (params) =>HttpService.queryParse(params, queryType, queryOptions)
    }
    const opts: AxiosOptions = merge(
      {},
      { headers: HEADERS_MAP.get(queryType) },
      options
    )
    return this.axios.delete(url, opts)
  }
  // ??????????????????
  public static queryParse(
    data: any,
    type?: string,
    options?: IStringifyOptions
  ) {
    const fn = type && QueryParse.queryMap.get(type)
    return fn ? fn(data, options) : data
  }
}

export default HttpService
interface DataOptions {
  params?: any
  data?: any
}

// ??????????????????
export interface AxiosOptions extends DataOptions, AxiosRequestConfig {
  headers?: any
  codes?: Codes
  unErrorMsg?: boolean
  queryType?: 'text' | 'json' | 'formd' | 'forms'
  queryOptions?: IStringifyOptions
  msgPack?: boolean
  oth?: AxiosRequestConfig
  [configName:string]:any
}

// codes
export interface Codes {
  sures?: Array<string>
  err?: Array<string>
}

export interface ResponseData<T> {
  code: number | string
  subCode: string
  bodyMessage: T
}

export type ReqBaseConfig = {
  // UI??????
  msgUI?: any
  // ????????????
  logout?: Function
  // ??????????????????
  timeout?: number
  // ????????????
  getToken?: Function
  // ???????????????tokenKey
  tokenHeaderKey?: string
  // ??????????????????
  headers?:any
  // ???????????? ????????????
  signHeaders?: Function
  // ??????????????????
  requestSet?: Function
  // ??????????????????
  responseSet?: Function
  // ????????????
  errorFn?: Function
  // ??????subCode?????? ????????????????????????????????????codes
  codes?: Codes
}
