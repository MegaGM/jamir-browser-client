import Vue from 'vue'
import Vuex from 'vuex'
import AddressProgram from '../types/AddressProgram'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    addressProgramsCount: 0,
    addressPrograms: [],
  },
  getters: {
    addressProgramsCount(state) {
      return state.addressProgramsCount
    },
    addressPrograms(state) {
      return state.addressPrograms
    },
  },
  actions: {
    async getAddressPrograms({ commit }, { pagination, filters, sorter } = {}) {
      const { addressProgramsCount, addressPrograms } = await new Promise((resolve, reject) => {
        const options: { offset: number, limit: number, order: object } = { offset: 0, limit: 0, order: { _id: -1 } }
        if (pagination) {
          console.info('getAddressPrograms pagination', pagination)
          const { current, pageSize } = pagination
          options.offset = (current - 1) * pageSize
          if (options.offset < 0) {
            options.offset = 0
          }
          options.limit = pageSize
          // options.order = { _id: -1 }
        }

        Vue.$socket.emit('getAddressPrograms', options, (err: any, data: any) => {
          if (err) {
            reject(err)
          } else {
            resolve(data)
          }
        })
      })

      commit('setAddressProgramsCount', addressProgramsCount)
      commit('setAddressPrograms', addressPrograms)
    },
    async updateAddressProgramTitle({ state }, _id) {
      const target = findAP(state, _id)
      if (target) {
        return new Promise((resolve, reject) => {
          Vue.$socket.emit('updateAddressProgramTitle', { _id, title: target.title }, (err: any, data: any) => {
            if (err) {
              reject(err)
            } else {
              resolve(data)
            }
          })
        })
      }
    },
    async deleteAddressProgram({ state }, _id) {
      return new Promise((resolve, reject) => {
        Vue.$socket.emit('deleteAddressProgram', { _id }, (err: any, data: any) => {
          if (err) {
            reject(err)
          } else {
            resolve(data)
          }
        })
      })
    },
  },
  mutations: {
    setAddressProgramsCount(state, payload) {
      state.addressProgramsCount = payload
    },
    setAddressPrograms(state, payload) {
      state.addressPrograms = payload
    },
    updateAddressProgramTitleVuex(state, { _id, title }) {
      const target = findAP(state, _id)
      if (target) {
        (target as { title: string }).title = title
      }
    },
    toggleAddressProgramEditableVuex(state, { _id, editable, cancel }) {
      const target: AddressProgram = findAP(state, _id)
      target.editable = editable

      if (editable) { // save title to be able to discard changes later
        target.initialTitle = target.title
      }
      else if (cancel && target.initialTitle) {
        target.title = target.initialTitle
      }
    },
  },
})

function findAP(state: any, _id: string) {
  return state.addressPrograms.find((ap: AddressProgram) => ap._id === _id)
}