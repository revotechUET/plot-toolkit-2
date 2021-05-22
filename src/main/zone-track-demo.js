import Vue from 'vue'
import { Plugin, Fragment } from 'vue-fragment';
import VScene from '../v-scene';
import VRect from '../v-rect';
import VContainer from "../v-container";
import VResizable from "../v-resizable";
import VXone from "../v-xone"
import { scaleLinear, scaleLog } from 'd3-scale';

Vue.use(Plugin)

const app = new Vue({
    el: "#vue-app",
    template: `<fragment>
        <v-scene
            :transparent="true" 
            :view-width="width" 
            :view-height="height"
            :real-min-y="realMinY"
            :real-max-y="realMaxY"
            y-transform="linear"
            :transform-y="transformY"
            x-transform="none"
        >
            <v-xone
                :knob-flags="[true, true]"
                fill-color="0xCCFFCC"
                name="zone 1" 
                direction="vertical"
                :real-min-y="realMinY1"
                :real-max-y="realMaxY1"
                y-transform="linear"
                :handle-real-y="handleRealY"
                :view-width="width"
                :line-width="1"
                :line-color="0x888888"
                size="10"
                content="Zone 1" 
                :content-style="style"
                :no-label="false"
                :no-fill="false"
                x-transform="none"
            />
            <v-xone
                :knob-flags="[true, true]"
                fill-color="0xCCFFCC"
                name="stratigraphy" 
                direction="vertical"
                :real-min-y="realMinY2"
                :real-max-y="realMaxY2"
                y-transform="linear"
                :handle-real-y="handleRealY2"
                :view-width="width"
                :line-width="1"
                :line-color="0x888888"
                size="10"
                content="Zone 2" 
                :content-style="style"
                :no-label="false"
                :no-fill="false"
                x-transform="none"
            />
        </v-scene>
    </fragment>`,
    data() {
        return {
            width: 500,
            height: 1000,
            realMinY: 0,
            realMaxY: 9000,
            realMinY1: 1000,
            realMaxY1: 4000,
            realMinY2: 4500,
            realMaxY2: 5000,
            style: {
                fontFamily: 'Arial',
                fontStyle: 'italic',
                fill: ['#ffffff', '#00ff99'], // gradient
                stroke: '#4a1850',
                strokeThickness: 4,
                dropShadowColor: '#000000',
                dropShadowAngle: Math.PI / 6,
                lineJoin: 'round',
            },
        }
    },
    methods: {
        transformY: function() {
            let getY = scaleLinear()
            .domain([0, this.height])
            .range([this.realMinY, this.realMaxY]);
            return getY;
        },
        handleRealY: function(realMinY, realMaxY) {
            this.realMinY1 = realMinY;
            this.realMaxY1 = realMaxY;
        },
        handleRealY2: function(realMinY, realMaxY) {
            this.realMinY2 = realMinY;
            this.realMaxY2 = realMaxY;
        }
    },
    components: {
        Fragment, VScene, VRect, VContainer, VResizable, VXone
    }
})