'use strict'
// TODO: V5.4 升级 node 插件需要自己引入，webpack不再统一引入了
const process = require('process')
const child_process = require('child_process')
const fs = require('fs')
const utils = require('./utils')
// 获取所有项目文件夹名
const projectConfig = require('./project.config')

utils.autoCompleteFun(projectConfig).then(res => {
    console.log('Run project name', res)
    console.log(process.env.NODE_ENV)

    // -----------正在构建项目' + projectName + '--------------
    utils.consoleFun()
    // 将项目名写入到系统中
    utils.modifyProjectName(res)

    // TODO: 不能加 sudo 会导致 progress.env 字段为 undefined
    let exec = child_process.execSync
    exec('npm run start', {stdio: 'inherit'}, (error, stdout, stderr) => {
        if (error) {
            console.error(`执行的错误: ${error}`)
            // 将项目名写入到系统中
            fs.writeFileSync('./build/project.js', `exports.name = ''`)
            return
        }
        console.log(`stdout: ${stdout}`)
        console.error(`stderr: ${stderr}`)
    })
}).catch(err => {
    // 将项目名写入到系统中
    fs.writeFileSync('./build/project.js', `exports.name = ''`)
})
