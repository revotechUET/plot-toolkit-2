import Vue from 'vue';
import VScene from '../v-scene';
import VLayout from '../v-layout';
import VResizable from '../v-resizable';
import VContainer from '../v-container';
import VRect from '../v-rect';
import {Plugin} from 'vue-fragment';

Vue.use(Plugin);
new Vue({
    el: "#vue-app",
    template: `
        <v-scene :transparent="true" :width="width" :height="height">
            <v-layout direction="vertical" :width="width" :height="height">
                <v-resizable direction="vertical" :width="width" :height="uHeight"
                    :constrained="true"
                    :on-resize="resize"
                    :fill-color="0xFFCCCC"
                    :fill-transparency="0.0001"
                    :size="3"
                    :knobFlags="[false, true]">
                </v-resizable>
                <v-container direction="vertical" :width="width" :height="lHeight" 
                    :constrained="true"
                    fill-color="0xCCFFCC">
                    <v-rect :pos-x="50" :pos-y="50" :width="100" :height="150"
                        :clipped="true"
                    />
                </v-container>
            </v-layout>
        </v-scene>
    `,
    data: {
        width: 800, height: 600, uHeight: 200
    },
    computed: {
        lHeight: function(){
            return this.height - this.uHeight;
        }
    },
    methods: {
        resize: function({width, height}) {
            this.uHeight = height;
        }
    },
    components: {
        VScene, VLayout, VResizable, VContainer, VRect
    }
});