import Vue from 'vue';
import { Fragment } from 'vue-fragment';
import VScene from '../v-scene';
import VShading from '../v-shading';
import VPath from '../v-path';

new Vue({
    el: "#vue-app",
    template: `<fragment>
        <v-scene :transparent="true" :view-width="viewWidth" :view-height="viewHeight"
            :view-pos-x="0" :view-pos-y="0"
            :real-min-x="realMinX" :real-max-x="realMaxX"
            :real-min-y="realMinY" :real-max-y="realMaxY"
            x-transform="linear" y-transform="linear">
            <v-shading
                fill-color="rgba(255, 0, 0, 0.3)" 
                :real-min-x="realMinX" :real-max-x="realMaxX"
                :real-min-y="realMinY" :real-max-y="realMaxY"
                :real-right="6.2"
                :real-left="realPath"
                line-color="#000000"
                :shading-direction="shadingDirection">
            </v-shading>
            <v-path :real-path="realPathObjFormat" symbol-color="0xFF0000">
            </v-path>
        </v-scene>
    </fragment>`,
    data: function () {
        return {
            viewWidth: 200,
            viewHeight: 500,
            realMinX: 6,
            realMaxX: 30,
            realMinY: 325,
            realMaxY: 3500,
            shadingDirection: "left",
            realPath: [
                20.32, 500, 25.32, 1200, 15.5, 2000, 20.32, 2500, 15.32, 3200
            ],
        }
    },
    computed: {
        realPathObjFormat: function () {
            let res = [];
            for (let i = 0; i < this.realPath.length; i += 2) {
                res.push({
                    x: this.realPath[i],
                    y: this.realPath[i + 1]
                })
            }
            console.log(res);
            return res;
        }
    },
    components: {
        Fragment, VScene, VShading, VPath
    }
})