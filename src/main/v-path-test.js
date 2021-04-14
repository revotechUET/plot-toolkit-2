const Vue = require("vue").default;
const FragmentPlugin = require("vue-fragment").Plugin;
const VScene = require("../v-scene").default;
const VShape = require("../v-shape").default;
const VRect = require("../v-rect").default;
const VCircle = require("../v-circle").default;
const VPolygon = require("../v-polygon").default;
const VPath = require("../v-path").default;

Vue.use(FragmentPlugin);

const app = new Vue({
	el: "#vue-app",
	template: `<fragment>
        <v-scene :transparent="true" :view-width="width" :view-height="height" 
				x-transform="linear" y-transform="linear" :view-pos-x="0" :view-pos-y="0"
        		:real-min-x="0" :real-max-x="5" :real-min-y="10" :real-max-y="500">

			<v-rect :line-width="1" line-color="red" :view-pos-x="100"
				:view-pos-y="50" 
				:clipped="false"
				:view-width="width-400" :view-height="height-100"
				:real-min-x="0" :real-max-x="5"
				:real-min-y="0" :real-max-y="500"
				x-transform='linear'
				y-transform='linear'
			>
		
				<v-path :real-path="path" :enabled="true" :symbol-shape="symbolShape" 
					:symbol-size="symbolSize" :symbol-color="symbolColor" :line-dash="lineDash">
				</v-path>
			</v-rect>

        </v-scene>
        <button v-on:click="double">Click me</button>
    </fragment>
    `,
	data: {
		width: 1000,
		height: 800,
		x: 100,
		y: 100,
		symbolShape: "plus",
		symbolSize: "5",
		symbolColor: "",
		lineDash: "5 3",
		path: [
			{ x: 0.90, y: 0 },
			{ x: 2.10, y: 50 },
			{ x: 1.00, y: 90 },
			{ x: 1.50, y: 100 },
			{ x: 1.20, y: 120 },
			{ x: 3.0, y: 130 },
			{ x: 5.00, y: 150 },
			{ x: 3.00, y: 200 },
			{ x: 1.55, y: 220 },
			{ x: 1.89, y: 250 },
			{ x: 5.0, y: 300 },
			{ x: 2.50, y: 350 },
			{ x: 1.50, y: 400 },
			{ x: 5.60, y: 500 },
		],
	},
	methods: {
		double: function (evt) {
			this.x += 10;
			this.y += 10;
		},
		click1: function (target, localPos, globalPos, evt) {
			target.hostedComponent.$nextTick(() => {
				target.zIndex++;
			});
		},
		dropFn: function (target, pos) {
			this.x = pos.x;
			this.y = pos.y;
		},
	},
	components: {
		VScene,
		VShape,
		VRect,
		VCircle,
		VPolygon,
		VPath,
	},
});
