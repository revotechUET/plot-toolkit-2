import Vue from "vue";
import { Plugin } from "vue-fragment";
import VScene from "../v-scene";
import VShape from "../v-shape";
import VResizable from "../v-resizable";
import VTextBox from "../v-textbox";

Vue.use(Plugin);

const app = new Vue({
  el: "#vue-app",
  template: `<fragment>
        <v-scene name="scene" :transparent="true" :view-width="width" :view-height="height"
          :real-min-y="0" :real-max-y="500" y-transform="linear"
        >
            <v-resizable shape="rect" :enabled="false"
                :real-min-y="400"
                :real-max-y="500"
                :knob-flags="[true, true]"
                :fill-color="0xFFFFCC"
                name="resizeable" direction="vertical"
                :line-width="1" :line-color="0x888888"
                :on-resize="resize"
                :view-pos-x="40" :view-pos-y="0" 
                :view-width="width1" :view-height="height1" size="10">
              <v-text-box
                content="content"
                :view-pos-x="10"
                :view-pos-y="10"
              />
            </v-resizable>
        </v-scene>
    </fragment>
    `,
  data: {
    width: 600,
    height: 500,
    x: 100,
    y: 100,
    width1: 270,
    height1: 400
  },
  methods: {
    resize: function ({ width, height }) {
      console.log("Resize", width, height);
      this.width1 = width;
      this.height1 = height;
    }
  },
  components: {
    VScene,
    VResizable,
    VShape,
    VTextBox
  }
});
