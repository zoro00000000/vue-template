import axios from 'axios'
import filterRepetition from './filterRepetition'
// const configEnv = require(`@config/${process.env.VUE_APP_BUILD_ENV}.config`)
const configEnv = require('@config/apiConfig')

let apiHostname = configEnv.prod.BASE_API

if (configEnv[process.env.VUE_APP_BUILD_ENV]) apiHostname = configEnv[process.env.VUE_APP_BUILD_ENV].BASE_API

console.log('apiHostname:', apiHostname)

/**
 * 接口错误返回处理
 *
 * @export
 * @class NetworkError
 * @extends {Error}
 */
export class NetworkError extends Error {
    constructor (message, response) {
        super(message)
        this.response = response
        this.name = NetworkError.name
        this.isBusinessError = true
    }

    get data () {
        return this.response && this.response.data
    }

    get result () {
        return this.data && this.data.result
    }

    get info () {
        return (this.result && this.result.info) || this.message
    }

    get code () {
        return this.data.result && this.data.result.code
    }
}

// 创建 axios 对象
const http = axios.create({
    baseURL: apiHostname, // 寄出来url
    timeout: 5000, // 超时时间
    withCredentials: true
})

// 设置全局的请求次数、请求间隙
http.defaults.retry = 3
http.defaults.retryDelay = 1000

// 防止重复请求
export const reqList = []

/**
 * 阻止重复请求
 * @param {array} reqList - 请求缓存列表
 * @param {string} url - 当前请求地址
 * @param {function} cancel - 请求中断函数
 * @param {string} errorMessage - 请求中断时需要显示的错误信息
 */
const stopRepeatRequest = (requestList, url, cancel, errorMessage) => {
    const errorMsg = errorMessage || ''
    for (let i = 0; i < requestList.length; i++) {
        if (requestList[i] === url && (filterRepetition.indexOf(url.replace(`${apiHostname}/`, ''))) >= 0) {
            cancel(errorMsg)
            return
        }
    }
    reqList.push(url)
}

/**
 * 允许某个请求可以继续进行
 * @param {array} reqList 全部请求列表
 * @param {string} url 请求地址
 */
const allowRequest = (requestList, url) => {
    for (let i = 0; i < requestList.length; i++) {
        if (requestList[i] === url) {
            reqList.splice(i, 1)
            break
        }
    }
}

// 添加 请求拦截器  
// 接口 请求前拦截
http.interceptors.request.use(config => {
    let cancel
    // 设置cancelToken对象
    config.cancelToken = new axios.CancelToken((c => {
        cancel = c
    }))
    // 阻止重复请求。当上个请求未完成时，相同的请求不会进行
    stopRepeatRequest(reqList, config.url, cancel, `${config.url} 请求被中断`)
    // TODO: 可以做一些请求前的 统一配置处理
    if (config.config) {
        for (const item in config.config) {
            config[item] = config.config[item]
        }
        if (config.config.cache) {
            config.url += /\?/g.test(config.url) ? `&_=${new Date().getTime()}` : `?_=${new Date().getTime()}`
        }
    }

    // TODO: 针对 请求类型做 处理
    if (config.method === 'post') {
        console.log('post')
        // ! 针对于 JD 的网关层做的特殊处理 接口入参必须是这种格式
        config.data = {
            reqData: config.data
        }
    } else if (config.method === 'get') {
        console.log('get')
        // ! 针对于 JD 的网关层做的特殊处理 接口入参必须是这种格式
        config.data = `reqData=${JSON.stringify(config.data)}`
    }

    return config
}, error => Promise.reject(error))

// 接口 请求后拦截
http.interceptors.response.use(response => {
    // 增加延迟，相同请求不得在短时间内重复发送
    const reqTimer = setTimeout(() => {
        allowRequest(reqList, response.config.url)
        clearTimeout(reqTimer)
    }, 100)

    // ! 网关层处理
    const result = response.data
    const always = (response.config.config && response.config.config.always) ? response.config.config.always : false
    
    // 网关接口响应失败
    if (!always) {
        if (result.resultCode && result.resultCode !== 0) {
            // 未登录
            if (result.resultCode === 3) {
                console.log('未登陆')
                // const localUrl = encodeURIComponent(`${window.location.protocol}//${window.location.host}${window.location.pathname}#/business/performance/company`)
                // const newUrl = `//plogin.m.jd.com/user/login.action?appid=566&wxautologin=false&returnurl=${localUrl}`
                // window.location.href = newUrl
                // return result

                const currentUrl = window.location.href
                console.debug(`currentUrl is ${currentUrl}`)
                console.debug(`login url is ${process.env.VUE_APP_LOGIN}`)
                window.location.href = process.env.VUE_APP_LOGIN + encodeURIComponent(currentUrl)
                return
            } else {
                console.log('系统异常，请稍后重试~~')
            }
            return false
        }
    }
    // TODO: 做一些请求成功后的处理 比如 回参 的状态码处理
    
    return result
}, error => {
    // 请求错误时做些事
    if (axios.isCancel(error)) {
        console.log(error.message)
    } else {
        // 增加延迟，相同请求不得在短时间内重复发送
        const errTimer = setTimeout(() => {
            allowRequest(reqList, error.config.url)
            clearTimeout(errTimer)
        }, 100)

        if (error && error.response) {
            switch (error.response.status) {
            case 400:
                error.message = '错误请求'
                break
            case 401:
                error.message = '未授权，请重新登录'
                break
            case 403:
                error.message = '拒绝访问'
                break
            case 404:
                error.message = '请求错误,未找到该资源'
                break
            case 405:
                error.message = '请求方法未允许'
                break
            case 408:
                error.message = '请求超时'
                break
            case 500:
                error.message = '服务器端出错'
                break
            case 501:
                error.message = '网络未实现'
                break
            case 502:
                error.message = '网络错误'
                break
            case 503:
                error.message = '服务不可用'
                break
            case 504:
                error.message = '网络超时'
                break
            case 505:
                error.message = 'http版本不支持该请求'
                break
            default:
                error.message = `连接错误${error.response.status}`
            }
            const errData = {
                code: error.response.status,
                message: error.message
            }
            window.console.log('统一错误处理: ', errData)
        }

        return Promise.reject(new NetworkError(error.message, error))
    }
})

// 暴露出方法
export const fetch = http
