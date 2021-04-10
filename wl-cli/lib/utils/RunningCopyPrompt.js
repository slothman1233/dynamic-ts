const chalk = require('chalk')

const {
    config,
    log,
    hasYarn,
    hasPnpm3OrLater,
} = require('./common')

module.exports = function (name) {
    // 包管理
    const packageManager = (
        (hasYarn() ? 'yarn' : null) ||
        (hasPnpm3OrLater() ? 'pnpm' : 'npm')
    )

    let v = "";
    const envName = packageManager === 'yarn' ? 'yarn' : packageManager === 'pnpm' ? 'pnpm' : 'npm'

    switch (config.linkPath) {
        case "cs_cli_ts":
            v = chalk.cyan(`${chalk.gray('$')} ${envName} install\n`) +
                chalk.cyan(`${chalk.gray('$')} ${envName} run watch`);
            break;
        case "cs_vue_template":
            v = chalk.cyan(`${chalk.gray('$')} ${envName} install\n`) +
                chalk.cyan(`${chalk.gray('$')} ${envName} run serve`);
            break;
        case "cs_cli_rollup":
            v = chalk.cyan(`${chalk.gray('$')} ${envName} install\n`) +
                chalk.cyan(`${chalk.gray('$')} pm2 install typescript\n`) +
                chalk.cyan(`${chalk.gray('$')} ${envName} run watch`);
            break;
        case "node_cli_web":
            v = chalk.cyan(`${chalk.gray('$')} ${envName} install\n`) +
                chalk.cyan(`${chalk.gray('$')} pm2 install typescript\n`) +
                chalk.cyan(`${chalk.gray('$')} ${envName} run start`);
            break;
        case "node_cli_api":
            v = chalk.cyan(`${chalk.gray('$')} ${envName} install\n`) +
                chalk.cyan(`${chalk.gray('$')} ${envName} run start`);
            break;

        default:
            v = chalk.cyan(`${chalk.gray('$')} ${envName} install\n`) +
                chalk.cyan(`${chalk.gray('$')} ${envName} run dev`);
    }


    log(
        `请按如下命令，开始愉快开发吧！\n\n` +
        (this.context === process.cwd() ? `` : chalk.cyan(`${chalk.gray('$')} cd ${name}\n`)) + v
    )
}