/*
 * @Description:
 * @Version: 0.1
 * @Author: EveChee
 * @Date: 2020-08-03 14:16:10
 * @LastEditTime: 2020-08-04 09:37:02
 */
/// <reference path="../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../node_modules/@types/expect.js/index.d.ts" />
/// <reference path="../node_modules/@types/sinon/index.d.ts" />
import PowerPlugin from '../src'
import sinon from 'sinon'
import VueRouter from 'vue-router'
const router = new VueRouter()
const power = new PowerPlugin({
  projectId: 1,
  router,
  routes:[]
})
power.init()

describe('核心测试', () => {
  it('登录', async () => {
    const login = await power.login({username: 'admin0', pwd: '123456'})
    expect(login.bodyMessage.token).a('string')
    expect(power.userInfo).a('object')
  })
  it('跳转触发钩子请求权限', async () => {
    await router.push('/')
    expect(power.permissions).a('object')
  })
})
