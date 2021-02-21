'use strict'
const child_process = require('child_process')
const utils = require('./utils')

console.log(process.env.NODE_ENV)
console.log(process.env.VUE_APP_BUILD_ENV)

// -----------正在构建项目' + projectName + '--------------
utils.consoleFun()
// 将项目名写入到系统中
utils.modifyProjectName()

let exec = child_process.execSync
exec('npm run dev', {stdio: 'inherit'})