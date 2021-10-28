import './index.scss'

export default {
    name: 'JsxBox',
    data () {
        return {
            title: 'jsx 组件页面',
            text: '这是个 jsx 组件测试',
            btnText: '这是个按钮',
            count: 0
        }
    },
    props: {
        val: {
            type: String,
            default: 'props val 1'
        }
    },
    mounted () {
        console.log('组件实例化')
    },
    methods: {
        clickEvent () {
            console.log('点击了某个 DOM', this.$data.count += 1)
        }
    },
    watch: {
        count: {
            deep: true,
            handler (val) {
                console.log('count change:', val)
            }
        }
    },
    render () {
        const { 
            title, 
            text,
            btnText,
            count
        } = this
        
        console.log('这里是jsx')
        console.log(this.val)

        return (
            <div class="jsx_container" >
                <div class="jsx_title">{ title }</div>

                <p class="jsx_p">{ `${text} - ${count}` }</p>

                <div class="jsx_button" onClick={() => this.clickEvent()}>{ btnText }</div>

                { this.$scopedSlots.default() }
            </div>
        )
    }
}
