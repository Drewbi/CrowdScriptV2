export default ({ app, store }) => {
  app.$axios.setToken(false)
  let token = store.getters['auth/getToken']
  if (token) {
    app.$axios.setToken(token, 'Bearer')
    return store.dispatch('auth/checkUser')
  } else {
    token = app.$cookies.get('access_token')
    if (!token) return store.commit('auth/clearUser')
    app.$axios.setToken(token, 'Bearer')
    store.commit('auth/setToken', token)
    return store.dispatch('auth/checkUser')
  }
}
