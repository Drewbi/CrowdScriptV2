<template>
  <div>
    <v-breadcrumbs :items="breadcrumbs" />
    <v-container v-if="!loading">
      <v-row align="center" class="ml-1">
        <v-progress-circular :value="progress" color="primary" size="100" width="15">
          {{ submissions.length + '/' + segments.length }}
        </v-progress-circular>
        <h1 class="ml-5">
          {{ episode.number + " - " + episode.name }}
        </h1>
        <v-spacer />
        <v-checkbox v-model="isActive" :disabled="toggling" label="Active" class="px-5" />
      </v-row>
      <v-hover v-slot:default="{ hover }" class="mt-10">
        <v-textarea
          ref="textArea"
          :value="submissionText"
          @mouseover="textHint = 'Click to copy'"
          @mouseout="textHint = ''"
          @click="textClick"
          :hint="textHint"
          :persistent-hint="hover"
          readonly
          auto-grow
          outlined
        />
      </v-hover>
      <user-list :users="userCredits" :verbose="false" @copy="copyUsers" />
    </v-container>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import UserList from '~/components/UserList'

export default {
  middleware: ['adminOnly'],
  components: {
    'user-list': UserList
  },
  data: () => ({
    loading: true,
    toggling: false,
    episode: null,
    segments: [],
    submissions: [],
    users: [],
    textHint: 'Click to copy',
    breadcrumbs: [{
      text: 'Back',
      disabled: false,
      href: '/admin'
    },
    {
      text: '',
      disabled: true
    }]
  }),
  computed: {
    progress() {
      return (this.submissions.length / this.segments.length) * 100
    },
    submissionText() {
      return this.sortedSubmissions.reduce((prev, curr) => prev + ' ' + curr.text, '')
    },
    userCredits() {
      const userCopy = [...this.users]
      return userCopy.filter(user => user.submissions.length > 0).sort((a, b) => b.submissions.length - a.submissions.length)
    },
    sortedSubmissions() {
      return this.segments.map((segment) => {
        return this.submissions.find(submission => submission.segment === segment._id)
      }).filter(submission => !!submission)
    },
    isActive: {
      get: function () {
        return this.episode.active
      },
      set: function (newVal) {
        this.toggleActive(this.episode.number, newVal)
      }
    }
  },
  mounted() {
    this.$nextTick(async () => {
      this.$nuxt.$loading.start()
      try {
        const episodeRes = await this.$axios.get('/api/episode/' + this.$route.params.id)
        if (episodeRes.status === 404) {
          this.$nuxt.$loading.fail()
          this.setError('Episode not found')
          this.$router.push('/admin')
        }
        const { episode } = episodeRes.data
        this.episode = episode
        this.breadcrumbs[1].text = episode.number
      } catch (err) {
        this.setError('Failed to load episode')
        this.$nuxt.$loading.fail()
      }
      const segmentPromise = this.$axios.get('/api/segment/episode/' + this.episode._id)
      const submissionPromise = this.$axios.get('/api/submission/episode/' + this.episode._id)
      const userPromise = this.$axios.get('/api/user')
      const [segmentRes, submissionRes, userRes] = await Promise.all([segmentPromise, submissionPromise, userPromise])
      if (segmentRes.status === 200) {
        const { segments } = segmentRes.data
        segments.sort((seg1, seg2) => seg1.number - seg2.number)
        this.segments = segments
      }
      if (submissionRes.status === 200) {
        const { submissions } = submissionRes.data
        this.submissions = submissions
      }
      if (userRes.status === 200) {
        const { users } = userRes.data
        users.forEach((user) => {
          user.submissions = this.submissions.filter(submission => submission.user === user._id)
        })
        this.users = users
      }
      this.$nuxt.$loading.finish()
      this.loading = false
    })
  },
  methods: {
    ...mapMutations(['setError']),
    textClick() {
      navigator.clipboard.writeText(this.submissionText)
      this.textHint = 'Copied'
    },
    copyUsers() {
      const userText = this.userCredits.reduce((prev, curr) => prev + curr.name + ', ', '')
      navigator.clipboard.writeText(userText)
    },
    toggleActive(episodeNum, active) {
      this.toggling = true
      this.$axios.put('/api/episode', {
        number: episodeNum,
        active
      }).then((res) => {
        this.toggling = false
        if (res.status === 200) {
          this.episode.active = active
        }
      }).catch(() => {
        this.toggling = false
        this.setError('Failed to toggle Active status')
      })
    }
  }
}
</script>
