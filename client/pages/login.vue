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
import { mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  middleware: ['notAuthenticated'],
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
  computed: {
    ...mapGetters({
      isAdmin: 'auth/isAdmin'
    })
  },
  methods: {
    ...mapActions({
      logIn: 'auth/logIn'
    }),
    ...mapMutations(['setError']),
    register() {
      this.$router.push('/register')
    },
    postLogin: async function (e) {
      e.preventDefault()
      try {
        const response = await this.logIn({ email: this.email, password: this.password })
        if (!response) this.setError('Login failed.')
        else this.isAdmin ? this.$router.push('/admin') : this.$router.push('/')
      } catch (err) {
        this.setError('Login failed.')
      }
    }
  }
}
</script>
