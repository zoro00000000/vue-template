// import { Tab, Tabs } from 'vant'
// 引入组件
import GoodsItem from './item'

// 引入样式
import './index.scss'

// 瀑布流组件
export default {
    name: 'masonry',
    components: {
        GoodsItem
    },
    data () {
        return {
            list: []
        }
    },
    created () {
        let i = 0
        while (i < 10) {
            const itemData = {}
            this.list.push(itemData)
            i++
        }
    },
    mounted () {
        const masonryRef = this.$refs.masonryRef
        const items = masonryRef.children

        window.onload = () => {

        }
    },
    methods: {
        // 瀑布流方法
        waterFall () {

        },
        // 页面尺寸发生变化
        resizeWindow () {
            this.waterFall()
        },
        // clientWidth 兼容性
        getClient () {
            return {
                width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
                heigth: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
            }
        },
        // scrollTop 兼容性
        getScrollTop () {
            return window.pageYOffset || document.documentElement.scrollTop
        }
    },
    render () {
        const { list } = this
        return (
            <div id="masonry" class="masonry-contianer" ref="masonryRef">
                <div class="masonry-content">
                    {
                        list.map((item, index) => {
                            const newKey = `goods-${index}`
                            return (
                                <GoodsItem data={item} key={newKey} />
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}
