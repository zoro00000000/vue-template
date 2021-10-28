'use strict'
const fs = require('fs')
const projectName = require('./project')

// 获取 src/app 文件夹下的所有文件目录，代表获取了所有的项目名
const files = fs.readdirSync('./src/app')
let fileNames = files
if (files.indexOf('.DS_Store') >= 0) {
    fileNames = files.slice(1)
}

const configs = {}
fileNames.forEach(item => {
    configs[item] = {
        entry: './src/app/' + item + '/',
        outputDir: '../release/' + item + '/',
        template: './src/app/' + item + '/',
        fileName: item
    }
})

// 有项目名 返回项目信息，无项目名 返回所有项目信息
if (projectName.name) {
    const configObj = configs[projectName.name]
    module.exports = configObj
} else {
    const configObj = configs
    module.exports = configObj
}