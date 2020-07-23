<template>
  <div>
    <loading-overlay :loading="loading" />
    <episode-list :episodes="episodes" @openDialog="episodeDialog = true" />
    <episode-dialog :dialogOpen="episodeDialog" @closeDialog="episodeDialog = false" @uploadComplete="handleUpload" />
    <user-list :users="users" @deleteUser="handleUserDelete" />
    <ban-dialog :dialogOpen="userBanDialog" :user="bannedUser" @closeDialog="closeUserBanDialog" @confirmDelete="confirmUserBan" />
    <banned-users :users="bannedUsers" @unban="unbanUser" />
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import EpisodeList from '~/components/EpisodeList'
import EpisodeCreate from '~/components/EpisodeCreate'
import UserList from '~/components/UserList'
import BannedUsers from '~/components/BannedUsers'
import BanDialog from '~/components/BanDialog'
import LoadingOverlay from '~/components/LoadingOverlay'

export default {
  middleware: ['adminOnly'],
  components: {
    'episode-list': EpisodeList,
    'episode-dialog': EpisodeCreate,
    'user-list': UserList,
    'banned-users': BannedUsers,
    'ban-dialog': BanDialog,
    'loading-overlay': LoadingOverlay
  },
  data: () => ({
    loading: true,
    episodeDialog: false,
    userBanDialog: false,
    bannedUser: {}
  }),
  async asyncData({ app, redirect, error }) {
    const userPromise = app.$axios.$get('/api/user')
    const episodePromise = app.$axios.$get('/api/episode')
    const segmentPromise = app.$axios.$get('/api/segment')
    const submissionPromise = app.$axios.$get('/api/submission')
    const [
      { users: allUsers = [] },
      { episodes = [] },
      { segments = [] },
      { submissions = [] }
    ] = await Promise.all([userPromise, episodePromise, segmentPromise, submissionPromise])

    const users = allUsers.filter(user => !user.banned)
    const bannedUsers = allUsers.filter(user => user.banned)
    // Populate segments with submissions
    segments.forEach((segment) => {
      const segmentSubmissions = submissions.filter(submission => submission.segment === segment._id)
      segment.submissions = segmentSubmissions
    })

    // Populate episodes with segments and submissions
    episodes.forEach((episode) => {
      const episodeSegments = segments.filter(segment => segment.episode === episode._id)
      const episodeSubmissions = []
      episodeSegments.forEach((segment) => {
        episodeSubmissions.push(...segment.submissions)
      })
      episode.segments = episodeSegments
      episode.submissions = episodeSubmissions
    })

    // Populate users with submissions
    users.forEach((user) => {
      const userSubmissions = submissions.filter(submission => submission.user === user._id && !user.banned)
      user.submissions = userSubmissions
    })
    bannedUsers.forEach((user) => {
      user.submissions = []
    })

    return { users, bannedUsers, episodes, segments, submissions }
  },
  mounted() {
    this.loading = false
  },
  methods: {
    ...mapMutations(['setError']),
    handleUpload() {
      this.episodeDialog = false
      this.$router.go()
    },
    handleUserDelete(user) {
      this.bannedUser = user
      this.userBanDialog = true
    },
    closeUserBanDialog(value) {
      this.bannedUser = {}
      this.userBanDialog = false
    },
    async confirmUserBan() {
      try {
        const res = await this.$axios.put('/api/user/ban/' + this.bannedUser._id)
        if (res.status !== 200) return this.setError('Could not ban user, please try again.')
        else {
          const userIndex = this.users.findIndex(user => user._id === this.bannedUser._id)
          this.users.splice(userIndex, 1)
          this.bannedUser.submissions = []
          this.bannedUsers.push(this.bannedUser)
          this.closeUserBanDialog()
        }
      } catch (err) {
        console.log(err)
        this.setError('Could not ban user, please try again.')
      }
    },
    async unbanUser(user) {
      console.log(user)
      try {
        const res = await this.$axios.put('/api/user/' + user._id, { banned: false })
        if (res.status !== 200) return this.setError('Could not unban user, please try again.')
        else {
          const userIndex = this.bannedUsers.findIndex(bannedUser => user._id === bannedUser._id)
          this.bannedUsers.splice(userIndex, 1)
          this.users.push(user)
        }
      } catch (err) {
        console.log(err)
        this.setError('Could not unban user, please try again.')
      }
    }
  }
}
</script>
