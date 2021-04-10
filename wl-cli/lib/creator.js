const chalk = require('chalk')
const inquirer = require('inquirer')
const EventEmitter = require('events')
const loadRemotePreset = require('./utils/loadRemotePreset')
const RunningCopyPrompt = require('./utils/RunningCopyPrompt')


const {
    log,
    error,
    logWithSpinner,
    clearConsole,
    hasProjectGit,
    stopSpinner,
    hasGit,
    config
} = require('../lib/utils/common')

module.exports = class creator extends EventEmitter {
    constructor(context) {
        super()
        this.type = config.linkPath
        this.name = config.projectName
        this.context = context
    }

    async create(cliOptions = { clone: true }, preset = null) {
        const { name, type } = this

        if (!hasGit()) {
            stopSpinner()
            error(`没有安装git或者没有设置git的环境变量！`)
            return false
        }


        await clearConsole()
        await this.resolvePreset(type, cliOptions.clone)


        logWithSpinner(`项目创建成功 ${chalk.yellow(name)}.`)

        stopSpinner()

        log()

        RunningCopyPrompt(name)

        this.emit('creation', { event: 'done' })
    }

    async resolvePreset(name, clone) {

        logWithSpinner(`✨`, `正在创建项目 ${chalk.yellow(this.context)}.`)
        this.emit('creation', { event: 'fetch-remote-preset' })
        try {
            await loadRemotePreset(name, this.context, clone)
            stopSpinner()
        } catch (e) {
            stopSpinner()
            error(`创建项目失败 ${chalk.cyan(name)}`)
            throw e
        }

    }
}