import Vue from 'vue';
import { Fragment } from 'vue-fragment';
import VScene from '../v-scene';
import VAxis from '../v-axis';
import VResizable from '../v-resizable';
import VRect, { VRectFactory } from '../v-rect';
import VLayer from '../v-layer';
import VViewport from '../v-viewport';
import VPath from '../v-path';
import data from '../main/data-polygon';

new Vue({
    el: "#vue-app",
    template: `<fragment>
        <v-scene :transparent="true"
            :view-width="sceneWidth + 10" :view-height="viewHeight" 
            layout-direction="horizontal"
            fill-color="0xFFFFFF"
            x-transform="none" y-transform="none">
            <v-resizable :view-pos-x="10" :view-pos-y="10"
                :view-width="sceneWidth" :view-height="viewportHeight" 
                direction="vertical"
                fill-color="0xFFFFFF"
                :knob-flags="[true, true]" :size="5"
                :on-resize="resizeVertical">
                <v-viewport :viewportWidth="sceneWidth" :viewport-height="viewportHeight"
                    :view-width="sceneWidth" :view-height="viewHeight"
                    x-transform="none" y-transform="none" :clipped="false"
                    fill-color="0xFFFFFF"
                    :view-pos-x="0" :view-pos-y="0"
                    :line-width="1" line-color="red">
                    <v-layer :view-width="sceneWidth" :view-height="viewHeight" :tooltip-style="tooltipStyle"
                            x-transform="none" y-transform="none"
                            :line-width="0.75" cursor="crosshair" line-color="red"
                            :view-pos-x="0" :view-pos-y="0"
                            :viewport-pos-y="10"
                            :clipped="false" :enabled="true"
                            :ref-line-x="true" :ref-line-y="false">
                        <v-rect-ext-mouse :view-pos-x="0" :view-pos-y="0"
                            name="vrect0"
                            :on-ext-mouse-pos="(...args) => genTooltip(...args)" :enabled="true"
                            cursor="crosshair"
                            x-transform="none" y-transform="linear"
                            :real-min-y="realMinY" :real-max-y="realMaxY"
                            :fill-transparency="0.001"
                            :line-width="1" line-color="red" :line-transparency="1"
                            :view-width="sceneWidth" :view-height="viewHeight">
                            <v-resizable :view-pos-x="0" :view-pos-y="0" :clipped="true"
                                :view-width="w" :view-height="viewHeight" direction="horizontal"
                                :constrained="false"
                                :knob-flags="[false, true]" :size="5"
                                x-transform="none" y-transform="none"
                                :on-resize="onResize">
                                <v-axis :clipped="true"
                                    axis="y" :view-width="w" :view-height="viewHeight" 
                                    :real-min-y="realMinY" :real-max-y="realMaxY" 
                                    y-transform="linear" x-transform="none"
                                    :grid="false"
                                    :major-ticks="4" :minor-ticks="4" 
                                    :line-width="1" :line-color="0x0000F0"
                                    :fill-color="0xFFFFEE"
                                    tick-label-position="middle"
                                    :tick-precision="2">
                                </v-axis>
                            </v-resizable>
                        </v-rect-ext-mouse>
                        <v-rect-ext-mouse :view-pos-x="w" :view-pos-y="0"
                            name="vrect1"
                            :on-ext-mouse-pos="(...args) => genTooltip(...args)" :enabled="true"
                            cursor="crosshair"
                            x-transform="none" y-transform="linear"
                            :real-min-y="realMinY" :real-max-y="realMaxY"
                            :fill-transparency="0.001"
                            :line-width="1" line-color="red" :line-transparency="1"
                            :view-width="sceneWidth" :view-height="viewHeight">
                            <v-resizable :view-pos-x="0" :view-pos-y="0" :clipped="false"
                                :view-width="viewWidth" :view-height="viewHeight"
                                :constrained="false" :fill-color="0xFFFFFF" direction="horizontal"
                                :line-width="1" line-color="0x0000F0"
                                :knob-flags="[false, true]" :size="5"
                                x-transform="linear" y-transform="linear"
                                :real-min-x="realMinX" :real-max-x="realMaxX"
                                :real-min-y="realMinY" :real-max-y="realMaxY"
                                :on-resize="onResize2">
                                <v-path :view-width="viewWidth" :view-height="viewHeight" 
                                    :real-path="myData1" symbol-color="0xFF0000">
                                </v-path>
                                <v-path :view-width="viewWidth" :viewHeight="viewHeight"
                                    :real-path="path" symbol-color="0xF0F000" symbol-shape="plus"
                                    :symbol-size="5"
                                    :line-width="1">
                                </v-path>
                            </v-resizable>
                        </v-rect-ext-mouse>
                    </v-layer>
                </v-viewport>
            </v-resizable>
        </v-scene>
    </fragment>`,
    data: function () {
        return {
            sceneWidth: 800,
            sceneHeight: 600,
            w: 150,
            h: 400,
            viewWidth: 200,
            viewHeight: 500,
            viewportHeight: 400,
            realMinX: 6,
            realMaxX: 30,
            realMinY: 325,
            realMaxY: 3500,
            tooltipStyle: {
                fontSize: 13,
            },
            path: [
                { x: 7, y: 620 },
                { x: 10, y: 760 },
                { x: 25, y: 1040 },
                { x: 20, y: 1200 },
                { x: 15, y: 1500 },
                { x: 8, y: 1820 },
                { x: 26, y: 2150 },
                { x: 20, y: 2340 },
                { x: 16, y: 2600 },
                { x: 20, y: 2860 },
                { x: 10, y: 3000 },
                { x: 25, y: 3110 },
                { x: 16, y: 3240 },
                { x: 12, y: 3350 },
                { x: 29, y: 3450 },
            ],
            symbolShape: "star",
            symbolSize: "2",
            symbolColor: "0xde3249",
            lineDash: "4 3",
        }
    },
    components: {
        Fragment, VScene, VAxis, VPath,
        VResizable, VRect, VLayer, VViewport,
        VRectExtMouse: VRectFactory({ extMouseListener: true })
    },
    methods: {
        onResize: function ({ width, height }) {
            this.w = width;
        },
        onResize2: function ({ width, height }, comp) {
            console.log(width, height, comp);
            this.viewWidth = width;
        },
        resizeVertical: function ({ width, height }, comp) {
            this.viewportHeight = height;
        },
        genTooltip: function (comp, target, globalPos, srcLocalPos, refLines) {
            const width = comp.$children[0].viewWidth;
            let localPos = comp.pixiObj.toLocal(globalPos);
            let yCoord = comp.transformY.invert(localPos.y);
            comp.signal('tooltip-on', comp, {
                content: `y: ${yCoord.toFixed(4)}`,
                viewWidth: width,
                viewHeight: 50,
                fillColor: '#F0F000',
                fillTransparency: 0.3,
                tooltipPosY: comp.$children[0].viewPosY + 10
            });
        }
    },
    computed: {
        viewportWidth: function () {
            return this.w + this.viewWidth;
        },
        myData1: function () {
            let res = [];
            for (let i = 0; i < data.length; i += 2) {
                res.push({
                    x: data[i],
                    y: data[i + 1]
                });
            }
            return res;
        }
    }
})