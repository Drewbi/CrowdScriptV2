<template>
  <div v-if="audioSrc">
    <v-card-title>{{ `Episode ${episode.number}: ${episode.name}` }}</v-card-title>
    <v-textarea v-model="text" :hint="'Change Distance: ' + textDistance" auto-grow outlined />
    <audio-player :startTime="time.start" :endTime="time.end" :src="audioSrc" :submitting="submitProgress" @submit="submitText" />
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import AudioPlayer from '../components/AudioPlayer.vue'
export default {
  middleware: ['authenticated'],
  components: {
    'audio-player': AudioPlayer
  },
  data: () => ({
    episode: null,
    audioSrc: '',
    episodeId: '',
    segmentId: '',
    segmentNumber: 0,
    text: '',
    originalText: '',
    submitProgress: false,
    time: null
  }),
  computed: {
    textDistance() {
      if (this.originalText !== '' && this.text === '') return this.originalText.length
      const matrix = Array(this.originalText.length + 1).fill(0).map(val => Array(this.text.length + 1).fill(0))
      for (let i = 1; i < matrix.length; i++) {
        for (let j = 1; j < matrix[i].length; j++) {
          if (i - 1 === 0) matrix[i - 1][j] = j
          if (j - 1 === 0) matrix[i][j - 1] = i
          matrix[i][j] = Math.min(
            matrix[i - 1][j] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j - 1] + (this.originalText[i] !== this.text[j] ? 1 : 0)
          )
        }
      }
      return matrix[this.originalText.length][this.text.length]
    }
  },
  watch: {
    episodeId(value) {
      this.loadEpisode(value)
    }
  },
  async asyncData({ app }) {
    const { segment: { episode: episodeId, number, text, time, _id } } = await app.$axios.$get('/api/segment/next')
    const { episode } = await app.$axios.$get('/api/episode/' + episodeId)
    const audioResponse = await app.$axios.$get('/api/file/' + episode.src)
    return { episode, audioSrc: audioResponse.url, episodeId, segmentId: _id, segmentNumber: number, text, originalText: text, time }
  },
  methods: {
    ...mapMutations(['setError']),
    async loadNext() {
      this.$nuxt.$loading.start()
      try {
        const response = await this.$axios('/api/segment/next')
        const { episode, number, text, time, _id } = response.data.segment
        this.episodeId = episode
        this.segmentId = _id
        this.segmentNumber = number
        this.text = text
        this.originalText = text
        this.time = time
      } catch (err) {
        this.setError('Loading failed, please try again')
        this.$nuxt.$loading.fail()
      }
      this.submitProgress = false
      this.$nuxt.$loading.finish()
    },
    async loadEpisode(episodeId) {
      try {
        const episodeResponse = await this.$axios('/api/episode/' + episodeId)
        this.episode = episodeResponse.data.episode
        const audioResponse = await this.$axios('/api/file/' + this.episode.src)
        this.audioSrc = audioResponse.data.url
      } catch (err) {
        this.$nuxt.$loading.fail()
        this.setError('Could not load episode data')
      }
      this.submitProgress = false
      this.$nuxt.$loading.finish()
    },
    submitText() {
      if (!this.submitProgress) {
        this.submitProgress = true
        this.$axios.post('/api/submission', { text: this.text, segment: this.segmentId, episode: this.episodeId }).then((res) => {
          this.loadNext()
        }).catch(() => {
          this.submitProgress = false
          this.setError('Submission failed, please try again')
        })
      }
    }
  }
}
</script>
