#! /usr/bin/env node

const program = require('commander'); // commander负责读取命令
const inquirer = require('inquirer'); // inquirer负责问询ss

// 检测node版本相关依赖
const chalk = require('chalk') // 改变命令行输出样式
const semver = require('semver')
const requiredVersion = require('../package.json').engines.node

const { gitPath, log, config } = require("../lib/utils/common")

// 检测node版本函数
/**
 * 
 * @param {*} wanted 
 * @param {*} id 
 */
function checkNodeVersion(wanted, id) {
    if (!semver.satisfies(process.version, wanted)) {
        console.log(chalk.red(
            '你是用的Node版本号为： ' + process.version + ', 但 ' + id +
            ' 需运行在 ' + wanted + '.\n请升级你的Node版本'
        ))
        process.exit(1)
    }
}

checkNodeVersion(requiredVersion, 'stl-cli')

program
    .option('-v -version', '版本号')
    .action(() => {
        console.log(require('../package.json').version)
    })



program
    .name('创建脚手架')
    .usage('<command> [options]')
    .command('create [name]')
    .action(async name => {
        if (!name) {
            console.error(chalk.red('项目名不能为空'));
            process.exit(1);
        }
        let ir = await linkType();
        config.linkType = '内部框架'.localeCompare(ir.linkType) === 0 ? 0 : 1;
        config.projectName = name;
        if (config.linkType == 0) {
            await typeSelection()
        } else {
            await gitLink()
        }


        require("../lib/create")();

    })


program.parse(process.argv)

async function linkType() {
    let ir = await inquirer.prompt([{
        type: 'list',
        name: 'linkType',
        message: '选择创建类型',
        choices: ['框架', '填写git链接地址']
    }]);
    return ir;
}



async function gitLink() {
    let ir = await inquirer.prompt([{
        type: 'input',
        name: 'gitLink',
        message: '填写git地址',

    }])

    if (ir.gitLink.trim() === '' || !/http[s]{0,1}:\/\/([\w.]+\/?)\S*/.test(ir.gitLink.trim())) {
        log("git地址格式不正确!（必须是带有http://或者https://）");
        await gitLink();
        return;
    }

    config.linkPath = ir.gitLink


}


//选择类型
async function typeSelection() {
    let ir = await inquirer.prompt([{
        type: 'list',
        name: 'projectType',
        message: '选择创建类型',
        choices: gitPath.map(element => {
            return element.name
        }),
    }])
    config.linkPath = ir.projectType


}