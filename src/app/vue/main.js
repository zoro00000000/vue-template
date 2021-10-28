import Vue from 'vue'

// import {
//     Toast,
//     Lazyload
// } from 'vant'
import router from './routers'
import store from './store'
import App from './App'
// import './assets/style/main.scss'

// 全局引入组件
const compoments = [
    // Toast,
    // Lazyload
]

compoments.forEach(component => {
    Vue.use(component)
    // Vue.component(component.name, component)
})

new Vue({
    render: h => h(App),
    router,
    store
}).$mount('#app')
