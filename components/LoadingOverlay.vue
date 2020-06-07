<template>
  <v-fade-transition>
    <v-overlay v-if="loading" absolute color="#fff" opacity="100%">
      <v-progress-circular indeterminate color="primary" size="100" width="10" />
    </v-overlay>
  </v-fade-transition>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      required: true
    }
  }
}
</script>
