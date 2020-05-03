<template>
  <v-app>
    <v-app-bar dark app>
      <v-btn class="menu-button" text nuxt to="about">
        About
      </v-btn>
      <span class="divider">/</span>
      <v-btn class="menu-button" text nuxt to="/">
        Transcript
      </v-btn>
      <v-spacer />
      <v-btn class="menu-button" text nuxt to="login">
        Login
      </v-btn>
    </v-app-bar>
    <v-content>
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
    </v-content>
    <v-footer dark app>
      <span>&copy; 2020 Because Language</span>
    </v-footer>
  </v-app>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  data() {
    return {
      errorBar: false
    }
  },
  computed: {
    ...mapGetters(['isError', 'errorMessage'])
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
    ...mapMutations(['setError'])
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
</style>
