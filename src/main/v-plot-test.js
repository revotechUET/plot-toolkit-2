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
                :view-pos-x="0" :view-pos-y="plotHeaderHeight"
                :view-width="viewWidth" :view-height="viewHeight"
                :tooltip-style="tooltipStyle" ref="myPlot"
                :zone-content-style="zoneContentStyle"
                :enabled="true"
                @plotHeaderResize="headerResize"
                :line-width="0.75" line-color="0x101010"
                :viewport-pos-y="plotHeaderHeight"
                :ref-line-x="true" :ref-line-y="false"
                :id-project="1" :id-plot="4" />
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
    methods: {
        headerResize: function (height) {
            this.plotHeaderHeight = height;
        }
    },
    components: {
        VPlot, VScene
    },
    store: store
});