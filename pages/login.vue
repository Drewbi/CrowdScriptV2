<template>
  <v-container class="mt-5" style="width:calc(200px + 20vw)">
    <v-row>
      <v-col>
        <v-form
          ref="form"
          v-model="valid"
          @submit="postLogin"
          class="d-flex flex-column"
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
            @click="$router.push('/register')"
            text
            color="primary"
            class="d-inline"
          >
            Create Account
          </v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
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
    postLogin: async function (e) {
      e.preventDefault()
      this.$nuxt.$loading.start()
      try {
        const response = await this.logIn({ email: this.email, password: this.password })
        if (!response) {
          this.setError('Login failed')
          this.$nuxt.$loading.fail()
        } else {
          this.isAdmin ? this.$router.push('/admin') : this.$router.push('/')
        }
      } catch ({ response: { status, data } }) {
        if (status === 404 || status === 400) this.setError(data.message)
        else this.setError('Login failed')
        this.$nuxt.$loading.fail()
      }
      this.$nuxt.$loading.finish()
    }
  }
}
</script>
