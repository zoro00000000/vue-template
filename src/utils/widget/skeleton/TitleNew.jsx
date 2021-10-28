import { getNumInString } from '../../tools'

const Title = (props, type) => {
    // console.log('title type:', type)
    const propsAttr = {
        prefixCls: {
            type: String,
            default () {
                return 'skeleton'
            }
        },
        width: {
            type: [Number, String],
            default () {
                return 100
            }
        },
        active: {
            type: Boolean,
            default () {
                return false
            }
        }
    }

    const textClass = ({ active, prefixCls }) => {
        if (type === 'vue') {
            return [`${prefixCls}-title-container`, active ? 'skeleton-animate' : 'skeleton-color']
        }
        return `${prefixCls}-title-container ${ active ? 'skeleton-animate' : 'skeleton-color' }`
    }

    const widthStyle = width => {
        const convWidth = getNumInString(width || 100) * (1 - 0.618)
        return {
            width: `${convWidth}%`,
        }
    }

    if (type === 'vue') {
        // #!if isVue === true
        return {
            name: 'Title',
            props: propsAttr,
            render () {
                const { prefixCls, width, active } = this.$props
        
                return (
                    <div class={ textClass({ active, prefixCls }) } style={ widthStyle(width) }></div>
                )
            }
        }
    } else {
        // REACT 组件
        // #!elseif isReact === true
        const { prefixCls, width, active } = props

        return (
            <div className={ textClass({ active, prefixCls }) } style={ widthStyle(width) }></div>
        )
        // #!endif
    }
}

export default Title
