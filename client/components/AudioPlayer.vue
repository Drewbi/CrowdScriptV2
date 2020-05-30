<template>
  <v-sheet
    class="d-flex align-center justify-center container"
    color="primary"
    tile
  >
    <v-btn
      @click="playButtonClicked"
      :aria-checked="playing"
      :data-playing="playing"
      class="button primary"
      role="switch"
      text
      fab
      large
    >
      <v-icon color="white">
        {{ playing ? 'pause' : 'mdi-play' }}
      </v-icon>
    </v-btn>
    <visualiser id="visualiser" :data="waveData" :time="time" :currentTime="currentTime" @seek="skipTo" />
    <audio ref="audioSource" :src="src" @ended="playing = false" type="audio/mpeg" crossOrigin="anonymous" />
    <v-btn text large color="white">
      <p class="font-weight-bold ma-0">
        Submit
      </p>
    </v-btn>
  </v-sheet>
</template>

<script>
import AudioVisualiser from '../components/AudioVisualiser.vue'

export default {
  components: {
    visualiser: AudioVisualiser
  },
  props: {
    time: {
      type: Object,
      required: true
    },
    src: {
      type: String,
      required: true
    }
  },
  data: () => ({
    context: null,
    audioElem: null,
    analyser: null,
    playing: false,
    currentTime: 0,
    intervalId: -1,
    waveData: [...new Array(100)].map(() => Math.random()),
    dataArray: null
  }),
  watch: {
    currentTime(value) {
      if (value > this.time.end / 1000) {
        this.audioElem.pause()
        this.playing = false
        this.audioElem.currentTime = this.time.start / 1000
      }
    }
  },
  mounted() {
    this.context = new AudioContext()
    this.audioElem = this.$refs.audioSource
    this.audioElem.currentTime = this.time.start / 1000
    const track = this.context.createMediaElementSource(this.audioElem)
    this.analyser = this.context.createAnalyser()
    this.analyser.minDecibels = -90
    this.analyser.maxDecibels = -10
    this.analyser.fftSize = 256
    const bufferLength = this.analyser.frequencyBinCount
    this.dataArray = new Uint8Array(bufferLength)
    track.connect(this.analyser)
    this.analyser.connect(this.context.destination)
    this.refreshTime()
  },
  methods: {
    playButtonClicked() {
      if (this.context.state === 'suspended') {
        this.context.resume()
      }
      // play or pause track depending on state
      if (!this.playing) {
        this.playAudio()
      } else {
        this.pauseAudio()
      }
    },
    refreshTime() {
      const self = this
      this.intervalId = setInterval(() => {
        this.currentTime = self.audioElem.currentTime
        const duration = this.time.end / 1000 - this.time.start / 1000
        this.analyser.getByteFrequencyData(this.dataArray)
        this.waveData[Math.round(((this.currentTime - this.time.start) / 1000 / duration) * 100)] = this.dataArray.reduce((acc, value, index) => (acc + value) / index)
      }, 10)
    },
    playAudio() {
      this.audioElem.play()
      this.playing = true
      this.refreshTime()
    },
    pauseAudio() {
      this.audioElem.pause()
      this.playing = false
      clearInterval(this.intervalId)
      this.intervalId = -1
    },
    skipTo(time) {
      this.audioElem.currentTime = time
      if (!this.playing) this.playAudio()
    }
  }
}
</script>

<style scoped>
  .button {
    border: none;
    color: white;
    padding: 10px 20px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 14px;
    margin: 4px 2px;
    cursor: pointer;
  }

  .container {
    position: absolute;
    bottom: 0;
    left: 0;
    min-width: 100vw;
    height: 100px;
  }

  #visualiser {
    height: 100%;
    width: calc(50vw - 50px);
    margin: 0 20px;
  }
</style>
