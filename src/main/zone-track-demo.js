import Vue from 'vue'
import { Plugin, Fragment } from 'vue-fragment';
import VScene from '../v-scene';
import VRect from '../v-rect';
import VContainer from "../v-container";
import VResizable from "../v-resizable";
import VXone from "../v-xone"
Vue.use(Plugin)

const app = new Vue({
    el: "#vue-app",
    template: `<fragment>
        <v-scene
            :transparent="true" 
            :view-width="width" 
            :view-height="height"
            :real-min-y="0"
            :real-max-y="5000"
            y-transform="linear"
            x-transform="none"
        >
            <v-xone
                :knob-flags="[true, true]"
                fill-color="0xCCFFCC"
                name="stratigraphy" 
                direction="vertical"
                :real-min-y="1000"
                :real-max-y="2000"
                y-transform="linear"
                :line-width="1"
                :line-color="0x888888"
                size="10"
                content="Stratigraphy" 
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
                :real-min-y="2500"
                :real-max-y="3000"
                y-transform="linear"
                :line-width="1"
                :line-color="0x888888"
                size="10"
                content="Stratigraphy" 
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
            height1: 300,
            vPosX: 0,
            vPosY: 0,
            vMinY: 0,
            vMaxY: 0,
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
    components: {
        Fragment, VScene, VRect, VContainer, VResizable, VXone
    }
})