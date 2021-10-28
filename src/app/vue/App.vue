<template>
    <div class="app-container">
        <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        
        <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
</template>

<script>
    export default {
        data () {
            return {}
        },
        methods: {

        }
    }
</script>

<style lang="scss">
@import './assets/style/main.scss';
html {
    background-color: #F5F8FC;
}
.app-container {
    font-size: 0.2rem;
}
</style>
