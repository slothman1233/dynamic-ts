const chalk = require('chalk')
const readline = require('readline') // 逐行读取
const padStart = require('string.prototype.padstart')
    // const EventEmitter = require('events')

// exports.events = new EventEmitter()

const format = (label, msg, length) => {

    return msg.split('\n').map((line, i) => {
        return i === 0 ?
            `${label} ${line}` :
            padStart(line, length + line.length)
    }).join('\n')
}

const chalkTag = msg => chalk.bgBlackBright.white.dim(` ${msg} `)

const length = (label, tag) => {

    return (label + (tag ? ` ${tag} ` : "")).length + 1;
}

exports.log = (msg = '', tag = null) => {
    tag ? console.log(format(chalkTag(tag), msg)) : console.log(msg)
}

exports.info = (msg, tag = null) => {
    console.log(format(chalk.bgBlue.black(' INFO ') + (tag ? chalkTag(tag) : ''), msg), length(' INFO ', tag))
}

exports.done = (msg, tag = null) => {
    console.log(format(chalk.bgGreen.black(' DONE ') + (tag ? chalkTag(tag) : ''), msg), length(' DONE ', tag))
}

exports.warn = (msg, tag = null) => {
    console.warn(format(chalk.bgYellow.black(' WARN ') + (tag ? chalkTag(tag) : ''), chalk.yellow(msg), length(' WARN ', tag)))
}

exports.error = (msg, tag = null) => {
    console.error(format(chalk.bgRed(' ERROR ') + (tag ? chalkTag(tag) : ''), chalk.red(msg), length(' ERROR ', tag)))
    if (msg instanceof Error) {
        console.error(msg.stack)
    }
}

/**
 * 清空控制台
 */
exports.clearConsole = title => {
    if (process.stdout.isTTY) {
        const blank = '\n'.repeat(process.stdout.rows)
        console.log(blank)
        readline.cursorTo(process.stdout, 0, 0)
        readline.clearScreenDown(process.stdout)
        if (title) {
            console.log(title)
        }
    }
}