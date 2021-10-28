/**
 * 查看浮点数 小数位数
 * @param {*} num 
 * @returns 
 */
export const countDecimals = num => {
    let len = 0

    try {
        num = Number(num)
        let str = num.toString().toUpperCase()
        if (str.split('E').length === 2) { // scientific notation
            let isDecimal = false
            if (str.split('.').length === 2) {
                str = str.split('.')[1]
                if (parseInt(str.split('E')[0], 10) !== 0) {
                    isDecimal = true
                }
            }
            const x = str.split('E')
            if (isDecimal) {
                len = x[0].length
            }
            len -= parseInt(x[1], 10)
        } else if (str.split('.').length === 2) { // decimal
            if (parseInt(str.split('.')[1], 10) !== 0) {
                len = str.split('.')[1].length
            }
        }
    } catch (e) {
        // throw e
        console.log(e)
        return 0
    } finally {
        if (Number.isNaN(len) || len < 0) {
            len = 0
        }
        return len
    }
}

/**
 * 转换为整数
 * @param {*} num 
 * @returns 
 */
export const convertToInt = num => {
    num = Number(num)

    let newNum = num
    const times = countDecimals(num)
    const tempNum = num.toString().toUpperCase()
    if (tempNum.split('E').length === 2) {
        // newNum = Math.round(num * Math.pow(10, times))
        newNum = Math.round(num * (10 ** times))
    } else {
        newNum = Number(tempNum.replace('.', ''))
    }
    return newNum
}

/**
 * 方法映射
 * @param {*} type 
 * @param {*} num1 
 * @param {*} num2 
 * @param {*} result 
 * @returns 
 */
export const getCorrectResult = (type, num1, num2, result) => {
    let tempResult = 0
    switch (type) {
    // 加法
    case 'add':
        tempResult = num1 + num2
        break
    // 减法
    case 'minus':
        tempResult = num1 - num2
        break
    // 除法
    case 'divide':
        tempResult = num1 / num2
        break
    //  乘法
    case 'multiply':
        tempResult = num1 * num2
        break
    default:
    // 默认加法
        tempResult = num1 + num2
        break
    }
    if (Math.abs(result - tempResult) > 1) {
        return tempResult
    }
    return result
}

/**
 * 乘法
 * @param {*} num1 
 * @param {*} num2 
 * @returns 
 */
export const multiply = (num1, num2) => {
    num1 = Number(num1)
    num2 = Number(num2)

    let times = 0
    const s1 = num1.toString()
    const s2 = num2.toString()

    try { times += countDecimals(s1) } catch (e) { console.log(e) }
    try { times += countDecimals(s2) } catch (e) { console.log(e) }
    
    // const result = convertToInt(s1) * convertToInt(s2) / Math.pow(10, times)
    const result = convertToInt(s1) * convertToInt(s2) / (10 ** times)
    return getCorrectResult('mul', num1, num2, result)
    // return result
}

/**
 * 加法
 * @param {*} num1 
 * @param {*} num2 
 * @returns 
 */
export const add = (num1, num2) => {
    num1 = Number(num1)
    num2 = Number(num2)

    let dec1
    let dec2

    try { 
        dec1 = countDecimals(num1) + 1
    } catch (e) { 
        dec1 = 0
    }
    try { 
        dec2 = countDecimals(num2) + 1
    } catch (e) {
        dec2 = 0
    }
    // const times = Math.pow(10, Math.max(dec1, dec2))
    const times = (10 ** Math.max(dec1, dec2))
    const result = Number((num1 * times + num2 * times) / times)
    // const result = (multiply(num1, times) + multiply(num2, times)) / times
    return getCorrectResult('add', num1, num2, result)
    // return result
}

/**
 * 减法
 * @param {*} num1 
 * @param {*} num2 
 * @returns 
 */
export const minus = (num1, num2) => {
    num1 = Number(num1)
    num2 = Number(num2)
    let dec1
    let dec2

    try { dec1 = countDecimals(num1) + 1 } catch (e) { dec1 = 0 }
    try { dec2 = countDecimals(num2) + 1 } catch (e) { dec2 = 0 }
    // const times = Math.pow(10, Math.max(dec1, dec2))
    const times = 10 ** (Math.max(dec1, dec2))
    const result = Number(((num1 * times - num2 * times) / times))
    return getCorrectResult('minus', num1, num2, result)
    // return result
}

/**
 * 除法
 * @param {*} num1 
 * @param {*} num2 
 * @returns 
 */
export const divide = (num1, num2) => {
    num1 = Number(num1)
    num2 = Number(num2)
    let t1 = 0
    let t2 = 0
    try { t1 = countDecimals(num1) + 1 } catch (e) { console.log(e) }
    try { t2 = countDecimals(num2) + 1 } catch (e) { console.log(e) }
    const dec1 = convertToInt(num1)
    const dec2 = convertToInt(num2)
    // const result = accMul((dec1 / dec2), Math.pow(10, t2 - t1))
    const result = multiply((dec1 / dec2), (10 ** t2 - t1))
    return getCorrectResult('divide', num1, num2, result)
    // return result
}
