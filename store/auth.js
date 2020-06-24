export const state = () => ({
  user: null,
  token: ''
})

export const getters = {
  isAuthenticated: (state) => {
    return !!state.user && state.token && state.token.length !== 0
  },

  isAdmin: (state) => {
    return state.user && state.user.admin
  },

  getToken: (state) => {
    return state.token
  }
}

export const mutations = {
  setToken(state, token) {
    state.token = token
    this.$axios.setToken(token, 'Bearer', ['post', 'delete', 'get'])
  },

  setCreds(state, { expiry, token }) {
    state.token = token
    this.$cookies.set('access_token', token, {
      expires: new Date(expiry),
      sameSite: 'lax'
    })
    this.$axios.setToken(token, 'Bearer', ['post', 'delete', 'get'])
  },

  setUser(state, user) {
    state.user = user
  },

  clearUser(state) {
    state.user = null
    state.token = null
    this.$cookies.remove('access_token')
    this.$axios.setToken(false)
  }
}

export const actions = {
  async logIn({ commit, dispatch }, { email, password }) {
    const { data } = await this.$axios.post('/api/authentication', {
      email,
      password
    })
    const { token, expiry } = data
    if (!token) return false
    commit('setCreds', { expiry, token })
    this.$axios.setToken(token, 'Bearer', ['post', 'delete', 'get'])
    const user = await dispatch('checkUser')
    if (user) return true
    else {
      commit('clearUser')
      this.$axios.setToken(false)
      return false
    }
  },

  checkUser({ commit }) {
    return new Promise((resolve, reject) => {
      this.$axios.get('/api/user/current').then(({ data }) => {
        if (!data.user) {
          commit('clearUser')
          reject(Error('Failed to load user'))
        }
        commit('setUser', data.user)
        resolve(data.user)
      }).catch((err) => {
        commit('clearUser')
        reject(Error('Failed to load user:', err))
      })
    })
  }
}
