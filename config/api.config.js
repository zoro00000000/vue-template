// 开发环境

module.exports = {
    dev: {
        NODE_ENV: 'development',
        BASE_API: '//dev.vue.com/api/',
        HOST_API: '//dev.vue.com',
        LOGAO_API: '//dev.vue.com/api/login/',
    },
    prod: {
        NODE_ENV: 'production',
        BASE_API: '//prod.vue.com/api/',
        HOST_API: '//prod.vue.com',
        LOGAO_API: '//prod.vue.com/api/login/',
    },
    staging: {
        NODE_ENV: 'production',
        BASE_API: '//staging.vue.com/api/',
        HOST_API: '//staging.vue.com',
        LOGAO_API: '//staging.vue.com/api/login/',
    },
    test: {
        NODE_ENV: 'development',
        BASE_API: '//test.vue.com/api/',
        HOST_API: '//test.vue.com',
        LOGAO_API: '//test.vue.com/api/login/',
    }
}

