import Vue from "vue";
import { Plugin } from "vue-fragment";
import VScene from "../v-scene";
import VShape from "../v-shape";
import VResizable from "../v-resizable";

Vue.use(Plugin);

const app = new Vue({
  el: "#vue-app",
  template: `<fragment>
        <v-scene name="scene" :transparent="true" :view-width="width" :view-height="height">
            <v-resizable shape="rect" :enabled="false"
                :knob-flags="[true, true]"
                :fill-color="0xFFFFCC"
                name="resizeable" direction="horizontal"
                :line-width="1" :line-color="0x888888"
                :on-resize="resize"
                :view-pos-x="40" :view-pos-y="0" :view-width="width1" :view-height="height1" size="10">
            </v-resizable>
        </v-scene>
    </fragment>
    `,
  data: {
    width: 600,
    height: 400,
    x: 100,
    y: 100,
    width1: 270,
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
