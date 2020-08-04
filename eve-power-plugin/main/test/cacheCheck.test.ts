/// <reference path="../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../node_modules/@types/expect.js/index.d.ts" />
/// <reference path="../node_modules/@types/sinon/index.d.ts" />
import { getCacheCheckTime, setCacheAddTime } from '../src'
import sinon from 'sinon'
const key = 'test_key'
describe('存储过期检测', () => {
  before(() => {
    setCacheAddTime(key, { abc: 123 })
  })
  it('未过期', async () => {
    const cache = getCacheCheckTime(key)
    expect(cache).a('object')
  })
  it('已过期', (done) => {
    setTimeout(() => {
      const cache = getCacheCheckTime(key, 3000)
      expect(cache).to.be(null)
    }, 5000)
    done()
  })
})
