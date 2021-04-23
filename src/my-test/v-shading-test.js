import Vue from 'vue';
import { Fragment } from 'vue-fragment';
import VScene from '../v-scene';
import VShading from '../v-shading';
import VPath from '../v-path';

new Vue({
    el: "#vue-app",
    template: `<fragment>
        <v-scene :transparent="true" :view-width="viewWidth" :view-height="viewHeight"
            :view-pos-x="0" :view-pos-y="0"
            :real-min-x="realMinX" :real-max-x="realMaxX"
            :real-min-y="realMinY" :real-max-y="realMaxY"
            x-transform="linear" y-transform="linear">
            <v-shading
                fill-color="rgba(255, 0, 0, 0.3)" 
                :real-min-x="realMinX" :real-max-x="realMaxX"
                :real-min-y="realMinY" :real-max-y="realMaxY"
                :real-right="realPath1"
                :real-left="18"
                line-color="#000000"
                min-color="#F0F000"
                max-color="#0000FF"
                :shading-direction="shadingDirection">
            </v-shading>
            <v-path :real-path="realPathObjFormat1" symbol-color="0xFF0000">
            </v-path>
        </v-scene>
    </fragment>`,
    data: function () {
        return {
            viewWidth: 200,
            viewHeight: 500,
            realMinX: 14,
            realMaxX: 30,
            realMinY: 325,
            realMaxY: 3500,
            shadingDirection: "left",
            realPath1: [
                { x: 18, y: 400 },
                { x: 20.32, y: 650 },
                { x: 15.5, y: 850 },
                { x: 22, y: 1000 },
                { x: 25.32, y: 1200 },
                { x: 20, y: 1600 },
                { x: 15.5, y: 2000 },
                { x: 20.32, y: 2500 },
                { x: 18.32, y: 3200 }
            ],
            realPath2: [
                { x: 15, y: 400 },
                { x: 23.32, y: 650 },
                { x: 18.5, y: 850 },
                { x: 25, y: 1000 },
                { x: 28.32, y: 1200 },
                { x: 23, y: 1600 },
                { x: 18.5, y: 2000 },
                { x: 23.32, y: 2500 },
                { x: 15.32, y: 3200 }
            ],
        }
    },
    computed: {
        realPathObjFormat1: function () {
            let res = [];
            for (let i = 0; i < this.realPath1.length; i += 2) {
                res.push({
                    x: this.realPath1[i],
                    y: this.realPath1[i + 1]
                })
            }
            return res;
        },
        realPathObjFormat2: function () {
            let res = [];
            for (let i = 0; i < this.realPath2.length; i += 2) {
                res.push({
                    x: this.realPath2[i],
                    y: this.realPath2[i + 1]
                });
            }
            return res;
        }
    },
    components: {
        Fragment, VScene, VShading, VPath
    }
})