import Vue from 'vue';
import {Fragment} from 'vue-fragment';
import VScene from '../v-scene';
import VCartersian from '../v-cartersian';

new Vue({
    el: '#vue-app',
    template: `
        <v-scene :view-width="800" :view-height="600" :transparent="true">
            <v-cartersian :view-pos-x="30" :view-pos-y="30" :view-width="500" :view-height="400"
                :enabled="true" :draggable="true"
                :fill-color="0xFFFFFF" :line-width="1" :line-color="0x010101"
                :real-min-x="0.1" :real-max-x="1500"
                :real-min-y="30" :real-max-y="130" x-transform="loga" y-transform="linear"
                :major-ticks-y="5" :minor-ticks-y="5" 
                :grid="true" tick-label-position-x="none" tick-label-position-y="low" tick-precision="1">
            </v-cartersian>
        </v-scene>
    `,
    components: { VScene, VCartersian, Fragment }
});
