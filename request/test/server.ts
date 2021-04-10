/*
 * @Description:
 * @Version: 0.1
 * @Author: EveChee
 * @Date: 2020-08-03 16:54:27
 * @LastEditTime: 2020-11-11 12:01:12
 */
import sinon from 'sinon'

const bodyMessage = '{ test: 1 }'
export const responseData = JSON.stringify({
  bodyMessage,
  code: 0,
  subCode: 'E000001'
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
