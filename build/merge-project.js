const fs = require('fs')
const path = require('path')
// node.js 压缩文件插件
const archiver = require('archiver')
// 解压文件
const StreamZip = require('node-stream-zip')
const copy = require('./copy-files.js')
const utils = require('./utils')

// 选择的项目名
let projectName = ''
const fileNames = utils.getFileNamesFun()
const oldFileNames = utils.getFileNamesFun('./VCM')

// 选择文件进行上传
async function uploadFolder () { 
    if (!fileNames) return
    await utils.autoCompleteFun(fileNames).then(res => {
        console.log('Run project name', res)

        if (!res) {
            console.log('')
            retrun
        }

        projectName = res
    })

    if (!projectName) {
        console.log('选择的目录不存在！！！！')
        return
    }

    // 解压文件夹
    await unzipFiles({
        path: path.resolve(__dirname, `../VCM/${projectName}.zip`),
        output: path.resolve(__dirname, '../VCM/'),
        projectName
    })

    // 第一次 copy 处理
    await mergeFolderFun({ 
        createSrc: `./VCM/${projectName}`,
        srcDir: `../release/${projectName}`,
        targetDir: `../VCM/${projectName}`,
        projectName
    })
    
    // 第二次 copy 处理
    await mergeFolderFun({
        rmSrc: `../../release/${projectName}`, 
        createSrc: `../release/${projectName}`,
        srcDir: `../VCM/${projectName}`,
        targetDir: `../../release/${projectName}`,
        projectName
    })

    // 第三次 copy 处理
    await mergeFolderFun({
        rmSrc: `../VCM/${projectName}`,
        createSrc: `./VCM/${projectName}`,
        srcDir: `../release/${projectName}`,
        targetDir: `../VCM/${projectName}`,
        projectName
    })

    // 新增压缩功能
    await archiverFiles({
        rmSrc: `../VCM/${projectName}`,
        entry: path.resolve(__dirname, `../VCM/${projectName}`),
        output: path.resolve(__dirname, `../VCM/${projectName}.zip`),
        projectName
    })
}

/**
 * 
 * @param {
 *    rmSrc: 删除文件夹路径，
 *    createSrc: 创建文件夹路径，
 *    srcDir: 初始文件夹路径，
 *    targetDir: 目标文件夹路径
 * }
 * @returns 
 */
function mergeFolderFun ({ rmSrc, createSrc, srcDir, targetDir }) {
    // 删除文件夹
    rmSrc && utils.rmFilesFun(rmSrc)

    // 创建文件夹
    createSrc && fs.mkdir(createSrc, { recursive: true }, (err) => {
        if (err) {
            console.log(err)
            return
        }
    })

    if (!srcDir || !targetDir) {
        console.log('srcDir 初始文件路径，targetDir 目标文件路径必填')
        return
    }

    return copy.copyFolder(path.resolve(__dirname, srcDir), path.resolve(__dirname, targetDir)).then(res => {
        console.log(`将 ${srcDir} 文件复制到 ${targetDir} 文件夹中`)
        return res
    })
}

/**
 * 压缩文件
 * @param {
 *    entry: 入口路径，
 *    output: 输出路径,
 *    projectName: 项目名,
 * }
 * @returns 
 */
function archiverFiles ({ rmSrc, entry, output, projectName }) {
    return new Promise(resolve => {
        output = fs.createWriteStream(output)
        const archive = archiver('zip')

        output.on('close', function() {
            console.log(archive.pointer() + ' total bytes')
            console.log('文件压缩已完成.')
            // 删除文件夹
            rmSrc && utils.rmFilesFun(rmSrc)
            resolve(true)
        })
        archive.on('error', (err) => {
            resolve(false, err)
        })

        archive.pipe(output)
        archive.directory(entry, projectName)
        archive.finalize()
    })
}

/**
 * 解压文件
 * @param {*} path: 文件路径
 */
function unzipFiles ({ path, output, projectName }) {
    return new Promise(resolve => {
        const unzip = new StreamZip({ file: path })
        unzip.on('error', err => {
            console.log('解压失败:', err)
            resolve(false)
        })

        unzip.on('ready', () => {
            console.log('读取文件')
            unzip.extract(null, output, (err, count) => {
                console.log(err ? `解压失败:${err}` : `${projectName}解压${count}个文件成功！`)
                // 删除临时文件
                fs.unlinkSync(path)
                resolve(true)
                unzip.close()
            })
        })
    })
}

// 执行函数
uploadFolder()
