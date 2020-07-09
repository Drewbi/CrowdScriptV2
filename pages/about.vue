<template>
  <v-row>
    <v-col>
      {{ baseUrl }}
      <h2>
        Thanks for helping us transcribe episodes of Because Language!
      </h2>
      <p>Your work will help more people enjoy our shows.</p>
      <h3>How to transcribe</h3>
      <ol>
        <li>Listen to the short piece of an episode provided</li>
        <li>Correct the auto generated transcript where possible</li>
        <li>Submit when satisfactory, ambiguous punctuation and names will be corrected later</li>
      </ol>
      <v-btn :to="isAdmin ? '/' : '/register'" color="primary" class="mt-5">
        Get started
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      isAdmin: 'auth/isAdmin'
    })
  }
}
</script>
