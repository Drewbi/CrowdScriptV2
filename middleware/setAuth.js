export default async ({ app, store }) => {
  if (!store.getters['auth/isAuthenticated']) {
    const token = app.$cookies.get('access_token')
    if (token) {
      await store.dispatch('auth/checkUser')
    }
  }
}
