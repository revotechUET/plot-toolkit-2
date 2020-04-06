import Vue from "vue";
import { Plugin } from "vue-fragment";
import VScene from "../v-scene";
import VShape from "../v-shape";
import VResizable from "../v-resizable";

Vue.use(Plugin);

const app = new Vue({
  el: "#vue-app",
  template: `<fragment>
        <v-scene name="scene" v-bind:transparent="true" v-bind:width="width" v-bind:height="height">
            <v-resizable shape="rect" :fill-transparency="0.0001" :enabled="false"
                :knob-flags="[true, true]"
                :clipped="false"
                name="resizeable" direction="horizontal"
                :line-width="1" :line-color="0x888888"
                :on-resize="resize"
                :pos-x="40" :pos-y="0" :width="width1" :height="height1" size="30">
            </v-resizable>
        </v-scene>
    </fragment>
    `,
  data: {
    width: 600,
    height: 400,
    x: 100,
    y: 100,
    width1: 170,
    height1: 270
  },
  methods: {
    resize: function({ width, height }) {
      console.log("resize", width, height);
      this.width1 = width;
      this.height1 = height;
    },
    mousemove: function(target, local, global, evt) {
      console.log(target, local, global);
    }
  },
  components: {
    VScene,
    VResizable,
    VShape
  }
});
