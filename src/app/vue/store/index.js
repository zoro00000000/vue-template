import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const modulesFiles = require.context('./modules', true, /index\.(js|ts)$/)

const modules = modulesFiles.keys().reduce((prev, modulePath) => {
    const moduleName = modulePath.replace(/^\.\/(.*)\/index\.(js|ts)$/, '$1')
    const value = modulesFiles(modulePath)

    /* eslint-disable-next-line no-param-reassign */
    prev[moduleName] = value.default
    return prev
}, {})

const store = new Vuex.Store({
    modules,
    strict: true
})
export default store
