/*
 * @Author: EveChee
 * @Date: 2020-12-24 13:53:55
 * @LastEditors: EveChee
 * @LastEditTime: 2020-12-28 16:11:39
 * @Description: file content
 */
/// <reference path="../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../node_modules/@types/expect.js/index.d.ts" />

import Emojis from '../src'
const emojis = new Emojis()
describe('表情标签替换为图片', () => {
    it('单个表情加文字替换实验，原文：[wx]哈哈', () => {
        const context = '[wx]哈哈'
        const res = emojis.replaceEmojisIntoImgs(context)
        expect(res).to.be(
            `<img src="https://imgs.wbp5.com/ChatText/dialogs/qq/01.png"/>哈哈`
        )
    })
    it('多个表情替换实验，原文：[wx][hx][se]', () => {
        const context = '[wx][hx][se]'
        const res = emojis.replaceEmojisIntoImgs(context)
        expect(res).to.be(
            `<img src="https://imgs.wbp5.com/ChatText/dialogs/qq/01.png"/><img src="https://imgs.wbp5.com/ChatText/dialogs/qq/02.png"/><img src="https://imgs.wbp5.com/ChatText/dialogs/qq/03.png"/>`
        )
    })
    it('汇聊表情替换实验，原文：[发呆][老板]', async () => {
        await emojis.init()
        const context = '[发呆][老板]'
        const res = emojis.replaceEmojisIntoImgs(context)
        expect(res).to.be(
            `<img src="https://imgs.wbp5.com/ChatText/dialogs/qq/04.png"/><img src="https://imgs.wbp5.com/ChatText/dialogs/qq/05.png"/>`
        )
    })
    it('汇聊表情老表情兼容替换实验，原文：[发呆][老板][wx][hx]', async () => {
        await emojis.init()
        const context = '[发呆][老板][wx][hx]'
        const res = emojis.replaceEmojisIntoImgs(context)
        expect(res).to.be(
            `<img src="https://imgs.wbp5.com/ChatText/dialogs/qq/04.png"/><img src="https://imgs.wbp5.com/ChatText/dialogs/qq/05.png"/><img src="https://imgs.wbp5.com/ChatText/dialogs/qq/01.png"/><img src="https://imgs.wbp5.com/ChatText/dialogs/qq/02.png"/>`
        )
    })
})
