<template>
    <div class="test-container">
        <div class="test-title">test 页面</div>
        <div class="text-img">
            <img src="../../assets/img/test.jpg" />
        </div>
        <div class="test-btn" @click="jumpPage('/demo')">点击跳转到 demo 页面</div>
        <div class="test-btn" @click="jumpPage('/')">点击跳转到 main 页面</div>
        <div class="text-icon"></div>
    </div>
</template>

<script>
    export default {
        methods: {
            jumpPage (path) {
                this.$router.push({
                    path
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .test-container {
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: aliceblue;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .test-title {
            font-size: 32px;
            color: #000000;
        }

        .text-img {
            margin: 20px 0;

            img {
                width: 200px;
                height: 200px;
            }
        }

        .test-btn {
            font-size: 32px;
            margin-top: 16px;
            color: #999999;
        }

        .text-icon {
            margin-top: 20px;
            width: 150px;
            height: 150px;
            background: url('../../assets/img/success_img.png') 100% / 100% no-repeat;
        }
    }
</style>
