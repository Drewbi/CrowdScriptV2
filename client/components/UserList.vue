<template>
  <v-card flat>
    <v-card-title>
      Users
      <v-icon v-if="!verbose" @click="$emit('copy')" small class="ml-2">
        mdi-content-copy
      </v-icon>
    </v-card-title>

    <v-list>
      <v-list-item v-if="users.length === 0">
        No Users
      </v-list-item>
      <v-list-item
        v-for="(user, i) in users"
        :key="i"
      >
        <v-list-item-content v-show="!verbose">
          {{ i + 1 }}
        </v-list-item-content>
        <v-list-item-content>
          {{ user.name }}
        </v-list-item-content>
        <v-list-item-content>
          {{ user.email }}
        </v-list-item-content>
        <v-list-item-content v-show="verbose">
          <v-list-item-title>
            {{ user.admin ? 'Admin' : 'User' }}
          </v-list-item-title>
        </v-list-item-content>
        <v-list-item-content>
          {{ user.submissions.length === 1 ? user.submissions.length + " submission" : user.submissions.length === 0 ? "No submissions" : user.submissions.length + " submissions" }}
        </v-list-item-content>
        <v-list-item-content v-show="verbose">
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
    },
    verbose: {
      type: Boolean,
      default: true
    }
  }
}
</script>
