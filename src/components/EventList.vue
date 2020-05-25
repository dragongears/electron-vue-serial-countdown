<template>
  <v-expansion-panel>
    <v-expansion-panel-header>Events</v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-card>
        <v-card-text v-if="events.length > 0">
          <v-list two-line>
            <v-list-item v-for="(event, index) in events" :key="event.event" @click="editEvent(index)">
              <v-list-item-content>
                <v-list-item-title>{{ event.event }}</v-list-item-title>
                <v-list-item-subtitle>{{ event.mm }}/{{ event.dd }}/{{ event.yy }}</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn icon @click.stop="deleteEvent(index)">
                  <v-icon color="grey lighten-1">mdi-delete</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-text v-else>
          No events
        </v-card-text>
      </v-card>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
export default {
  name: 'event-list',
  props: ['events'],
  methods: {
    editEvent(index) {
      this.$emit('edit:event', index)
    },
    deleteEvent(index) {
      this.$emit('delete:event', index)
    },
  },
}
</script>

<style></style>
