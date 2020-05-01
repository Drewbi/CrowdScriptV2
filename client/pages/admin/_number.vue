<template>
  <div>
    episode {{ $route.params.number }}
  </div>
</template>

<script>
export default {
  validate({ params }) {
    // Must be a number
    return /^\d+$/.test(params.number)
  }
}
</script>
