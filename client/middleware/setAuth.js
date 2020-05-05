const Cookies = require('js-cookie')

export default ({ store }) => {
  if (!store.getters['auth/isAuthenticated']) {
    const token = Cookies.get('access_token')
    if (token) store.dispatch('auth/checkUser')
  }
}
