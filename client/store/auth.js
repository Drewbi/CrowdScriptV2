export const state = () => ({
  user: null,
  token: ''
})

export const getters = {
  isAuthenticated: (state) => {
    return !!state.user
  },

  isAdmin: (state) => {
    return state.user && state.user.admin
  }
}

export const mutations = {
  setCreds(state, { expiry, token }) {
    state.token = token
    this.$cookies.set('access_token', token, {
      expires: new Date(expiry),
      sameSite: 'lax'
    })
  },

  setUser(state, user) {
    state.user = user
  },

  clearUser(state) {
    state.user = null
    this.$cookies.remove('access_token')
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
    const user = await dispatch('checkUser')
    if (user) return true
    else {
      commit('clearUser')
      return false
    }
  },

  async checkUser({ commit }) {
    try {
      const { data } = await this.$axios.get('/api/user/current')
      if (!data.user) return null
      commit('setUser', data.user)
      return data.user
    } catch (err) {
      return null
    }
  }
}
