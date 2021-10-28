/**
 * ? 从 url 上获取？后面的所有参数
 * @param {String} url 
 * @returns 
 */
export const getQueryParams = url => {
    const ESC = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        '&': '&amp;'
    }
    
    // 特殊字符转换
    const escapeChar = a => ESC[a] || a
    const escape = s => s.replace(/[<>"&]/g, escapeChar)

    const queryObj = {}
    const params = new URL(url).searchParams

    for (const [key, value] of params) {
        queryObj[key] = escape(value)
    }

    return queryObj
}

/**
 * ? url 获取指定参数
 * @param {String} name 
 */
export const getQueryString = name => {
    // 正则匹配
    const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`)
    const r = window.location.search.substr(1).match(reg)

    if (r != null) return unescape(r[2])
    return null
}
