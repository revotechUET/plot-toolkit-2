import Vue from 'vue';
import VAxis from '../v-axis';
import VScene from '../v-scene';
import VRect from '../v-rect';
new Vue({
    el: '#vue-app',
    template: `<v-scene :view-width="width" :view-height="height" :transparent="true">
        <v-axis :view-pos-x="30" :view-pos-y="50" :clipped="true"
            axis="y" :view-width="300" :view-height="300" 
            :real-min-y="10" :real-max-y="15" 
            y-transform="linear"
            :grid="false"
            :majorTicks="4" minorTicks="5" 
            :enabled="true" :draggable="true" 
            :line-width="2" :line-color="0x010101" :fill-color="0xFFFFEE"
            tick-label-position="high"
            :tick-precision="2">
            <v-rect :view-pos-x="-20" :view-pos-y="-20" :view-width="50" :view-height="50"
                :fill-color="0x00FF00" :fill-transparency="0.4" />
        </v-axis>
    </v-scene>
    `,
    data: {
        width: 600, height: 400
    },
    components: {
        VAxis, VScene, VRect
    }
});