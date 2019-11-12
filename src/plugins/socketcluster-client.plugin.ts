import _Vue from 'vue'
import socketCluster, { SCClientSocket } from 'socketcluster-client'

// declare module 'vue/types/vue' {
//   interface Vue {
//     $socket: object
//   }
// }

declare global {
  interface Window {
    $socket: SCClientSocket
  }
}

export default {
  install(Vue: typeof _Vue, options: any): Promise<SCClientSocket> {
    return new Promise((resolve, reject) => {
      const scOptions = {
        query: {
          authKey: 'CLIENTWEBAUTHKEY',
        },
        autoReconnectOptions: {
          initialDelay: 1000,
          maxDelay: 5000,
          multiplier: 1,
          randomness: 200,
        },
        secure: false,
        port: 8000,
        hostname: 'localhost',
      }
      if (options)
        Object.assign(scOptions, options)

      const scSocket = socketCluster.create(scOptions)
      scSocket.on('connect', () => {
        // FOR DEBUG PURPOSE
        window.$socket = scSocket
        Vue.prototype.$socket = scSocket
        resolve(scSocket)
      })
    })
  }
}