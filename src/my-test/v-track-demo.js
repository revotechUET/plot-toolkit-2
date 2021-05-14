import Vue from 'vue';
import { Fragment } from 'vue-fragment';
import VShading from '../v-shading';
import VScene from '../v-scene';
import VTrack from '../v-track';
import VRect from '../v-rect';
import VPath from '../v-path';
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
                <v-path :real-path="realPath1" symbol-color="0xFF0000"
                    name="HIHIHI"
                    :view-width="trackViewWidth">
                </v-path>
                <v-path :real-path="realPath2" symbol-color="0x000000"
                :onmousedown="mousedown" :enabled="true"
                    :view-width="trackViewWidth">
                </v-path>
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
                { x: 18.05, y: 405 },
                { x: 18.1, y: 410 },
                { x: 18.15, y: 415 },
                { x: 18.2, y: 420 },
                { x: 18.22, y: 425 },
                { x: 18.25, y: 430 },
                { x: 18.3, y: 435 },
                { x: 18.35, y: 440 },
                { x: 18.4, y: 445 },
                { x: 18.45, y: 450 },
                { x: 18.5, y: 455 },
                { x: 18.55, y: 460 },
                { x: 18.6, y: 465 },
                { x: 18.65, y: 470 },
                { x: 18.7, y: 475 },
                { x: 18.75, y: 480 },
                { x: 18.8, y: 485 },
                { x: 18.85, y: 490 },
                { x: 18.9, y: 495 },
                { x: 19, y: 500 },
                { x: 19.05, y: 505 },
                { x: 19.1, y: 500 },
                { x: 19.15, y: 515 },
                { x: 19.2, y: 520 },
                { x: 19.25, y: 525 },
                { x: 19.3, y: 530 },
                { x: 19.35, y: 535 },
                { x: 19.4, y: 540 },
                { x: 19.45, y: 545 },
                { x: 19.5, y: 550 },
                { x: 19.55, y: 555 },
                { x: 19.6, y: 560 },
                { x: 19.65, y: 565 },
                { x: 19.7, y: 570 },
                { x: 19.75, y: 575 },
                { x: 19.8, y: 580 },
                { x: 19.82, y: 585 },
                { x: 19.86, y: 590 },
                { x: 19.88, y: 595 },
                { x: 19.90, y: 600 },
                { x: 19.92, y: 605 },
                { x: 19.94, y: 610 },
                { x: 19.96, y: 615 },
                { x: 20, y: 620 },
                { x: 20.05, y: 625 },
                { x: 20.1, y: 630 },
                { x: 20.15, y: 635 },
                { x: 20.2, y: 640 },
                { x: 20.25, y: 645 },
                { x: 20.32, y: 650 },
                { x: 20.37, y: 655 },
                { x: 20.42, y: 660 },
                { x: 20.47, y: 665 },
                { x: 20.52, y: 670 },
                { x: 20.57, y: 675 },
                { x: 20.62, y: 680 },
                { x: 20.67, y: 685 },
                { x: 20.72, y: 690 },
                { x: 20.77, y: 695 },
                { x: 20.82, y: 700 },
                { x: 20.87, y: 705 },
                { x: 20.92, y: 710 },
                { x: 20.97, y: 715 },
                { x: 21.02, y: 720 },
                { x: 21.07, y: 725 },
                { x: 21.12, y: 730 },
                { x: 21.17, y: 735 },
                { x: 21.22, y: 740 },
                { x: 21.27, y: 745 },
                { x: 21.32, y: 750 },
                { x: 21.27, y: 755 },
                { x: 21.22, y: 760 },
                { x: 21.17, y: 765 },
                { x: 21.12, y: 770 },
                { x: 21.07, y: 775 },
                { x: 21.02, y: 780 },
                { x: 20.97, y: 785 },
                { x: 20.95, y: 790 },
                { x: 20.9, y: 795 },
                { x: 20.85, y: 800 },
                { x: 20.8, y: 805 },
                { x: 20.75, y: 810 },
                { x: 20.7, y: 815 },
                { x: 20.65, y: 825 },
                { x: 20.6, y: 830 },
                { x: 20.55, y: 835 },
                { x: 20.5, y: 840 },
                { x: 20.45, y: 845 },
                { x: 20, y: 850 },
                { x: 20.05, y: 855 },
                { x: 20.1, y: 860 },
                { x: 20.15, y: 865 },
                { x: 20.2, y: 870 },
                { x: 20.25, y: 875 },
                { x: 20.3, y: 880 },
                { x: 20.35, y: 885 },
                { x: 20.4, y: 890 },
                { x: 20.45, y: 895 },
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
                { x: 19.05, y: 405 },
                { x: 19.1, y: 410 },
                { x: 19.15, y: 415 },
                { x: 19.2, y: 420 },
                { x: 19.25, y: 425 },
                { x: 19.3, y: 430 },
                { x: 19.35, y: 435 },
                { x: 19.4, y: 440 },
                { x: 19.45, y: 445 },
                { x: 19.5, y: 450 },
                { x: 19.55, y: 455 },
                { x: 19.6, y: 460 },
                { x: 19.65, y: 465 },
                { x: 19.7, y: 470 },
                { x: 19.75, y: 475 },
                { x: 19.9, y: 480 },
                { x: 19.92, y: 485 },
                { x: 19.94, y: 490 },
                { x: 19.97, y: 495 },
                { x: 20, y: 500 },
                { x: 20.05, y: 505 },
                { x: 20.1, y: 510 },
                { x: 20.15, y: 515 },
                { x: 20.2, y: 520 },
                { x: 20.25, y: 525 },
                { x: 20.3, y: 530 },
                { x: 20.35, y: 535 },
                { x: 20.4, y: 540 },
                { x: 20.45, y: 545 },
                { x: 20.5, y: 550 },
                { x: 20.55, y: 555 },
                { x: 20.6, y: 560 },
                { x: 20.65, y: 565 },
                { x: 20.7, y: 570 },
                { x: 20.75, y: 575 },
                { x: 20.8, y: 580 },
                { x: 20.82, y: 585 },
                { x: 20.84, y: 590 },
                { x: 20.86, y: 595 },
                { x: 20.88, y: 600 },
                { x: 20.9, y: 605 },
                { x: 20.92, y: 610 },
                { x: 22, y: 615 },
                { x: 22.05, y: 620 },
                { x: 22.1, y: 625 },
                { x: 22.15, y: 630 },
                { x: 22.2, y: 635 },
                { x: 22.25, y: 640 },
                { x: 22.3, y: 645 },
                { x: 22.32, y: 650 },
                { x: 22.37, y: 655 },
                { x: 22.42, y: 660 },
                { x: 22.47, y: 665 },
                { x: 22.52, y: 670 },
                { x: 22.57, y: 675 },
                { x: 22.62, y: 680 },
                { x: 22.67, y: 685 },
                { x: 22.72, y: 690 },
                { x: 22.77, y: 695 },
                { x: 22.82, y: 700 },
                { x: 22.87, y: 705 },
                { x: 22.92, y: 710 },
                { x: 22.97, y: 715 },
                { x: 23.02, y: 720 },
                { x: 23.07, y: 725 },
                { x: 23.12, y: 730 },
                { x: 23.17, y: 735 },
                { x: 23.22, y: 740 },
                { x: 23.27, y: 745 },
                { x: 23.32, y: 750 },
                { x: 23.27, y: 755 },
                { x: 23.22, y: 760 },
                { x: 23.17, y: 765 },
                { x: 23.12, y: 770 },
                { x: 23.07, y: 775 },
                { x: 23.02, y: 780 },
                { x: 22.97, y: 785 },
                { x: 22.95, y: 790 },
                { x: 22.9, y: 795 },
                { x: 22.85, y: 800 },
                { x: 22.8, y: 805 },
                { x: 22.75, y: 810 },
                { x: 22.7, y: 815 },
                { x: 22.65, y: 825 },
                { x: 22.6, y: 830 },
                { x: 22.55, y: 835 },
                { x: 22.5, y: 840 },
                { x: 22.45, y: 845 },
                { x: 22.5, y: 850 },
                { x: 22.55, y: 855 },
                { x: 22.6, y: 860 },
                { x: 22.65, y: 865 },
                { x: 22.7, y: 870 },
                { x: 22.75, y: 875 },
                { x: 22.8, y: 880 },
                { x: 22.85, y: 885 },
                { x: 22.9, y: 890 },
                { x: 22.95, y: 895 },
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
        VShading, VPath
    }
})