import { getNumInString } from '../../tools'

const Title = {
    name: 'Title',
    props: {
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
    },
    render () {
        const { prefixCls, width, active } = this.$props

        const convWidth = getNumInString(width) * (1 - 0.618)

        return (
            <div class={[`${prefixCls}-title-container`, active ? 'skeleton-animate' : 'skeleton-color']} style={ `width: ${convWidth}%` }></div>
        )
    }
}

export default Title
