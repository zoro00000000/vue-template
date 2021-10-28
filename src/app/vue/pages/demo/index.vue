<template>
    <div class="demo-container">
        <div class="demo-title">demo 项目页面</div>
        <div class="demo-img">
            <img src="../../assets/img/person.png" />
        </div>
        <div class="demo-btn" @click="jumpPage('/test')">点击跳转到 test 页面</div>
        <div class="demo-btn" @click="jumpPage('/')">点击跳转到 main 页面</div>
        <div class="demo-icon"></div>
    </div>
</template>

<script>
    export default {
        components: {},
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
    .demo-container {
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: aliceblue;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .demo-title {
            font-size: 32px;
            color: #000000;
        }

        .demo-img {
            margin: 20px 0;

            img {
                width: 200px;
                height: 200px;
            }
        }

        .demo-btn {
            font-size: 32px;
            margin-top: 16px;
            color: #999999;
        }

        .demo-icon {
            margin-top: 20px;
            width: 250px;
            height: 250px;
            background: url('../../assets/img/success_img.png') 100% / 100% no-repeat;
        }
    }
</style>
