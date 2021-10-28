/**
 * 获取剩余时间
 * @param {Number} endTime          截止时间
 * @param {Number} deviceTime       设备时间
 * @param {Number} serverTime       服务器时间
 * @return {Object}                 剩余时间对象
 */
export const getRemainderTime = (serverTime, deviceTime, endTime) => {
    // console.log(serverTime, deviceTime, endTime)
    const t = endTime - Date.parse(new Date()) - serverTime + deviceTime

    const seconds = Math.floor((t / 1000) % 60)
    const minutes = Math.floor((t / 1000 / 60) % 60)
    const hours = Math.floor((t / (1000 * 60 * 60)) % 24)
    const days = Math.floor(t / (1000 * 60 * 60 * 24))

    return {
        total: t,
        days,
        hours,
        minutes,
        seconds
    }
}

/**
 * 计时器方法
 * @param {Number} serverTime       服务器时间
 * @param {Number} deviceTime       设备时间
 * @param {Number} endTime          截止时间
 * @returns 
 */
export const timepiece = ({
    serverTime, 
    deviceTime, 
    endTime, 
    intervalTime, 
    timerCb 
}) => new Promise(resolve => {
    const intevalometer = setInterval(() => {
        // 得到剩余时间
        const remainTime = getRemainderTime(serverTime, deviceTime, endTime)
        // console.log('remainTime', remainTime)

        if (remainTime.total > 0) {
            // 倒计时过程中
            timerCb && timerCb({
                timeData: remainTime,
                timer: intevalometer,
                status: false
            })
        } else if (remainTime.total <= 0) {
            // 倒计时结束
            clearInterval(intevalometer)
            resolve({
                timeData: remainTime,
                timer: intevalometer,
                status: true
            })
        }
    }, intervalTime || 1000)
})
