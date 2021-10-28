import ParagraphNode from './ParagraphNew'
import TitleNode from './TitleNew'
import './index.scss'

/**
 * 一款兼容 vue、react 的组件
 *
 * @param {string} [type='vue']
 */
export const Skeleton = (props, type) => {
    console.log('Skeleton type', props, type)
    // 组件 props 参数
    const propsAttr = {
        // 骨架屏动画
        loading: {
            type: Boolean,
            default () {
                return true
            }
        },
        // 是否展示头图骨架屏
        avatar: {
            type: Boolean,
            default () {
                return false
            }
        },
        // 是否展示文案
        title: {
            type: Boolean,
            default () {
                return true
            }
        },
        // 展示行
        paragraph: {
            type: Boolean,
            default () {
                return true
            }
        },
        // 展示几行
        row: {
            type: Number,
            default () {
                return 2
            }
        },
        // 是否展示动画
        active: {
            type: Boolean,
            default () {
                return true
            }
        }
    }

    // class 名前缀
    const prefixCls = 'skeleton'

    // 状态处理
    const handlerStatusFun = ({ avatar, title, paragraph }) => ({
        hasAvatar: !!avatar,
        hasTitle: !!title,
        hasParagraph: !!paragraph
    })

    // avatar Dom
    const avatarHandler = ({ status, nodeDom }) => (status && nodeDom)

    // content Dom
    const contentHandler = ({ hasTitle, hasParagraph, nodeDom }) => {
        if (hasTitle || hasParagraph) {
            // 计算 row 的最大值
            const remainHidth = 100 - 12
            let maxRow = parseInt(remainHidth / (5.2), 10)

            console.log('maxRow:', maxRow)

            hasTitle && (maxRow -= 1)

            return nodeDom(maxRow)
        }
    }

    // 骨架屏样式
    const skeletonCls = ({ active }) => {
        if (type === 'vue') {
            return [
                active && `${prefixCls}-active`,
                `${prefixCls}-container`,
                `${prefixCls}-avatar`
            ]
        }
        return `${prefixCls}-container ${prefixCls}-avatar ${ active ? `${prefixCls}-active` : ''}`
    }

    if (type === 'vue') {
        // VUE 组件
        // #!if isVue === true
        return {
            name: 'skeleton',
            props: propsAttr,
            components: {
                Paragraph: ParagraphNode(props, type),
                Title: TitleNode(props, type)
            },
            render () {
                const {
                    loading,
                    avatar,
                    title,
                    paragraph,
                    active,
                    row
                } = this.$props

                if (loading) {
                    // 状态统一处理
                    const status = handlerStatusFun({ avatar, title, paragraph })

                    // avatar
                    const avatarNode = avatarHandler({ status: status.hasAvatar, nodeDom: (<div class={`${prefixCls}-header`}></div>) })

                    // content
                    const contentNode = contentHandler({
                        hasTitle: status.hasTitle,
                        hasParagraph: status.hasParagraph,
                        nodeDom: maxRow => (
                            <div class={`${prefixCls}-content`}>
                                { status.hasTitle && <Title prefixCls={prefixCls} active={active} /> }
                                { status.hasParagraph && <Paragraph prefixCls={prefixCls} rows={row <= maxRow ? row : maxRow } active={active} /> }
                            </div>
                        )
                    })

                    return (
                        <div class={ skeletonCls(active) }>
                            { avatarNode }
                            { contentNode }
                        </div>
                    )
                }

                // 显示正常内容
                return this.$scopedSlots.default()
            }
        }
    } else {
        console.log('react skeleton')
        // #!elseif isReact === true
        const {
            loading,
            avatar,
            title,
            paragraph,
            active,
            row
        } = props

        if (loading) {
            // 状态统一处理
            const status = handlerStatusFun({ avatar, title, paragraph })

            const contentNode = contentHandler({
                hasTitle: status.hasTitle,
                hasParagraph: status.hasParagraph,
                nodeDom: maxRow => (
                    <div className={`${prefixCls}-content`}>
                        { status.hasTitle && <TitleNode prefixCls={prefixCls} active={active} /> }
                        { status.hasParagraph && <ParagraphNode prefixCls={prefixCls} rows={row <= maxRow ? row : maxRow } active={active} /> }
                    </div>
                )
            })

            return (
                <div className={ skeletonCls(active) }>
                    { contentNode }
                </div>
            )
        }

        // REACT 组件
        return (
            <div>
                { props.children }
            </div>
        )
        // #!endif
    }
}

// export default Skeleton
