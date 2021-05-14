import Vue from 'vue';
import { Plugin, Fragment } from 'vue-fragment';
import VScene from '../v-scene';
import VRect from '../v-rect';
import VContainer from "../v-container";
import VResizable from "../v-resizable";

Vue.use(Plugin);

const app = new Vue({
    el: "#vue-app",
    template: `<fragment>
        <v-scene name="scene" :transparent="true" :view-width="width" :view-height="height">
            <v-container name="layout" layoutDirection="horizontal" :view-width="width-50" :view-height="height" 
            :view-pos-x="0" :view-pos-y="0"
            x-transform="none" y-transform="none">

                <v-rect v-for="(r, idx) in rects" :key="idx" :view-width="30" :view-height="100" :line-width="1"
                    :constrained="true"
                    :fill-color="r.color" />
                
                <v-resizable direction="vertical"
                    :constrained="true"
                    :on-resize="resize"
                    :clipped="true"
                    :knob-flags="[false, true]"
                    :view-width="w" :view-height="h" />
                <v-rect :view-width="30" :view-height="100" :line-width="1" 
                    :constrained="true"
                    fill-color="#ffcccc" />
                <v-rect :view-width="30" :view-height="100" :line-width="1" 
                    :enabled="true" :draggable="true"
                    :constrained="true"
                    fill-color="#ccffcc" />
            </v-container>
        </v-scene>
        <button v-on:click="click">click</button>
    </fragment>
    `,
    data: {
        width: 600,
        height: 400,
        w: 100, h: 100,
        rects: [{ color: "yellow" }, { color: "wheat" }, { color: "pink" }]
    },
    methods: {
        resize: function ({ width, height }, targetComp) {
            this.w = width;
            this.h = height;
            this.$nextTick(() => targetComp.triggerRelayout());
        },
        click: function () {
            this.rects.shift();
        }
    },
    components: {
        VScene, VContainer, VRect, VResizable, Fragment
    }
});