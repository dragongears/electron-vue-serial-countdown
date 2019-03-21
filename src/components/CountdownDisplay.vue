<template>
  <v-container fill-height>
    <v-layout align-center>
      <v-flex>
        <div class="title mb-3">{{display.event}}</div>
        <div class="title">{{display.days}}</div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'countdown-display',
  props: ['display'],
  data () {
    return {
    }
  }
}
</script>

<style>
</style>
