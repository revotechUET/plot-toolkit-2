import Vue from 'vue';
import { Fragment } from 'vue-fragment';
import VShading from '../v-shading';
import VScene from '../v-scene';
import VTrack from '../v-track';
import VRect from '../v-rect';
import VPath from '../v-path';
import VCurve from '../v-curve';
import Pallete from '../main/pallete.json';

new Vue({
    el: "#vue-app",
    template: `<fragment>
        <v-scene :transparent="true" :view-width="600" :view-height="viewHeight"
            :view-pos-x="0" :view-pos-y="0">
            <v-track
                :track-view-width="trackViewWidth"
                :view-width="viewWidth" :view-height="viewHeight"
                :track-resize="trackResize" :track-body-height="trackBodyHeight"
                :track-header-resize="trackHeaderResize"
                :trackHeaderHeight="trackHeaderHeight" 
                trackHeaderFillColor="0xFFFFFF"
                :is-shading="isShading"
                :view-pos-x="0" :view-pos-y="0"
                fill-color="0xFFFFFF" :fill-transparency="1"
                :real-min-x="realMinX" :real-max-x="realMaxX"
                :real-min-y="realMinY" :real-max-y="realMaxY"
                x-transform="linear" y-transform="linear"
                :color-path-list="['0xFF0000', '0x00FF00']"
                :real-right="realPath2"
                :real-left="realPath1"
                cursor="crosshair"
                :enabled="true"
                >
                <v-shading
                    :view-pos-x="0" :view-pos-y="0"
                    name="Sang" :is-shading="shading"
                    :real-min-x="realMinX" :real-max-x="realMaxX"
                    :real-min-y="realMinY" :real-max-y="realMaxY"
                    :view-width="trackViewWidth" :view-height="trackBodyHeight"
                    x-transform="linear" y-transform="linear"
                    :real-right="realPath1" :real-left="realPath2"
                    cursor="crosshair"
                    :enabled="true"
                    min-color="#ffff00"
                    max-color="#33CC33"
                    type-fill-color="Pallete"
                    :pallete="myPallete['BGR']"
                    :onmousedown="shadingMouseDown"
                    :fill-pattern-list="fillPatternList"
                    :custom-fill-values="fillValues"  
                    :foreground-color-list="foregroundColorList"
                    :background-color-list="backgroundColorList">
                </v-shading>
                <v-path :real-path="realPath1" :symbol-color="0xFF0000"
                    name="HIHIHI"
                    :view-width="trackViewWidth">
                </v-path>
                <v-curve :real-path="realPath2" :symbol-color="0x0000FF"
                    :onmousedown="mousedown" :enabled="true"
                    line-dash="5 3"
                    :left-value="10" :right-value="20" unit="V/V"
                    :view-width="trackViewWidth">
                </v-curve>
            </v-track>
        </v-scene>
    </fragment>`,
    data: function () {
        return {
            shading: false,
            isShading: [false, false, false],
            viewWidth: 600,
            viewHeight: 700,
            trackBodyHeight: 1400,
            trackViewWidth: 200,
            trackHeaderHeight: 100,
            realMinX: 14,
            realMaxX: 30,
            realMinY: 325,
            realMaxY: 9000,
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
            foregroundColorList: ["white", "red", "yellow", "white"],
            realPath1: [
                { x: 18, y: 400 },
                { x: 20, y: 620 },
                { x: 20.5, y: 900 },
                { x: 22, y: 1000 },
                { x: 25.32, y: 1200 },
                { x: 20, y: 1600 },
                { x: 15.5, y: 2000 },
                { x: 17.32, y: 2500 },
                { x: 20.32, y: 2800 },
                { x: 17.32, y: 3200 },
                { x: 19.32, y: 3400 },
                { x: 21, y: 3700 },
                { x: 25.7, y: 4000 },
                { x: 19, y: 4300 },
                { x: 18, y: 4900 },
                { x: 20.32, y: 5150 },
                { x: 15.5, y: 5350 },
                { x: 22, y: 5500 },
                { x: 25.32, y: 5700 },
                { x: 20, y: 6100 },
                { x: 15.5, y: 6500 },
                { x: 17.32, y: 7000 },
                { x: 20.32, y: 7300 },
                { x: 17.32, y: 7700 },
                { x: 19.32, y: 7900 },
                { x: 21, y: 8200 },
                { x: 25.7, y: 8500 },
                { x: 19, y: 8800 },
            ],
            realPath2: [
                { x: 19, y: 400 },
                { x: 22.05, y: 620 },
                { x: 23, y: 900 },
                { x: 25, y: 1000 },
                { x: 28.32, y: 1200 },
                { x: 23, y: 1600 },
                { x: 18.5, y: 2000 },
                { x: 20.32, y: 2500 },
                { x: 21.32, y: 2800 },
                { x: 18.32, y: 3200 },
                { x: 21.32, y: 3400 },
                { x: 17, y: 3700 },
                { x: 29, y: 4000 },
                { x: 20, y: 4300 },
                { x: 15, y: 4900 },
                { x: 23.32, y: 5150 },
                { x: 18.5, y: 5350 },
                { x: 25, y: 5500 },
                { x: 28.32, y: 5700 },
                { x: 23, y: 6100 },
                { x: 18.5, y: 6500 },
                { x: 20.32, y: 7000 },
                { x: 21.32, y: 7300 },
                { x: 18.32, y: 7700 },
                { x: 21.32, y: 7900 },
                { x: 17, y: 8200 },
                { x: 29, y: 8500 },
                { x: 20, y: 8800 },
            ],
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
    methods: {
        trackResize: function ({ width, height }, comp) {
            this.trackViewWidth = width;
        },
        trackHeaderResize: function ({ width, height }, comp) {
            this.trackHeaderHeight = height;
        },
        mousedown: function (target, localPos, globalPos, evt) {
            console.log("component", target.hostComponent.name)
        },
        shadingMouseDown: function (target, localPos, globalPos, evt) {
            this.shading = !this.shading;
            this.isShading = this.isShading.map((child, idx) => child = idx === 0 ? !child : child);
        }
    },
    components: {
        Fragment, VScene, VTrack, VRect,
        VShading, VPath, VCurve
    }
})