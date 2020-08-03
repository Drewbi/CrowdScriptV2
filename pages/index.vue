<template>
  <div>
    <v-alert
      :value="isUnsupported"
      color="orange"
      dismissible
      type="info"
      dense
    >
      Audio functionality for your browser is not yet supported and may not work as intended. Please use Chrome or Firefox.
    </v-alert>
    <div v-if="audioSrc">
      <v-card-title>{{ `Episode ${episode.number}: ${episode.name}` }}</v-card-title>
      <v-textarea v-model="text" :hint="'Change Distance: ' + textDistance" auto-grow outlined />
      <audio-player :startTime="time.start" :endTime="time.end" :src="audioSrc" :submitting="submitProgress" @submit="submitText" />
    </div>
    <div v-else class="d-flex flex-column justify-center align-center mt-10">
      <div
        v-text="message"
        class="text-h5 mb-10"
      />
      <v-img :src="getImage" max-width="200" />
    </div>
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
    },
    getImage() {
      return Math.random() > 0.5 ? '/image/undraw_order_confirmed_aaw7.svg' : '/image/undraw_sync_files_xb3r.svg'
    },
    isUnsupported() {
      if (process.client) {
        const isFirefox = typeof InstallTrigger !== 'undefined'
        const isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime)
        return !isFirefox && !isChrome
      }
      return false
    }
  },
  watch: {
    episodeId(value) {
      this.loadEpisode(value)
    }
  },
  async asyncData({ app, error }) {
    const res = await app.$axios.$get('/api/segment/next')
    if (res.message === 'All episodes complete') return { message: res.message }
    const { segment: { episode: episodeId, number: segmentNumber, text, time, _id: segmentId } } = res
    const { episode } = await app.$axios.$get('/api/episode/' + episodeId)
    const audioResponse = await app.$axios.$get('/api/file/' + episode.src)
    return { episode, audioSrc: audioResponse.url, episodeId, segmentId, segmentNumber, text, originalText: text, time }
  },
  methods: {
    ...mapMutations(['setError']),
    async loadNext() {
      this.$nuxt.$loading.start()
      try {
        const response = await this.$axios('/api/segment/next')
        if (response.data.message === 'All episodes complete' || response.data.message === 'All segments are allocated') return this.$router.go({ path: '/', force: true })
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
