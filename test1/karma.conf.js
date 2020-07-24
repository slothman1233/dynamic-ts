module.exports = function(config) {
  config.set({
    // 依赖插件  
     plugins: [
      'karma-mocha', 
      'karma-chai',
      'karma-chrome-launcher', 
      'karma-typescript'
      ],
     //frameworks 需要用到的断言库
      frameworks: ["mocha","chai","karma-typescript"],
    //可以配置通配符把源代码和测试代码加载进来。
      files: [
          { pattern: "node_modules/expect.js/index.js" },
          { pattern: "src/**/*.ts" },
          { pattern: "test/**/*.ts" }
      ],
      client: { mocha: { opts: './config/karma/mocha.opts' } },
      //在将匹配文件提供给浏览器之前对其进行预处理
      // available preprocessors：https://npmjs.org/browse/keyword/karma-preprocessor
      preprocessors: {
          "**/*.ts": ["karma-typescript"]
      },
      //怎么显示测试结果 测试结果显示插件https://npmjs.org/browse/keyword/karma-reporter
      reporters: ["karma-typescript"],

      // 可以启动的浏览器列表 需要去下载对应的启动插件 https://npmjs.org/browse/keyword/karma-launcher
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
      browsers: ["Chrome"],
      karmaTypescriptConfig: {
        reports: {
            "html": 'config/karma/coverage/'
        },
        bundlerOptions: {
          transforms: [
              require("karma-typescript-es6-transform")()  //将ES2015（又名ES6）代码转换为ES5语法
          ]
      }
          
    },
    
        // coverageReporter : {
        //     // 可以用什么形式展示 支持以下格式：clover、cobertura、html、json-summary、json、lcov、lcovonly、none、teamcity、text-lcov、text-summary、text
        //     // 可以看连接 : https://github.com/istanbuljs/istanbul-reports/tree/590e6b0089f67b723a1fdf57bc7ccc080ff189d7/lib
        //     reports: ['html', 'text-summary'],
        //     // 结果存放的位置
        //     dir: 'node/gulp/karma/coverage/',
        //     // 如果使用webpack和预加载器，可以绕过webpack打破源路径
        //     fixWebpackSourcePaths: true,
        //     // 停止输出消息，如`File [$ {filename}]忽略，没有任何东西可以映射
        //     skipFilesWithNoCoverage: true,
        //     // 大多数记录接受额外的配置选项。 你可以通过`report-config`选项传递这些
        //     'report-config': {
        //         // 配置html
        //         html: {
        //             // 输出到 dir + /html
        //             subdir: 'html'
        //         }
        //     }
        // },
  
    // 运行的服务端口，可以自己修改
    port: 6150,


    // 在输出中启用/禁用颜色（记录(reporters)和日志(logs)） 肯定需要看到运行的结果，不然出错了也不好调试
    colors: true,


    // 显示日志记录的级别 （默认就好）
    // 可能的值： config.LOG_DISABLE （禁用） || config.LOG_ERROR （错误） || config.LOG_WARN （警告）|| config.LOG_INFO （信息）|| config.LOG_DEBUG （调试）
    logLevel: config.LOG_INFO,


    //观察文件是否变动，如有变动则重新运行单测。
    // 每当任何测试文件更改时，启用/禁用监听文件并执行测试  这就是第6步
    autoWatch: true,


    // 可以启动的浏览器列表 需要去下载对应的启动插件 https://npmjs.org/browse/keyword/karma-launcher
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['Chrome'],


    // 持续集成模式 如果是，Karma启动浏览器，运行测试并退出 默认就好，设true你会后悔的。
    singleRun: false,

     // 并发级别 可以同时启动多少浏览器 默认无限大
    concurrency: Infinity,
  });
};
