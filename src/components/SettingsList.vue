<template>
  <v-expansion-panel>
    <v-expansion-panel-header>Settings</v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-card>
        <v-card-text>
          <v-list>
            <v-list-item>
              <v-list-item-action>
                <v-checkbox @change="saveSettings" v-model="localSettings.serialGui"></v-checkbox>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Use as USB serial display front end</v-list-item-title>
                <v-list-item-subtitle>Check to enable</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-divider></v-divider>
          <v-list two-line subheader>
            <v-subheader>USB Serial Port Settings (Restart Countdown to Apply)</v-subheader>
            <v-list-item>
              <v-flex xs6>
                <v-subheader>Serial port</v-subheader>
              </v-flex>
              <v-flex xs6>
                <v-select
                  @input="saveSettings"
                  :items="ports"
                  v-model="localSettings.serialPort"
                  item-text="comName"
                  item-value="comName"
                  label="Select port"
                  single-line
                  :disabled="!localSettings.serialGui"
                >
                </v-select>
              </v-flex>
            </v-list-item>
            <v-list-item>
              <v-flex xs6>
                <v-subheader>Baud rate</v-subheader>
              </v-flex>
              <v-flex xs6>
                <v-select
                  @input="saveSettings"
                  :items="rates"
                  v-model="localSettings.baudRate"
                  label="Select baud rate"
                  single-line
                  :disabled="!localSettings.serialGui"
                ></v-select>
              </v-flex>
            </v-list-item>
          </v-list>
          <v-divider></v-divider>
          <v-list two-line subheader>
            <v-subheader>USB Serial Display Settings </v-subheader>
            <v-list-item>
              <v-flex xs6>
                <v-subheader>Color</v-subheader>
              </v-flex>
              <v-flex xs6>
                <v-select
                  @input="saveSettings"
                  :items="colors"
                  v-model="localSettings.color"
                  label="Select display background color"
                  single-line
                  :disabled="!localSettings.serialGui"
                >
                  <template slot="selection" slot-scope="data">
                    <v-list-item-avatar class="color-select" tile :color="data.item.value"> </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title
                        :class="{ 'secondary--text text--darken-1': localSettings.serialGui }"
                        v-html="data.item.text"
                      ></v-list-item-title>
                    </v-list-item-content>
                  </template>
                  <template slot="item" slot-scope="data">
                    <v-list-item-avatar class="color-select" tile :color="data.item.value"> </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title v-html="data.item.text"></v-list-item-title>
                    </v-list-item-content>
                  </template>
                </v-select>
              </v-flex>
            </v-list-item>
            <v-list-item>
              <v-flex xs6>
                <v-subheader>Speed</v-subheader>
              </v-flex>
              <v-flex xs6>
                <v-select
                  @input="saveSettings"
                  :items="speeds"
                  v-model="localSettings.speed"
                  label="Select display change speed"
                  single-line
                  :disabled="!localSettings.serialGui"
                ></v-select>
              </v-flex>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'settings-list',
  props: ['settings'],
  data() {
    return {
      localSettings: {
        serialGui: false,
        serialPort: '/dev/ttyACM0',
        baudRate: 115200,
        color: 'white',
        speed: 3,
      },
      speeds: [
        { text: '1', value: 1 },
        { text: '2', value: 2 },
        { text: '3', value: 3 },
        { text: '4', value: 4 },
        { text: '5', value: 5 },
      ],
      colors: [
        { text: 'White', value: 'white' },
        { text: 'Red', value: 'red' },
        { text: 'Orange', value: 'orange' },
        { text: 'Yellow', value: 'yellow' },
        { text: 'Green', value: 'green' },
        { text: 'Blue', value: 'blue' },
        { text: 'Purple', value: 'purple' },
      ],
      rates: [
        { text: '300', value: 300 },
        { text: '1200', value: 1200 },
        { text: '2400', value: 2400 },
        { text: '4800', value: 4800 },
        { text: '9600', value: 9600 },
        { text: '19200', value: 19200 },
        { text: '38400', value: 38400 },
        { text: '57600', value: 57600 },
        { text: '74880', value: 74880 },
        { text: '115200', value: 115200 },
        { text: '230400', value: 230400 },
        { text: '500000', value: 500000 },
        { text: '1000000', value: 1000000 },
        { text: '2000000', value: 2000000 },
      ],
    }
  },
  computed: {
    ...mapState({
      ports: state => state.ports,
    }),
  },
  watch: {
    settings: function(newVal) {
      this.localSettings = newVal
    },
  },
  methods: {
    saveSettings() {
      this.$nextTick(function() {
        this.$store.dispatch('saveSettings', this.localSettings)
      })
    },
    editEvent(index) {
      this.$emit('edit', index)
    },
    deleteEvent(index) {
      this.$emit('delete', index)
    },
  },
  mounted() {
    this.$store.dispatch('loadSettings').then(() => {
      let val = this.ports.find(obj => {
        return obj.comName === this.localSettings.serialPort
      })
      if (val === undefined) {
        this.port = 'Unset'
      } else {
        this.port = val.comName
      }
    })
  },
}
</script>

<style>
.color-select.list__tile__avatar .avatar--tile {
  margin: 3px;
  border: 1px solid black !important;
}
</style>
