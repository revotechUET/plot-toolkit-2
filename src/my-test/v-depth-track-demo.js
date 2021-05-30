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
import VXone from '../v-xone';

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
                        name="Depth Track" track-type="Depth Track"
                        unit="M"
                        :major-tick-length="30" :minor-ticks="6"
                        :track-real-min-y="trackRealMinY" :track-real-max-y="trackRealMaxY"
                        :view-width="trackViewWidth2" :view-height="viewHeight"
                        :on-resize="trackResize2"
                        :track-header-resize="trackHeaderResize"
                        :track-header-height="trackHeaderHeight"
                        :view-pos-x="0" :view-pos-y="-trackHeaderHeight"
                        fill-color="0xFFFFFF" :fill-transparency="1"
                        :real-min-y="realMinY" :real-max-y="realMaxY"
                        x-transform="none" y-transform="linear"
                        cursor="crosshair"
                        :enabled="true"
                        >
                    </v-track>
                </v-layer>
        </v-scene>
    </fragment>`,
    data: function () {
        return {
            style: {
                fontSize: 13
            },
            trackRealMinY: 4534.07,
            trackRealMaxY: 4571.03,
            viewWidth: 200,
            viewHeight: 700,
            width: 50,
            trackViewWidth2: 150,
            trackHeaderHeight: 100,
            realMinX: 14,
            realMaxX: 30,
            realMinY: 4480,
            realMaxY: 4600,
            tooltipStyle: {
                fontSize: 13,
            },
        }
    },
    methods: {
        trackResize2: function ({ width, height }, comp) {
            this.trackViewWidth2 = width;
            this.$refs.myLayer.tooltips.splice(0);
        },
        trackHeaderResize: function ({ width, height }, comp) {
            this.trackHeaderHeight = height;
        },
        childrenChanged: function () {
            console.log("child changed");
            this.childCount = this.pathList.length;
        },
    },
    mounted: function () {
        const y = (this.viewHeight - this.trackHeaderHeight) * (this.realMaxY - this.realMinY)
            / (this.trackRealMaxY - this.trackRealMinY);
        this.scaleTrackHeight = y;
    },
    components: {
        Fragment, VScene, VTrack, VRect,
        VShading, VPath, VCurve, VLayer, VResizable, VXone
    }
})