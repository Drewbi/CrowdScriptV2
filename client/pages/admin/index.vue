<template>
  <div>
    <v-list>
      <v-subheader>Episodes</v-subheader>
      <v-list-item v-if="episodes.length === 0">
        No Episodes
      </v-list-item>
      <v-list-item
        v-for="episode in notCompletedEpisodes"
        :key="episode.number"
      >
        <v-list-item-icon>
          {{ episode.number }}
        </v-list-item-icon>
        <v-list-item-content>
          {{ episode.name }}
        </v-list-item-content>
        <v-list-item-content>
          {{ episode.submissions.length + '/' + episode.segments.length }}
        </v-list-item-content>
      </v-list-item>
      <v-expansion-panels v-if="completedEpisodes.length > 0">
        <v-expansion-panel>
          <v-expansion-panel-header>Completed Episodes</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-list-item
              v-for="episode in completedEpisodes"
              :key="episode.number"
            >
              <v-list-item-icon>
                {{ episode.number }}
              </v-list-item-icon>
              <v-list-item-content>
                {{ episode.name }}
              </v-list-item-content>
              <v-list-item-content>
                {{ episode.segments.length }}
              </v-list-item-content>
            </v-list-item>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-list>
    <v-list>
      <v-subheader>Users</v-subheader>
      <v-list-item
        v-for="(user, i) in users"
        :key="i"
      >
        <v-list-item-content>
          {{ user.name }}
        </v-list-item-content>
        <v-list-item-content>
          {{ user.email }}
        </v-list-item-content>
        <v-list-item-content>
          <v-checkbox v-model="user.credit" label="Credit" disabled />
        </v-list-item-content>
        <v-list-item-content>
          <v-list-item-title>
            {{ user.admin ? 'Admin' : '' }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
export default {
  middleware: ['adminOnly'],
  data: () => ({
    episodes: [],
    users: [],
    submissions: []
  }),
  computed: {
    notCompletedEpisodes() {
      return this.episodes.filter(episode => !episode.completed)
    },
    completedEpisodes() {
      return this.episodes.filter(episode => episode.completed)
    }
  },
  async mounted() {
    const userPromise = this.$axios.get('/api/user')
    const episodePromise = this.$axios.get('/api/episode')
    const [userData, episodeData] = await Promise.all([userPromise, episodePromise])
    const { users } = userData.data
    const { episodes } = episodeData.data
    const { data: { segments } } = await this.$axios.get('/api/segment')
    const { data: { submissions } } = await this.$axios.get('/api/submission')
    episodes.forEach((episode) => {
      const episodeSegments = segments.filter(segment => segment.episode === episode._id)
      const episodeSubmissions = submissions.filter(submission => submission.episode === episode._id)
      episode.segments = episodeSegments
      episode.submissions = episodeSubmissions
    })
    this.users = users
    this.episodes = episodes
  }
}
</script>
