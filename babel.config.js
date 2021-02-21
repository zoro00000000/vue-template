module.exports = {
    presets: [
        ['@babel/preset-env', {
            targets: {
                browsers: ['last 1 Chrome versions']
            }
        }]
    ],
    plugins: [
        '@babel/plugin-transform-runtime',
        ['@babel/plugin-proposal-decorators', {
            legacy: true
        }],
        ['import', {
            libraryName: 'vant',
            libraryDirectory: 'es',
            style: true
        }, 'vant']
    ]
}