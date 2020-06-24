export default ({ store, redirect }) => {
  // If the user is not authenticated, redirect
  store.getters['auth/isAuthenticated'] ? console.log('Is logged') : console.log('Not loggd')
}
