<template>
  <div>
    <loading-overlay :loading="loading" />
    <episode-list :episodes="episodes" @openDialog="dialog=true" />
    <episode-dialog :dialogOpen="dialog" @closeDialog="dialog=false" @uploadComplete="handleUpload" />
    <user-list :users="users" />
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import EpisodeList from '~/components/EpisodeList'
import EpisodeCreate from '~/components/EpisodeCreate'
import UserList from '~/components/UserList'
import LoadingOverlay from '~/components/LoadingOverlay'

export default {
  middleware: ['adminOnly'],
  components: {
    'episode-list': EpisodeList,
    'episode-dialog': EpisodeCreate,
    'user-list': UserList,
    'loading-overlay': LoadingOverlay
  },
  data: () => ({
    episodes: [],
    users: [],
    submissions: [],
    loading: true,
    dialog: false
  }),
  async mounted() {
    try {
      const userPromise = this.$axios.get('/api/user')
      const episodePromise = this.$axios.get('/api/episode')
      const segmentPromise = this.$axios.get('/api/segment')
      const submissionPromise = this.$axios.get('/api/submission')
      const [userData, episodeData, segmentData, submissionData] = await Promise.all([userPromise, episodePromise, segmentPromise, submissionPromise])
      const { users } = userData.data
      const { episodes } = episodeData.data
      const { segments } = segmentData.data
      const { submissions } = submissionData.data
      segments.forEach((segment) => {
        const segmentSubmissions = submissions.filter(submission => submission.segment === segment._id)
        segment.submissions = segmentSubmissions
      })
      episodes.forEach((episode) => {
        const episodeSegments = segments.filter(segment => segment.episode === episode._id)
        const episodeSubmissions = []
        episodeSegments.forEach((segment) => {
          episodeSubmissions.push(...segment.submissions)
        })
        episode.segments = episodeSegments
        episode.submissions = episodeSubmissions
      })
      users.forEach((user) => {
        const userSubmissions = submissions.filter(submission => submission.user === user._id)
        user.submissions = userSubmissions
      })
      this.users = users
      this.episodes = episodes
      this.loading = false
    } catch (err) {
      this.setError(err.response.data.message)
      this.$router.push('/about')
    }
  },
  methods: {
    ...mapMutations(['setError']),
    openDialog() {
      this.dialog = true
    },
    closeDialog() {
      this.dialog = false
    },
    handleUpload() {
      this.closeDialog()
      this.$router.go()
    }
  }
}
</script>
