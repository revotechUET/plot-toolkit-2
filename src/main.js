const Vue = require('vue').default;
const Hello = require('./hello/index.js').default;
const MyHello = require('./myHello').default;
const FragmentPlugin = require('vue-fragment').Plugin;
const VScene = require('./v-scene').default;
const VShape = require('./v-shape').default;

Vue.use(FragmentPlugin);

const app = new Vue({
    el: "#vue-app",
    template: `<fragment>
        <div class=".root">
            <span>{{message}}</span>
        </div>
        <Hello slogan="Cong hoa xa hoi chu nghia" title="Don xin nghi hoc" />
        <v-scene v-bind:transparent="true" v-bind:width="width" v-bind:height="height">
            <v-shape shape="polygon" :path="[0, 1, 32, 21, 0, 41, 33, 61, 4, 81, 32, 101, 0, 101, 0, 1]" :enabled="true" />
            <v-shape v-bind:shape="shape" 
                :line-width='3' 
                radius="60" 
                :pos-x="x+1" 
                :pos-y="y+1"
                :fill-transparency="1"
                :fill-color="0xFFDDDD"
                line-color="0x00FF00"
                width="180"
                :clipped="true"
                :enabled="true"
                :onmousedown="click1"
                height="180">
                <v-shape shape="rect"
                    fill-color="0xFFFFDD" 
                    :pos-x="x+1" 
                    :pos-y="y+1"
                    line-color="#FF00FF"
                    height="180"
                    :enabled="true"
                    :onmousedown="click1"
                    width="180" />
            </v-shape>
        </v-scene>
        <button v-on:click="double">Click me</button>
        <my-hello slogan="Cong hoa xa hoi chu nghia" title="Don xin nghi hoc" size="17"/>
    </fragment>
    `,
    data : {
        message: "Cong hoa xa hoi chu nghia Viet Nammmm",
        width: 600,
        height: 400,
        x: 100,
        y: 100,
        shape: 'circle'
    },
    methods: {
        double: function(evt) {
            console.log(evt, this.width, this.height);
            /*this.width *= 1.5;
            this.height *= 1.5;
            */
            this.shape = 'rect';
        },
        click1: function(target, localPos, globalPos, evt) {
            console.log(target, localPos, globalPos, evt);
            target.hostedComponent.$nextTick(() => {
                target.zIndex++;
            });
        }
    },
    components: {
        Hello, VScene, MyHello, VShape
    }
});