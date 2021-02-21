
'use strict'
const path = require('path')
const webpackDevServer = require('webpack-dev-server')
const webpack = require('webpack')
const chalk = require('chalk')

const webpackDevConfig = require('./webpack.dev.conf')
const config = require('../config')

// webpack dev server 配置
const options = {
    port: config.dev.port,
    // ? 允许devServer使用本地IP打开，重点必须配置host 0.0.0.0
    useLocalIp: config.dev.useLocalIp,
    host: config.dev.host,
    contentBase: config.dev.contentBase,
    compress: config.dev.compress,
    // historyApiFallback: true,
    hot: config.dev.hot,
    https: config.dev.https,
    open: config.dev.open,
    noInfo: config.dev.noInfo,
    inline: config.dev.inline,
    overlay: config.dev.overlay,
    watchContentBase: config.dev.watchContentBase,
    allowedHosts: config.dev.allowedHosts,
    proxy: config.dev.proxy,
}

webpackDevServer.addDevServerEntrypoints(webpackDevConfig, options)

const compiler = webpack(webpackDevConfig)

const server = new webpackDevServer(compiler, options)

compiler.hooks.done.tap('webpack-dev-server done', stats => {
    if (stats.hasErrors()) {
        return
    }

    let localUrl = `http://${config.dev.host}:${config.dev.port}`

    console.log()
    console.log(`  App running at:`)
    console.log(`  - Local:   ${chalk.cyan(localUrl)}  `)
    console.log()
    
    let buildCommand = 'npm run d (子项目名称)'
    console.log(`  Note that the development build is not optimized.`)
    console.log(`  To create a production build, run ${chalk.cyan(buildCommand)}.`)
})

server.listen(8080, 'localhost', () => {
    console.log(chalk.blue(`  dev server: ${config.dev.host}:${config.dev.port}  `))
})