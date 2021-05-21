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
                        <v-xone v-for="(zone, idx) in listZone"
                            :key="idx"
                            :knob-flags="[true, true]"
                            :fill-color="zone.fillColor"
                            :name="zone.label" 
                            direction="vertical"
                            :real-min-y="zone.realMinY"
                            :real-max-y="zone.realMaxY"
                            y-transform="linear"
                            :line-width="1"
                            :line-color="0x888888"
                            :content="zone.label"
                            :content-style="style"
                            :no-label="false"
                            :no-fill="false"
                            x-transform="none"
                            :view-width="trackViewWidth"
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
            listZone: [
                {label: 'abc', realMinY: 0, realMaxY: 1000, fillColor: '0xCCFFCC'},
                {label: 'def', realMinY: 2000, realMaxY: 3000, fillColor: '0xAABBFF'},
                {label: 'ghi', realMinY: 4000, realMaxY: 4500, fillColor: '0xAABBFF'},
            ]
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
        }
    },
    components: {
        Fragment, VScene, VTrack, VRect,
        VShading, VPath, VCurve, VLayer, VResizable,
        VTrack2, VXone
    }
})