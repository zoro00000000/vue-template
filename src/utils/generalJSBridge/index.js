import axios from 'axios'
import * as WebviewTester from '../webviewTester'
import { 
    getNumInString,
    getJrAppVersion
} from '../tools'

const ua = navigator.userAgent.toLowerCase()
const isIos = WebviewTester.isAppleDevices()

/**
 * 辨别环境
 * 
 * @param {Function} jrFun： 金融app
 * @param {Function} jdFun: 京东app
 * @param {Function} h5Fun: h5页面
 * @returns 
 */
export const identifyStruts = (jrFun = () => {}, jdFun = () => {}, h5Fun = () => {}) => {
    if (WebviewTester.isInJdJrApp() && window.JrBridge) {
        return jrFun()
    } else if (WebviewTester.isInJdApp()) {
        return jdFun()
    } else {
        return h5Fun()
    }
}

/**
 * 通过 jsBridge 获取导航栏高度方法
 * 
 * @returns 
 */
export const getNavBarHeight = () => new Promise(resolve => {
    // 判别环境，三个方法顺序不可变！！！
    identifyStruts(
        // JR
        () => {
            // ? 金融app 内的桥方法
            console.log('Jr App')
            window.JrBridge.callNative({ type: '74' }, cbData => {
                let navBarHeight = 0
                if (!cbData.statusBarHeight) {
                    console.log(JSON.stringify(cbData))
                    navBarHeight = 0
                } else {
                    if (ua.indexOf('smartisan') > 0) cbData.navBarTotalHeightPx = cbData.navBarHeightPx

                    navBarHeight = cbData.navBarTotalHeightPx / window.devicePixelRatio
                }
                resolve(navBarHeight)
            })
        }, 
        // JD
        () => {
            console.log('Jd App')
            // ? 京东app 内的桥方法
            // '9.1.6'以上调用新方法，以下调用老方法
            const appVersion = getNumInString(window.JSSDK.Client.getAppVersion())
            if (appVersion >= 916) {
                window.getNaviHeightCallback = function (result) {
                    if (typeof result === 'string') {
                        result = JSON.parse(result)
                    }

                    // ios数据结构需要单独处理
                    if (isIos) {
                        result = result.data
                    }

                    const navigationHeight = result.navigationHeight || 0
                    const statusBarHeight = result.statusBarHeight || 0

                    resolve(parseInt(navigationHeight + statusBarHeight, 10))
                }

                if (isIos) {
                    window.webkit.messageHandlers.JDAppUnite.postMessage({
                        method: 'callRouterModuleWithParams',
                        params: {
                            routerURL: 'router://JDWebViewBusinessModule/getActualNaviStatusHeight', // required,必选参数
                            callBackName: 'getNaviHeightCallback'
                        }
                    })
                } else {
                    window.MobileNavi.getActualNaviStatusHeight('getNaviHeightCallback')
                }
            } else {
                console.log('版本太低 无法获取到导航栏高度')
                resolve(0)
            }
        }, 
        // H5
        () => {
            console.log('不是 JR、JD APP')
            resolve(0)
        }
    )
})

/**
 * 设置沉浸式头部
 * 
 * @param {*} config 
 * @returns 
 */
export const setNavBarFun = config => new Promise((resolve, reject) => {
    // ! 判别环境，三个方法顺序不可变！！！
    identifyStruts(
        // JR
        () => {
            console.log('jr app')
            // 默认属性
            const defaultConfig = {
                // 是否展示，右上角 更多icon
                moreItem: true,
                // 沉浸式头部参数
                transparentConfig: {
                    // 是否开启沉浸式
                    enable: true,
                    // 导航标题
                    title: document.title,
                    // 透明导航栏时的导航配置
                    normalConfig: {
                        naviIcon: 1, // int类型 设置返回、关闭、更多按钮以及文案颜色样式 【1-白；2-黑】仅支持 1 和 2 
                        showTitle: 1, // 是否展示标题 默认展示 0--不展示 1--展示
                        bgColor: '' // 背景色 默认透明 如果有背景色需求 就传 16进制字符 9位 前两位为透明度 例如：’#00FFFFFF‘
                    },
                    // 页面滚动时的导航配置 滚动及停止滚动后会变为 scrollConfig 时的配置，滚动到顶部恢复为 transparentConfig 配置
                    scrollConfig: {
                        naviIcon: 2, // int类型 设置返回、关闭、更多按钮以及文案颜色样式 【1-白；2-黑】仅支持 1 和 2
                        showTitle: 1, // 是否展示标题 默认展示
                        bgColor: '#FFFFFF' // 背景色 默认透明 如果有背景色需求 就传 16进制字符 9位 前两位为透明度 例如：’#00FFFFFF‘
                    }
                },
                rightItemList: config.rightItemList || []
            }

            // 金融APP NavBar 沉浸式
            const jrAppVersion = getJrAppVersion()
            if (jrAppVersion[0] >= 6) {
                window.JrBridge.setTopBar((config || defaultConfig), data => {
                    // ! 回调函数不会执行呢。
                    resolve(data)
                })
                resolve(true)
            } else {
                reject()
            }
        },
        // JD
        () => {
            // 京东 app
            console.log('jdapp setnavbarstyle')
            const navData = {
                canPull: '0',
                supportTran: '1',
                tranParams: {
                    backgroundColor: config.transBg || '#FFFFFF',
                    naviMenuType: config.naviMenuType || 'wb'
                },
                titleImgWidth: '200dp',
                callBackName: 'androidConfigNaviCB' // Android才需要，设置状态栏的回调
            }

            window.androidConfigNaviCB = function (params) {
                console.log('androidConfigNaviCB:', params)
                resolve(params)
            }

            // 设置滚动切换背景色
            // const transparentConfig = config ? config.transparentConfig : defaultConfig.transparentConfig
            // if (transparentConfig && transparentConfig.scrollConfig) {
            //     navData.tranParams.backgroundColor = transparentConfig.scrollConfig.bgColor || '#FFFFFF'
            // }

            // native('configNavigationBar', navData).then(res => {
            //     console.log('configNavigationBar', res)
            //     cb()
            // })
            
            const name = 'configNavigationBar'
            const newParams = typeof navData === 'object' ? JSON.stringify(navData) : navData
            // 当需要回调函数时，params参数一般为传递的函数名，且需要在window下注册方法，由客户端来调用
            window[newParams] = function (result) {
                resolve(result)
            }

            if (isIos) {
                // ios
                window.webkit.messageHandlers.MobileNavi.postMessage({
                    method: name,
                    params: newParams
                })
                console.log('newParams:', newParams)
                resolve(1)
            } else if (window.MobileNavi && window.MobileNavi[name]) {
                // android
                window.MobileNavi[name](newParams)
                resolve(2)
            } else {
                console.warn(`${name} 方法未找到或未定义`)
            }
        },
        // H5
        () => {
            console.log('不是 JR、JD APP')
            resolve(0)
        }
    )
})

/**
 * 获取 金口令 接口方法
 * * 金口令跟 京口令底层一样，所以通用于 京东 app
 * 
 * @param {*} config 
 * @returns 
 */
export const getJingCode = config => new Promise((resolve, reject) => {
    // console.log('process.env.VUE_APP_BUILD_ENV', process.env.VUE_APP_BUILD_ENV, process.env.NODE_ENV)
    const baseUrl = process.env.VUE_APP_BUILD_ENV === 'prod' ? '//ms.jr.jd.com' : '//msinner.jr.jd.com'

    // axios.get(`${baseUrl}/gw/generic/jrm/h5/m/build`, {
    //     reqData: config
    // }).then(res => {
    //     console.log(res)
    //     resolve(res)
    // }).catch(e => {
    //     console.log(e)
    //     reject(e)
    // })

    axios({
        method: 'get',
        url: `${baseUrl}/gw/generic/jrm/h5/m/build`,
        params: {
            reqData: config
        }
    }).then(res => {
        console.log(res)
        resolve(res)
    }).catch(e => {
        console.log(e)
        reject(e)
    })
})

/**
 * 新开 view 打开页面统一方法
 * @param {String} jumpUrl：需要打开的链接 URL 
 */
export const openView = jumpUrl => {
    identifyStruts(
        // JR
        () => {
            // 如果 url 带有 # 号 则需要中转
            if (jumpUrl.indexOf('#') > 0) {
                const url = encodeURIComponent(jumpUrl)
                jumpUrl = `https://bao.tjjt360.com/experience/insurance_business/gold_shop/holiday_insurance/transform?backUrl=${url}`
            }
            const defaultConfig = {
                target: jumpUrl,
                container: RegExp('http').test(jumpUrl) ? 'h5' : 'native',
                islogin: true,
                wallet: '',
                productId: '',
                isclose: false
            }
            window.JrBridge.openView(defaultConfig)
        },
        // JD
        () => {
            const defaultConfig = {
                category: 'jump',
                des: 'm',
                url: jumpUrl
            }
            window.location.href = `openApp.jdMobile://virtual?params=${encodeURIComponent(JSON.stringify(defaultConfig))}`
        },
        // h5
        () => {
            console.log('h5 url', jumpUrl)
            // if (jumpUrl.indexOf('http') !== -1) {
            //     window.location.href = jumpUrl
            // }
            if (RegExp('http').test(jumpUrl)) {
                window.location.href = jumpUrl
            }
        }
    )
}

/**
 * 分享方法
 * @param {*} config 
 */
export const jdAppShare = config => new Promise(resolve => {
    identifyStruts(
        // JR
        () => {
            // TODO: 方法已废弃
            // window.JrBridge.setShareConfig(config, data => {
            //     // 这里是回调
            //     resolve(data)
            // })
            resolve(true)
        },
        // JD
        () => {
            const defaultConfig = {
                title: document.title,
                content: document.title,
                url: window.location.href,
                img: 'https://m.360buyimg.com/n1/s120x120_jfs/t2566/341/1119128176/23675/6356333b/568e3d86Naa36a750.jpg', // 即使只分享到小程序，仍然要配置img参数
                channel: 'Wxfriends, Wxmoments',
                mpId: 'gh_45b306365c3d',
                mpIconUrl: 'https://m.360buyimg.com/babel/jfs/t21268/47/5908233/95730/e4ed3dff/5af4fc8bN4c4190d0.jpg',
                // 小程序页面 路径 仅H5落地页需要encodeURIComponent
                // mpPath: `/pages/h5/index?encode_url=${encodeURIComponent('https://ctap.m.jd.com/babelDiy/Zeus/4H78szWRVuUegyuLVJLTLpMSzfUb/index.html')}`,
                mpType: '0' // 正式
            }

            const newConfig = { ...defaultConfig, ...config }
            window.jdshare.setShareInfo(newConfig)
        },
        // H5
        () => {
            // 不需要分享功能
            resolve(true)
        }
    )
})
