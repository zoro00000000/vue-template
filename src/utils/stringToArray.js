/**
 * 提取数字，将文案转换成数组方法。
 * @param {*} str 
 * @param {*} filters  例： [1, 2, 3]
 * @returns 
 */
export const stringToArray = (str, filters) => {
    if (str.length === 0) return []
    let demoString = str
    let numberArr = demoString.match(/\d+(.\d+)?/g)
    const newArray = []

    if (filters && filters.length > 0) {
        numberArr = numberArr.filter(number => {
            return filters.indexOf(Number(number)) === -1
        })
    }

    if (numberArr) {
        numberArr.map((item, index) => {
            demoString.indexOf(item)
    
            const textString = {
                type: 'text',
                text: demoString.slice(0, demoString.indexOf(item))
            }
    
            demoString = demoString.slice(-(demoString.length - demoString.indexOf(item) - item.length))
    
            const numberString = {
                type: 'number',
                text: item
            }
            newArray.push(textString, numberString)
            
            if (numberArr.length - 1 === index && demoString.length > 0) {
                // 最后一个数字
                newArray.push({
                    type: 'text',
                    text: demoString
                })
            }
            return item
        })
    } else {
        const textString = {
            type: 'text',
            text: str
        }
        newArray.push(textString)
    }

    return newArray
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
