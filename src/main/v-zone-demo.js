import Vue from "vue";
import { Plugin } from "vue-fragment";
import VScene from "../v-scene";
import VResizable from "../v-resizable";
import VZone from "../v-zone";
Vue.use(Plugin);

const app = new Vue({
	el: "#vue-app",
	template: `<fragment>
        <v-scene name="scene" :transparent="true" :view-width="width" :view-height="height">
            <v-zone shape="rect" :enabled="false"
                :knob-flags="[true, true]"
                :fill-color="0xFFFFCC"
                name="resizeable" direction="vertical"
                :line-width="1" :line-color="0x888888"
                :on-resize="resize"
				:view-pos-x="40" :view-pos-y="0" :view-width="width1" :view-height="height1" size="10"
				content="Troifds dsff dsf sd" :content-style="style" margin-top="50" margin-left="15"  :clipped="true"
				>
            </v-zone>
        </v-scene>
    </fragment>
    `,
	data: {
		width: 600,
		height: 400,
		x: 100,
		y: 100,
		width1: 270,
		height1: 270,
		style: {
			fontFamily: "Arial",
			fontSize: 20,
			fontStyle: "italic",
			fontWeight: "bold",
			fill: ["#ffffff", "#00ff99"], // gradient
			stroke: "#4a1850",
			strokeThickness: 5,
			dropShadow: true,
			dropShadowColor: "#000000",
			dropShadowBlur: 4,
			dropShadowAngle: Math.PI / 6,
			dropShadowDistance: 6,
			wordWrap: true,
			wordWrapWidth: 440,
			backgroundColor: "red",
		},
	},
	methods: {
		resize: function({ width, height }) {
			console.log("resize", width, height);
			this.width1 = width;
			this.height1 = height;
		},
		mousemove: function(target, local, global, evt) {
			console.log(target, local, global);
		},
	},
	components: {
		VScene,
		VResizable,
		VZone,
	},
});
