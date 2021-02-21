'use strict'

const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
// 引入项目文件属性
const config = require('../config')
const utils = require('./utils')

// 删除 上一次构建的 release 文件
utils.rmReleaseFiles()

const webpackProdConf = {
    mode: 'production',
    devtool: 'source-map',
    entry: {
        'merchant-admin': './src/app/merchant-admin/main.js',
        'merchant-bd': './src/app/merchant-bd/main.js'
    },
    output: {
        // 打包生成的根目录
        path: path.join(__dirname, '../release'),
        filename: './js/[name].[chunkhash:8].js',
        publicPath: '../',
        chunkFilename: './js/[name].[chunkhash:8].chunk.js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/app/merchant-admin/index.html',
            title: 'merchant-admin page',
            filename: './merchant-admin/index.html',
            minify: {   // html 文件的 压缩配置
                html5: true,
            },
            hash: false,
            chunks: [ 'merchant-admin', 'vendors' ],
            inject: true
        }),
        new HtmlWebpackPlugin({
            template: './src/app/merchant-bd/index.html',
            title: 'merchant-bd page',
            filename: './merchant-bd/index.html',
            minify: {   // html 文件的 压缩配置
                html5: true,
            },
            hash: false,
            chunks: [ 'merchant-bd', 'vendors' ],
            inject: true
        }),
        new MiniCssExtractPlugin({
            filename: './styles/[name].[chunkhash:8].css',
            chunkFilename: './styles/[id].[chunkhash:8].css'
        }),
        new VueLoaderPlugin(),
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
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            },
            minChunks: 2
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: file => (
                    /node_modules/.test(file) &&
                    !/\.vue\.js/.test(file)
                ),
                include: path.resolve(__dirname, 'src'),
                loader: 'babel-loader'
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    // 去除模板中的空格
                    preserveWhitespace: false,
                	loaders: [
                        'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                modules: true
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true
                            }
                        }
                    ]
                }
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[hash:8]-[name].[ext]',
                            outputPath: 'img/',   //输出图片放置的位置
                            publicPath: '../img', //html的img标签src所指向图片的位置，与outputPath一致
                            limit: 4000,
                            esModule: false
                        }
                    }
                ]
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
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
                use: [
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
    resolve: {
        modules: [
            'node_modules',
            // path.resolve(__dirname, '../src')
            // path.resolve(__dirname, `../src/app/${projectConfig.fileName}`)
        ],
        extensions: ['.js', '.json', '.jsx', '.css', '.scss', '.vue'],
        alias: {
            '@plugins': path.resolve('src/plugins'),
            '@config': path.resolve('config')
        }
    }
}

module.exports = webpackProdConf
