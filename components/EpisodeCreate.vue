<template>
  <v-dialog v-model="dialogOpen" persistent max-width="600px">
    <v-card>
      <v-card-title class="pl-15 pr-3">
        New Episode
        <v-spacer />
        <v-btn @click="$emit('closeDialog')" color="error" text fab small>
          <v-icon>
            mdi-close
          </v-icon>
        </v-btn>
      </v-card-title>
      <v-form v-model="valid" class="px-15 pb-4">
        <v-container>
          <v-row>
            <v-text-field
              v-model="number"
              :rules="numberRules"
              name="number"
              label="Number"
              type="number"
              class="mr-5"
              style="width: 50px"
              outlined
            />
            <v-text-field
              v-model="title"
              :rules="titleRules"
              name="title"
              label="Title"
              outlined
            />
          </v-row>
          <v-row>
            <v-file-input
              v-model="audioFile"
              :rules="fileRules"
              accept="audio/mpeg, audio/mp3"
              prepend-icon="mdi-file-music-outline"
              label="Audio"
              outlined
            />
          </v-row>
          <v-row>
            <v-file-input
              v-model="srtFile"
              :rules="fileRules"
              accept="text/plain, .srt, .doc.srt"
              prepend-icon="mdi-script-text-outline"
              label="Subtitle"
              outlined
            />
          </v-row>
          <v-row>
            <v-btn :disabled="!valid" @click="uploadEpisode" color="primary">
              <v-progress-circular v-if="uploading" indeterminate size="22" width="3" />
              {{ uploading ? "" : "Create" }}
            </v-btn>
            <v-spacer />
            <p>
              {{ progressText }}
            </p>
          </v-row>
        </v-container>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'

export default {
  props: {
    dialogOpen: {
      type: Boolean,
      default: () => false
    }
  },
  data: () => ({
    uploading: false,
    number: null,
    title: '',
    audioFile: null,
    srtFile: null,
    progressText: '',
    valid: false,
    numberRules: [
      v => !!v || 'Number is required',
      v => /^[0-9]+$/.test(v) || 'Must be a number',
      v => v > 0 || 'Must be greater than 0',
      v => v < 10000 || 'Must be less than 10000'
    ],
    titleRules: [
      v => !!v || 'Title is required',
      v => (v || '').length < 60 || 'Max 60 characters'
    ],
    fileRules: [
      v => !!v || 'Please add a file',
      v => (v || {}).size < 1000000000 || 'File is too large'
    ]
  }),
  computed: {
    ...mapGetters({ getToken: 'auth/getToken' })
  },
  methods: {
    ...mapMutations(['setError']),
    async uploadEpisode() {
      this.uploading = true
      this.progressText = 'Getting srt upload link'
      const { url: srtUrl, key: srtKey } = await this.$axios.$post('/api/file', { contentType: 'text/plain' })
      this.progressText = 'Getting audio upload link'
      const { url: audioUrl, key: audioKey } = await this.$axios.$post('/api/file', { contentType: 'audio/mpeg' })
      // Prepare for big hack
      this.$axios.setToken(null)
      this.progressText = 'Uploading srt'
      await this.uploadFile(this.srtFile, 'text/plain', srtUrl)
      this.progressText = 'Uploading Audio'
      await this.uploadFile(this.audioFile, 'audio/mpeg', audioUrl)
      this.$axios.setToken(this.getToken)
      this.progressText = 'Creating episode'
      await this.$axios.post('/api/episode', {
        number: this.number,
        name: this.title,
        src: audioKey,
        srt: srtKey
      })
      this.uploading = false
      this.$emit('uploadComplete')
    },
    uploadFile(file, fileType, uploadUrl) {
      return this.$axios.put(uploadUrl, file, {
        headers: {
          'Content-Type': fileType
        }
      })
    }
  }
}
</script>
