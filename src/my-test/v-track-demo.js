import Vue from 'vue';
import { Fragment } from 'vue-fragment';
import VShading from '../v-shading';
import VScene from '../v-scene';
import VTrack from '../v-track';
import VRect from '../v-rect';
import VResizable from '../v-resizable';
import VPath from '../v-path';
import VCurve from '../v-curve';
import Palette from '../main/pallete.json';
import VLayer from '../v-layer';
import ContextMenu from '../context-menu';
import VXone from '../v-xone';
import { scaleLinear } from 'd3';

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
                        name="Zone Track" :grid="false"
                        track-type="Zone Track"
                        :after-mouse-down="contextMenuHandler"
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
                    </v-track>
                    <v-track
                        name="vtrack1" :after-mouse-down="contextMenuHandler"
                        :track-title-fill-color="0xF0F0F0"
                        :track-real-min-y="trackRealMinY" :track-real-max-y="trackRealMaxY"
                        :view-width="trackViewWidth2" :view-height="viewHeight"
                        :on-resize="trackResize2"
                        :track-header-resize="trackHeaderResize"
                        :track-header-height="trackHeaderHeight" 
                        track-header-fill-color="0xFFFFFF"
                        :view-pos-x="trackViewWidth" :view-pos-y="-trackHeaderHeight"
                        fill-color="0xFFFFFF" :fill-transparency="1"
                        :real-min-y="realMinY" :real-max-y="realMaxY"
                        x-transform="none" y-transform="linear"
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
                            :view-width="trackViewWidth2" :view-height="scaleTrackHeight"
                            x-transform="linear" y-transform="linear"
                            :real-right="14.01" :real-left="realPath1"
                            cursor="crosshair"
                            :curve-low-value="0" :curve-high-value="1"
                            :enabled="true"
                            min-color="#ffff00"
                            max-color="#33CC33"
                            type-fill-color="Palette"
                            :palette="myPalette['BGR']"
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
                            :view-width="trackViewWidth2" :view-height="scaleTrackHeight"
                            x-transform="linear" y-transform="linear"
                            :real-right="realPath2" :real-left="realPath1"
                            cursor="crosshair"
                            :enabled="true"
                            min-color="#F0F000"
                            max-color="#0000FF"
                            type-fill-color="Custom Fills"
                            :palette="myPalette['BGR']"
                            :fill-pattern-list="fillPatternList"
                            :custom-fill-values="fillValues"  
                            :foreground-color-list="foregroundColorList"
                            :background-color-list="backgroundColorList">
                        </v-shading>
                        <v-curve :real-path="realPath2" :symbol-color="0xFF0000"
                            name="C1"
                            :real-min-x="realMinX" :real-max-x="realMaxX"
                            :real-min-y="realMinY" :real-max-y="realMaxY"
                            x-transform="linear" y-transform="linear"
                            :left-value="1.95" :right-value="2.95" unit="g/cm3"
                            :view-width="trackViewWidth2" :view-height="scaleTrackHeight">
                        </v-curve>
                        <v-curve :real-path="realPath1" :symbol-color="0x996600"
                            name="C2"
                            :real-min-x="realMinX" :real-max-x="realMaxX"
                            :real-min-y="realMinY" :real-max-y="realMaxY"
                            x-transform="linear" y-transform="linear"
                            :left-value="1.95" :right-value="2.95" unit="g/cm3"
                            :view-width="trackViewWidth2" :view-height="scaleTrackHeight">
                        </v-curve>
                    </v-track>
                    <v-resizable
                        :view-pos-x="trackViewWidth + trackViewWidth2" :view-pos-y="-trackHeaderHeight"
                        direction="horizontal" :enabled="true"
                        :onmousedown="onDeleteContext"
                        :view-width="width" :view-height="viewHeight"
                        :knob-flags="[false, true]" :size="5"
                        :fill-color="0xf2f2f2" :fill-transparency="1"
                        :on-resize="resize">
                    </v-resizable>
                    <v-track
                        name="vtrack3" :after-mouse-down="contextMenuHandler"
                        :track-children="childCount" :track-title-fill-color="0xF0F000"
                        :track-real-min-y="trackRealMinY" :track-real-max-y="trackRealMaxY"
                        :view-width="trackViewWidth3" :view-height="viewHeight"
                        :on-resize="trackResize3"
                        :track-header-resize="trackHeaderResize"
                        :track-header-height="trackHeaderHeight" 
                        track-header-fill-color="0xFFFFFF"
                        :view-pos-x="trackViewWidth + width + trackViewWidth2" :view-pos-y="-trackHeaderHeight"
                        fill-color="0xFFFFFF" :fill-transparency="1"
                        :real-min-y="realMinY" :real-max-y="realMaxY"
                        x-transform="none" y-transform="linear"
                        :real-right="realPath2"
                        :real-left="realPath1"
                        cursor="crosshair"
                        :enabled="true"
                        >
                        <v-curve v-for="(path, idx) in pathList"
                            :key="idx" :real-path="path" :symbol-color="0xFF0000"
                            :name="idx % 2 === 0 ? 'Alice' : 'Bob'"
                            :left-value="1.95" :right-value="2.95" unit="g/cm3"
                            :real-min-x="6" :real-max-x="realMaxX"
                            :real-min-y="realMinY" :real-max-y="realMaxY"
                            x-transform="linear" y-transform="linear"
                            :view-width="trackViewWidth3" :view-height="scaleTrackHeight"
                            @vMounted="childrenChanged"
                            @vDestroyed="childrenChanged">
                        </v-curve>
                    </v-track>
                    <v-track
                        name="vtrack4" :after-mouse-down="contextMenuHandler"
                        :track-title-fill-color="0xF00000"
                        :track-real-min-y="trackRealMinY" :track-real-max-y="trackRealMaxY"
                        :view-width="trackViewWidth4" :view-height="viewHeight"
                        :on-resize="trackResize4"
                        :track-header-resize="trackHeaderResize"
                        :track-header-height="trackHeaderHeight" 
                        track-header-fill-color="0xFFFFFF"
                        :view-pos-x="trackViewWidth + width + trackViewWidth2 + trackViewWidth3" :view-pos-y="-trackHeaderHeight"
                        fill-color="0xFFFFFF" :fill-transparency="1"
                        :real-min-y="realMinY" :real-max-y="realMaxY"
                        x-transform="none" y-transform="linear"
                        cursor="crosshair"
                        :enabled="true"
                        >
                        <v-curve :real-path="realPath2" :symbol-color="0x0000FF"
                            name="bob1"
                            :real-min-x="6" :real-max-x="realMaxX"
                            :real-min-y="realMinY" :real-max-y="realMaxY"
                            x-transform="linear" y-transform="linear"
                            :left-value="1.95" :right-value="2.95" unit="g/cm3"
                            :view-width="trackViewWidth4" :view-height="scaleTrackHeight">
                        </v-curve>
                        <v-curve :real-path="realPath1" :symbol-color="0xFF0000"
                            name="bob2"
                            :real-min-x="6" :real-max-x="realMaxX"
                            :real-min-y="realMinY" :real-max-y="realMaxY"
                            x-transform="linear" y-transform="linear"
                            :left-value="0" :right-value="1" unit="V/ V"
                            :view-width="trackViewWidth4" :view-height="scaleTrackHeight">
                        </v-curve>
                    </v-track>
                </v-layer>
        </v-scene>
        <button @click="addPath">Add Path to Track 3</button>
        <button @click="removePath">Remove Path to Track 3</button>
        <context-menu 
            v-if="contextFlag" :context-type="contextType"
            :context-pos-x="contextMenuPosX" :context-pos-y="contextMenuPosY"
        />
    </fragment>`,
    data: function () {
        return {
            shading: false,
            shading2: false,
            style: {
                fontSize: 18
            },
            contextFlag: false,
            contextType: '',
            contextMenuPosX: 0,
            contextMenuPosY: 0,
            trackRealMinY: 1000,
            trackRealMaxY: 3000,
            viewWidth: 200,
            viewHeight: 700,
            width: 50,
            trackBodyHeight: 1400,
            trackViewWidth: 150,
            trackViewWidth2: 150,
            trackViewWidth3: 150,
            trackViewWidth4: 150,
            trackHeaderHeight: 120,
            realMinX: 14,
            realMaxX: 30,
            realMinY: 325,
            realMaxY: 9000,
            tooltipStyle: {
                fontSize: 13,
            },
            trackBodyOffsetY: 0,
            fillValues: [
                { lowVal: 14, highVal: 17 },
                { lowVal: 17, highVal: 21 },
                { lowVal: 21, highVal: 25 },
                { lowVal: 25, highVal: 30 },
            ],
            backgroundColorList: ["blue", "green", "red", "orange"],
            fillPatternList: [
                "/pattern/Sandstone9_.png", "/pattern/point_.png", "/pattern/Clay_shale_.png", "/pattern/Limestone_.png"
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
            pathList: [
                [
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
                ]
            ],
            childCount: 1,
            scaleTrackHeight: 0,
            label1: 'abc',
            realMinY1: 350,
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
        myPalette: function () {
            return Palette["content"];
        },
    },
    methods: {
        contextMenuHandler: function (evt, contextType, typeMouseDown) {
            if (typeMouseDown === 0) {
                this.contextFlag = false;
                return;
            }
            this.contextFlag = true;
            this.contextType = contextType;
            this.contextMenuPosX = evt.data.global.x;
            this.contextMenuPosY = evt.data.global.y;
        },
        onDeleteContext: function () {
            this.contextFlag = false;
        },
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
        trackResize4: function ({ width, height }, comp) {
            this.trackViewWidth4 = width;
            this.$refs.myLayer.tooltips.splice(0);
        },
        resize: function ({ width, height }, comp) {
            this.width = width;
            this.$refs.myLayer.tooltips.splice(0);
        },
        trackHeaderResize: function ({ width, height }, comp) {
            this.trackHeaderHeight = height;
        },
        addPath: function () {
            let arr = [];
            for (let i = 0; i < 28; i++) {
                arr.push({
                    x: this.realMinX + Math.random() * (this.realMaxX - this.realMinX),
                    y: this.realPath1[i].y
                })
            }
            this.pathList.push(arr);
        },
        removePath: function () {
            if (this.pathList.length === 0) return;
            this.pathList.pop();
        },
        childrenChanged: function () {
            console.log("child changed");
            this.childCount = this.pathList.length;
        },
        handleRealY1: function (realMinY, realMaxY) {
            this.realMinY1 = realMinY;
            this.realMaxY1 = realMaxY;
        },
        handleRealY2: function (realMinY, realMaxY) {
            this.realMinY2 = realMinY;
            this.realMaxY2 = realMaxY;
        },
        handleRealY3: function (realMinY, realMaxY) {
            this.realMinY3 = realMinY;
            this.realMaxY3 = realMaxY;
        }
    },
    mounted: function () {
        const y = (this.viewHeight - this.trackHeaderHeight) * (this.realMaxY - this.realMinY)
            / (this.trackRealMaxY - this.trackRealMinY);
        this.scaleTrackHeight = y;
        let transformFn = scaleLinear().domain([this.realMinY, this.realMaxY]).range([0, y]);
        this.trackBodyOffsetY -= transformFn(this.trackRealMinY)
    },
    components: {
        Fragment, VScene, VTrack, VRect, ContextMenu,
        VShading, VPath, VCurve, VLayer, VResizable, VXone,
    }
})