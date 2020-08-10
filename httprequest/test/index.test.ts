/// <reference path="../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../node_modules/@types/expect.js/index.d.ts" />

import { assert } from "chai"
import  sinon from "sinon";
import { http } from "../src/index"

const bodyMessage = '{ test: 1 }'
export const responseData = JSON.stringify({
  bodyMessage: bodyMessage,
  code: 0,
})
let server = sinon.fakeServer.create()
server.autoRespond = true
server.respondWith('GET', '/test/api', [
  200,
  { 'Content-Type': 'application/json' },
  responseData,
])
server.respondWith('POST', /\/post\/(\d+)/, function (xhr) {
  if(xhr.url === '/post/401'){
    xhr.respond(
      401,
      { 'Content-Type': 'application/json' },
      JSON.stringify({ bodyMessage: '登录失败检测', code: 0 })
    )
    return
  }
  if (xhr.requestHeaders.sign) {
    xhr.respond(
      200,
      { 'Content-Type': 'application/json' },
      JSON.stringify({ bodyMessage: { headers: { sign: xhr.requestHeaders.sign } }, code: 0 })
    )
  } else {
    xhr.respond(200, { 'Content-Type': 'application/json' }, responseData)
  }
})
server.respondWith('PUT', '/test/put', [
  200,
  { 'Content-Type': 'application/json' },
  responseData,
])
server.respondWith('DELETE', '/test/delete', [
  200,
  { 'Content-Type': 'application/json' },
  responseData,
])
server.respondWith("POSTBODY",'/test/postbody',[
    200,
    {'Content-Type':'application/json'},
    responseData,
])
server.respondWith("FROMDATA",'/test/fromData',[
    200,
    {},
    responseData,
])

const logout = sinon.fake()

describe("验证请求",function(){
    this.timeout(5000)
   it("get",()=>{
       http.get({url:"/text/api"}).then((data)=>{
        expect(data).to.be.equal(responseData)
       }).catch((e)=>{console.log(e)})
   })
   it("post",()=>{
        http.post({url:"/post/401"}).then((data)=>{
            expect(data).to.be.equal(responseData)
       }).catch((e)=>{console.log(e)})
   })
   it("put",()=>{
        http.put({url:"/test/put"}).then((data)=>{
            expect(data).to.be.equal(responseData)
        }).catch((e)=>{console.log(e)})
   })
   it("delete",()=>{
        http.delete({url:"/test/delete"}).then((data)=>{
            expect(data).to.be.equal(responseData)
        }).catch((e)=>{console.log(e)})
    })
    it("postbody",()=>{
        http.postbody({url:"/test/postbody"}).then((data)=>{
            expect(data).to.be.equal(responseData)
        }).catch((e)=>{console.log(e)})
    })
    it("fromData",()=>{
        http.fromData({url:"/test/fromData"}).then((data)=>{
            expect(data).to.be.equal(responseData)
        }).catch((e)=>{console.log(e)})
    })
})

describe('401测试', () => {
    it('Post401', async () => {
        http.post({url:"/post/401",data:{abc:1}}).then((data)=>{
            expect(data).to.be(undefined)
            sinon.assert.called(logout);
       }).catch((e)=>{console.log(e)})
    })
})