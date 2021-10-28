/**
 * ? 版本号对比方法
 * @param {String} v1：版本号1
 * @param {String} v2：版本号2
 * @returns 
 */
export const versionContrast = (v1, v2) => {
    if (!v1 || !v2) return -1

    let result = 0
    v2 = v2.split('.')
    v1.split('.').some((n, i) => {
        result = n - v2[i]
        return result
    })
    return result
}

/**
 * ? 金融app 内 从ua信息中获取版本号
 * @param {String} name 
 * @returns 
 */
export const getJrAppVersion = (name = 'clientversion') => {
    const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`)
    const ua = navigator.userAgent.toLowerCase()
    return ua.match(reg)[2]
}

/**
 * ? 获取 sessionStorage 里的属性
 * @param {String} name: sessionStorage 的 key
 * @returns 
 */
export const getStorage = name => {
    if (sessionStorage[name] && sessionStorage[name] !== 'undefined') {
        return JSON.parse(sessionStorage[name])
    } else {
        return false
    }
}

/**
 * ? 获取字符串中数字
 * @param {String} str：包含数字的字符串
 * @returns 
 */
export const getNumInString = str => {
    if (typeof str === 'string') {
        const num = str.replace(/[^0-9]/ig, '')
        return num
    } else if (typeof str === 'number') {
        return str
    } else {
        return undefined
    }
}

// TODO: 需修改版本
/**
 * ? 图片 URL 拼接
 * @param {String} url 
 * @returns 
 */
export function jointImgUrl (url) {
    const reg = RegExp(/http/)
    if (reg.test(url)) {
        return url
    } else {
        return `https://m.360buyimg.com/jrqb/${url}`
    }
}

// /**
//  * ? 从 url 上获取？后面的所有参数
//  * @param {String} url 
//  * @returns 
//  */
// export const getQueryParams = url => {
//     const ESC = {
//         '<': '&lt;',
//         '>': '&gt;',
//         '"': '&quot;',
//         '&': '&amp;'
//     }
    
//     // 特殊字符转换
//     const escapeChar = a => ESC[a] || a
//     const escape = s => s.replace(/[<>"&]/g, escapeChar)

//     const queryObj = {}
//     const params = new URL(url).searchParams

//     for (const [key, value] of params) {
//         queryObj[key] = escape(value)
//     }

//     return queryObj
// }

// /**
//  * ? url 获取指定参数
//  * @param {String} name 
//  */
// export const getQueryString = name => {
//     // 正则匹配
//     const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`)
//     const r = window.location.search.substr(1).match(reg)

//     if (r != null) return unescape(r[2])
//     return null
// }

/**
 * ? 内容复制
 * @param {String} content 
 * @param {String} toastDesc 
 */
export const copy = (content, toastDesc = '复制成功') => {
    const inputDom = document.createElement('input')
    inputDom.setAttribute('readonly', 'readonly')
    inputDom.setAttribute('value', content)
    inputDom.style = 'opacity: 0'
    document.body.appendChild(inputDom)
    inputDom.select()
    document.execCommand('Copy')
    document.body.removeChild(inputDom)
    console.log(toastDesc)
}
