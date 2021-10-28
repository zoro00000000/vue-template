'use strict'

const path = require('path')
const webpack = require('webpack')
const { merge } = require('webpack-merge')

const webpackBaseConf = require('./webpack.base.conf')
// 引入项目文件属性
const config = require('../config')
const projectName = require('./project')
const projectConfig = require('./project.config')

// 模块
const modulesConfig = () => {
    let modules = {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            // modules: true,
                            importLoaders: 1
                        }
                    },
                    'postcss-loader'
                ]
            },
            {
                test: /\.(sa|sc)ss$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.less$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    'postcss-loader',
                    'less-loader'
                ]
            }
        ]
    }

    return modules
}

// 输出
const outputConfig = () => {
    let output = {
        // 如果有项目名 输出单个项目
        path: projectName.name ? path.join(__dirname, projectConfig.outputDir) : path.join(__dirname, '../dist'),
        filename: '[name].js',
        chunkFilename: '[name].js',
        // 性能优化1
        pathinfo: false
    }

    return output
}

// 插件
const pluginsConfig = () => {
    let plugins = [
        // 热更新
        // new webpack.HotModuleReplacementPlugin()
    ]

    return plugins
}

const webpackDevConf = {
    mode: config.dev.mode,
    devtool: config.dev.devtool,
    output: outputConfig(),
    plugins: pluginsConfig(),
    // 性能优化2
    optimization: config.dev.optimization,
    module: modulesConfig()
}

// 合并配置文件
const newConf = merge(webpackBaseConf, webpackDevConf)

module.exports = newConf
