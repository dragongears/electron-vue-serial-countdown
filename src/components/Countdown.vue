<template>
    <main>
      <v-toolbar fixed app height="120">
        <countdown-display :display="display"></countdown-display>
      </v-toolbar>
      <v-content>
        <v-container fluid>
          <v-expansion-panel>
            <event-list :events="events" @edit:event="editEvent" @delete:event="deleteEvent"></event-list>
            <settings-list :settings="settings"></settings-list>
          </v-expansion-panel>
          <!-- Add event FAB -->
          <v-btn fixed dark fab bottom right color="pink" @click="addEvent">
            <v-icon>add</v-icon>
          </v-btn>
        </v-container>
      </v-content>
      <!-- Edit/Add event dialog -->
      <v-dialog v-model="editDialog" max-width="500px">
        <v-card>
          <v-card-text>
            <v-layout row>
              <v-text-field
                name="eventTitleInput"
                label="Event title"
                v-model="edit.title"
              ></v-text-field>
            </v-layout>
            <v-date-picker
              v-model="edit.date"
              full-width
              landscape
              class="mt-3"
            ></v-date-picker>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" flat @click.stop="dialogDone">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </main>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import CountdownDisplay from './CountdownDisplay'
import EventList from './EventList'
import SettingsList from './SettingsList'

const jsonfile = require('jsonfile')
const eventsFilename = './events.json'

let next = 0

export default {
  name: 'countdown',
  components: {
    CountdownDisplay,
    EventList,
    SettingsList
  },
  data () {
    return {
      // events: [],
      display: {event: '', days: ''},
      edit: {title: '', date: null},
      index: 0,
      editDialog: false
    }
  },
  computed: {
    ...mapState({
      events: state => state.events,
      settings: state => state.settings
    })
  },
  methods: {
    dateCompare (a, b) {
      let aa = new Date(a.yy, a.mm, a.dd).getTime()
      let bb = new Date(b.yy, b.mm, b.dd).getTime()

      if (aa < bb) {
        return -1
      }
      if (aa > bb) {
        return 1
      }
      return 0
    },
    sortEvents () {
      console.log('sortEvents()')
      this.updateEvents(this.events.sort(this.dateCompare))
    },
    intervalFunc () {
      if (this.events.length !== 0) {
        if (next >= this.events.length) {
          next = 0
        }

        let daysStr = [' day', ' days']

        let date1 = new Date() // Today
        let date2 = new Date(this.events[next].yy, this.events[next].mm - 1, this.events[next].dd) // Target date
        let timeDiff = Math.abs(date2.getTime() - date1.getTime())
        let days = Math.ceil(timeDiff / (1000 * 3600 * 24))

        if (days < 0) {
          this.removeEvent(next)
          jsonfile.writeFileSync(eventsFilename, this.events, {spaces: 2})
          next = 0
        } else if (days === 0) {
          console.log(this.events[next].event)
          console.log('Today!')
          this.display.event = this.events[next].event
          this.display.days = 'Today!'
        } else {
          console.log(this.events[next].event)
          console.log(days.toString() + daysStr[+!!(days - 1)])
          this.display.event = this.events[next].event
          this.display.days = days.toString() + daysStr[+!!(days - 1)]
        }

        next += 1

        setTimeout(this.intervalFunc, 3000)
      } else {
        this.display.event = 'No events'
        this.display.days = ''
      }

      this.$store.dispatch('loadEvents')
      // this.updateEvents(this.readJsonFile(eventsFilename, []))

      if (next >= this.events.length) {
        next = 0
      }
    },
    readJsonFile (filename, defaults) {
      try {
        return jsonfile.readFileSync(filename)
      } catch (e) {
        jsonfile.writeFileSync(filename, defaults, {spaces: 2})
        return defaults
      }
    },
    deleteEvent (index) {
      this.removeEvent(index, 1)
      jsonfile.writeFileSync(eventsFilename, this.events, {spaces: 2})
      console.log(`delete ${index}`)
    },
    editEvent (index) {
      console.log(`edit ${index}`)
      this.edit.title = this.events[index].event
      this.edit.date = `${this.events[index].yy}-${this.events[index].mm}-${this.events[index].dd}`
      this.index = index
      this.editDialog = true
    },
    addEvent () {
      console.log(`add event`)
      let d = new Date()
      this.edit.title = ''
      this.edit.date = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
      this.index = -1
      this.editDialog = true
    },
    dialogDone () {
      console.log(`dialogDone()`)
      this.editDialog = false

      if (this.edit.title) {
        let newEvent = {}
        let match = this.edit.date.match(/(\d{4})-(\d{1,2})-(\d{1,2})/)
        if (match) {
          newEvent.yy = Number(match[1])
          newEvent.mm = Number(match[2])
          newEvent.dd = Number(match[3])
          newEvent.event = this.edit.title

          if (this.index === -1) {
            this.appendEvent(newEvent)
          } else {
            this.updateEvents(this.events.map((evt, indx) => indx === this.index ? newEvent : evt))
          }

          this.sortEvents()
          jsonfile.writeFileSync(eventsFilename, this.events, {spaces: 2})
        }
      }
    },
    open (link) {
      this.$electron.shell.openExternal(link)
    },
    ...mapMutations([
      'updateEvents',
      'appendEvent',
      'removeEvent'
    ])
  },
  mounted () {
    this.$store.dispatch('loadEvents')
    // this.updateEvents(this.readJsonFile(eventsFilename, []))
    this.intervalFunc()
  }
}
</script>

<style>
</style>
