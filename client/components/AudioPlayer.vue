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
    <visualiser
      id="visualiser"
      :data="waveData"
      :startTime="startTime"
      :endTime="endTime"
      :currentTime="currentTime"
      @seek="skipTo"
    />
    <audio ref="audioSource" :src="src" @ended="playing = false" type="audio/mpeg" crossOrigin="anonymous" />
    <v-btn @click="$emit('submit')" width="100px" text large color="white">
      <v-progress-circular v-if="submitting" indeterminate />
      <p v-else class="font-weight-bold ma-0">
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
    startTime: {
      type: Number,
      default: 0
    },
    endTime: {
      type: Number,
      default: 0
    },
    submitting: {
      type: Boolean,
      default: false
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
      if (value > this.endTime / 1000) {
        this.audioElem.pause()
        this.playing = false
        this.audioElem.currentTime = this.startTime / 1000
      }
    },
    startTime(value) {
      this.waveData = this.generateFakeWave()
      this.audioElem.currentTime = this.startTime / 1000
    }
  },
  mounted() {
    this.context = new AudioContext()
    this.audioElem = this.$refs.audioSource
    this.audioElem.currentTime = this.startTime / 1000
    const track = this.context.createMediaElementSource(this.audioElem)
    this.analyser = this.context.createAnalyser()
    this.analyser.minDecibels = -90
    this.analyser.maxDecibels = -10
    this.analyser.fftSize = 256
    const bufferLength = this.analyser.frequencyBinCount
    this.dataArray = new Uint8Array(bufferLength)
    this.waveData = this.generateFakeWave()
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
    generateFakeWave() {
      return [...new Array(100)].map(() => Math.random())
    },
    refreshTime() {
      const self = this
      this.intervalId = setInterval(() => {
        this.currentTime = self.audioElem.currentTime
        const duration = this.endTime / 1000 - this.startTime / 1000
        this.analyser.getByteFrequencyData(this.dataArray)
        this.waveData[Math.round(((this.currentTime - this.startTime) / 1000 / duration) * 100)] = this.dataArray.reduce((acc, value, index) => (acc + value) / index)
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
