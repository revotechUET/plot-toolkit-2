import Vue from 'vue';
import { Fragment } from 'vue-fragment';
import VScene from '../v-scene';
import VAxis from '../v-axis';
import VResizable from '../v-resizable';
import VRect, { VRectFactory } from '../v-rect';
import VLayer from '../v-layer';
import VViewport from '../v-viewport';
import VPath from '../v-path';

new Vue({
    el: "#vue-app",
    template: `<fragment>
        <v-scene :transparent="true"
            :view-width="sceneWidth" :view-height="sceneHeight" 
            layout-direction="horizontal"
            x-transform="none" y-transform="none">
            <v-viewport :viewportWidth="sceneWidth" :viewport-height="viewportHeight"
                :view-width="sceneWidth" :view-height="viewHeight"
                x-transform="none" y-transform="none" :clipped="false"
                :view-pos-x="10" :view-pos-y="10"
                :line-width="1" line-color="red">
                <v-rect-ext-mouse :view-pos-x="0" :view-pos-y="0"
                    :on-ext-mouse-pos="genTooltip" :enabled="true"
                    cursor="crosshair"
                    x-transform="none" y-transform="linear"
                    :real-min-y="realMinY" :real-max-y="realMaxY"
                    :fill-transparency="0.001"
                    :line-width="1" line-color="red" :line-transparency="1"
                    :view-width="sceneWidth" :view-height="viewHeight">
                    <v-layer :view-width="sceneWidth" :view-height="viewHeight" :tooltip-style="tooltipStyle"
                        x-transform="none" y-transform="none"
                        :line-width="0.75" cursor="crosshair" line-color="red"
                        :view-pos-x="0" :view-pos-y="0"
                        :viewport-pos-x="10" :viewport-pos-y="10"
                        :clipped="false" :enabled="true"
                        :ref-line-x="true" :ref-line-y="false">
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
                        <v-resizable :view-pos-x="w" :view-pos-y="0" :clipped="false"
                            :view-width="viewWidth" :view-height="viewHeight"
                            :constrained="false" :fill-color="0xFFFFFF" direction="horizontal"
                            :line-width="1" line-color="0x0000F0"
                            :knob-flags="[false, true]" :size="5"
                            x-transform="linear" y-transform="linear"
                            :real-min-x="realMinX" :real-max-x="realMaxX"
                            :real-min-y="realMinY" :real-max-y="realMaxY"
                            :on-resize="onResize2">
                            <v-path :view-width="viewWidth" :view-height="viewHeight + 100" 
                                :real-path="path" line-color="red" :symbol-shape="symbolShape" 
                                :symbol-size="symbolSize" :symbol-color="symbolColor" :line-dash="lineDash">
                            </v-path>
                        </v-resizable>
                    </v-layer>
                </v-rect-ext-mouse>
            </v-viewport>
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
            realMinX: 0,
            realMaxX: 1000,
            realMinY: 0,
            realMaxY: 1000,
            tooltipStyle: {
                fontSize: 13,
                stroke: '#FFFFFF',
                strokeThickness: 4,
                fontWeight: 'bold'
            },
            path: [
                { x: 150, y: 120 },
                { x: 500, y: 160 },
                { x: 250, y: 240 },
                { x: 500, y: 300 },
                { x: 300, y: 360 },
                { x: 500, y: 420 },
                { x: 300, y: 480 },
                { x: 150, y: 540 },
                { x: 500, y: 600 },
                { x: 200, y: 660 },
                { x: 500, y: 750 },
                { x: 150, y: 780 },
                { x: 600, y: 840 },
                { x: 850, y: 900 },
                { x: 350, y: 960 },
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
        genTooltip: function (comp, target, globalPos, srcLocalPos, refLines) {
            let localPos = comp.pixiObj.toLocal(globalPos);
            let yCoord = comp.transformY.invert(localPos.y);
            comp.signal('tooltip-on', comp, `y: ${yCoord.toFixed(4)}`);
        }
    },
    computed: {
        viewportWidth: function () {
            return this.w + this.viewWidth;
        }
    }
})