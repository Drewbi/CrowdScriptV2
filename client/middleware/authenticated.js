export default ({ store, redirect }) => {
  // If the user is not authenticated, redirect
  if (!store.getters['auth/isAuthenticated']) return redirect('/login')
}
