<template>
  <v-app>
    <countdown></countdown>
  </v-app>
</template>

<script>
  import Countdown from './components/Countdown'

  export default {
    name: 'electron-vue-serial-countdown',
    components: {
      Countdown
    },
    created () {
      // Get the USB serial ports on this computer
      this.$store.dispatch('loadPorts')
    }
  }
</script>

<style>
  /* CSS */
</style>
