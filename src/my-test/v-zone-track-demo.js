import Vue from 'vue';
import { Fragment } from 'vue-fragment';
import { Text } from 'pixi.js';
import VShading from '../v-shading';
import VScene from '../v-scene';
import VTrack from '../v-track';
import VTrack2 from '../v-track-2';
import VRect from '../v-rect';
import VResizable from '../v-resizable';
import VPath from '../v-path';
import VCurve from '../v-curve';
import Pallete from '../main/pallete.json';
import VLayer from '../v-layer';
import dataPolygon from '../main/data-polygon';
import VXone from '../v-xone';

new Vue({
    el: "#vue-app",
    template: `<fragment>
        <v-scene :transparent="true" 
            :view-width="1000" :view-height="viewHeight"
            :view-pos-x="0" :view-pos-y="0"
        >
            <v-rect :view-pos-x="0" :view-pos-y="0"
                :view-width="1000"
                :view-height="viewHeight"
                :fill-color="0xFFFFFF" :fill-transparency="0"
                :line-transparency="0"
            >
                <v-layer :view-width="trackViewWidth + trackViewWidth1" 
                    :view-height="viewHeight"
                    x-transform="none" y-transform="none"
                    :view-pos-x="0" :view-pos-y="trackHeaderHeight"
                    :enabled="true" :clipped="false"
                    :tooltip-style="tooltipStyle"
                    line-dash="3 2"
                    ref="myLayer"
                    :line-width="0.75" line-color="red"
                    :viewport-pos-y="trackHeaderHeight"
                    :ref-line-x="true" :ref-line-y="false"
                >
                    <v-track-2
                        name="vtrack0"
                        :gen-tooltip="genTooltip"
                        :track-view-width="trackViewWidth"
                        :view-width="trackViewWidth" 
                        :view-height="viewHeight"
                        :on-resize="trackResize" 
                        :track-body-height="trackBodyHeight"
                        :track-header-resize="trackHeaderResize"
                        :trackHeaderHeight="trackHeaderHeight"
                        :view-pos-x="0" :view-pos-y="-trackHeaderHeight"
                        :real-min-x="realMinX" :real-max-x="realMaxX"
                        :real-min-y="realMinY" :real-max-y="realMaxY"
                        :view-port-real-min-y="viewPortRealMinY"
                        :view-port-real-max-y="viewPortRealMaxY"
                        x-transform="linear" y-transform="linear"
                        fill-color="rgba(255, 100, 0, 0.05)"
                        cursor="pointer"
                        :enabled="true"
                        zone-header-label="zone"
                    >
                        <v-xone
                            :knob-flags="[true, true]"
                            :fill-color="fillColor1"
                            :name="label1" 
                            direction="vertical"
                            :real-min-y="realMinY1"
                            :real-max-y="realMaxY1"
                            x-transform="none"
                            y-transform="linear"
                            :handleRealY="handleRealY1"
                            :view-width="trackViewWidth"
                            :line-width="1"
                            :line-color="0x888888"
                            :content="label1"
                            :content-style="style"
                            :no-label="false"
                            :no-fill="false"
                        />
                        <v-xone
                            :knob-flags="[true, true]"
                            :fill-color="fillColor3"
                            :name="label3" 
                            direction="vertical"
                            :real-min-y="realMinY3"
                            :real-max-y="realMaxY3"
                            x-transform="none"
                            y-transform="linear"
                            :handleRealY="handleRealY3"
                            :view-width="trackViewWidth"
                            :line-width="3"
                            :line-color="0x888888"
                            :content="label3"
                            :content-style="style"
                            :no-label="false"
                            :no-fill="false"
                        />
                        <v-xone
                            :knob-flags="[true, true]"
                            :fill-color="fillColor2"
                            :name="label2" 
                            direction="vertical"
                            :real-min-y="realMinY2"
                            :real-max-y="realMaxY2"
                            x-transform="none"
                            y-transform="linear"
                            :handleRealY="handleRealY2"
                            :view-width="trackViewWidth"
                            :line-width="2"
                            :line-color="0x888888"
                            :content="label2"
                            :content-style="style"
                            :no-label="false"
                            :no-fill="false"
                        />
                    </v-track-2>
                </v-layer>
            </v-rect>
        </v-scene>
    </fragment>`,
    data: function () {
        return {
            style: {
                fontSize: 13
            },
            trackRealMinY: 0,
            trackRealMaxY: 4662,
            viewWidth: 200,
            viewHeight: 700,
            width: 50,
            trackBodyHeight: 2000,
            trackViewWidth: 200,
            trackViewWidth1: 200,
            trackHeaderHeight: 80,
            realMinX: 14,
            realMaxX: 30,
            realMinY: 0,
            realMaxY: 9000,
            viewPortRealMinY: 1000,
            viewPortRealMaxY: 3000,
            tooltipStyle: {
                fontSize: 13,
            },
            label1: 'abc',
            realMinY1: 0,
            realMaxY1: 1500,
            fillColor1: '0xCCFFCC',

            label2: 'def',
            realMinY2: 2000,
            realMaxY2: 2500,
            fillColor2: '0xCCAA00',

            label3: 'ghi',
            realMinY3: 2500,
            realMaxY3: 5000,
            fillColor3: '0xCCFF00'
        }
    },
    computed: {

    },
    methods: {
        trackResize: function ({ width, height }, comp) {
            this.trackViewWidth = width;
        },
        trackHeaderResize: function ({ width, height }, comp) {
            this.trackHeaderHeight = height + 20;
        },
        genTooltip: function (comp, target, globalPos, srcLocalPos, refLines) {
            let localPos = comp.pixiObj.toLocal(globalPos);
            const width = comp.$children[0].viewWidth;
            let xCoord = comp.transformX.invert(localPos.x);
            let yCoord = comp.transformY.invert(localPos.y);
            comp.signal('tooltip-on', comp, {
                content: `y: ${yCoord.toFixed(4)}`,
                viewWidth: width,
                viewHeight: 50,
                fillColor: '#F0F000',
                fillTransparency: 0.3,
                tooltipPosY: this.trackHeaderHeight
            });
        },
        handleRealY1: function(realMinY, realMaxY) {
            this.realMinY1 = realMinY;
            this.realMaxY1 = realMaxY;
        },
        handleRealY2: function(realMinY, realMaxY) {
            this.realMinY2 = realMinY;
            this.realMaxY2 = realMaxY;
        },
        handleRealY3: function(realMinY, realMaxY) {
            this.realMinY3 = realMinY;
            this.realMaxY3 = realMaxY;
        }
    },
    components: {
        Fragment, VScene, VTrack, VRect,
        VShading, VPath, VCurve, VLayer, VResizable,
        VTrack2, VXone
    }
})