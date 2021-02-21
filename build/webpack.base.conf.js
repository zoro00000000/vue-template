'use strict'

const path = require('path')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const chalk = require('chalk')
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const webpack = require('webpack')
// 引入项目文件属性
const utils = require('./utils')
// const config = require('../config')
const projectName = require('./project')
const projectConfig = require('./project.config')

// 初始化 node Env
utils.initNodeEnv()

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
            minify: {
                html5: true,
            },
            hash: false
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
                    // filename: element.fileName + '/index.html',
                    filename: (process.env.VUE_APP_BUILD_ENV === 'staging' ? element.fileName + '-pre' : element.fileName) + '/index.html',
                    minify: {   // html 文件的 压缩配置
                        html5: true,
                    },
                    hash: false,
                    chunks: [ element.fileName, 'vendor' ],
                    inject: true
                })
            )
        }
    }
}

// 基础 plugins
let basePlugin = [
    new ProgressBarPlugin({
        format: chalk.blue.bold('  构建中 [:bar] ') + chalk.green.bold(':percent') + ' (:elapsed seconds)',
        clear: false,
        width: 70
    }),
    new webpack.DefinePlugin({
        // 'process.env': config.dev.env,
        'process.env.VUE_APP_BUILD_ENV': JSON.stringify(process.env.VUE_APP_BUILD_ENV)
    }),
    new VueLoaderPlugin(),
]

let allPlugin = [].concat(HTMLPlugin, basePlugin)

const webpackBaseConf = {
    entry: entryPath,
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: file => (
                    /node_modules/.test(file) &&
                    !/\.vue\.js/.test(file)
                ),
                include: path.resolve(__dirname, 'src'),
                loader: 'babel-loader'
            },
            {
                test: /\.vue$/,
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
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[hash:8]-[name].[ext]',
                            outputPath: 'img/',   //输出图片放置的位置
                            publicPath: projectName.name ? './img' : '../img', //html的img标签src所指向图片的位置，与outputPath一致
                            limit: 4000,
                            esModule: false
                        }
                    }
                ]
            }
        ]
    },
    resolve: {
        modules: [
            'node_modules',
            // path.resolve(__dirname, '../src')
            // path.resolve(__dirname, `../src/app/${projectConfig.fileName}`)
        ],
        extensions: ['.js', '.json', '.jsx', '.css', '.scss', '.vue'],
        alias: {
            '@plugins': path.resolve('src/plugins'),
            '@config': path.resolve('config'),
            '@': path.resolve('src/app')
        }
    },
    plugins: allPlugin
}

// 将项目名写入到系统中
fs.writeFileSync('./build/project.js', `exports.name = ''`)

module.exports = webpackBaseConf
