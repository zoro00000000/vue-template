/**
 * ! 路由
 * ? test
 * @param {}
 */

const testComponent = () => import('../../pages/test')

const router = [
    {
        path: '/test',
        name: '/test',
        component: testComponent,
        meta: {
            keepAlive: false,
            title: 'test 项目页面'
        }
    }
]

export default router
