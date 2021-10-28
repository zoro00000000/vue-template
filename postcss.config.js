// https://github.com/michael-ciniawsky/postcss-load-config
const projectName = require('./build/project')
let addPlugins = []
if (projectName.name) {
    let configData = {}
    try {
        configData = require(`./src/app/${projectName.name}/postcssConfig.js`)
        if (configData && configData.addPlugins) addPlugins = configData.addPlugins
    } catch (error) {
        // 文件不存在
    }
}

module.exports = {
    plugins: [
        require('postcss-import'),
        require('postcss-preset-env')({
            state: 3,
            features: {
                'nesting-rules': true,
                'custom-properties': true
            }
        }),
        // require('autoprefixer'),
        require('cssnano'),
        // require('postcss-pxtorem')({
        //     rootValue ({ file }) {
        //         return file.indexOf('vant') !== -1 ? 37.5 : 75
        //     },
        //     propList: ['*']
        // }),
        ...addPlugins
    ]
}