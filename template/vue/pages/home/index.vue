<template>
    <div class="main-container">
        <div class="main-title">Vue template main 首页</div>
        <div class="main-icon">
            <img src="../../assets/img/success_img.png" />
        </div>
        <div class="main-btn" @click="jumpPage('/test')">点击跳转到 test 页面</div>
        <div class="main-btn" @click="jumpPage('/demo')">点击跳转到 demo 页面</div>
        <div class="main-title">这就是首页哦 上传打包测试</div>
        <div class="main-img"></div>

        <JsxBox class="jsx-box">
            <p class="slot-p">slot 测试 1</p>
        </JsxBox>
    </div>
</template>

<script>
    import {
        // Lodash,
        GetSDKToken,
        // GeneralJSBridge,
        WebviewTester,
        Load
    } from '@utils/index'
    import JsxBox from '../jsxBox'
    // import configEnv from '../../config/dev.env'
    import { apiMain } from '../../api'
    
    export default {
        components: {
            JsxBox
        },
        created () {
            window.onload = () => {
                console.log('----- window onload -----')
                if (WebviewTester.isInJdJrApp()) {
                    Load.loadJS('https://m.jr.jd.com/common/jssdk/jrbridge/2.0.9/jrbridge.js').then(res => {
                        console.log('京东金融桥方法', res)
                        // 京东商城环境处理
                    })
                } else if (WebviewTester.isInJdApp()) {
                    Load.loadJS('https://storage.360buyimg.com/js-jdd/jd-jssdk.min.js').then(res => {
                        console.log('京东商城桥方法', res)
                        // 京东商城环境处理
                    })
                } else {
                    // 外部环境处理
                }

                this.init()
            }
        },
        methods: {
            // 初始化
            async init () {
                const bizid = 'JDJR-BT-CND'
                const sdkToken = await GetSDKToken(bizid)
                console.log(sdkToken)
            },
            apiFunDemo () {
                apiMain.mainDemoInfo({ data: 1 }).then(res => {
                    console.log(res)
                })
            },
            jumpPage (path) {
                this.$router.push({
                    path
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .main-container {
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: aliceblue;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .main-title {
            font-size: 36px;
            line-height: 48px;
            color: #000000;
            box-sizing: content-box;
        }

        .main-icon {
            margin: 10px 0;

            img {
                width: 200px;
                height: 200px;
            }
        }

        .main-btn {
            font-size: 32px;
            line-height: 40px;
            margin-top: 16px;
            color: #999999;
        }

        .main-img {
            margin-top: 20px;
            width: 150px;
            height: 150px;
            background: url('../../assets/img/test.jpg') 100% / 100% no-repeat;
        }

        .jsx-box {
            margin-top: 20px;

            .slot-p {
                font-size: 24px;
                color: green;
                line-height: 40px;
            }
        }
    }
</style>
