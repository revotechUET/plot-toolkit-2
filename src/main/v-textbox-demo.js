import Vue from "vue";
import { Fragment } from "vue-fragment";
import VTextbox from "../v-textbox";
import VScene from "../v-scene";

new Vue({
	el: "#vue-app",
	template: `<fragment>
        <v-scene :view-width="600" :view-height="400" :transparent="true">
            <v-textbox :view-pos-x="30" :view-pos-y="30" :view-width="100" :view-height="50" 
                :line-width="1" :clipped="true"
                line-color="rgba(0, 0, 255, 1)" fill-color="#FFFF0088" content="Troi" :content-style="style" content-pos="30 10"
            />
        </v-scene>
    </fragment>
	`,
	data: {
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
			wordWrapWidth: 440
		},
		data: "huan"
	},
	components: {
		Fragment,
		VTextbox,
		VScene
	}
});
