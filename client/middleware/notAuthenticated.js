export default ({ store, redirect }) => {
  // If the user is authenticated, redirect
  if (store.getters['auth/isAuthenticated']) return redirect('/about')
}
