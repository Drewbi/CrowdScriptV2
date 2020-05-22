<template>
  <v-card flat>
    <v-card-title>Users</v-card-title>
    <v-list>
      <v-list-item v-if="users.length === 0">
        No Users
      </v-list-item>
      <v-list-item
        v-for="(user, i) in users"
        :key="i"
      >
        <v-list-item-content>
          {{ user.name }}
        </v-list-item-content>
        <v-list-item-content>
          {{ user.email }}
        </v-list-item-content>
        <v-list-item-content>
          <v-list-item-title>
            {{ user.admin ? 'Admin' : 'User' }}
          </v-list-item-title>
        </v-list-item-content>
        <v-list-item-content>
          {{ user.submissions.length + user.submissions.length === 1 ? " Submission" : user.submissions.length === 0 ? "No submissions" : "Submissions" }}
        </v-list-item-content>
        <v-list-item-content>
          <v-checkbox v-model="user.credit" label="Credit" disabled />
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
export default {
  props: {
    users: {
      type: Array,
      default: () => []
    }
  }
}
</script>
