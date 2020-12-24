/*
 * @Author: EveChee
 * @Date: 2020-12-24 13:53:55
 * @LastEditors: EveChee
 * @LastEditTime: 2020-12-24 15:40:43
 * @Description: file content
 */
const EMOJI_CONFIG = require('./emojis.json')
export default class Emojis {
    public static all = EMOJI_CONFIG
    // 替换含有内部表情的标签为图片展示
    public static replaceEmojisIntoImgs(content: string) {
        return content.replace(/\[.*?\]/g, (tag) => {
            const matched = Emojis.all[tag]
            return matched ? `<img src="${matched?.Url}"/>` : tag
        })
    }
}
