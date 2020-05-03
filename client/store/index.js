const Cookies = require('js-cookie')

export const state = () => ({
  error: ''
})

export const getters = {
  isError: (state) => {
    return state.error !== ''
  },
  errorMessage: (state) => {
    return state.error
  },
  isAuthenticated: (state) => {
    return Cookies.get('access_token')
  }
}

export const mutations = {
  setError(state, errorMessage) {
    state.error = errorMessage
  }
}
