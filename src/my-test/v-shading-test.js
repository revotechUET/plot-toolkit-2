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
                fill-color="0xf0f5f5" :fill-transparency="1"
                :real-min-x="realMinX" :real-max-x="realMaxX"
                :real-min-y="realMinY" :real-max-y="realMaxY"
                x-transform="linear" y-transform="linear"> 
                <v-shading
                    fill-color="rgba(255, 0, 0, 0.3)" 
                    :view-width="viewWidth" :view-height="viewHeight"
                    :real-right="realPath1"
                    :real-left="20"
                    line-color="#000000"
                    cursor="crosshair"
                    :enabled="true"
                    min-color="#F0F000"
                    max-color="#0000FF"
                    type-fill-color="Palette"
                    :palette="myPalette['BGR']"
                    :fill-pattern-list="fillPatternList"
                    :custom-fill-values="fillValues"
                    :foreground-color-list="foregroundColorList"
                    :background-color-list="backgroundColorList"
                    :is-normal-fill="false"
                    :positive-side-color="positiveSideColor"
                    :negative-side-color="negativeSideColor"
                    :shading-positive-high-value="30" :shading-positive-low-value="18"
                    :shading-negative-high-value="18" :shading-negative-low-value="14"
                    :positive-side-palette="myPalette['HFU']"
                    :negative-side-palette="myPalette['RandomColor']">
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
                { lowVal: 14, highVal: 17 },
                { lowVal: 17, highVal: 21 },
                { lowVal: 26, highVal: 30 },
                { lowVal: 21, highVal: 26 },
            ],
            backgroundColorList: ["blue", "green", "red", "orange"],
            fillPatternList: [
                "/pattern/Sandstone9_.png", "/pattern/point_.png", "/pattern/Clay_shale_.png", "/pattern/Limestone_.png"
            ],
            foregroundColorList: ["white", "red", "yellow", "green"],
            positiveSideColor: {
                minColor: 0x009933,
                maxColor: 0xFF0000
            },
            negativeSideColor: {
                minColor: 0x0000FF,
                maxColor: 0xF0F000
            }
        }
    },
    computed: {
        myPalette: function () {
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