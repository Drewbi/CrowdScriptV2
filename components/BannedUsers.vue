<template>
  <v-card flat>
    <v-expansion-panels
      v-model="panel"
      flat
    >
      <v-expansion-panel>
        <v-expansion-panel-header class="pl-0">
          Banned Users
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          {{ users.length === 0 ? "No banned users" : "" }}
          <v-list>
            <v-list-item
              v-for="user in users"
              :key="user._id"
            >
              <v-list-item-content>
                <v-list-item-title>{{ user.name }}</v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn @click="$emit('unban', user)" color="error" outlined>
                  UNBAN
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-card>
</template>

<script>
export default {
  props: {
    users: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    panel: [0, 1]
  })
}
</script>

<style>

</style>
