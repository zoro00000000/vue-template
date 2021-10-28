/* eslint-disable */
/* 
需要在 index.html 中 body 下引入以下 js
    <script language="JavaScript">
        // pin在script文件之前，pc端在*.jd.com域下无需添加，自动从cookie中获取，移动端必须传，如果pin被其他代码使用，可以使用jd_jr_td_risk_pin变量
        var pin = "服务器端加密以后的pin";
    </script>
    <!-- 注意：域名是 gia -->
    <script src="//gia.jd.com/m.html"></script>
    <!-- 注意：域名是 gias -->
    <script src="//gias.jd.com/js/m.js"></script>
*/

import {
    isWechat,
    isAppleDevices,
    isAndroidDevices
} from './webviewTester'

// 增加 appType
function addAppType (obj) {
    if (isWechat()) {
        // wechat_h5
        obj.appType = 10
    } else if (isAppleDevices()) {
        // IOS_h5
        obj.appType = 1
    } else if (isAndroidDevices()) {
        // android_h5
        obj.appType = 3
    } else {
        // h5
        obj.appType = 6
    }
    return obj
}

/**
 * 获取 sdkToken 方法
 *
 * @param {string} [bizid='JD-JDJK-YXHD']
 * @param {number} [timeNum=10]
 * @return {*} 
 */
const getSDKToken = (bizid = 'JD-JDJK-YXHD', timeNum = 10) => {
    const ua = navigator.userAgent.toLowerCase()
    // 产品提供
    const bp_bizid = bizid 
    let risk_jd
    let times = timeNum
    
    return new Promise((resolve, reject) => {
        const timer = setInterval(() => {
            times -= 1
            
            try {
                risk_jd = getJdEid()
                // 注意：调用getJdEid应该放在加载m.js之后
                // 如果在金融App或商城App打开，需要获取设备原生信息，建议使用以下方法，返回字段详见下方列表
                // (@20201118 huwei111备注：只调用getJdEid即可，不需要调用getEidJoint)
                // risk_jd = getEidJoint();
                
                // 在金融app 或者 京东app 内的时候才会有 sdkToken
                if (ua.includes('jdjr-app') || ua.includes('jdjr-app')) {
                    // console.log('京东/金融app环境：', times)
                    if (risk_jd.sdkToken) {
                        clearInterval(timer)
                        // 将数据存储到 sessionStorage 中
                        let str = JSON.stringify(addAppType(risk_jd))
                        // return str
                        resolve(str)
                    }
                } else {
                    // console.log('非京东/金融app环境：', times)
                    clearInterval(timer)
                    // 将数据存储到 sessionStorage 中
                    let str = JSON.stringify(addAppType(risk_jd))
                    // return str
                    resolve(str)
                }
            } catch (e) {
                // 出现异常没有数据的情况
            }
    
            if (times <= 0) {
                // console.log('已到0次返回结果不再循环')
                clearInterval(timer)
                // risk_jd = addAppType(risk_jd)
                // return risk_jd
                let str = JSON.stringify(addAppType(risk_jd))

                resolve(str)
            }
        }, 100)
    })
}

export default getSDKToken
