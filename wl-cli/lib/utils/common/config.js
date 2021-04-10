///模板对应的git地址
exports.gitPath = [
    //direct: 一定要加上
    // #dev  分支 不写默认master
    { name: "cs_cli_ts", path: "direct:https://github.com/slothman1233/cli_ts.git#dev" },
    { name: "cs_vue_template", path: "direct:https://github.com/slothman1233/vue-template.git#dev" },
    { name: "cs_cli_rollup", path: "direct:https://github.com/slothman1233/cli_rollup.git#dev" },
    { name: "node_cli_web", path: "direct:https://github.com/slothman1233/cli_web.git#dev" },
    { name: "node_cli_api", path: "direct:https://github.com/slothman1233/cli_api.git#dev" },
]

exports.config = {
    //创建的项目名称
    projectName: "",
    //选择的创建类型
    //0 是获取框架
    //1 是填写git地址
    linkType: 0,
    // git link地址 
    linkPath: ""
}