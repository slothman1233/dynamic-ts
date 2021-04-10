const fs = require('fs-extra')

const { gitPath, config } = require("./common")

function getGitPath() {
    switch (config.linkType) {
        case 0:
            let PathAry = gitPath.filter((v) => v.name === config.linkPath);
            if (PathAry.length <= 0 || !PathAry[0]['path']) return null;
            return PathAry[0].path;
        case 1:
            if (!/^direct:.*/.test(config.linkPath)) {
                config.linkPath = `direct:${config.linkPath}`;
            }
            return config.linkPath;
        default:
            return null;

    }
}

module.exports = async function(name, targetDir, clone) {
    // const os = require('os')
    const path = require('path')
    const download = require('download-git-repo')
        //const tmpdir = path.join(os.tmpdir(), 'stl-cli')

    await fs.remove(targetDir)

    await new Promise((resolve, reject) => {
        // let PathAry = gitPath.filter((v) => v.name === name);

        // if (PathAry.length <= 0 || !PathAry[0]['path']) reject("模板不存在")
        let path = getGitPath();

        if (!path) reject("git链接错误！")

        // 这里可以根据具体的模板地址设置下载的url，注意，如果是git，url后面的branch不能忽略
        download(path, targetDir, { clone }, (err) => {

            if (err) return reject(err)
            resolve()
        })
    })

    return {
        targetDir
    }
}