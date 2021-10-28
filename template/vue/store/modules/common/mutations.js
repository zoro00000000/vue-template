import * as types from './mutationTypes'

const mutations = {
    [types.SET_COMMON_DATA] (state, commonData) {
        state.commonData = commonData
    }
}

export default mutations
