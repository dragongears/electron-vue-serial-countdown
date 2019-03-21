<template>
    <v-expansion-panel-content>
        <div slot="header">Events</div>
        <v-card>
            <v-card-text v-if="events.length > 0">
                <v-list two-line>
                <v-list-tile v-for="(event, index) in events" :key="event.event" @click="editEvent(index)">
                    <v-list-tile-content>
                    <v-list-tile-title>{{ event.event }}</v-list-tile-title>
                    <v-list-tile-sub-title>{{event.mm}}/{{event.dd}}/{{event.yy}}</v-list-tile-sub-title>
                    </v-list-tile-content>
                    <v-list-tile-action>
                    <v-btn icon ripple="" @click.stop="deleteEvent(index)">
                        <v-icon color="grey lighten-1">delete</v-icon>
                    </v-btn>
                    </v-list-tile-action>
                </v-list-tile>
                </v-list>
            </v-card-text>
            <v-card-text v-else>
                No events
            </v-card-text>
        </v-card>
    </v-expansion-panel-content>
</template>

<script>
export default {
  name: 'event-list',
  props: ['events'],
  methods: {
    editEvent (index) {
      this.$emit('edit:event', index)
    },
    deleteEvent (index) {
      this.$emit('delete:event', index)
    }
  }
}
</script>

<style>
</style>
