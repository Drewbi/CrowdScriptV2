<template>
  <v-card flat>
    <v-card-title>Episodes</v-card-title>
    <v-list>
      <v-list-item v-if="episodes.length === 0">
        No Episodes
      </v-list-item>
      <v-list-item
        v-for="episode in episodes"
        :key="episode.number"
        :to="'admin/episode/' + episode._id"
        nuxt
      >
        <v-list-item-icon>
          {{ episode.number }}
        </v-list-item-icon>
        <v-list-item-content>
          {{ episode.name }}
        </v-list-item-content>
        <v-spacer />
        <v-list-item-content>
          {{ episode.completed ? 'Completed' : episode.submissions.length + '/' + episode.segments.length }}
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
export default {
  props: {
    episodes: {
      type: Array,
      default: () => []
    }
  }
}
</script>
