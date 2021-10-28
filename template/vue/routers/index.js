import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'

Vue.use(VueRouter)

let routerBase = ''
if (process.env.NODE_ENV === 'production') {
    // if (['prod', 'staging'].indexOf(process.env.VUE_APP_BUILD_ENV) !== -1 && (window.location.host === 'bt-activity-pre.jd.com' || window.location.host === 'btfront.jd.com')) routerBase = '/release/monthtoplay'
    routerBase = '/release/vue'
    window.location.host === 'minner.jr.jd.com' && (routerBase = '/experience/vue')
}

const routerPage = new VueRouter({
    mode: 'history',
    // 打包后的项目访问基础路径 /release/vue-template
    base: routerBase,
    routes,
    // 路由切换时 滑动行为处理
    scrollBehavior (to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { x: 0, y: 0 }
        }
    }
})

// 新增路由拦截
routerPage.beforeEach((to, from, next) => {
    console.log('路由拦截beforeEach：', to, from)
    // 路由发生变化修改页面title
    if (to.meta && to.meta.title) {
        document.title = to.meta.title
    }

    next()
})

routerPage.afterEach((to, from) => {
    console.log('路由拦截afterEach：', to, from)
})

export default routerPage
