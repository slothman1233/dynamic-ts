/// <reference path="../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../node_modules/@types/expect.js/index.d.ts" />
/// <reference path="../node_modules/@types/sinon/index.d.ts" />
// import sinon from 'sinon/pkg/sinon-esm.js'
import HttpService from '../src/index'
import { responseData } from './server'
const http = new HttpService()

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
