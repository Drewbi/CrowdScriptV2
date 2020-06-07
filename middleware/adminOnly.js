export default ({ store, redirect }) => {
  if (!store.getters['auth/isAuthenticated']) return redirect('/login')
  if (!store.getters['auth/isAdmin']) return redirect('/about')
}
