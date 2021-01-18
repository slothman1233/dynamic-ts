const paths = {
    index: {
        input: './src/index.ts', //入口未见
        jsfile: "./dist/index.js", //js输出文件
        lessfile: "./dist/index.css", //样式输出的文件 默认是在dist文件下
        format: "umd", //输出格式：立即执行函数表达式   which can be one of 'amd', 'cjs', 'system', 'esm', 'iife' or 'umd'
        name: "indexjs", //umd or iife 下的方法的命名 
    },
    test: {
        input: './test/index.ts', //入口未见
        jsfile: "./test/index.js", //js输出文件
        lessfile: "./test/index.css", //样式输出的文件 默认是在dist文件下
        format: "umd", //输出格式：立即执行函数表达式   which can be one of 'amd', 'cjs', 'system', 'esm', 'iife' or 'umd'
        name: "indexjs", //umd or iife 下的方法的命名 
    }
}

// 需要生成的文件
const jspages = [
    //"index",
    //测试用的
    "test"
]


export {
    paths,
    jspages
}