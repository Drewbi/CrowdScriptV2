<template>
  <canvas id="canvas" ref="canvas" @click="skipTo" width="800px" height="200px" />
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      required: true
    },
    time: {
      type: Object,
      required: true
    },
    currentTime: {
      type: Number,
      required: true
    }
  },
  data: () => ({
    canvas: null,
    duration: 0
  }),
  watch: {
    currentTime() {
      this.displayData()
    }
  },
  mounted() {
    this.canvas = this.$refs.canvas
    this.duration = this.time.end / 1000 - this.time.start / 1000
    this.displayData()
    console.log(this.data)
  },
  methods: {
    skipTo(e) {
      const rect = this.canvas.getBoundingClientRect()
      const percentage = (e.clientX - rect.x) / rect.width
      this.$emit('seek', this.time.start / 1000 + this.duration * percentage)
    },
    displayData() {
      const ctx = this.canvas.getContext('2d')
      const canvasWidth = this.canvas.width
      const canvasHeight = this.canvas.height
      ctx.clearRect(0, 0, canvasWidth, canvasHeight)
      const maxHeight = 0.9
      const currentPerc = (this.currentTime - this.time.start / 1000) / this.duration
      this.data.forEach((height, index) => {
        const x = (((canvasWidth - 10) / this.data.length) * index) + 5
        const yOffset = canvasHeight / 2 * this.data[index] * maxHeight
        ctx.beginPath()
        ctx.moveTo(x, canvasHeight / 2 - yOffset)
        ctx.lineTo(x, canvasHeight / 2 + yOffset)
        const strokePerc = index / this.data.length
        ctx.strokeStyle = strokePerc >= currentPerc ? '#fff' : '#226688'
        ctx.lineWidth = 2
        ctx.stroke()
      })
    }
  }
}
</script>
