/*
 * @Author: EveChee
 * @Date: 2020-12-24 13:53:55
 * @LastEditors: EveChee
 * @LastEditTime: 2020-12-28 16:12:15
 * @Description: file content
 */
import HttpService from '@stl/request'
// import HttpService from '../test/src'
const EMOJI_CONFIG = require('./emojis.json')
const BASE_URL = 'http://testfxchatapi.wbp5.com'

const canFlat = (Array.prototype as any).flat
function flatDeep(arr: any[], d = 1): any[] {
    return d > 0
        ? arr.reduce(
              (acc: any[], val: any) =>
                  acc.concat(Array.isArray(val) ? flatDeep(val, d - 1) : val),
              []
          )
        : arr.slice()
}
interface EmojiOptions {
    BASE_URL: string
}
export default class Emojis {
    public BASE_URL = ''
    public all = EMOJI_CONFIG
    public oldAll = EMOJI_CONFIG
    public http: HttpService
    constructor(otps?: EmojiOptions) {
        this.BASE_URL = otps?.BASE_URL || BASE_URL
        this.http = new HttpService(this.BASE_URL)
    }
    // 替换含有内部表情的标签为图片展示
    public replaceEmojisIntoImgs(content: string) {
        return content.replace(/\[(.*?)\]/g, (tag, name) => {
            let matched:any
            if (Array.isArray(this.all)) {
                matched =
                    this.all.find(
                        (_: { ExpressionName: string }) =>
                            _?.ExpressionName === name
                    ) || this.oldAll[tag]
            } else {
                matched = this.oldAll[tag]
            }
          
            return matched
                ? `<img src="${matched.ExpressionUrl || matched.Url}"/>`
                : tag
        })
    }
    public async init() {
        return this.getEmojiData()
    }
    private async getEmojiData() {
        const res: any = await this.http.get('/api/OCSExpressionApi', {
            codes: { sures: ['0'] }
        })
        if (!res) {
            return false
        }
        return this.setData(res.bodyMessage)
    }
    private setData(emojis: any) {
        const data = emojis.map((_: { ExpressionDetails: any[] }) =>
            _.ExpressionDetails?.filter(
                (_: { ExpressionName: any }) => _.ExpressionName
            )
        )
        this.all = canFlat ? data.flat(Infinity) : flatDeep(data, 1 / 0)
        return this.all
    }
}
