export default {
    name: 'GoodsItem',
    props: {
        data: {
            type: Object,
            default () {
                return {}
            }
        }
    },
    render () {
        const { data } = this.$props
        return (
            <div class="item-container">
                <img src={ data.imgUrl && data.imgUrl } />
            </div>
        )
    }
}
