<template>
  <div
    class="d-flex justify-center pt-10"
  >
    <v-form
      ref="form"
      v-model="valid"
      @submit="postLogin"
      class="d-flex flex-column"
      style="width: calc(200px + 20vw);"
      lazy-validation
    >
      <v-text-field
        v-model="email"
        :rules="emailRules"
        type="email"
        label="E-mail"
        outlined
        required
      />

      <v-text-field
        v-model="password"
        :rules="passwordRules"
        type="password"
        label="Password"
        outlined
        required
      />

      <v-btn
        :disabled="!valid"
        type="submit"
        color="primary"
        class="d-inline"
      >
        Login
      </v-btn>
      <v-btn
        @click="register"
        text
        color="primary"
        class="d-inline"
      >
        Create Account
      </v-btn>
    </v-form>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
const Cookies = require('js-cookie')

export default {
  middleware: 'notAuthenticated',
  data: () => ({
    valid: true,
    email: '',
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
    ],
    password: '',
    passwordRules: [
      v => !!v || 'Password is required'
    ]
  }),
  methods: {
    ...mapMutations(['setError']),
    register() {
      this.$router.push('/register')
    },
    postLogin: async function (e) {
      e.preventDefault()
      try {
        const response = await this.$axios.post('/authentication', {
          email: this.email,
          password: this.password
        })
        Cookies.set('access_token', response.data.token)
        this.$router.push('/about')
      } catch (err) {
        console.log(err)
        this.setError('Login failed.')
      }
    }
  }
}
</script>
