'use strict'

const path = require('path')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const chalk = require('chalk')
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const VConsolePlugin = require('vconsole-webpack-plugin')
const webpack = require('webpack')
// TODO: V5.4 升级 node 插件需要自己引入，webpack不再统一引入了
const process = require('process')
// 引入项目文件属性
const utils = require('./utils')
// const config = require('../config')
const projectName = require('./project')
const projectConfig = require('./project.config')

// 初始化 node Env
utils.initNodeEnv()

// 条件编译处理
// const conditionalCompiler = {
//     loader: 'js-conditional-compile-loader',
//     options: {
//         ISVUE: process.env.VUE_APP_BUILD_ENV, // VUE 项目
//         ISREACT: process.env.REACT_APP_BUILD_ENV // REACT 项目
//     }
// }

let entryPath = {}
let HTMLPlugin = []
// 如果有项目名 输出单个项目
if (projectName.name) {
    entryPath = {
        main: projectConfig.entry + 'main.js'
    }
    HTMLPlugin = [
        new HtmlWebpackPlugin({
            template: projectConfig.template + 'index.html',
            title: projectConfig.fileName + 'page',
            // filename: projectConfig.fileName + '.html',
            filename: 'index.html',
            hash: false,
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true
                // more options:
                // https://github.com/kangax/html-minifier#options-quick-reference
            }
        })
    ]
} else {
    for (const key in projectConfig) {
        if (projectConfig.hasOwnProperty(key)) {
            const element = projectConfig[key]
            entryPath[key] = element.entry + 'main.js'

            HTMLPlugin.push(
                new HtmlWebpackPlugin({
                    template: element.template + 'index.html',
                    title: element.fileName + ' page',
                    // filename: element.fileName + '.html',
                    filename: (process.env.VUE_APP_BUILD_ENV === 'staging' ? element.fileName + '-pre' : element.fileName) + '/index.html',
                    // chunks: [ 'vendors', element.fileName ],
                    inject: true,
                    minify: {
                        removeComments: true,
                        collapseWhitespace: true
                        // more options:
                        // https://github.com/kangax/html-minifier#options-quick-reference
                    },
                    hash: false
                })
            )
        }
    }
}

// 模块
const moduleConfig = () => {
    let modules = {
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)$/,
                // exclude: file => (
                //     /node_modules/.test(file) &&
                //     !/\.vue\.js/.test(file)
                // ),
                exclude: /node_modules/,
                include: [
                    /src\/app/,
                    /src\/server/,
                    /src\/services/,
                    /src\/utils/,
                ],
                // include: file => {
                //     console.log(file)
                //     return /app/.test(file)
                // },
                use: [
                    'babel-loader',
                    // conditionalCompiler
                    { // 条件编译处理
                        loader: 'webpack-preprocessor-loader',
                        options: {
                            params: {
                                isVue: true,
                                isReact: false
                            }
                        },
                    }
                ]
            },
            {
                test: /\.vue$/,
                use: [
                    {
                        loader: 'vue-loader',
                        options: {
                            // 去除模板中的空格
                            preserveWhitespace: false,
                            // postcss配置,把vue文件中的样式部分,做后续处理
                            // postcss: {
                            //     options: {postcss, parser: 'postcss-scss'}
                            // },
                            loaders: [
                                'style-loader',
                                {
                                    loader: 'css-loader',
                                    options: {
                                        modules: true
                                    }
                                },
                                {
                                    loader: 'sass-loader',
                                    options: {
                                        sourceMap: true
                                    }
                                }
                            ]
                        }
                    },
                    // conditionalCompiler
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'images/[hash][ext][query]'
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                exclude: /node_modules/,
                include: [
                    /src\/app/,
                    /src\/base/,
                ],
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[hash][ext][query]'
                }
            }
        ]
    }

    return modules
}

// 解析
const resolveConfig = () => {
    let resolve = {
        modules: [
            'node_modules',
            // path.resolve(__dirname, '../src')
            // path.resolve(__dirname, `../src/app/${projectConfig.fileName}`)
        ],
        extensions: ['.js', '.json', '.jsx', '.css', '.scss', '.vue'],
        alias: {
            '@plugins': path.resolve('src/plugins'),
            '@config': path.resolve('config'),
            '@': path.resolve('src/app'),
            '@utils': path.resolve('src/utils'),
            '@base': path.resolve('src/base')
        }
    }

    return resolve
}

// plugins
const pluginsConfig = () => {
    let basePlugin = [
        new ProgressBarPlugin({
            format: chalk.blue.bold('  构建中 [:bar] ') + chalk.green.bold(':percent') + ' (:elapsed seconds)',
            clear: false,
            width: 100
        }),
        new webpack.DefinePlugin({
            // 'process.env': config.dev.env,
            'process.env.VUE_APP_BUILD_ENV': JSON.stringify(process.env.VUE_APP_BUILD_ENV)
        }),
        new VueLoaderPlugin(),
        new VConsolePlugin({
            // 需要郭略的入口文件
            filter: [],
            // 发布代码前记得改回 false
            enable: (process.env.NODE_ENV === 'production' && process.env.VUE_APP_BUILD_ENV === 'prod') ? false : true
        })
    ]

    let allPlugin = [].concat(HTMLPlugin, basePlugin)
    return allPlugin
}

const webpackBaseConf = {
    entry: entryPath,
    module: moduleConfig(),
    resolve: resolveConfig(),
    plugins: pluginsConfig(),
    cache: {
        type: 'filesystem',
        allowCollectingMemory: true,
    }
}

// 将项目名写入到系统中
fs.writeFileSync('./build/project.js', `exports.name = ''`)

module.exports = webpackBaseConf
