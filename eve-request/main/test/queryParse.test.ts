/// <reference path="../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../node_modules/@types/expect.js/index.d.ts" />

import HttpService from '../src/index'
import {stringify} from 'qs'
const queryParse = HttpService.queryParse


describe('参数类型转换测试', () => {
  it("queryType:'json'", () => {
    const origin = { list: [1, 2, 3, 4], id: 12, remark: '卡萨丁' }
    const data = queryParse(origin, 'json')
    expect(data).to.be(JSON.stringify(origin))
  })
  it("queryType:'formd'", () => {
    const origin = { list: [1, 2, 3, 4], id: 12, remark: '卡萨丁' }
    const data = queryParse(origin, 'formd')
    expect(data instanceof FormData).to.be(true)
  })
  it("queryType:'forms'", () => {
    const origin = { list: [1, 2, 3, 4], id: 12, remark: '卡萨丁' }
    const data = queryParse(origin, 'forms')
    expect(data).to.be(stringify(origin))
  })
  it("queryType:none", () => {
    const origin = { list: [1, 2, 3, 4], id: 12, remark: '卡萨丁' }
    const data = queryParse(origin)
    expect(data).to.be(origin)
  })
})

