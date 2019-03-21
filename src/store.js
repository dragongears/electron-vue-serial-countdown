import Vue from 'vue'
import Vuex from 'vuex'
// import VuexPersist from 'vuex-persist'
const jsonfile = require('jsonfile')
const eventsFilename = './events.json'
const settingsFilename = './settings.json'

Vue.use(Vuex)

// const vuexLocalStorage = new VuexPersist({
//   key: 'electron-vue--serial-countdown', // The key to store the state on in the storage provider.
//   storage: window.localStorage, // or window.sessionStorage or localForage
//   reducer: state => ({
//     events: state.events,
//     settings: state.settings
//   })
// })

function readJsonFile (filename, defaults) {
  try {
    return jsonfile.readFileSync(filename)
  } catch (e) {
    jsonfile.writeFileSync(filename, defaults, {spaces: 2})
    return defaults
  }
}

export default new Vuex.Store({
  // plugins: [vuexLocalStorage.plugin],
  state: {
    events: [],
    settings: {},
    ports: []
  },
  getters: {
    events: state => {
      return state.events
    },
    settings: state => {
      return state.settings
    },
    ports: state => {
      return state.ports
    }
  },
  mutations: {
    updateEvents: (state, payload) => {
      state.events = payload
    },
    appendEvent: (state, payload) => {
      state.events.push(payload)
    },
    removeEvent: (state, payload) => {
      state.events.splice(payload, 1)
    },
    updateSettings: (state, payload) => {
      state.settings = payload
    },
    updatePorts: (state, payload) => {
      state.ports = payload
    }
  },
  actions: {
    loadEvents: (context) => {
      const events = readJsonFile(eventsFilename, [])
      context.commit('updateEvents', events)
    },
    loadSettings: (context) => {
      const settings = readJsonFile(settingsFilename, [])
      context.commit('updateSettings', settings)
    },
    saveSettings: (context, settings) => {
      context.commit('updateSettings', settings)
      jsonfile.writeFileSync(settingsFilename, settings, {spaces: 2})
    },
    loadPorts: (context) => {
      const SerialPort = require('serialport')
      // callback approach
      SerialPort.list(function (err, ports) {
        if (!err) {
          const portsInUse = ports.filter(port => port.pnpId)
          context.commit('updatePorts', portsInUse)
        }
      })
    }
  }
})
