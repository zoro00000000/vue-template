import * as webview from './webviewTester'
import {
    getNumInString,
    getJrAppVersion
} from './tools'

// 默认数据
const resultData = {
    // 是否需要转链 ’1‘：是，’0‘：不是；默认为 ’0‘
    isTranserCpsLink: '0',
    // 是否需要开启个性化 '1' 开启，‘0’ 关闭
    isAllowRecommend: '1'
}

// 转链 & 获取个性化配置
export const getIsAllowRecommend = () => new Promise(resolve => {
    // 判断 如果是 JDapp
    if (webview.isInJdApp()) {
        console.log('jdApp')

        resultData.isTranserCpsLink = '1'
        resolve(resultData)
    } else if (webview.isInJdJrApp()) {
        console.log('jrApp')

        resultData.isTranserCpsLink = '0'
        const head = document.getElementsByTagName('head')[0]
        const js = document.createElement('script')
        js.type = 'text/javascript'
        js.innerHTML = 'window.isGylHjlcCps=1'
        head.appendChild(js)

        // 是JRapp
        if (window.JrBridge) {
            console.log('JrBridge')
            // 获取金融app内用户是否开启了个性化推荐
            // 先获取JRapp版本号
            const jrAppVersion = getJrAppVersion()
            if (getNumInString(jrAppVersion) >= 6020) {
                // 获取个性化推荐
                // eslint-disable-next-line no-undef
                JrBridge.callNative({ type: '75' }, data => {
                    console.log('JrBridge data:', data)
                    if (data && typeof data !== 'object') data = JSON.parse(data)

                    if (data && data.isAllowRecommend) resultData.isAllowRecommend = data.isAllowRecommend

                    resolve(resultData)
                })
            } else {
                resultData.isAllowRecommend = '1'
                resolve(resultData)
            }
        }
    } else {
        console.log('M站')
        resultData.isAllowRecommend = '1'
        resolve(resultData)
    }
})
