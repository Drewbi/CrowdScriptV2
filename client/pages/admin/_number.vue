<template>
  <div>
    <v-breadcrumbs :items="breadcrumbs" />
    <v-container v-if="!loading">
      <v-row align="center">
        <v-progress-circular :value="progress" color="primary" size="100" width="15">
          {{ submissions.length + '/' + segments.length }}
        </v-progress-circular>
        <h1 class="ml-5">
          {{ episode.number + " - " + episode.name }}
        </h1>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  middleware: ['adminOnly'],
  validate({ params }) {
    // Must be a number
    return /^\d+$/.test(params.number)
  },
  data() {
    return {
      loading: true,
      episode: null,
      segments: [],
      submissions: [],
      breadcrumbs: [{
        text: 'Back',
        disabled: false,
        href: '/admin'
      },
      {
        text: 'Episode ' + this.$route.params.number,
        disabled: true
      }]
    }
  },
  computed: {
    progress() {
      return (this.submissions.length / this.segments.length) * 100
    }
  },
  mounted() {
    this.$nextTick(async () => {
      this.$nuxt.$loading.start()
      try {
        const episodeRes = await this.$axios.get('/api/episode/' + this.$route.params.number)
        if (episodeRes.status === 404) {
          this.$nuxt.$loading.fail()
          this.setError('Episode not found')
          this.$router.push('/admin')
        }
        const { episode: [episode] } = episodeRes.data
        this.episode = episode
      } catch (err) {
        console.log(err)
        this.$nuxt.$loading.fail()
      }
      const segmentRes = await this.$axios.get('/api/segment/episode/' + this.episode._id)
      if (segmentRes.status === 200) {
        const { segments } = segmentRes.data
        this.segments = segments
      }
      const submissionRes = await this.$axios.get('/api/submission/episode/' + this.episode._id)
      if (submissionRes.status === 200) {
        const { submissions } = submissionRes.data
        this.submissions = submissions
      }
      this.$nuxt.$loading.finish()
      this.loading = false
    })
  },
  methods: {
    ...mapMutations(['setError'])
  }
}
</script>
