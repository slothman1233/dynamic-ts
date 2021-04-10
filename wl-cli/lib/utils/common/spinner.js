const ora = require('ora')
const chalk = require('chalk')

const spinner = ora()
let lastMsg = null


/**
 * 开启并赋值 loading 状态
 * @param {*} sumbol  图标 
 * @param {String} options  文字 
 * 如果只传入一个参数 则 图标默认为 ✔ 传入的参数则为内容
 */
exports.logWithSpinner = (symbol, msg) => {
    if (!msg) {
        msg = symbol
        symbol = chalk.green('✔')
    }
    if (lastMsg) {
        spinner.stopAndPersist({
            symbol: lastMsg.symbol,
            text: lastMsg.text
        })
    }
    spinner.text = ' ' + msg
    lastMsg = {
        symbol: symbol + ' ',
        text: msg
    }
    spinner.start()
}

/**
 * 结束loading状态 
 * @param {Bool}} persist  是否保留问候的文案
 */
exports.stopSpinner = (persist) => {
    if (lastMsg && persist !== false) {
        spinner.stopAndPersist({
            symbol: lastMsg.symbol,
            text: lastMsg.text
        })
    } else {

        spinner.stop()
    }
    lastMsg = null
}

exports.pauseSpinner = () => {
    spinner.stop()
}

exports.resumeSpinner = () => {
    spinner.start()
}