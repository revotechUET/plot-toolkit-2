import Vue from 'vue';
import VScene from '../v-scene';
import VViewport from '../v-viewport';
import VResizable from '../v-resizable';
import VContainer from '../v-container';
import VRect from '../v-rect';
import { Plugin } from 'vue-fragment';

Vue.use(Plugin);
new Vue({
    el: "#vue-app",
    template: `
        <v-scene :transparent="true" :view-width="width" :view-height="height" layout-direction="vertical"
            x-transform="none" y-transform="none">
            <v-resizable direction="vertical" 
                :view-width="width" :view-height="uHeight"
                :constrained="true"
                :clipped="true"
                :on-resize="resize"
                :fill-color="0xFFCCCC"
                :fill-transparency="0.0001"
                :size="5"
                :knobFlags="[false, true]">
                <v-viewport pan="y" :view-pos-x="0" :view-pos-y="0" 
                    layout-direction="horizontal" 
                    x-transform="none" y-transform="none"
                    :viewport-width="width" :viewport-height="uHeight"
                    :view-width="width" :view-height="height" :line-width="0">
                    <v-resizable v-for="(trackHeader,index) in tracks" :key="index" :constrained="true" 
                        direction="horizontal" :fill-color="trackHeader.color" :line-width="1" :knob-flags="[false, true]"
                        :view-width="trackHeader.width" :view-height="uHeight"
                        :clipped="true"
                        :on-resize="({width, height}, t) => {trackHeader.width = width; $nextTick(() => t.triggerRelayout());}"/>
                </v-viewport>
            </v-resizable>
            <v-container :view-width="width" :view-height="lHeight" 
                :constrained="true"
                fill-color="0xCCFFCC">
                <v-rect :view-pos-x="50" :view-pos-y="50" :view-width="100" :view-height="150"
                    :clipped="true"
                />
            </v-container>
        </v-scene>
    `,
    data: {
        width: 600, height: 400, uHeight: 200,
        tracks: [{
            name: "track1",
            color: "#00FF00",
            width: 100,
            curves: [{
                name: "curve1",
                color: "#00FF00",
            }, {
                name: "curve2",
                color: "#FF0000",
            }, {
                name: "curve3",
                color: "#00FFFF",
            }]
        }, {
            name: "track2",
            color: "#FF0000",
            width: 100,
            curves: [{
                name: "curve1",
                color: "#00FF00",
            }, {
                name: "curve2",
                color: "#FF0000",
            }, {
                name: "curve3",
                color: "#00FFFF",
            }]
        }, {
            name: "track3",
            width: 100,
            color: "#00FFFF",
            curves: [{
                name: "curve1",
                color: "#00FF00",
            }, {
                name: "curve2",
                color: "#FF0000",
            }, {
                name: "curve3",
                color: "#00FFFF",
            }]
        }]
    },
    computed: {
        lHeight: function () {
            return this.height - this.uHeight;
        }
    },
    methods: {
        resize: function ({ width, height }) {
            this.uHeight = height;
        }
    },
    components: {
        VScene, VViewport, VResizable, VContainer, VRect
    }
});