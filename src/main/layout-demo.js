import Vue from 'vue';
import {Plugin} from 'vue-fragment';
import VScene from '../v-scene';
import VShape from '../v-shape';
import VLayout from "../v-layout";
import VResizable from "../v-resizable";

Vue.use(Plugin);

const app = new Vue({
    el: "#vue-app",
    template: `<fragment>
        <v-scene name="scene" :transparent="true" :width="width" :height="height">
            <v-layout name="layout" direction="horizontal" :width="width-50" :height="height">
                <v-shape shape="rect" :width="30" :height="100" :line-width="1"
                    :constrained="true"
                    fill-color="#ffcccc" />
                <v-shape shape="rect" :width="30" :height="100" :line-width="1" 
                    :constrained="true"
                    fill-color="#ccffcc" />
                <v-shape shape="rect" :width="30" :height="100" :line-width="1" 
                    :constrained="true"
                    fill-color="#ffcccc" />
                <v-shape shape="rect" :width="30" :height="100" :line-width="1" 
                    :constrained="true"
                    fill-color="#ccffcc" />
                <v-resizable direction="horizontal"
                    :constrained="true"
                    :on-resize="resize"
                    :knob-flags="[false, true]"
                    :width="w" :height="h" />
                <v-shape shape="rect" :width="30" :height="100" :line-width="1" 
                    :constrained="true"
                    fill-color="#ffcccc" />
                <v-shape shape="rect" :width="30" :height="100" :line-width="1" 
                    :enabled="true" :draggable="true"
                    :constrained="true"
                    fill-color="#ccffcc" />
            </v-layout>
        </v-scene>
    </fragment>
    `,
    data : {
        width: 600,
        height: 400,
        w: 100, h: 100
    },
    methods: {
        resize: function({width, height}, targetComp) {
            this.w = width;
            this.h = height;
            this.$nextTick(() => targetComp.triggerRelayout());
        }
    },
    components: {
        VScene, VLayout, VShape, VResizable
    }
});