import Vue from 'vue';
import { Fragment } from 'vue-fragment';
import VScene from '../v-scene';
import VShading from '../v-shading';
import VPath from '../v-path';
import VRect from '../v-rect';
import Pallete from '../main/pallete.json';

new Vue({
    el: "#vue-app",
    template: `<fragment>
        <v-scene :transparent="true" :view-width="viewWidth" :view-height="viewHeight"
            :view-pos-x="0" :view-pos-y="0"
            x-transform="none" y-transform="none">
            <v-rect 
                :view-width="viewWidth" :view-height="viewHeight"
                :view-pos-x="0" :view-pos-y="0"
                fill-color="0x00FFCC" :fill-transparency="1"
                :real-min-x="realMinX" :real-max-x="realMaxX"
                :real-min-y="realMinY" :real-max-y="realMaxY"
                x-transform="linear" y-transform="linear"> 
                <v-shading
                    fill-color="rgba(255, 0, 0, 0.3)" 
                    :real-min-x="realMinX" :real-max-x="realMaxX"
                    :real-min-y="realMinY" :real-max-y="realMaxY"
                    :real-right="realPath2"
                    :real-left="realPath1"
                    line-color="#000000"
                    min-color="#F0F000"
                    max-color="#0000FF"
                    type-fill-color="Custom Fills"
                    :pallete="myPallete['BGR']"
                    :fill-pattern-list="fillPatternList"
                    :custom-fill-values="fillValues"
                    :foreground-color-list="foregroundColorList"
                    :background-color-list="backgroundColorList">
                </v-shading>
            </v-rect>
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
            realPath1: [
                { x: 18, y: 400 },
                { x: 20.32, y: 650 },
                { x: 15.5, y: 850 },
                { x: 22, y: 1000 },
                { x: 25.32, y: 1200 },
                { x: 20, y: 1600 },
                { x: 15.5, y: 2000 },
                { x: 17.32, y: 2500 },
                { x: 20.32, y: 2800 },
                { x: 17.32, y: 3200 },
                { x: 19.32, y: 3400 },
            ],
            realPath2: [
                { x: 15, y: 400 },
                { x: 23.32, y: 650 },
                { x: 18.5, y: 850 },
                { x: 25, y: 1000 },
                { x: 28.32, y: 1200 },
                { x: 23, y: 1600 },
                { x: 18.5, y: 2000 },
                { x: 20.32, y: 2500 },
                { x: 21.32, y: 2800 },
                { x: 18.32, y: 3200 },
                { x: 21.32, y: 3400 },
            ],
            fillValues: [
                { lowVal: 0.3, highVal: 0.6 },
                { lowVal: 0.3, highVal: 0 },
                { lowVal: 0.6, highVal: 0.75 },
                { lowVal: 0.75, highVal: 1 },
            ],
            backgroundColorList: ["blue", "green", "red", "orange"],
            fillPatternList: [
                "Massive sand or sandstone", "Quartz", "Limestone", "DBOS Metamorphic"
            ],
            foregroundColorList: ["white", "red", "yellow", "white"]
        }
    },
    computed: {
        realPathObjFormat1: function () {
            if (this.realPath1[0].x || this.realPath2[0].y) {
                return this.realPath1;
            }
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
            if (this.realPath2[0].x || this.realPath2[x].y) {
                return this.realPath2;
            }
            let res = [];
            for (let i = 0; i < this.realPath2.length; i += 2) {
                res.push({
                    x: this.realPath2[i],
                    y: this.realPath2[i + 1]
                });
            }
            return res;
        },
        myPallete: function () {
            return Pallete["content"];
        }
    },
    components: {
        Fragment, VScene, VShading, VPath, VRect
    },
    mounted: function () {
        console.log(Pallete["content"]["BGR"].length);
    }
})