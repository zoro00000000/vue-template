import { isObject } from './isObject'
import root from './root'

/**
 * 防抖 函数 方法
 * @param {Function} func: 需要执行的函数
 * @param {Number} wait: 需要等待的时间
 * @param {Object} options: 配置项
 * @param {Boolean} options: options.leading = false 指定在超时边缘上用
 * @param {Number} options: options.maxWait func被允许在被调用之前被延迟的最大时间。
 * @param {Boolean} options: options.trailing = true 指定在超时的末尾进行调用。
 * @param {Function} options: 返回新的防抖函数。
 */
export const debounce = (func, wait, options) => {
    let lastArgs
    let lastThis
    let maxWait
    let result
    let timerId
    let lastCallTime
    
    let lastInvokeTime = 0
    let leading = false
    let maxing = false
    let trailing = true

    // 是否使用 requestAnimationFrame
    const useRAF = (!wait && wait !== 0 && typeof root.requestAnimationFrame === 'function')
    
    if (typeof func !== 'function') {
        throw new TypeError('Expected a function')
    }

    // 配置参数赋值
    wait = +wait || 0
    if (isObject(options)) {
        leading = !!options.leading
        maxing = 'maxWait' in options
        maxWait = maxing ? Math.max(+options.maxWait || 0, wait) : maxWait
        trailing = 'trailing' in options ? !!options.trailing : trailing
    }

    // 方法继承
    function invokeFunc (time) {
        const args = lastArgs
        const thisArg = lastThis

        lastThis = undefined
        lastArgs = lastThis
        lastInvokeTime = time
        result = func.apply(thisArg, args)
        return result
    }

    // ! 定时器 延时执行 func 的封装
    function startTimer (pendingFunc, newWait) {
        if (useRAF) {
            root.cancelAnimationFrame(timerId)
            return root.requestAnimationFrame(pendingFunc)
        }
        return setTimeout(pendingFunc, newWait)
    }

    // 清除定时器
    // function cancelTimer (id) {
    //     if (useRAF) {
    //         return root.cancelAnimationFrame(id)
    //     }
    //     clearTimeout(id)
    // }

    function trailingEdge (time) {
        timerId = undefined

        if (trailing && lastArgs) {
            return invokeFunc(time)
        }
        lastThis = undefined
        lastArgs = lastThis
        return result
    }

    // 检测当有 延时方法的时候，当前状态，如果这个延时方法没执行返回 false，执行完返回 true
    function shouldInvote (time) {
        const timeSinceLastCall = time - lastCallTime
        const timeSinceLastInvoke = time - lastInvokeTime

        return (lastCallTime === undefined || (timeSinceLastCall >= wait)
            || (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait)
        )
    }

    // 剩余的等待
    // function remainingWait (time) {
    //     const timeSinceLastCall = time - lastCallTime
    //     const timeSinceLstInvoke = time - lastInvokeTime
    //     const timeWaiting = wait - timeSinceLastCall

    //     return maxing ? Math.min(timeWaiting, maxWait - timeSinceLstInvoke) : timeWaiting
    // }

    // ! 过期的 延时 func
    function timerExpired () {
        const time = Date.now()
        if (shouldInvote(time)) {
            return trailingEdge(time)
        }
        // timerId = startTimer(timerExpired, remainingWait(time))
        
        const timeSinceLastCall = time - lastCallTime
        const timeSinceLstInvoke = time - lastInvokeTime
        const timeWaiting = wait - timeSinceLastCall
        // 剩余执行时间
        const timeIng = maxing ? Math.min(timeWaiting, maxWait - timeSinceLstInvoke) : timeWaiting
        timerId = startTimer(timerExpired, timeIng)
    }

    // ! 执行 重要函数
    function leadingEdge (time) {
        // 重置 ‘maxWait’ 定时器
        lastInvokeTime = time
        // 设置新的计时器
        timerId = startTimer(timerExpired, wait)
        // 执行 函数
        return leading ? invokeFunc(time) : result
    }

    // debounced 的方法
    // 清除延时 fanc
    function cancel () {
        // 如果有待执行的延时func
        if (timerId !== undefined) {
            // cancelTimer(timerId)
            if (useRAF) {
                return root.cancelAnimationFrame(timerId)
            }
            clearTimeout(timerId)
        }
        // 重置基础数据
        lastInvokeTime = 0
        timerId = undefined
        lastThis = undefined
        lastCallTime = undefined
        lastArgs = undefined
    }

    // 继续延时 func
    function flush () {
        return timerId === undefined ? result : trailingEdge(Date.now())
    }

    // 停止 func
    function pending () {
        return timerId !== undefined
    }

    // 主要函数方法
    function debounced (...args) {
        const time = Date.now()
        const isInvoking = shouldInvote(time)

        lastArgs = args
        lastThis = this
        lastCallTime = time
        
        // 如果有上一个没有执行完的函数
        if (isInvoking) {
            if (timerId === undefined) {
                return leadingEdge(lastCallTime)
            }

            if (maxing) {
                timerId = startTimer(timerExpired, wait)
                return invokeFunc(lastCallTime)
            }
        }

        if (timerId === undefined) {
            // 如果没有需要执行的 延时func 则新创建一个
            timerId = startTimer(timerExpired, wait)
        }
        return result
    }

    debounced.cancel = cancel
    debounced.flush = flush
    debounced.pending = pending

    return debounced
}
