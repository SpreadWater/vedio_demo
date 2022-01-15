import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import socket from './modules/socket'

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  getters: {

  },
  modules: {
    socket,
  }
})
