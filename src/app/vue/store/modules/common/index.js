import state from './state'
import mutations from './mutations'
import * as getters from './getters'
import * as actions from './actions'

const common = {
    // 是否对应 模块名 响应数据
    namespaced: true,
    // namespace: true,
    saveStore: true,
    state,
    getters,
    actions,
    mutations
}

export default common
