/// <reference path="../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../node_modules/@types/expect.js/index.d.ts" />

import merge from '../src/lib/merge'

describe('数据深度合并测试', () => {
  it('对象合并', () => {
    const origin = { list: [1, 2, 3, 4], id: 12, remark: '卡萨丁' }
    const target = { abc: 999, remark: '覆盖', locas: 'weqwe' }
    expect(merge(origin, target)).key('abc', 'locas')
  })
  it('数组合并', () => {
    const origin = [1, 3, 'asd', 999]
    const target = [88, 777]
    const res = merge(origin, target)
    expect(res.length).to.be(4)
    expect(res).contain(777)
  })
  it('混杂深度', () => {
    const origin = {
      abc: 123,
      ooo: [1, 2, 3, { oop: [999, 888, [203]] }],
      ooa: { ps: 123 },
    }
    const target = {
      def: 456,
      ooo: [12, 33, 3, { locas: 999 }],
      ooa: { pol: [123, 456, 789] },
    }
    const res = merge(origin, target)
    expect(res).key('def', 'abc')
    expect(res.ooo[3].locas).to.be(999)
    expect(res.ooo[3].oop.length).to.be(3)
    expect(res.ooa).key('pol','ps')
  })
})
