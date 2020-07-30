import typescript from "rollup-plugin-typescript2"
import resolves from 'rollup-plugin-node-resolve' // 帮助寻找node_modules里的包
import babel from 'rollup-plugin-babel' // rollup 的 babel 插件，ES6转ES5
import replace from 'rollup-plugin-replace' // 替换待打包文件里的一些变量，如 process在浏览器端是不存在的，需要被替换
import commonjs from 'rollup-plugin-commonjs' // 将非ES6语法的包转为ES6可用
import { uglify } from 'rollup-plugin-uglify' //js压缩                          // 压缩包
import json from 'rollup-plugin-json' //读取JSON 文件中的数据
import * as build from "./config/build" //配置文件
import nested from "postcss-nested"
//style处理
import postcss from 'rollup-plugin-postcss'; //样式处理
import autoprefixer from 'autoprefixer'; //自动补全
import cssnano from 'cssnano'; //样式的压缩合并
import tsconfigOverride from "./.tsconfig.json"
const env = process.env.NODE_ENV;

const rollupTs = () => {
    var ts = typescript({
        tsconfigOverride: tsconfigOverride
    })
    return ts;
}


const config = () => {
    const ary = [];
    let pages = build.jspages;
    if (env === 'development') {
        pages = [build.jspages[0]];
    }
    for (let i = 0; i < pages.length; i++) {
        const obj = build.paths[pages[i]];
        if (obj) {
            ary.push({
                context: 'window',
                input: "./" + obj.input, //入口未见
                external: obj.externals || [],
                output: {
                    file: "./" + obj.jsfile, //输出文件
                    format: obj.format || "umd", //输出格式：立即执行函数表达式   which can be one of 'amd', 'cjs', 'system', 'esm', 'iife' or 'umd'
                    name: obj.name || "fx", //umd or iife 下的方法的命名
                    sourcemap: (env === 'production' ? false : true), //代码映射，方便调试
                    globals: obj.global || {}
                },
                plugins: [
                    json(),
                    rollupTs(),
                    commonjs({
                        namedExports:{
                            'node_modules/element-ui/lib/element-ui.common.js':['Message' ],
                        },
                        include: 'node_modules/**',
                        // external:['@babel/polyfill'],
                        //如果为false，则跳过CommonJS模块的sourceMap生成
                        sourceMap: false
                    }),
                    resolves({
                        browser: true // Default: false
                    }),
                    postcss({
                        extensions: ['.css', '.less', '.scss', '.sss', '.pcss'], //处理以这些扩展名结尾的文件
                        plugins: [nested(), autoprefixer(), cssnano],
                        extract: obj.lessfile // 输出路径
                    }),
                    babel({
                        exclude: 'node_modules/**',
                        runtimeHelpers: true
                    }),
                    replace({
                        exclude: 'node_modules/**', // 排除node_modules 下的文件
                        ENV: JSON.stringify(env || 'development'),
                    }),
                    (env === 'production' && obj.uglify && uglify())
                ]
            })
        }
    }

    return ary;
}


export default config();