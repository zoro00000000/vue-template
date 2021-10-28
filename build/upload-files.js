const fs = require('fs')
const path = require('path')
const FormData = require('form-data')
// node.js 请求 后端请求不会跨域
const request = require('request')
// node.js 压缩文件插件
const archiver = require('archiver')
// node.js 自定义命令插件
// const { program } = require('commander')
const utils = require('./utils')

const fileNames = utils.getFileNamesFun()
// 选择文件进行上传
utils.autoCompleteFun(fileNames).then(res => {
    console.log('Run project name', res)
    // 命令行执行
    // 自定义 node 命令
    // program.option('-m, --minner [env]', 'upload app to minner pre-env').option('-r, --release', 'copy built app to release dir for publishing')
    // program.parse(process.argv)

    const global = {
        // 项目名称
        appName: res || 'test',
        // 构建之后的路径
        builtDir: path.resolve(__dirname, `../release/${res}`),
        tempZip: `${res}.zip`
    }

    minner.run(global)
})

// 上传至 minner
const minner = {
    config: {
        // TODO： 这里需要修改
        cloudSpace: '/experience',
        cloudUrl: 'http://check.jr.jd.com/upload',
    },
    // 压缩文件
    compress (srcDir, outZip, rootDir) {
        return new Promise((resolve) => {
            const output = fs.createWriteStream(outZip)
            const archive = archiver('zip')
            archive.pipe(output)

            output.on('close', function() {
                console.log(archive.pointer() + ' total bytes')
                console.log('文件压缩已完成.')
            })
            archive.on('error', (err) => {
                resolve(false, err)
            })
            // 监听压缩、传输数据结束
            output.on('close', () => { // 压缩完成
                resolve(true)
            })
            archive.directory(srcDir, rootDir)
            archive.finalize()
        })
    },
    // 请求上传
    uploader (localZip, url, dir) {
        const file = fs.createReadStream(localZip)
        return new Promise((resolve) => {
            // TODO: 这里需要替换
            request.post({ url, formData: { my_file: file, my_field: dir } }, resolve)
        })
    },
    // 跑起来
    async run (global) {
        const Conf = this.config
        if (await this.compress(global.builtDir, global.tempZip, global.appName)) {
            const err = await this.uploader(global.tempZip, Conf.cloudUrl, Conf.cloudSpace)
            if (err) {
                console.error(' minner upload failed: ', err)
            } else {
                console.log(`minner upload success: https://minner.jr.jd.com${Conf.cloudSpace}/${global.appName}/`)
            }
            // 删除临时文件
            fs.unlinkSync(global.tempZip)
        }
    }
}
