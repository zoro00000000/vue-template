const user = {
    // 是否对应 模块名 响应数据
    namespaced: true,
    // namespace: true,
    saveStore: true,
    state: {
        userInfo: {}
    },
    getters: {
        userInfo: state => state.userInfo
    },
    actions: {
        setUserInfo: ({ commit }, data) => {
            commit('SET_USER_INFO', data)
        }
    },
    mutations: {
        SET_USER_INFO (state, commonData) {
            state.userInfo = commonData
        }
    }
}

export default user
