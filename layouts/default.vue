<template>
  <v-app>
    <v-app-bar dark app>
      <v-btn class="menu-button" text nuxt to="/about">
        About
      </v-btn>
      <span class="divider">/</span>
      <v-btn class="menu-button" text nuxt to="/">
        Transcript
      </v-btn>
      <span v-if="isAdmin" class="divider">/</span>
      <v-btn v-if="isAdmin" class="menu-button" text nuxt to="/admin">
        Admin
      </v-btn>
      <v-spacer />
      <v-btn v-if="!isAuthenticated" class="menu-button" text nuxt to="/login">
        Login
      </v-btn>
      <v-btn v-else @click="logout" class="menu-button" text nuxt>
        Logout
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
      <v-snackbar
        v-model="errorBar"
        color="error"
      >
        {{ errorMessage }}
        <v-btn
          @click="errorBar = false"
          icon
          color="white"
        >
          <v-icon>close</v-icon>
        </v-btn>
      </v-snackbar>
    </v-main>
    <v-footer dark app>
      <span class="footerText">&copy; 2020 Because Language</span>
      <v-spacer />
      <span v-show="$vuetify.breakpoint.smAndUp" class="footerText">Made by <a href="https://www.github.com/Drewbi">Drew Alexander</a></span>
    </v-footer>
  </v-app>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  middleware: ['setAuth'],
  data() {
    return {
      errorBar: false
    }
  },
  computed: {
    ...mapGetters(['isError', 'errorMessage']),
    ...mapGetters({
      isAuthenticated: 'auth/isAuthenticated',
      isAdmin: 'auth/isAdmin'
    })
  },
  watch: {
    errorBar(newVal, oldVal) {
      if (!newVal && oldVal) this.setError('')
    },
    isError(newVal, oldVal) {
      if (newVal && !oldVal) this.errorBar = true
    }
  },
  methods: {
    ...mapMutations(['setError']),
    ...mapMutations({
      clearUser: 'auth/clearUser'
    }),
    logout() {
      this.clearUser()
      this.$router.push('/about')
    }
  }
}
</script>

<style scoped>
.divider {
  color: #444;
}

.menu-button {
  color: #888;
}

.menu-button::before {
  color: transparent
}

.menu-button:hover {
    color: white;
}

.footerText {
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  color: #888;
}

.footerText a {
  text-decoration: none;
}
</style>
