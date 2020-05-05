export const state = () => ({
  error: ''
})

export const getters = {
  isError: (state) => {
    return state.error !== ''
  },
  errorMessage: (state) => {
    return state.error
  }
}

export const mutations = {
  setError(state, errorMessage) {
    state.error = errorMessage
  }
}
