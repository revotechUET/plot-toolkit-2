const Vue = require("vue").default;
const FragmentPlugin = require("vue-fragment").Plugin;
const VScene = require("../v-scene").default;
const VShape = require("../v-shape").default;
const VRect = require("../v-rect").default;
const VCircle = require("../v-circle").default;
const VPolygon = require("../v-polygon").default;
const VPath = require("../v-path").default;

Vue.use(FragmentPlugin);

/*const template = `<fragment>
    <v-scene v-bind:transparent="true" v-bind:view-width="width" v-bind:view-height="height">
        <v-polygon :path="[0, 1, 32, 21, 0, 41, 33, 61, 4, 81, 32, 101, 0, 101]" :enabled="true">
        </v-polygon>
        <v-circle 
            :line-width='3'
            radius="60"
            :view-pos-x="x"
            :view-pos-y="y"
            :fill-transparency="1"
            :fill-color="0xFFDDDD"
            line-color="0x00FF00"
            :clipped="false"
            :enabled="true"
            :onmousedown="click1"
            :draggable="true"
            :onDrop="dropFn"
            view-width="180"
            view-height="180">
        </v-circle>
        <v-rect 
            fill-color="0xFFFFDD" 
            :view-pos-x="x + 100" 
            :view-pos-y="y + 100"
            line-color="#FF00FF"
            :enabled="true"
            :onmousedown="click1"
            view-height="180"
            view-width="180">
        </v-rect>
        <v-polygon
            fill-color="0xFFFF11" 
            :view-pos-x="x+100" 
            :view-pos-y="y-50"
            line-color="#FF11FF"
            :enabled="true"
            :path="[0, 1, 32, 21, 0, 41, 33, 61, 4, 81, 32, 101]"
            >
        </v-polygon>
        <v-path v-bind:view-path="path" :enabled="true" shape="star"></v-path>
    </v-scene>
    <button v-on:click="double">Click me</button>
</fragment>
`;*/

const template = `<fragment>
    <v-scene :transparent="true" :view-width="width" :view-height="height" 
      x-transform="linear" y-transform="linear" :view-pos-x="0" :view-pos-y="0"
      :real-min-x="0" :real-max-x="5" :real-min-y="10" :real-max-y="500">
        <v-path :real-path="path1" :enabled="true" :symbol-shape="symbolShape" :symbol-size="symbolSize" :symbol-color="symbolColor" :line-dash="lineDash"></v-path>
    </v-scene>
    <button v-on:click="double">Click me</button>
</fragment>
`;
const app = new Vue({
    el: "#vue-app",
    template: template,
    data: {
        width: 600,
        height: 400,
        x: 100,
        y: 100,
        symbolShape: "star",
        symbolSize: 3,
        symbolColor: "0xde3249",
        lineDash: "  15    3  ",
        path1: [
            { x: 0.53, y: 10 },
            { x: 0.93, y: 30 },
            { x: 1.2, y: 50 },
            { x: 0.6, y: 70 },
            { x: 1.5, y: 90 },
            { x: 0.93, y: 110 },
            { x: 1.8, y: 130 },
            { x: 2.1, y: 150 },
            { x: 2.8, y: 170 },
            { x: 3.1, y: 190 },
            { x: 1.9, y: 210 },
            { x: 2.5, y: 230 },
            { x: 2.9, y: 250 },
            { x: 3.3, y: 270 },
            { x: 1.0, y: 290 },
            { x: 0.7, y: 310 },
            { x: 1.8, y: 330 },
            { x: 2.0, y: 350 },
            { x: 3.0, y: 370 },
            { x: 4.1, y: 390 },
            { x: 2.9, y: 410 },
            { x: 3.8, y: 430 },
            { x: 2.5, y: 450 },
            { x: 1.6, y: 470 },
            { x: 4.0, y: 490 },
        ]
    },
    methods: {
        double: function (evt) {
            this.x += 10;
            this.y += 10;
            this.$nextTick(() => {
                console.log("x and y", this.x, this.y);
            })
        },
        click1: function (target, localPos, globalPos, evt) {
            target.hostComponent.$nextTick(() => {
                target.zIndex++;
            });
        },
        dropFn: function (target, pos) {
            if (pos.x !== undefined) this.x = pos.x;
            if (pos.y !== undefined) this.y = pos.y;
        }
    },
    components: {
        VScene,
        VShape,
        VRect,
        VCircle,
        VPolygon,
        VPath
    }
});
