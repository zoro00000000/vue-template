// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
    addPlugins: [
        require('postcss-pxtorem')({
            rootValue ({ file }) {
                return file.indexOf('vant') !== -1 ? 37.5 : 75
            },
            propList: ['*']
        })
    ]
}
