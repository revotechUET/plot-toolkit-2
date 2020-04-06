const Vue = require('vue').default;
const FragmentPlugin = require('vue-fragment').Plugin;
const VScene = require('../v-scene').default;
const VShape = require('../v-shape').default;

Vue.use(FragmentPlugin);

const app = new Vue({
    el: "#vue-app",
    template: `<fragment>
        <v-scene v-bind:transparent="true" v-bind:width="width" v-bind:height="height">
            <v-shape shape="polygon" :path="[0, 1, 32, 21, 0, 41, 33, 61, 4, 81, 32, 101, 0, 101, 0, 1]" :enabled="true">
            </v-shape>
            <v-shape v-bind:shape="shape" 
                :line-width='3'
                radius="60"
                :pos-x="x"
                :pos-y="y"
                :fill-transparency="1"
                :fill-color="0xFFDDDD"
                line-color="0x00FF00"
                width="180"
                :clipped="false"
                :enabled="true"
                :onmousedown="click1"
                :draggable="true"
                :onDrop="dropFn"
                height="180">
            </v-shape>
            <v-shape shape="rect"
                fill-color="0xFFFFDD" 
                :pos-x="x + 100" 
                :pos-y="y + 100"
                line-color="#FF00FF"
                height="180"
                :enabled="true"
                :onmousedown="click1"
                width="180">
            </v-shape>
        </v-scene>
        <button v-on:click="double">Click me</button>
    </fragment>
    `,
    data : {
        width: 600,
        height: 400,
        x: 100,
        y: 100,
        shape: 'circle'
    },
    methods: {
        double: function(evt) {
            this.x += 10;
            this.y += 10;
        },
        click1: function(target, localPos, globalPos, evt) {
            target.hostComponent.$nextTick(() => {
                target.zIndex++;
            });
        },
        dropFn: function(target, pos) {
            if (pos.x !== undefined ) this.x = pos.x;
            if (pos.y !== undefined ) this.y = pos.y;
        }
    },
    components: {
        VScene, VShape
    }
});