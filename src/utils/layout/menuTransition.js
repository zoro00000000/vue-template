// 函数组件
const transitionStyle = '0.3s height ease-in-out'

// transition
const Transition = {
    beforeEnter (el) {
        el.style.transition = transitionStyle
        if (!el.dataset) el.dataset = {}

        el.style.height = 0
    },
    enter (el) {
        el.dataset.oldOverflow = el.style.overflow
        if (el.scrollHeight !== 0) {
            el.style.height = `${el.scrollHeight}px`
        } else {
            el.style.height = ''
        }

        el.style.overflow = 'hidden'
    },
    afterEnter (el) {
        el.style.transition = ''
        el.style.height = ''
        el.style.overflow = el.dataset.oldOverflow
    },
    beforeLeave (el) {
        if (!el.dataset) el.dataset = {}
        el.dataset.oldOverflow = el.style.overflow

        el.style.height = `${el.scrollHeight}px`
        el.style.overflow = 'hidden'
    },
    leave (el) {
        if (el.scrollHeight !== 0) {
            el.style.transition = transitionStyle
            el.style.height = 0
        }
    },
    afterLeave (el) {
        el.style.transition = ''
        el.style.height = ''
        el.style.overflow = el.dataset.oldOverflow
    }
}

export default {
    name: 'MenuTransition',
    functional: true,
    render (createElement, { children }) {
        const data = {
            // 事件监听 处理
            on: Transition
        }
        // 创建一个 transition 标签
        return createElement('transition', data, children)
    }
}
