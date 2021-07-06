import Vue from 'vue';
import Vuex from 'vuex'
import VPlot from '../v-plot';
import VScene from '../v-scene';
import options from '../stores/logplot-store.js';

Vue.use(Vuex);
Vue.config.devtools = true

const store = new Vuex.Store(options);

let app = new Vue({
    el: "#vue-app",
    template: `
        <v-scene :transparent="true" :view-width="1000" :view-height="520"
            :view-pos-x="0" :view-pos-y="0">
            <v-plot
                :view-pos-x="0" :view-pos-y="0"
                :view-width="viewWidth" :view-height="viewHeight"
                :tooltip-style="tooltipStyle" ref="myPlot"
                :zone-content-style="zoneContentStyle"
                :enabled="true"
                :id-project="1" :id-plot="5" />
        </v-scene>
    `,
    data: function () {
        return {
            plotHeaderHeight: 100,
            tooltipStyle: {
                fontSize: 13
            },
            viewHeight: 500,
            viewWidth: 1000,
            zoneContentStyle: {
                fontSize: 14,
            }
        }
    },
    components: {
        VPlot, VScene
    },
    store: store
});