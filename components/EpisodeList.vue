<template>
  <v-card flat>
    <v-card-title>
      Episodes
      <v-btn @click="$emit('openDialog')" class="mx-15" color="primary" small>
        <v-icon dense>
          mdi-plus
        </v-icon>
        Add Episode
      </v-btn>
    </v-card-title>
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
        <v-list-item-action>
          {{ episode.number }}
        </v-list-item-action>
        <v-list-item-content>
          {{ episode.name }}
        </v-list-item-content>
        <v-spacer />
        <v-list-item-content>
          {{ episode.completed ? 'Completed' : episode.submissions.length + '/' + episode.segments.length }}
        </v-list-item-content>
        <v-list-item-content>
          <v-checkbox v-model="episode.active" label="Active" class="px-5" disabled />
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
