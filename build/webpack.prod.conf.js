'use strict'

const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { merge } = require('webpack-merge')
// 压缩 JS 插件
const TerserPlugin = require('terser-webpack-plugin')
// 也是压缩 JS 插件
// const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// TODO: optimizeChunkAssets 这个插件已弃用
// const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const webpackBaseConf = require('./webpack.base.conf')
// 引入项目文件属性
const config = require('../config')
const utils = require('./utils')
const projectName = require('./project')
const projectConfig = require('./project.config')

// 删除 上一次构建的 release 文件
utils.rmReleaseFiles(projectName.name)

// 输出
const outputConfig = () => {
    let output = {
        path: path.join(__dirname, projectName.name ? projectConfig.outputDir : '../release'),
        filename: './js/[name].[chunkhash:8].js',
        publicPath: config.build.assetsPublicPath,
        chunkFilename: './js/[name].[chunkhash:8].bundle.js'
    }

    return output
}

// plugins
const pluginsConfig = () => {
    let plugins = [
        new MiniCssExtractPlugin({
            experimentalUseImportModule: true,
            filename: './styles/[name].[chunkhash:8].css',
            chunkFilename: './styles/[id].[chunkhash:8].css'
        }),
        // 复制自定义的不需要build的静态资源
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, '../static'),
                    to: 'static',
                    // ignore: ['.*']
                }
            ]
        })
    ]

    return plugins
}

// 优化
const optimizationConfig = () => {
    let optimization = {
        minimize: config.build.minimize,
        minimizer: [
            // 压缩js插件 覆盖默认压缩工具
            new TerserPlugin({
                parallel: true,     // 使用多进程提高构建速度
                // sourceMap: false,   
                terserOptions: {
                    // ecama: undefined,
                    // warnings: false,
                    parse: {},
                    // compress: process.env.VUE_APP_BUILD_ENV === 'prod' ? {} : {
                    //     pure_funcs: ['console.log', 'debugger'] 
                    // },
                    compress: {
                        pure_funcs: process.env.VUE_APP_BUILD_ENV === 'prod' ? ['console.log', 'debugger'] : []
                    },
                    mangle: true,
                    module: false,
                    // output: {
                    //     comments: false,
                    // },
                    output: null,
                    format: null,
                    toplevel: false,
                    nameCache: null,
                    ie8: false,
                    keep_classnames: undefined,
                    keep_fnames: false,
                    safari10: false
                },
                extractComments: false      // 是否将注释提取到单独的文件中
            })
        ],
        concatenateModules: config.build.concatenateModules,
        // moduleIds: 'hashed',
        splitChunks: {
            chunks: 'all',          // 需要优化的模块 
            // minSize: 30000,         // 生成的块的最小大小（字节单位）
            minSize: {
                javascript: 30000,
                webassembly: 50000
            },
            minChunks: 1,           // 分割前必须共享模块的最小块数
            // maxSize: 0,
            maxSize: {
                javascript: 200000,
                webassembly: 500000
            },
            maxAsyncRequests: 30,    // 按需加载时的最大并行请求数
            maxInitialRequests: 30,  // 入口点处的最大并行请求数
            // enforceSizeThreshold: 50000,
            // automaticNameDelimiter: '-',
            // automaticNameMaxLength: 30,
            // name: true,            // 拆分模块名称
            cacheGroups: {          // 缓存组可以继承/覆盖任何选项
                // 相同代码提取
                common: {
                    name:'common',
                    chunks: 'all',   // 表示显示块的范围，有三个可选值：initial(初始块)、async(按需加载块)、all(全部块)，默认为all
                    minChunks: 2,   // 模块引用两次以上的抽到 common 中
                    priority: -20
                },
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'initial',  // 表示显示块的范围，有三个可选值：initial(初始块)、async(按需加载块)、all(全部块)，默认为all
                    priority: -10
                },
                styles: {
                    name: 'styles',
                    test: /\.css$/,
                    chunks: 'all',
                    enforce: true,
                }
            },
            // chunkIds: 'deterministic',  // dev: named, prod: deterministic
            // nodeEnv: 'production'
        }
    }
    return optimization
}

// 模块
const modulesConfig = () => {
    let modules = {
        rules: [
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../'
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1
                            // minimize: true
                        }
                    },
                    {
                        loader: "postcss-loader",
                        // options: {
                        //     plugins: () => [require('autoprefixer')]
                        // }
                    },
                    'sass-loader'
                ]
            },
            {
                test: /\.less$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../'
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1
                            // minimize: true
                        }
                    },
                    {
                        loader: "postcss-loader",
                        // options: {
                        //     plugins: () => [require('autoprefixer')]
                        // }
                    },
                    'less-loader'
                ]
            }
        ]
    }
    return modules
}

// 性能
const performanceConfig = () => {
    let performance = {
        // 创建超过400kb 警告
        hints: config.build.hints,
        maxEntrypointSize: config.build.maxEntrypointSize,
        maxAssetSize: config.build.maxAssetSize,
        assetFilter: function (assetFilename) {
            return assetFilename.endsWith('.js')
        }
    }

    return performance
}

const webpackProdConf = {
    mode: config.build.mode,
    devtool: config.build.devtool,
    output: outputConfig(),
    plugins: pluginsConfig(),
    optimization: optimizationConfig(),
    module: modulesConfig(),
    // 性能提示
    performance: performanceConfig()
}

// 合并 webpack 配置文件
const webpackConfig = merge({ mode: 'production' }, webpackBaseConf, webpackProdConf)

// 开启 gzip 的配置文件
if (config.build.productionGzip) {
    const CompressionWebpackPlugin = require('compression-webpack-plugin')

    webpackConfig.plugins.push(
        new CompressionWebpackPlugin({
            filename: '[path].gz[query]',
            test: /\.js$|\.css$|\.html$/,
            cache: true,
            algorithm: 'gzip',
            threshold: 10240,
            minRatio: 0.8,
        })
    )
}

module.exports = webpackConfig
