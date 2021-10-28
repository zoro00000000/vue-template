'use strict'
const child_process = require('child_process')
const utils = require('./utils')
// 获取所有项目文件夹名
const projectConfig = require('./project.config')

utils.autoCompleteFun(projectConfig).then(res => {
    console.log('Run project name', res)

    // -----------正在构建项目' + projectName + '--------------
    utils.consoleFun()
    // 将项目名写入到系统中
    utils.modifyProjectName(res)

    let exec = child_process.execSync
    exec('npm run build-pro', {stdio: 'inherit'})
})
