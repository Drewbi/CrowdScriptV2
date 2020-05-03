<template>
  <div>
    about
    cookies: {{ isAuthenticated }}
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['isAuthenticated'])
  }
}
</script>
