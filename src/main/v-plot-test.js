import Vue from 'vue';
import Vuex from 'vuex'
import VPlot from '../v-plot';
import options from '../stores/logplot-store.js';

Vue.use(Vuex);
Vue.config.devtools = true

const store = new Vuex.Store( options );

let app = new Vue({
    el: "#vue-app",
    template: `<div>
        <v-plot :id-plot="1" :id-project="1" />
    </div>
    `,
    data: function() {
        return {
            plot: null
        }
    },
    components: {
        VPlot
    },
    store: store
});