'use strict'
const fs = require('fs')
const chalk = require('chalk')
const dotenv = require('dotenv')
const dotenvExpand = require('dotenv-expand')
const ora = require('ora')
const rimraf = require('rimraf')
const path = require('path')

// 获取项目名
const projectName = process.argv.pop()
/**
 * 彩色输出
 */
exports.consoleFun = function () {
    // -----------正在构建项目' + projectName + '--------------
    console.log(chalk.blue('************************'))
    console.log(chalk.blue('*----------------------*'))
    console.log(chalk.blue('*|                    |*'))
    console.log(chalk.blue('*|       Build        |*'))
    console.log(chalk.blue('*|        ING         |*'))
    console.log(chalk.blue('*|                    |*'))
    console.log(chalk.blue('*----------------------*'))
    console.log(chalk.blue('************************'))
}

/**
 * 重写 project name
 * @param {启动命令上的 项目名} projectName 
 */
exports.modifyProjectName = function (name = projectName) {
    // 将项目名写入到系统中
    fs.writeFileSync('./build/project.js', `exports.name = '${name}'`)
}

/**
 * 初始化 Node Env
 */
exports.initNodeEnv = () => {
    const NODE_ENV = {
        ...dotenv.config({
            debug: process.env.DEBUG,
            path: path.join(__dirname, '../.env')
        }),
        ...dotenv.config({
            debug: process.env.DEBUG,
            path: path.join(__dirname, `../.env.${process.env.VUE_APP_BUILD_ENV}`)
        })
    }
    dotenvExpand(NODE_ENV)
}

/**
 * 
 * @param { 需要清除的文件夹名称 } fileName 
 */
exports.rmReleaseFiles = (fileName) => {
    const spinner = ora('[构建开始----优先删除release文件夹]')
    spinner.start()
    // 清除 release 文件
    rimraf.sync(path.join(__dirname, fileName ? `../release/${fileName}` : '../release'))
    spinner.stop()
    console.log(chalk.yellow('[  清空 release 目录. ]\n'))
}

/**
 * 获取本机ip的函数
 */
exports.getIPAdress = () => {
    let interfaces = require('os').networkInterfaces()
    for (let devName in interfaces) {
        let iface = interfaces[devName]
        for (let i = 0; i < iface.length; i++) {
            let alias = iface[i]
            if (alias.family === 'IPv4' && alias.address !== '1127.0.0.1' && !alias.internal) {
                return alias.address
            }
        }
    }
}