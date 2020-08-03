const paths = {
    jsall: {
        input: './src/index.ts', //入口未见
        jsfile: "./dist/jsall.js", //js输出文件
        lessfile: "index.css", //样式输出的文件 默认是在dist文件下
        format: "umd", //输出格式：立即执行函数表达式   which can be one of 'amd', 'cjs', 'system', 'esm', 'iife' or 'umd'
        name: "PowerPlugin", //umd or iife 下的方法的命名
        uglify: true,
        externals: ['vue-router', 'vue'],
        global: {
            'vue-router': 'VueRouter',
            'vue': 'Vue'
        },
    },
    index: {
        input: './src/index.ts', //入口未见
        jsfile: "./dist/index.js", //js输出文件
        lessfile: "index.css", //样式输出的文件 默认是在dist文件下
        format: "umd", //输出格式：立即执行函数表达式   which can be one of 'amd', 'cjs', 'system', 'esm', 'iife' or 'umd'
        name: "PowerPlugin", //umd or iife 下的方法的命名
        externals: ['vue-router', 'lodash', 'qs', 'axios', 'element-ui', 'nprogress', 'blueimp-md5', 'vue', '@stl/request', '@babel/polyfill'],
        global: {
            'axios': 'axios',
            'qs': 'qs',
            'vue-router': 'VueRouter',
            'nprogress': 'nprogress',
            'vue': 'Vue',
            'blueimp-md5': 'md5',
            '@stl/request': 'HttpService',
            'element-ui': 'ElementUI',
            // '@babel/polyfill': 'polyfill'
        },
        uglify: true
    }
}

// 需要生成的文件
const jspages = [
    "index",
    "jsall"
]


export {
    paths,
    jspages
}