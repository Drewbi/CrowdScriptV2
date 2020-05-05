const Cookies = require('js-cookie')

export const state = () => ({
  admin: false,
  token: '',
  id: ''
})

export const getters = {
  isAuthenticated: (state) => {
    return state.id !== ''
  },

  isAdmin: (state) => {
    return state.admin
  }
}

export const mutations = {
  setCreds(state, { expiry, token }) {
    state.token = token
    Cookies.set('access_token', token, {
      expires: new Date(expiry)
    })
  },

  setUser(state, { _id, admin }) {
    state.id = _id
    state.admin = admin
  },

  clearUser(state) {
    state.admin = false
    state.token = ''
    state.id = ''
    Cookies.remove('access_token')
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
      const { _id, admin } = data.user
      if (!_id) return null
      commit('setUser', { _id, admin })
      return { _id, admin }
    } catch (err) {
      return null
    }
  }
}
