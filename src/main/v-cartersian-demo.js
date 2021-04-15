import Vue from 'vue';
import { Fragment } from 'vue-fragment';
import VScene from '../v-scene';
import VCartersian, { VCartersianFactory } from '../v-cartersian';
import VViewport from '../v-viewport';
import VLayer from "../v-layer";

new Vue({
    el: '#vue-app',
    template: `
        <v-scene :view-width="800" :view-height="600" :transparent="true">
            <v-viewport :viewport-width="500" :viewport-height="300"
                :view-pos-x="30" :view-pos-y="30"
                x-transform="none" y-transform="none"
                :view-width="500" :view-height="400" pan="y" line-color="rgba(0,0,255,0.5)" :line-width="3"> 
                <v-layer :enabled="true" :tooltip-style="toolTipStyle"
                    :view-width="500" :view-height="300" :line-width="1" line-color="blue" 
                    x-transform="none" y-transform="none"
                    :ref-line-x="true" :ref-line-y="true"
                    :viewport-pos-x="30" :viewport-pos-y="30">
                    <v-cartersian-ext-mouse :view-width="500" :view-height="400"
                        :enabled="false" :draggable="false"
                        :fill-color="0xFFFFFF" :line-width="1" :line-color="0x010101"
                        :real-min-x="0.1" :real-max-x="1500"
                        :real-min-y="30" :real-max-y="130" x-transform="loga" y-transform="linear"
                        :major-ticks-y="5" :minor-ticks-y="5" 
                        :grid="true" tick-label-position-x="none" tick-label-position-y="low" tick-precision="1"
                        :on-ext-mouse-pos="genTooltip">
                    </v-cartersian-ext-mouse>
                </v-layer>
            </v-viewport>
        </v-scene>
    `,
    data: function () {
        return {
            toolTipStyle: {
                fontSize: 16,
                stroke: '#FFFFFF',
                strokeThickness: 4,
                fontWeight: 'bold'
            }
        }
    },
    methods: {
        genTooltip: function (comp, target, globalPos, srcLocalPos, refLines) {
            let localPos = comp.pixiObj.toLocal(globalPos);
            let xCoord = comp.transformX.invert(localPos.x);
            let yCoord = comp.transformY.invert(localPos.y);
            comp.signal('tooltip-on', comp, `x:${xCoord.toFixed(4)} - y: ${yCoord.toFixed(4)}`);
        }
    },
    components: {
        VScene, VCartersian, Fragment, VViewport, VLayer,
        VCartersianExtMouse: VCartersianFactory({ extMouseListener: true })
    }
});
