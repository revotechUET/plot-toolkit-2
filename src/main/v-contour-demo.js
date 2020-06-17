import Vue from 'vue';
import {Fragment} from 'vue-fragment';
import VScene from '../v-scene';
import VImage from '../v-image';
import VCartersian from "../v-cartersian";
import { scaleLinear } from "d3-scale";
import { extent } from "d3-array";
import VViewport from "../v-viewport";
import {ContourView, ContourFileImport} from "../../../contour-module/src/components/index-vue";

new Vue({
    el: '#vue-app',
    template: `
        <fragment>
            <v-scene :view-width="800" :view-height="600" :transparent="true">
                <v-viewport :view-pos-x="30" :view-pos-y="30" :viewport-width="400" :viewport-height="400"
                    :draggable="true"
                    :view-width="vpsize" :view-height="vpsize" pan="both" line-color="rgba(0,0,255,0.5)" :line-width="3"> 
                    <v-cartersian
                        :view-width="vpsize" :view-height="vpsize"
                        :enabled="true" :draggable="true"
                        :fill-color="0xFFFFFF" :line-width="1" :line-color="0x010101"
                        :real-min-x="20" :real-max-x="150"
                        :real-min-y="30" :real-max-y="130"
                        x-transform="linear" y-transform="linear"
                        :major-ticks-x="5" :minor-ticks-x="5" 
                        :major-ticks-y="5" :minor-ticks-y="5" 
                        :grid="false" tick-label-position-x="sticky" tick-label-position-y="sticky" tick-precision="1" >
                        <v-image :draggable="true" :scaled="scaled" :clipped="true" :centering="centering" :view-width="vpsize" :view-height="vpsize" :image-url="imageURL"></v-image>
                    </v-cartersian>
                </v-viewport>
            </v-scene>
            <div>
                <button @click="centering = !centering">centering</button>
                <button @click="scaled = !scaled">scaled</button>
                <button @click="vpsize += 50">+ Viewport</button>
                <button @click="vpsize -= 50">- Viewport</button>
            </div>

            <div>
                <contour-file-import
                    :negative-data="negativeData"
                    :on-data-changed="onDataChanged"></contour-file-import>
            </div>

            <div style="display: none;">
                <contour-view
                    ref="contourView"
                    :values="values" :n-rows="headers.numOfCols" :n-cols="headers.numOfRows"
                    :min-x="headers.minX" :max-x="headers.maxX"
                    :min-y="headers.minY" :max-y="headers.maxY"
                    :x-inc="headers.xDirection" :y-inc="headers.yDirection"
                    :color-scale="colorScale" :step="step" :major-every="majorEvery"
                    :show-grid="showGrid" :grid-major="gridMajor" :grid-minor="gridMinor" :grid-nice="gridNice"
                    :y-direction="yDirection" :show-scale="showScale"
                    :show-color-scale-legend="showColorScaleLegend" :color-legend-ticks="colorLegendTicks"
                    :negative-data="negativeData"
                    :draw-width="vpsize" :draw-height="vpsize"
                    :on-draw-finished="updateImage"
                    :show-label="showLabel" :label-font-size="fontSize" :on-scale-changed="(_scl) => scale = _scl">
                ></contour-view>
            </div>
        </fragment>
    `,
    computed: { },
    data: {
        imageURL: null,
        vpsize: 500,
        urlIdx: 0,
        centering: false,
        scaled: true,

        negativeData: false,
        headers: {},
        values: [],
        minValue: 0,
        maxValue: 1,
        colorScale: scaleLinear().range(['red', 'blue']),
        step: 100,
        majorEvery: 5,
        fontSize: 2,
        showLabel: false,
        showGrid: false,
        gridMajor: 5,
        gridMinor: 4,
        gridNice: true,
        scale: 1,
        showScale: true,
        yDirection: 'up',
        colorLegendTicks: 50,
        showColorScaleLegend: false,
    },
    watch: {
        /*
        vpsize() {
            setTimeout(() => {
                this.updateImage();
            })
        },
        scale() {
            this.updateImage();
        }
        */
    },
    methods: {
        onDataChanged: function(changedData) {
            console.log(changedData);
            this.headers = _.clone(changedData.headers);
            this.values = _.flatten(changedData.data);
            const domain = extent(this.values);
            this.colorScale.domain(domain);
            this.minValue = domain[0];
            this.maxValue = domain[1];
        },
        updateImage: function() {
            const canvasEle = this.$refs.contourView.__contour.d3Canvas.node();
            canvasEle.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                console.log(url);
                this.imageURL = url;
            }) 
        }
    },
    components: { VScene, VImage, Fragment, VViewport, VCartersian, ContourView, ContourFileImport }
});
