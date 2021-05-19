import Vue from 'vue';
import { Fragment } from 'vue-fragment';
import VShading from '../v-shading';
import VScene from '../v-scene';
import VTrack from '../v-track';
import VRect from '../v-rect';
import VResizable from '../v-resizable';
import VPath from '../v-path';
import VCurve from '../v-curve';
import Pallete from '../main/pallete.json';
import VLayer from '../v-layer';
import dataPolygon from '../main/data-polygon';

new Vue({
    el: "#vue-app",
    template: `<fragment>
        <v-scene :transparent="true" :view-width="1000" :view-height="viewHeight"
            :view-pos-x="0" :view-pos-y="0">
                <v-layer :view-width="900" 
                    :view-height="viewHeight - trackHeaderHeight"
                    x-transform="none" y-transform="none"
                    :view-pos-x="0" :view-pos-y="trackHeaderHeight"
                    :enabled="true" :clipped="false"
                    :tooltip-style="tooltipStyle"
                    line-dash="3 2"
                    ref="myLayer"
                    :line-width="0.75" line-color="red"
                    :viewport-pos-y="trackHeaderHeight"
                    :ref-line-x="true" :ref-line-y="false">
                    <v-track
                        name="vtrack0"
                        :gen-tooltip="genTooltip"
                        :track-real-min-y="trackRealMinY" :track-real-max-y="trackRealMaxY"
                        :view-width="trackViewWidth" :view-height="viewHeight"
                        :on-resize="trackResize"
                        :track-header-resize="trackHeaderResize"
                        :track-header-height="trackHeaderHeight" 
                        track-header-fill-color="0xFFFFFF"
                        :view-pos-x="0" :view-pos-y="-trackHeaderHeight"
                        fill-color="0xFFFFFF" :fill-transparency="1"
                        :real-min-x="realMinX" :real-max-x="realMaxX"
                        :real-min-y="realMinY" :real-max-y="realMaxY"
                        x-transform="linear" y-transform="linear"
                        :real-right="realPath2"
                        :real-left="realPath1"
                        cursor="crosshair"
                        :enabled="true"
                        >
                        <v-curve :real-path="realPath1" :symbol-color="0xFF0000"
                            name="HIHIHI"
                            :view-width="trackViewWidth">
                        </v-curve>
                        <v-curve :real-path="realPath2" :symbol-color="0x0000FF"
                            :left-value="10" :right-value="20" unit="V/V"
                            :view-width="trackViewWidth">
                        </v-curve>
                        <v-shading
                            :view-pos-x="0" :view-pos-y="0"
                            name="Sang" :is-shading="shading"
                            :curve-low-value="9" :curve-high-value="10"
                            :real-min-x="realMinX" :real-max-x="realMaxX"
                            :real-min-y="realMinY" :real-max-y="realMaxY"
                            :view-width="trackViewWidth"
                            x-transform="linear" y-transform="linear"
                            :real-right="realPath1" :real-left="14.01"
                            cursor="crosshair"
                            :enabled="true"
                            min-color="#ffff00"
                            max-color="#33CC33"
                            type-fill-color="Pallete"
                            :pallete="myPallete['BGR']"
                            :fill-pattern-list="['Limestone']"
                            :custom-fill-values="[{ lowVal: 0, highVal: 1 }]"  
                            :foreground-color-list="['white']"
                            :background-color-list="['green']">
                        </v-shading>
                    </v-track>
                    <v-track
                        name="vtrack1" 
                        :gen-tooltip="genTooltip"
                        :track-real-min-y="trackRealMinY" :track-real-max-y="trackRealMaxY"
                        :view-width="trackViewWidth2" :view-height="viewHeight"
                        :on-resize="trackResize2"
                        :track-header-resize="trackHeaderResize"
                        :track-header-height="trackHeaderHeight" 
                        track-header-fill-color="0xFFFFFF"
                        :view-pos-x="trackViewWidth" :view-pos-y="-trackHeaderHeight"
                        fill-color="0xFFFFFF" :fill-transparency="1"
                        :real-min-x="realMinX" :real-max-x="realMaxX"
                        :real-min-y="realMinY" :real-max-y="realMaxY"
                        x-transform="linear" y-transform="linear"
                        :real-right="realPath2"
                        :real-left="realPath1"
                        cursor="crosshair"
                        :enabled="true"
                        >
                        <v-shading
                            :view-pos-x="0" :view-pos-y="0"
                            name="Test" :is-shading="shading2"
                            :real-min-x="realMinX" :real-max-x="realMaxX"
                            :real-min-y="realMinY" :real-max-y="realMaxY"
                            :view-width="trackViewWidth2"
                            x-transform="linear" y-transform="linear"
                            :real-right="14.01" :real-left="realPath1"
                            cursor="crosshair"
                            :enabled="true"
                            min-color="#ffff00"
                            max-color="#33CC33"
                            type-fill-color="Pallete"
                            :pallete="myPallete['BGR']"
                            :fill-pattern-list="fillPatternList"
                            :custom-fill-values="fillValues"  
                            :foreground-color-list="foregroundColorList"
                            :background-color-list="backgroundColorList">
                        </v-shading>
                        <v-shading
                            :view-pos-x="0" :view-pos-y="0"
                            name="Test 2" :is-shading="shading2"
                            :real-min-x="realMinX" :real-max-x="realMaxX"
                            :real-min-y="realMinY" :real-max-y="realMaxY"
                            :view-width="trackViewWidth2"
                            x-transform="linear" y-transform="linear"
                            :real-right="realPath2" :real-left="realPath1"
                            cursor="crosshair"
                            :enabled="true"
                            min-color="#F0F000"
                            max-color="#0000FF"
                            type-fill-color="Gradient"
                            :pallete="myPallete['BGR']"
                            :fill-pattern-list="fillPatternList"
                            :custom-fill-values="fillValues"  
                            :foreground-color-list="foregroundColorList"
                            :background-color-list="backgroundColorList">
                        </v-shading>
                        <v-curve :real-path="realPath2" :symbol-color="0xFF0000"
                            name="hehe"
                            :left-value="1.95" :right-value="2.95" unit="g/cm3"
                            :view-width="trackViewWidth2">
                        </v-curve>
                    </v-track>
                    <v-resizable
                        :view-pos-x="trackViewWidth + trackViewWidth2" :view-pos-y="-trackHeaderHeight"
                        direction="horizontal"
                        :view-width="width" :view-height="viewHeight"
                        :knob-flags="[false, true]" :size="5"
                        :fill-color="0xf2f2f2" :fill-transparency="1"
                        :on-resize="resize">
                    </v-resizable>
                    <v-track
                        name="vtrack3"
                        :gen-tooltip="genTooltip"
                        :track-real-min-y="trackRealMinY" :track-real-max-y="trackRealMaxY"
                        :view-width="trackViewWidth3" :view-height="viewHeight"
                        :on-resize="trackResize3"
                        :track-header-resize="trackHeaderResize"
                        :track-header-height="trackHeaderHeight" 
                        track-header-fill-color="0xFFFFFF"
                        :view-pos-x="trackViewWidth + width + trackViewWidth2" :view-pos-y="-trackHeaderHeight"
                        fill-color="0xFFFFFF" :fill-transparency="1"
                        :real-min-x="6" :real-max-x="realMaxX"
                        :real-min-y="realMinY" :real-max-y="realMaxY"
                        x-transform="linear" y-transform="linear"
                        :real-right="realPath2"
                        :real-left="realPath1"
                        cursor="crosshair"
                        :enabled="true"
                        >
                        <v-curve :real-path="realPath1" :symbol-color="0xFF0000"
                            name="hehe"
                            :left-value="1.95" :right-value="2.95" unit="g/cm3"
                            :view-width="trackViewWidth3">
                        </v-curve>
                    </v-track>
                </v-layer>
        </v-scene>
    </fragment>`,
    data: function () {
        return {
            shading: false,
            shading2: false,
            trackRealMinY: 1000,
            trackRealMaxY: 4662,
            viewWidth: 200,
            viewHeight: 700,
            width: 50,
            trackBodyHeight: 1400,
            trackViewWidth: 200,
            trackViewWidth2: 200,
            trackViewWidth3: 300,
            trackHeaderHeight: 120,
            realMinX: 14,
            realMaxX: 30,
            realMinY: 325,
            realMaxY: 9000,
            tooltipStyle: {
                fontSize: 13,
            },
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
        },
        myData1: function () {
            let res = [];
            for (let i = 0; i < dataPolygon.length; i += 2) {
                res.push({
                    x: dataPolygon[i],
                    y: dataPolygon[i + 1]
                });
            }
            return res;
        }
    },
    methods: {
        trackResize: function ({ width, height }, comp) {
            this.trackViewWidth = width;
            this.$refs.myLayer.tooltips.splice(0);
        },
        trackResize2: function ({ width, height }, comp) {
            this.trackViewWidth2 = width;
            this.$refs.myLayer.tooltips.splice(0);
        },
        trackResize3: function ({ width, height }, comp) {
            this.trackViewWidth3 = width;
            this.$refs.myLayer.tooltips.splice(0);
        },
        resize: function ({ width, height }, comp) {
            this.width = width;
            this.$refs.myLayer.tooltips.splice(0);
        },
        trackHeaderResize: function ({ width, height }, comp) {
            this.trackHeaderHeight = height;
        },
        genTooltip: function (comp, target, globalPos, srcLocalPos, refLines) {
            let localPos = comp.pixiObj.toLocal(globalPos);
            const width = comp.$children[0].viewWidth;
            let xCoord = comp.transformX.invert(localPos.x);
            let yCoord = comp.transformY.invert(localPos.y);
            comp.signal('tooltip-on', comp, {
                content: ` y: ${yCoord.toFixed(4)}`,
                viewWidth: width,
                viewHeight: 50,
                fillColor: '#F0F000',
                fillTransparency: 0.3,
                tooltipPosY: comp.$children[0].viewPosY + 10
            });
        },
    },
    components: {
        Fragment, VScene, VTrack, VRect,
        VShading, VPath, VCurve, VLayer, VResizable
    }
})