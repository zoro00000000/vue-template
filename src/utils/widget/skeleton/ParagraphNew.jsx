import { getNumInString } from '../../tools'

const Paragraph = (props, type) => {
    const propsAttr = {
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
    }

    // 获取相应宽度
    const getWidth = ({ index, width, rows }) => {
        const convWidth = getNumInString(width || 100)

        let widthPercent = `${convWidth}%`
        // 最后一行
        if (rows - 1 === index) {
            // return `width: ${convWidth * 0.618}%`
            widthPercent = `${convWidth * 0.618}%`
        }
        return {
            width: widthPercent
        }
    }

    if (type === 'vue') {
        // #!if isVue === true
        return {
            name: 'Paragraph',
            props: propsAttr,
            render () {
                const { 
                    rows, 
                    prefixCls, 
                    active, 
                    width 
                } = this.$props

                const newArray = [...Array(rows)]
        
                return (
                    <ul class={`${prefixCls}-paragraph-container`}>
                        { 
                            newArray.map((item, index) => {
                                return <li class={ active ? 'skeleton-animate' : 'skeleton-color' } key={index} style={ getWidth({ index, width, rows }) } />
                            })
                        }
                    </ul>
                )
            }
        }
    } else {
        // #!elseif isReact === true
        const { 
            rows, 
            prefixCls, 
            active, 
            width 
        } = props

        const newArray = [...Array(rows)]
        // REACT 组件
        return (
            <ul className={`${prefixCls}-paragraph-container`}>
                { 
                    newArray.map((item, index) => {
                        return <li className={ active ? 'skeleton-animate' : 'skeleton-color' } key={index} style={ getWidth({ index, width, rows }) } />
                    })
                }
            </ul>
        )
        // #!endif
    }
}

export default Paragraph
