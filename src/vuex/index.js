import { createStore } from 'vuex'
import VuexPersistence from 'vuex-persist'
import cart from './states/cart'
import notifications from './states/notifications'
import user from './states/user'

const vuexLocal = new VuexPersistence({
  storage: window.localStorage
})

export default createStore({
  modules: {
    cart,
    notifications,
    user
  },
  plugins: [vuexLocal.plugin]
})