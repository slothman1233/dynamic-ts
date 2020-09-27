/*
 * @Description:
 * @Version: 0.1
 * @Author: EveChee
 * @Date: 2020-08-03 16:30:58
 * @LastEditTime: 2020-09-27 11:10:06
 */
/// <reference path="../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../node_modules/@types/expect.js/index.d.ts" />
/// <reference path="../node_modules/@types/sinon/index.d.ts" />
// import sinon from 'sinon/pkg/sinon-esm.js'
import HttpService from '../src/index'
import { responseData } from './server'
const http = new HttpService('', {
  signHeaders: () => {
    return { sign: '123456' }
  },
})

describe('请求头添加测试', () => {

  it('Add-Headers', async () => {
    const post = await http.post<any>('/post/12', { abc: 1 })

    expect(post?.bodyMessage?.headers?.sign).to.be('123456')
  })
})
