import axios from 'axios'
// import router from '@/router'
import qs from 'qs'
// import { Toast } from 'vant'
// import 'vant/lib/toast/style'

const configEnv = require('@config/api.config')

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

let apiHostname = configEnv.prod.HOST_API
let apiLoginname = configEnv.prod.LOGIN_API

if (configEnv[process.env.VUE_APP_BUILD_ENV]) {
    apiHostname = configEnv[process.env.VUE_APP_BUILD_ENV].HOST_API
    apiLoginname = configEnv[process.env.VUE_APP_BUILD_ENV].LOGIN_API
}

// console.log('configEnv:', configEnv)
// console.log('env:', process.env.VUE_APP_BUILD_ENV)
// console.log('apiHostname:', apiHostname)

const http = axios.create({
    withCredentials: true,
    baseURL: apiHostname,
    timeout: 5000
})

http.defaults.retry = 3 // 超时重试3次
http.defaults.retryDelay = 5000 // 间隔5000毫秒重试

// const { CancelToken } = axios
const requestMap = new Map()
// 前置拦截器
http.interceptors.request.use(
    config => {
        // 放重提交
        const keyString = qs.stringify(
            {
                
                url: config.url,
                method: config.method,
                ...config.data
            }
        )

        if (requestMap.get(keyString) && config.repeat) {
            // 取消当前请求
            config.cancelToken = new axios.CancelToken(cancel => {
                cancel('Please slow down a little')
            })
        }
        requestMap.set(keyString, true)

        Object.assign(config, {
            _keyString: keyString
        })
        return config
    },
    err => Promise.reject(err)
)

http.interceptors.response.use(
    response => {
        const { config } = response
        // 重置放重提交
        requestMap.set(config._keyString, false)
        const res = response.data
        
        console.log('------------------')
        console.log(response)

        // 业务错误
        if (!res || (res.resultCode !== 0 && res.resultCode !== 3)) {
            // Toast('网络开小差了，请稍后再试~')
            // router.push({ name: 'error' })
            return
        }
        // 网关resultCode为3说明没有登录状态，跳转登录
        if (res.resultCode === 3) {
            const currentUrl = window.location.href
            // console.debug(`currentUrl is ${currentUrl}`)
            // console.debug(`login url is ${apiLoginname}`)
            window.location.href = apiLoginname + encodeURIComponent(currentUrl)
            return
        }
        return res.resultData
    },
    err => {
        // 重置放重提交
        requestMap.clear()
        if (err && err.response) {
            switch (err.response.status) {
            case 400:
                err.message = '错误请求'
                break
            case 401:
                err.message = '未授权，请重新登录'
                break
            case 403:
                err.message = '拒绝访问'
                break
            case 404:
                err.message = '请求错误,未找到该资源'
                break
            case 405:
                err.message = '请求方法未允许'
                break
            case 408:
                err.message = '请求超时'
                break
            case 500:
                err.message = '服务器端出错'
                break
            case 501:
                err.message = '网络未实现'
                break
            case 502:
                err.message = '网络错误'
                break
            case 503:
                err.message = '服务不可用'
                break
            case 504:
                err.message = '网络超时'
                break
            case 505:
                err.message = 'http版本不支持该请求'
                break
            default:
                err.message = `连接错误${err.response.status}`
            }
            const errData = {
                code: err.response.status,
                message: err.message
            }
            window.console.log('统一错误处理: ', errData)
            // Toast(errData.message)
        }
        // router.push({ name: "error" })
        // Toast(err.message)
        return Promise.reject(new NetworkError(err.message, err))
    }
)

export const fetch = {
    /**
     * ? GET 请求
     *
     * @param {*} params
     * @return {*} 
     */
    get (params) {
        return new Promise((resolve, reject) => {
            // 序列化入参 网关入参格式
            const requestData = {
                reqData: params.data || {}
            }
            const options = {
                method: 'GET',
                url: params.url,
                config: params.config || null,
                params: requestData
            }
            http(options).then(res => {
                if (!res) reject()
                resolve(res)
            }).catch(error => {
                // 网络请求发生未知错误
                new NetworkError(error.message, error)
                reject(error)
            })
        })
    },
    /**
     * ? POST 请求
     *
     * @param {*} params
     * @return {*} 
     */
    post (params) {
        return new Promise((resolve, reject) => {
            const paramData = params.data || {}
            const requestData = `reqData=${JSON.stringify(paramData)}`
            const options = {
                method: 'POST',
                url: params.url,
                config: params.config || null,
                data: requestData,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
            // options.headers['Content-Type'] = 'application/x-www-form-urlencoded'
            http(options).then(res => {
                if (!res) reject()
                resolve(res)
            }).catch(error => {
                // 网络请求发生未知错误
                console.log('error2')
                new NetworkError(error.message, error)
                reject(error)
            })
        })
    },
    /**
     * ? 图片上传
     *
     * @param {*} params
     * @return {*} 
     */
    postImage (params) {
        return new Promise((resolve, reject) => {
            const paramData = params.data || {}
            const options = {
                method: 'POST',
                url: params.url,
                config: params.config || null,
                data: paramData,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }

            http(options).then(res => {
                if (res.id === '1') {
                    resolve(res)
                } else {
                    reject()
                }
            }).catch(error => {
                // 网络请求发生未知错误
                new NetworkError(error.message, error)
                reject(error)
            })
        })
    },
    /**
     * ? 获取 json 文件
     *
     * @param {*} params
     * @return {*} 
     */
    jsonPost (params) {
        return new Promise((resolve, reject) => {
            const paramData = params.data || {}
            const options = {
                method: 'POST',
                url: params.url,
                config: params.config || null,
                data: paramData,
                headers: {
                    'Content-Type': 'application/json'
                }
            }

            http(options).then(res => {
                if (res) {
                    resolve(res)
                } else {
                    reject()
                }
            }).catch(error => {
                // 网络请求发生未知错误
                new NetworkError(error.message, error)
                reject(error)
            })
        })
    },
    mget (url) {
        return axios.get(url)
    },
    spread (cb) {
        return axios.spread(cb)
    },
    all (getArry, cb) {
        axios.all(getArry).then(fetch.spread(cb))
    }
}
