/**
 * ! 路由
 * ? demo
 * @param {}
 */

const demoComponent = () => import('../../pages/demo')

const router = [
    {
        path: '/demo',
        name: '/demo',
        component: demoComponent,
        meta: {
            keepAlive: false,
            title: 'demo 项目页面'
        }
    }
]

export default router
