/*
 * @Date: 2020-02-24 10:44:00
 * @LastEditors:    haoliang
 * @LastEditTime:   2020-02-24
 */

const path = require('path')

module.exports = {
    // 生产环境配置
    build: {
        mode: 'production',
        devtool: 'source-map',
        minimize: true,
        concatenateModules: true,
        // 性能提示
        hints: 'warning',
        // 最大体积
        maxEntrypointSize: 400000,
        // 单个资源体积
        maxAssetSize: 100000,
        // 是否开启 Gzip
        productionGzip: true,
        assetsPublicPath: '../'
    },
    // 开发环境 配置项
    dev: {
        mode: 'development',
        devtool: 'cheap-module-eval-source-map',
        optimization: {
            removeAvailableModules: false,
            removeEmptyChunks: false,
            splitChunks: false
        },
        // devServer 配置
        useLocalIp: false,
        // host: '0.0.0.0',
        host: 'dev.jd.com',
        port: 8080,
        contentBase: path.resolve(__dirname, '../public'),
        compress: true,
        hot: true,
        https: false,
        open: true,
        noInfo: true,
        inline: true,
        overlay: {
            warnings: true,
            errors: true
        },
        watchContentBase: true,
        allowedHosts: ['.jd.com'],
        proxy: {
            // '/gw/generic/bt/h5/m/*': {
            //     target: 'mstest.jr.jd.com',
            //     secure: false,
            //     changeOrigin: true,
            //     onProxyReq: function(proxyReq,req){
            //         Object.keys(req.headers).forEach(function(key){
            //             proxyReq.setHeader(key, req.headers[key])
            //         })
            //         proxyReq.setHeader('origin', targetDomain)
            //         proxyReq.setHeader('referer', targetDomain)
            //     },
            //     onProxyRes: function(proxyRes, req, res){
            //         Object.keys(proxyRes.headers).forEach(function(key){
            //             res.append(key,proxyRes.headers[key])
            //         })
            //     },
            // },   
        }
    }
}
