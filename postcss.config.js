// https://github.com/michael-ciniawsky/postcss-load-config

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
        require('cssnano')
    ]
}
