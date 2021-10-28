import { getNumInString } from '../../tools'

const Paragraph = {
    name: 'Paragraph',
    props: {
        prefixCls: {
            type: String,
            default () {
                return 'skeleton'
            }
        },
        rows: {
            type: Number,
            default () {
                return 2
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
    methods: {
        // 获取相应宽度
        getWidth (index) {
            const { width, rows } = this.$props
            const convWidth = getNumInString(width)
            // 最后一行
            if (rows - 1 === index) {
                return `width: ${convWidth * 0.618}%`
            }
            return `width: ${convWidth}%`
        }
    },
    render () {
        const { rows, prefixCls, active } = this.$props
        const newArray = [...Array(rows)]

        return <ul class={`${prefixCls}-paragraph-container`}>
            { 
                newArray.map((item, index) => {
                    const width = this.getWidth(index)
                    return <li class={active ? 'skeleton-animate' : 'skeleton-color'} key={index} style={width} />
                })
            }
        </ul>
    }
}

export default Paragraph
