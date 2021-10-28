/**
 * ! 路由
 * ? main
 * @param {}
 */

const mainComponent = () => import('../../pages/home')

const router = [
    {
        path: '*',
        name: '/main',
        component: mainComponent,
        meta: {
            keepAlive: false,
            title: 'vue 项目模板首页'
        }
    }
]

export default router
