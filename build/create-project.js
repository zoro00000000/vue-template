const copy = require('./copy-files.js')
const path = require('path')

const srcDir = path.resolve(__dirname, '../template/')
const targetDir = path.resolve(__dirname, '../src/app')
// copy.copyFolder(srcDir, targetDir, function () {
//     console.log('复制完成！')
// })
copy.copyFolder(srcDir, targetDir).then(res => {
    console.log('copy 完成！！！')
})