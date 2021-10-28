const fs = require('fs')
const path = require('path')
const chalk = require('chalk')

/**
 * 复制文件A到文件B中
 * @param {String Url} srcPath ：要复制的源文件路径
 * @param {String Url} targetPath ：复制操作的目标文件路径
 * @param {Function} cb ：回调函数
 */
const copyFile = (srcPath, targetPath, cb) => {
    fs.copyFile(srcPath, targetPath, cb)
}

/**
 * 复制文件夹 A 到 文件夹B 中
 * @param {String Url} srcPath ：要复制的源文件夹路径
 * @param {String Url} targetPath ：复制操作的目标文件夹路径
 * @param {Function} cb ：回调函数
 */
const copyFolder = (srcDir, targetDir) => new Promise((resolve, reject) => {
    fs.readdir(srcDir, (err, files) => {
        let count = 0
        let checkEnd = () => {
            if (Array.isArray(files)) ++count === files.length && resolve(true)
        }

        if (err) {
            console.log(`${chalk.red('error:' + err)}`)
            checkEnd()
            reject(err)
            return
        }

        files.forEach((file) => {
            const srcPath = path.join(srcDir, file)
            const tarPath = path.join(targetDir, file)
            
            // 判断文件是文件夹 还是文件
            fs.stat(srcPath, (err, stats) => {
                if (stats.isDirectory()) {
                    console.log('mkdir', tarPath)
                    fs.mkdir(tarPath, { recursive: true }, (err) => {
                        if (err) {
                            console.log(err)
                            return
                        }
                    })
                    copyFolder(srcPath, tarPath).then(res => {
                        checkEnd()
                    })
                } else {
                    copyFile(srcPath, tarPath, checkEnd)
                }
            })
        })
        
        // 完成执行回调
        files.length === 0 && resolve(true)
    })
})

exports.copyFolder = copyFolder