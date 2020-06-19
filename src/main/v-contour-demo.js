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
                <v-viewport ref="viewport" :view-pos-x="30" :view-pos-y="30" :viewport-width="vpWidth" :viewport-height="vpHeight"
                    :draggable="true"
                    :view-width="vpWidth" :view-height="vpHeight" pan="both" :on-zoom="zoomFn"
                    line-color="rgba(0,0,255,0.5)" :line-width="3"> 
                    <v-cartersian 
                        :expanded="true"
                        :enabled="true"
                        :fill-color="0xFFFFFF" :line-width="1" :line-color="0x010101"
                        :real-min-x="minX" :real-max-x="maxX"
                        :real-min-y="minY" :real-max-y="maxY"
                        x-transform="linear" y-transform="linear"
                        :major-ticks-x="5" :minor-ticks-x="5" 
                        :major-ticks-y="5" :minor-ticks-y="5" 
                        :grid="false" tick-label-position-x="sticky" tick-label-position-y="sticky" tick-precision="1" >
                        <v-image :scaled="scaled" :clipped="true" :centering="centering" 
                            :expanded="true"
                            :image-url="imageURL"></v-image>
                    </v-cartersian>
                </v-viewport>
            </v-scene>
            <div>
                <button @click="centering = !centering">centering</button>
                <button @click="scaled = !scaled">scaled</button>
                <button @click="vpWidth += 50">+ vpWidth</button>
                <button @click="vpWidth -= 50">- vpWidth</button>
                <button @click="vpHeight += 50">+ vpHeight</button>
                <button @click="vpHeight -= 50">- vpHeight</button>
            </div>

            <div>
                <contour-file-import
                    :negative-data="negativeData"
                    :on-data-changed="onDataChanged"></contour-file-import>
            </div>

            <div style="display: block;">
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
                    :draw-width="vpWidth" :draw-height="vpHeight"
                    :fit-container="false"
                    :on-draw-finished="updateImage"
                    :show-label="showLabel" :label-font-size="fontSize" :on-scale-changed="(_scl) => scale = _scl">
                ></contour-view>
            </div>
        </fragment>
    `,
    computed: {
        minX() { return this.headers.minX},
        maxX() { return this.headers.maxX},
        minY() { return this.yDirection === "up" ? this.headers.maxY:this.headers.minY},
        maxY() { return this.yDirection === "up" ? this.headers.minY:this.headers.maxY},
    },
    data: {
        imageURL: null,
        vpWidth: 500,
        vpHeight: 500,
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
        scale() {
            console.log(this.scale);
        }
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
            // this.vpWidth = this.headers.numOfCols;
            // this.vpHeight = this.headers.numOfRows;
        },
        updateImage: function() {
            const canvasEle = this.$refs.contourView.__contour.d3Canvas.node();
            canvasEle.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                console.log(url);
                this.imageURL = url;
            }) 
        },
        zoomFn: function(delta, centerX, centerY, evt) {
            let destCanvas = document.querySelector(".draw-layer");
            let newEvent = new evt.constructor(evt.type, evt);
            newEvent.clientY += 560;
            newEvent.y += 560;
            newEvent.offsetY += 560;
            newEvent.layerY += 560;
            newEvent.screenY += 560;
            destCanvas.dispatchEvent(newEvent);
            return;
            const zoomFactor = 2;
            let {x, y} = this.$refs.viewport.pixiObj.children[0].toLocal({x:centerX, y:centerY});
            this.$refs['viewport'].translate(x, y);
            if (delta > 0) {
                this.$refs['viewport'].translate(-x*zoomFactor, -y*zoomFactor);
                this.vpWidth *= zoomFactor;
                this.vpHeight *= zoomFactor;
            }
            else if (delta < 0) {
                this.$refs['viewport'].translate(-x/zoomFactor, -y/zoomFactor);
                this.vpWidth /= zoomFactor;
                this.vpHeight /= zoomFactor;
            }
        }
    },
    components: { VScene, VImage, Fragment, VViewport, VCartersian, ContourView, ContourFileImport }
});
