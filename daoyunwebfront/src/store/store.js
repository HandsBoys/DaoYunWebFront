import Vue from 'vue'

import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({

    state: {
        backgroundColor: "#324157",

        ifDictSuccess: false,
        reloadSidebar: false,
        updatePage: false
    },

    mutations: {

        // increment(state, n) {
        //     state.count += n
        // },
        // decrement:state => state.count --,
    }
})