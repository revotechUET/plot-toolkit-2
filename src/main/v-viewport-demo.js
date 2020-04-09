import Vue from 'vue';
import VScene from '../v-scene';
import VRect from '../v-rect';
import VContainer from "../v-container";
import VViewport from "../v-viewport";
/*
            <v-viewport :view-pos-x="10" :view-pos-y="10" 
                :view-width="0.25*width" 
                :view-height="0.25*height" 
                :viewport-width="0.5*width :viewport-height="0.5*height">
            </v-viewport>
            */
new Vue({
    el: '#vue-app',
    template: `
        <v-scene :view-width="width" :view-height="height" :transparent="true">
            <v-viewport :view-pos-x="10" :view-pos-y="10" 
                :view-width="2*width" :clipped="true"
                :view-height="2*height" pan="y"
                :viewport-width="0.5*width" :viewport-height="0.5*height" :line-width="1">
                <v-rect :view-width="200" :view-height="200" 
                    :view-pos-x="100" :view-pos-y="100" 
                    fill-color="#FFDDDD" :line-width="1"></v-rect>
            </v-viewport>
        </v-scene>
    `,
    data: {
        width: 600,height: 400
    },
    components: { VScene, VRect, VViewport, VContainer}
})