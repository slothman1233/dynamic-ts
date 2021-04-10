const paths = {
    jsall: {
        input: './src/index.ts', //入口未见
        jsfile: "./dist/jsall.js", //js输出文件
        lessfile: "index.css", //样式输出的文件 默认是在dist文件下
        format: "umd", //输出格式：立即执行函数表达式   which can be one of 'amd', 'cjs', 'system', 'esm', 'iife' or 'umd'
        name: "HttpService", //umd or iife 下的方法的命名
        externals: ['@babel/polyfill'],
        global: {
            '@babel/polyfill': 'polyfill',
        },
        uglify:true
    },
    index: {
        input: './src/index.ts', //入口未见
        jsfile: "./dist/index.js", //js输出文件
        lessfile: "index.css", //样式输出的文件 默认是在dist文件下
        format: "umd", //输出格式：立即执行函数表达式   which can be one of 'amd', 'cjs', 'system', 'esm', 'iife' or 'umd'
        name: "HttpService", //umd or iife 下的方法的命名
        externals: ['lodash', 'qs', 'axios', '@babel/polyfill'],
        global: {
            'axios': 'axios',
            'qs': 'qs',
            '@babel/polyfill': 'polyfill',
        },
        uglify:true
    }
}

// 需要生成的文件
const jspages = [
    "jsall",
    "index"
]


export {
    paths,
    jspages
}