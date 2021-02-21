'use strict'

const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const merge = require('webpack-merge')
// 压缩 JS 插件
const TerserPlugin = require('terser-webpack-plugin')
// 也是压缩 JS 插件
// const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const webpackBaseConf = require('./webpack.base.conf')
// 引入项目文件属性
const config = require('../config')
const utils = require('./utils')
const projectName = require('./project')
const projectConfig = require('./project.config')

// 删除 上一次构建的 release 文件
utils.rmReleaseFiles()

const webpackProdConf = {
    mode: config.build.mode,
    devtool: config.build.devtool,
    output: {
        // 打包生成的根目录
        path: path.join(__dirname, projectName.name ? projectConfig.outputDir : '../release'),
        filename: './js/[name].[chunkhash:8].js',
        publicPath: config.build.assetsPublicPath,
        chunkFilename: './js/[name].[chunkhash:8].chunk.js'
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: './styles/[name].[chunkhash:8].css',
            chunkFilename: './styles/[id].[chunkhash:8].css'
        }),
        // new OptimizeCssAssetsPlugin(),
        // 复制自定义的不需要build的静态资源
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, '../static'),
                to: 'static',
                ignore: ['.*']
            }
        ])
    ],
    optimization: {
        minimize: config.build.minimize,
        minimizer: [
            // 压缩js插件 覆盖默认压缩工具
            new TerserPlugin({
                parallel: true,
                sourceMap: false,
                terserOptions: {
                    ecama: undefined,
                    warnings: false,
                    parse: {},
                    compress: {
                        pure_funcs: ['console.log', 'debugger']
                    },
                    mangle: true,
                    module: false,
                    output: {
                        comments: false,
                    },
                    toplevel: false,
                    nameCache: null,
                    ie8: false,
                    keep_classnames: undefined,
                    keep_fnames: false,
                    safari10: false
                },
                extractComments: false
            })
        ],
        concatenateModules: config.build.concatenateModules,
        moduleIds: 'hashed',
        splitChunks: {
            chunks: 'all',          // 需要优化的模块
            minSize: 30000,         // 生成的块的最小大小（字节单位）
            minChunks: 1,           // 分割前必须共享模块的最小块数
            maxSize: 0,
            maxAsyncRequests: 6,    // 按需加载时的最大并行请求数
            maxInitialRequests: 4,  // 入口点处的最大并行请求数
            automaticNameDelimiter: '-',
            automaticNameMaxLength: 30,
            name: true,            // 拆分模块名称
            cacheGroups: {          // 缓存组可以继承/覆盖任何选项
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    chunks: 'initial',  // 表示显示块的范围，有三个可选值：initial(初始块)、async(按需加载块)、all(全部块)，默认为all
                    priority: 10
                },
                // common: {
                //     chunks: 'all',
                //     minChunks: 2,
                //     name:'common',
                //     enforce: true,
                //     priority: 5
                // },
                // styles: {
                //     name: 'styles',
                //     test: /\.css$/,
                //     chunks: 'all',
                //     enforce: true,
                // }
            }
        }
    },
    module: {
        rules: [
            {
                test: /\.(sa|sc|c)ss$/,
                use:[
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1
                            // minimize: true
                        }
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            plugins: () => [require('autoprefixer')]
                        }
                    },
                    'sass-loader'
                ]
            },
            {
                test: /\.less$/,
                use:[
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1
                            // minimize: true
                        }
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            plugins: () => [require('autoprefixer')]
                        }
                    },
                    'less-loader'
                ]
            }
        ]
    },
    // 性能提示
    performance: {
        // 创建超过400kb 警告
        hints: config.build.hints,
        maxEntrypointSize: config.build.maxEntrypointSize,
        maxAssetSize: config.build.maxAssetSize,
        assetFilter: function (assetFilename) {
            return assetFilename.endsWith('.js')
        }
    }
}

// 合并 webpack 配置文件
const webpackConfig = merge(webpackBaseConf, webpackProdConf)

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
