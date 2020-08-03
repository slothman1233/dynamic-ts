import sinon from 'sinon'

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
