import { fetch } from '../../../services/http'

const configEnv = require('@config/apiConfig')

let apiHostUrl = '//ms.jr.jd.com'

if (configEnv[process.env.VUE_APP_BUILD_ENV]) apiHostUrl = configEnv[process.env.VUE_APP_BUILD_ENV].HOST_API

/**
 * liong-cli
 * ?接口（0.0）统一路径接口
 * 测试接口
 * @export
 * @param {*} param
 * @returns
 */
export const mainDemoInfo = param => fetch.post({
    // url: `${apiHostUrl}/queryAgentMerchantBaseInfo`,
    url: '/gw/generic/bt/h5/m/queryBDStaffInfoByPin',
    // method: 'post',
    data: param
})

/**
 * liong-cli
 * ?接口（0.0）自定义路径接口
 * 测试接口
 * @export
 * @param {*} param
 * @returns
 */
export const mainDemoInfo2 = param => fetch.post({
    url: `${apiHostUrl}/queryAgentMerchantBaseInfo`,
    data: param
})
