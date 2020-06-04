import Vue from 'vue'
import Vuex from 'vuex'
import config from '../config'
import quotes from './quotes'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    endpoints: {
      baseUrl: config.hostname
    }
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    quotes
  }
})
