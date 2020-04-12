import Vue from 'vue';
import VAxis from '../v-axis';
import VScene from '../v-scene';
import VRect from '../v-rect';
import VResizable from '../v-resizable';
import {Plugin} from 'vue-fragment';
Vue.use(Plugin);
new Vue({
    el: '#vue-app',
    template: `<fragment>
        <v-scene :view-width="width" :view-height="height" :transparent="true">
            <v-resizable :view-pos-x="30" :view-pos-y="50" :clipped="false" 
                :view-width="w" :view-height="h" 
                direction="horizontal" :size="3" :knob-flags="[false, true]" 
                :enabled="true" :draggable="true"
                :on-resize="({width, height}) => {w = width; h = height}">
                <v-axis :clipped="true"
                    axis="y" :view-width="w" :view-height="h" 
                    :real-min-y="9.73" :real-max-y="maxVal" 
                    y-transform="loga"
                    :grid="true"
                    :major-ticks="4" :major-tick-length="1" :minor-ticks="minorTicks" 
                    :line-width="1.5" :line-color="0x010101"
                    :fill-color="0xFFFFEE"
                    tick-label-position="middle"
                    :tick-precision="2">
                    <v-axis :clipped="true"
                        axis="x" :view-width="w" :view-height="h" 
                        :real-min-x="9.73" :real-max-x="maxValX" 
                        x-transform="linear"
                        :grid="true"
                        :major-ticks="4" :minor-ticks="minorTicks" 
                        :line-width="1.5" :line-color="0x010101"
                        :fill-color="0xFFFFEE" :fill-transparency="0.2"
                        tick-label-position="none"
                        :tick-precision="1">
                        <v-rect :view-pos-x="-20" :view-pos-y="-20" :view-width="50" :view-height="50"
                            :fill-color="0x00FF00" :fill-transparency="0.4" />
                    </v-axis>
                </v-axis>
            </v-resizable>
        </v-scene>
        <button v-on:click="minorTicks--">Click Me</button>
        <button v-on:click="maxVal += 0.3">Click Me</button>
    </fragment>
    `,
    data: {
        w:300, h: 300, width: 600, height: 400, minorTicks: 5, maxVal: 23090, maxValX: 40
    },
    components: {
        VAxis, VScene, VRect, VResizable
    }
});