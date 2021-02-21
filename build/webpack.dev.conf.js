'use strict'

const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
// const chalk = require('chalk')
const webpackBaseConf = require('./webpack.base.conf')
// 引入项目文件属性
const config = require('../config')
const projectName = require('./project')
const projectConfig = require('./project.config')

const webpackDevConf = {
    mode: config.dev.mode,
    devtool: config.dev.devtool,
    output: {
        // 如果有项目名 输出单个项目
        path: projectName.name ? path.join(__dirname, projectConfig.outputDir) : path.join(__dirname, '../dist'),
        filename: '[name].js',
        chunkFilename: '[name].js',
        // 性能优化1
        pathinfo: false
    },
    plugins: [
        // 热更新
        new webpack.HotModuleReplacementPlugin()
    ],
    // 性能优化2
    optimization: config.dev.optimization,
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    {
                        loader: 'css-loader',
                        options: {
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
}

// 合并配置文件
const newConf = merge(webpackBaseConf, webpackDevConf)

module.exports = newConf
