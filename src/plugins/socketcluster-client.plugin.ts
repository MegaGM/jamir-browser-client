import _Vue from 'vue'
import socketCluster, { SCClientSocket } from 'socketcluster-client'

declare module 'vue/types/vue' {
  interface Vue {
    $socket: SCClientSocket
  }
  interface VueConstructor {
    $socket: SCClientSocket
  }
}

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
        // TODO: change for production
        ackTimeout: 5 * 60 * 1000,
        secure: false,
        port: 8000,
        hostname: 'localhost',
      }
      if (options)
        Object.assign(scOptions, options)

      const scSocket = socketCluster.create(scOptions)
      Vue.prototype.$socket = scSocket
      Vue.$socket = scSocket

      scSocket.on('connect', () => {
        // FOR DEBUG PURPOSE
        window.$socket = scSocket
        resolve(scSocket)
      })
    })
  }
}