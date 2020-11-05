/*
 * @Description:
 * @Version: 0.1
 * @Author: EveChee
 * @Date: 2020-08-03 14:16:10
 * @LastEditTime: 2020-09-27 11:09:14
 */
/// <reference path="../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../node_modules/@types/expect.js/index.d.ts" />
/// <reference path="../node_modules/@types/sinon/index.d.ts" />
import HttpService from '../src/index'
import { responseData } from './server'
import sinon from 'sinon'
const logout = sinon.fake()
const http = new HttpService('', {
  logout
})

describe('请求测试', () => {
  it('Get', async () => {
    const get = await http.get('/test/api').catch((e) => console.log(e))
    // delays the expectations check
    expect(JSON.stringify(get)).to.be.equal(responseData)
  })
  it('Post', async () => {
    const post = await http
      .post('/post/3999', { abc: 1 })
      .catch((e) => console.log(e))
    expect(JSON.stringify(post)).to.be.equal(responseData)
  })
  it('Put', async () => {
    const put = await http
      .put('/test/put', { abc: 1 })
      .catch((e) => console.log(e))
    expect(JSON.stringify(put)).to.be.equal(responseData)
  })
  it('Delete', async () => {
    const del = await http
      .delete('/test/delete', { params: { abc: 1 } })
      .catch((e) => console.log(e))
    expect(JSON.stringify(del)).to.be.equal(responseData)
  })
})

describe('401测试', () => {

  it('Post401', async () => {
    const post = await http
      .post('/post/401', { abc: 1 })
      .catch((e) => console.log(e))
    expect(post).to.be(undefined)
    sinon.assert.called(logout);
  })

})
