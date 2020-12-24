/*
 * @Author: EveChee
 * @Date: 2020-12-24 13:53:55
 * @LastEditors: EveChee
 * @LastEditTime: 2020-12-24 15:42:28
 * @Description: file content
 */
/// <reference path="../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../node_modules/@types/expect.js/index.d.ts" />

import Emojis from '../src'

describe('表情标签替换为图片', () => {
    it('单个表情加文字替换实验，原文：[wx]哈哈', () => {
        const context = '[wx]哈哈'
        const res = Emojis.replaceEmojisIntoImgs(context)
        expect(res).to.be(
            `<img src="https://imgs.wbp5.com/ChatText/dialogs/qq/01.png"/>哈哈`
        )
    })
    it('多个表情替换实验，原文：[wx][hx][se]', () => {
        const context = '[wx][hx][se]'
        const res = Emojis.replaceEmojisIntoImgs(context)
        expect(res).to.be(
            `<img src="https://imgs.wbp5.com/ChatText/dialogs/qq/01.png"/><img src="https://imgs.wbp5.com/ChatText/dialogs/qq/02.png"/><img src="https://imgs.wbp5.com/ChatText/dialogs/qq/03.png"/>`
        )
    })
})
