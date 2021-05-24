import Vue from 'vue';
import Vuex from 'vuex'
import VPlot from '../v-plot';
import createStore from '../stores/logplot-store.js';
import VTrack from '../v-track';

Vue.use(Vuex);

const store = createStore(1, 1);

let app = new Vue({
    el: "#vue-app",
    template: `<div>
        <v-plot />
    </div>
    `,
    data: function() {
        return {
            plot: null
        }
    },
    components: {
        VPlot, VTrack
    },
    store: store
});