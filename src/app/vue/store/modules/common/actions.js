// 引入枚举数据
import * as types from './mutationTypes'

/**
 * set common data 
 * @param {*} param 
 * @param {*} data 
 */
export const setCommonData = ({ commit }, data) => {
    commit(types.SET_COMMON_DATA, data)
} 
