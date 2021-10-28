import Paragraph from './Paragraph'
import Title from './Title'
import './index.scss'

const Skeleton = {
    name: 'skeleton',
    props: {
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
    },
    components: {
        Paragraph,
        Title
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

        const prefixCls = 'skeleton'

        if (loading) {
            const hasAvatar = !!avatar
            const hasTitle = !!title
            const hasParagraph = !!paragraph

            // avatar
            let avatarNode
            if (hasAvatar) {
                avatarNode = (
                    <div class={`${prefixCls}-header`}>
                        {/* <Avatar {...avatarProps} /> */}
                    </div>
                )
            }

            // content
            let contentNode
            if (hasTitle || hasParagraph) {
                // 计算 row 的最大值
                const remainHidth = 100 - 12
                let maxRow = parseInt(remainHidth / (5.2), 10)

                console.log('maxRow:', maxRow)

                hasTitle && (maxRow -= 1)

                contentNode = (
                    <div class={`${prefixCls}-content`}>
                        { hasTitle && <Title prefixCls={prefixCls} active={active} /> }
                        { hasParagraph && <Paragraph prefixCls={prefixCls} rows={row <= maxRow ? row : maxRow } active={active} /> }
                    </div>
                )
            }

            // 骨架屏样式
            const skeletonCls = [
                `${prefixCls}-container`,
                `${prefixCls}-avatar`,
                active && `${prefixCls}-active`
            ]

            return (
                <div class={skeletonCls}>
                    { avatarNode }
                    { contentNode }
                </div>
            )
        }

        // 显示正常内容
        return this.$scopedSlots.default()
    }
}

export default Skeleton
