<template>
   <v-footer
      v-bind="localAttrs"
      :padless="padless"
    >
      <v-card
        flat
        tile
        width="100%"
      >

        <v-card-text class="text-lg-right primary--text">
          Copyright  &copy; {{ new Date().getFullYear() }} <strong>Afnan Fauzi</strong>
        </v-card-text>
      </v-card>
    </v-footer>
</template>

<script>
  export default {
    data: () => ({
      items: [
        'default',
        'absolute',
        'fixed',
      ],
      padless: true,
      variant: 'default',
    }),
    computed: {
      localAttrs () {
        const attrs = {}

        if (this.variant === 'default') {
          attrs.absolute = false
          attrs.fixed = false
        } else {
          attrs[this.variant] = true
        }
        return attrs
      },
    },
  }
</script>