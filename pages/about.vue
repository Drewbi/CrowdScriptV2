<template>
  <v-row>
    <v-col>
      <h2>
        Thanks for helping us transcribe episodes of Because Language!
      </h2>
      <p>Your work will help more people enjoy our shows.</p>
      <h3>How to transcribe</h3>
      <ol>
        <li>Listen to the short piece of an episode provided.</li>
        <li>Correct the text, so it matches the words you hear. If there's crosstalk, just disentangle it the best you can.</li>
        <li>If you feel confident with adding punctuation, go ahead. Otherwise, just get the words. We'll add all of the punctuation later.</li>
      </ol>
      <v-btn :to="isAdmin ? '/' : '/register'" color="primary" class="mt-5">
        Get started
      </v-btn>
    </v-col>
    <v-alert
      :value="isUnsupported"
      color="orange"
      dismissible
      type="info"
      dense
    >
      Audio functionality for your browser is not yet supported and may not work as intended. Some desyncing may occur. Please consider Chrome or Firefox until this is fixed.
    </v-alert>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      isAdmin: 'auth/isAdmin'
    }),
    isUnsupported() {
      if (process.client) {
        const isFirefox = typeof InstallTrigger !== 'undefined'
        const isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime)
        return !isFirefox && !isChrome
      }
      return false
    }
  }
}
</script>
