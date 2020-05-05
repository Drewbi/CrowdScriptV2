export default ({ store, redirect }) => {
  // If the user is an admin
  if (!store.state.auth.admin) {
    if (!store.state.auth.user) return redirect('/login')
    return redirect('/about')
  }
}
