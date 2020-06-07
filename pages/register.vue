<template>
  <v-container class="mt-5" style="width:calc(200px + 20vw)">
    <v-row>
      <v-col>
        <v-form
          ref="form"
          v-model="valid"
          @submit="postRegister"
          class="d-flex flex-column"
        >
          <v-text-field
            v-model="name"
            :rules="nameRules"
            label="Name"
            hint="This is how you will be credited"
            outlined
            required
          />

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

          <v-text-field
            v-model="confirmPassword"
            :rules="[
              v => !!v || 'Please confirm your password',
              v => v === password || 'Passwords do not match'
            ]"
            type="password"
            label="Confirm Password"
            outlined
            required
          />

          <v-checkbox
            v-model="credit"
            class="ma-0"
            label="Would you like to be credited?"
          />

          <v-btn
            :disabled="!valid"
            type="submit"
            color="primary"
            class="d-inline"
          >
            Register
          </v-btn>
          <v-btn
            @click="$router.push('/login')"
            text
            color="primary"
            class="d-inline"
          >
            Have an account?
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
    name: '',
    nameRules: [
      v => !!v || 'Name is required'
    ],
    email: '',
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
    ],
    password: '',
    passwordRules: [
      v => !!v || 'Password is required'
    ],
    confirmPassword: '',
    confirmPasswordRules: [
      v => !!v || 'Please confirm your password'
    ],
    credit: true
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
    postRegister: async function (e) {
      e.preventDefault()
      this.$nuxt.$loading.start()
      try {
        const response = await this.$axios.post('/api/user', { name: this.name, email: this.email, password: this.password, credit: this.credit })
        if (!response) {
          this.setError('Sign-up failed')
          this.$nuxt.$loading.fail()
        } else {
          this.logIn()
          const loginResponse = await this.logIn({ email: this.email, password: this.password })
          if (!loginResponse) {
            this.setError('Auto login failed, Please try again')
            this.$nuxt.$loading.fail()
            this.$router.push('/login')
          }
          this.$router.push('/')
        }
      } catch (err) {
        if (err.response.status === 409) this.setError(err.response.data.message)
        else this.setError('Sign-up failed')
        this.$nuxt.$loading.fail()
      }
      this.$nuxt.$loading.finish()
    }
  }
}
</script>
