import Vue from 'vue';
import {Plugin} from 'vue-fragment';
import VScene from '../v-scene';
import VRect from '../v-rect';
import VLayout from "../v-layout";
import VResizable from "../v-resizable";

Vue.use(Plugin);

const app = new Vue({
    el: "#vue-app",
    template: `<fragment>
        <v-scene name="scene" :transparent="true" :view-width="width" :view-height="height">
            <v-layout name="layout" direction="horizontal" :view-width="width-50" :view-height="height">
                <v-rect :view-width="30" :view-height="100" :line-width="1"
                    :constrained="true"
                    fill-color="#ffcccc" />
                <v-rect :view-width="30" :view-height="100" :line-width="1" 
                    :constrained="true"
                    fill-color="#ccffcc" />
                <v-rect :view-width="30" :view-height="100" :line-width="1" 
                    :constrained="true"
                    fill-color="#ffcccc" />
                <v-rect :view-width="30" :view-height="100" :line-width="1" 
                    :constrained="true"
                    fill-color="#ccffcc" />
                <v-resizable direction="horizontal"
                    :constrained="true"
                    :on-resize="resize"
                    :knob-flags="[false, true]"
                    :view-width="w" :view-height="h" />
                <v-rect :view-width="30" :view-height="100" :line-width="1" 
                    :constrained="true"
                    fill-color="#ffcccc" />
                <v-rect :view-width="30" :view-height="100" :line-width="1" 
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
        VScene, VLayout, VRect, VResizable
    }
});