/**
 * 判断对象是否是 Object 类型
 * @param {* 需要判断的对象} value 
 * @returns 
 */
export const isObject = value => {
    const type = typeof value
    return value != null && (type === 'object' || type === 'function')
}
