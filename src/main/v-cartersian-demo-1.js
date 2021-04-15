import Vue from 'vue';
import { Fragment } from 'vue-fragment';
import VScene from '../v-scene';
import VRect from '../v-rect';
import VViewport from '../v-viewport';
import VCartersian from '../v-cartersian';

new Vue({
    el: '#vue-app',
    template: `
        <v-scene :view-width="800" :view-height="600" :transparent="true">
            <v-viewport :viewport-width="500" :viewport-height="300"
                :view-pos-x="30" :view-pos-y="30"
                x-transform="none" y-transform="none"
                :constrained="true"
                :view-width="1000" :view-height="400" pan="both" line-color="rgba(0,0,255,0.5)" :line-width="1"> 
                <v-cartersian :view-width="1000" :view-height="500"
                    :enabled="true" :draggable="true"
                    :clipped="true"
                    :fill-color="0xFFFFFF" :line-width="1" :line-color="0x010101"
                    :real-min-x="0.1" :real-max-x="1500"
                    :real-min-y="30" :real-max-y="1000" x-transform="loga" y-transform="linear"
                    :major-ticks-y="5" :minor-ticks-y="5" 
                    :grid="false" tick-label-position-x="sticky" tick-label-position-y="sticky" tick-precision="1">
                        <v-rect :view-width="30" :view-height="100" :line-width="1" 
                            :view-pos-x="itemX"
                            :view-pos-y="itemY"
                            :constrained="true" 
                            :enabled="true" :draggable="true"
                            :on-drop="dropFn"
                            fill-color="#ccffcc" />
                        <v-rect :view-width="100" :view-height="30" :line-width="1" 
                            :view-pos-x="itemX + 10"
                            :view-pos-y="itemY + 10"
                            :constrained="true" 
                            :enabled="true" :draggable="true"
                            :on-drop="dropFn"
                            fill-color="#ffffcc" />
                </v-cartersian>
            </v-viewport>
        </v-scene>
    `,
    computed: {
    },
    data: {
        itemX: 0,
        itemY: 0
    },
    methods: {
        dropFn(target, pos) {
            console.log("on Drop", ...arguments);
            this.itemX = pos.x || this.itemX;
            this.itemY = pos.y || this.itemY;
        },
    },
    components: { VScene, VRect, Fragment, VViewport, VCartersian }
});
