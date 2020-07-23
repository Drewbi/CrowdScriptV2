<template>
  <v-dialog
    v-model="dialog"
    :overlay="false"
    max-width="500px"
    transition="dialog-transition"
  >
    <v-card>
      <v-card-title>
        Ban User?
        <v-spacer />
        <v-btn @click="$emit('closeDialog')" color="error" text fab small>
          <v-icon>
            mdi-close
          </v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>This will delete their submissions and prevent them from logging in.</v-card-text>
      <v-card-text>Type <kbd>{{ user.email }}</kbd> to ban {{ user.name }}.</v-card-text>
      <v-card-text class="pb-0">
        <v-form
          v-model="valid"
        >
          <v-text-field
            v-model="email"
            :rules="emailRules"
            label="Confirm User"
          />
        </v-form>
      </v-card-text>
      <v-card-actions class="px-6 pb-6">
        <v-btn
          @click="$emit('closeDialog')"
        >
          Cancel
        </v-btn>
        <v-spacer />
        <v-btn
          :disabled="!valid"
          @click="$emit('confirmDelete')"
          color="error"
          class="justify-end"
        >
          Confirm
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    dialogOpen: {
      type: Boolean,
      required: true
    },
    user: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      valid: false,
      email: '',
      emailRules: [
        v => !!v || 'Enter email',
        v => (v === this.user.email) || 'Email does not match'
      ]
    }
  },
  computed: {
    dialog: {
      get: function () {
        return this.dialogOpen
      },
      set: function () {
        this.$emit('closeDialog')
      }
    }
  },
  watch: {
    'user.email'(newVal, oldVal) {
      if (newVal === undefined) this.email = ''
    }
  }
}
</script>
