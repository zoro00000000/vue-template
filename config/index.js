const path = require('path')

module.exports = {
    // 生产环境配置
    build: {
        mode: 'production',
        // ! 根据项目情况而定
        // devtool: 'source-map',
        minimize: true,
        concatenateModules: true,
        // 性能提示
        hints: 'warning',
        // 最大体积
        maxEntrypointSize: 400000,
        // 单个资源体积
        maxAssetSize: 100000,
        // 是否开启 Gzip
        productionGzip: false,
        assetsPublicPath: ''
    },
    // 开发环境 配置项
    dev: {
        mode: 'development',
        devtool: 'eval-cheap-module-source-map',
        optimization: {
            removeAvailableModules: false,
            removeEmptyChunks: false,
            splitChunks: false
        },
        // devServer 配置
        useLocalIp: false,
        // host: '0.0.0.0',
        host: 'dev.vue.component.com',
        port: 80,
        contentBase: path.resolve(__dirname, '../public'),
        compress: true,
        hot: true,
        https: false,
        // open: true,
        open: 'Google Chrome',
        noInfo: true,
        inline: true,
        watchContentBase: true,
        // allowedHosts: ['.jd.com'],
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
        },
        // V4 新增
        logging: 'none',
        overlay: true,
        progress: true
    }
}
