<template>
  <div v-if="audioSrc">
    hello
    <audio-player :time="time" :src="audioSrc" />
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
    segmentNumber: 0,
    text: '',
    time: null
  }),
  watch: {
    episodeId(value) {
      this.loadEpisode(value)
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.loadNext()
    })
  },
  methods: {
    ...mapMutations(['setError']),
    async loadNext() {
      this.$nuxt.$loading.start()
      try {
        const response = await this.$axios('/api/segment/next')
        const { episode, number, text, time } = response.data.segment
        this.episodeId = episode
        this.segmentNumber = number
        this.text = text
        this.time = time
      } catch (err) {
        this.setError('Loading failed, please try again')
        this.$nuxt.$loading.fail()
      }
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
        console.log(err)
      }
      this.$nuxt.$loading.finish()
    }
  }
}
</script>
