const fs = require('fs-extra')
const path = require('path')
const inquirer = require('inquirer')
const chalk = require('chalk')
const Creator = require('./creator')
const { stopSpinner, error, config } = require("./utils/common")


async function create() {
    const cwd = process.cwd()
    const projectName = config.projectName
        // 是否在当前目录
    const inCurrent = projectName === '.'
    const name = inCurrent ? path.relative('../', cwd) : projectName

    const targetDir = path.resolve(cwd, projectName || '.')

    // 检查文件夹是否存在
    if (fs.existsSync(targetDir)) {

        // await clearConsole()
        if (inCurrent) {
            const { ok } = await inquirer.prompt([{
                name: 'ok',
                type: 'confirm',
                message: `在当前目录中生成项目?`
            }])
            if (!ok) {
                return
            }
        } else {
            const { action } = await inquirer.prompt([{
                name: 'action',
                type: 'list',
                message: `目标文件夹 ${chalk.cyan(targetDir)} 已经存在，请选择：`,
                choices: [
                    { name: '覆盖', value: 'overwrite' },
                    { name: '取消', value: false }
                ]
            }])
            if (!action) {
                return
            } else if (action === 'overwrite') {
                console.log(`\n 正在删除 ${chalk.cyan(targetDir)}...`)
                await fs.remove(targetDir)
            }
        }

    }
    const creator = new Creator(targetDir)
    await creator.create()
}


module.exports = function() {
    create().catch(err => {
        stopSpinner(false)
        error(err)
    })
}