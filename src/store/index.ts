import Vue from 'vue'
import Vuex from 'vuex'
import ru_RU from 'ant-design-vue/es/locale-provider/ru_RU'
import AddressProgram from '../types/AddressProgram'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    locale: ru_RU,
    addressProgramsCount: 0,
    addressPrograms: [],
    addressProgramWithRows: {},
  },
  getters: {
    locale: (state) => state.locale,
    addressProgramsCount: (state) => state.addressProgramsCount,
    addressPrograms: (state) => state.addressPrograms,
    addressProgramWithRows: (state) => state.addressProgramWithRows,
  },
  mutations: {
    setAddressProgramsCount: (state, payload) => state.addressProgramsCount = payload,
    setAddressPrograms: (state, payload) => state.addressPrograms = payload,
    setAddressProgramWithRows: (state, payload) => state.addressProgramWithRows = payload,
    updateAddressProgramTitleVuex(state, { _id, title }) {
      const target = findAP(state, _id)
      target.title = title
    },
    toggleAddressProgramEditableVuex(state, { _id, editable, cancel }) {
      const target = findAP(state, _id)
      target.editable = editable

      if (editable) { // save title to be able to discard changes later
        target.initialTitle = target.title
      }
      else if (cancel && target.initialTitle) {
        target.title = target.initialTitle
      }
    },
  },
  actions: {
    async getAddressPrograms({ commit }, { pagination, filters, sorter } = {}) {
      const options:
        { offset: number, limit: number, order: object } =
        { offset: 0, limit: 0, order: { _id: -1 } }

      if (pagination) {
        const { current, pageSize } = pagination
        options.offset = (current - 1) * pageSize
        if (options.offset < 0) {
          options.offset = 0
        }
        options.limit = pageSize
        // options.order = { _id: -1 }
      }

      const { addressProgramsCount, addressPrograms } = await new Promise((resolve, reject) => {
        Vue.$socket.emit('getAddressPrograms', options, makeDefaultSCCallback(reject, resolve))
      })

      console.info('getAddressPrograms:', addressPrograms)
      commit('setAddressProgramsCount', addressProgramsCount)
      commit('setAddressPrograms', addressPrograms)
    },
    async getAddressProgramWithRows({ commit }, { _id, pagination, filters, sorter } = {}) {
      const options:
        { _id: string, query: { [key: string]: object }, offset: number, limit: number, order: object } =
        { _id, offset: 0, query: {}, limit: 0, order: { city: 1, streetName: 1, buildingBaseNumber: 1 } }

      if (pagination) {
        const { current, pageSize } = pagination
        options.offset = (current - 1) * pageSize
        if (options.offset < 0) {
          options.offset = 0
        }
        options.limit = pageSize
        // options.order = { _id: -1 }
      }

      if (filters) {
        for (const field in filters) {
          if (filters[field].length) {
            options.query[field] = { $in: filters[field] }
          }
        }
      }

      const addressProgram = await new Promise((resolve, reject) => {
        Vue.$socket.emit('getAddressProgramWithRows', options, makeDefaultSCCallback(reject, resolve))
      })

      console.info('getAddressProgramWithRows:', addressProgram)
      commit('setAddressProgramWithRows', addressProgram)
    },
    async updateAddressProgramTitle({ state }, _id) {
      const target = findAP(state, _id)
      if (target) {
        return new Promise((resolve, reject) => {
          Vue.$socket.emit('updateAddressProgramTitle', { _id, title: target.title.trim() }, makeDefaultSCCallback(reject, resolve))
        })
      }
    },
    async deleteAddressProgram({ state }, _id) {
      return new Promise((resolve, reject) => {
        Vue.$socket.emit('deleteAddressProgram', { _id }, makeDefaultSCCallback(reject, resolve))
      })
    },
  },
})

function findAP(state: any, _id: string): AddressProgram {
  return state.addressPrograms.find((ap: AddressProgram) => ap._id === _id)
}

function makeDefaultSCCallback(reject: (err: any) => void, resolve: (data: any) => void) {
  return function (err: any, data: any) {
    if (err) {
      reject(err)
    }
    else {
      resolve(data)
    }
  }
}