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
        <v-scene :transparent="true" :view-width="width" :view-height="height">
            <v-layout direction="vertical" :view-width="width" :view-height="height">
                <v-resizable direction="vertical" :view-width="width" :view-height="uHeight"
                    :constrained="true"
                    :on-resize="resize"
                    :fill-color="0xFFCCCC"
                    :fill-transparency="0.0001"
                    :size="3"
                    :knobFlags="[false, true]">
                </v-resizable>
                <v-container direction="vertical" :view-width="width" :view-height="lHeight" 
                    :constrained="true"
                    fill-color="0xCCFFCC">
                    <v-rect :view-pos-x="50" :view-pos-y="50" :view-width="100" :view-height="150"
                        :clipped="true"
                    />
                </v-container>
            </v-layout>
        </v-scene>
    `,
    data: {
        width: 600, height: 400, uHeight: 200
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