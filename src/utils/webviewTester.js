/**
 * WebviewTester
 * 检测是否处于 webview 内
 * 2021/04/06
 * ? 需要
 */

export const ua = navigator.userAgent

export const isInThirdPartWebview = () => !this.isInJdApp() && !this.isInJdApp()

// true表示是ios商城，false表示是android商城
export const isWKWebView = () => !!ua.match(/supportJDSHWK/i) || window._is_jdsh_wkwebview === 1
 
export const isInMicroMessenger = () => /MicroMessenger/i.test(ua)

export const isInQQ = () => /\sQQ/.test(ua)

export const isInWeibo = () => /Weibo/i.test(ua)

// https://cf.jd.com/pages/viewpage.action?pageId=163683133
export const isInJdApp = () => /jdapp/.test(ua)

// https://cf.jd.com/pages/viewpage.action?pageId=181277416
export const isInJdJrApp = () => /JDJR-App/.test(ua)
    
export const isWxMini = () => /miniprogram/i.test(ua)

export const isWechat = () => /micromessenger/i.test(ua)
     
export const isIE = () => {
    const msie = ua.indexOf('MSIE ')
    if (msie > 0) {
        // IE 10 or older => return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10)
    }
    
    const trident = ua.indexOf('Trident/')
    if (trident > 0) {
        // IE 11 => return version number
        const rv = ua.indexOf('rv:')
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10)
    }
    
    const edge = ua.indexOf('Edge/')
    if (edge > 0) {
        // Edge (IE 12+) => return version number
        return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10)
    }
    
    // other browser
    return false
}
    
export const isAppleDevices = () => /ipad|iphone|ipod|Macintosh/ig.test(ua)

export const isAndroidDevices = () => /Android/ig.test(ua)
