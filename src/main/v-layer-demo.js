import Vue from 'vue';
import VScene from '../v-scene';
import VLayer from '../v-layer';
import VRect from '../v-rect';
import { VRectFactory } from '../v-rect';

new Vue({
    el: '#vue-app',
    template: `
    <v-scene :view-width="800" :view-height="600" :transparent="true">
        <v-rect :enabled='true' :draggable="false" 
            :view-pos-x="10" :view-pos-y="10" 
            :view-width="400" :view-height="300" 
            :line-width="1" line-color="#FF000088">
            <v-layer :enabled="true" 
                :view-pos-x="0" :view-pos-y="0" 
                :view-width="400" :view-height="300" :ref-line-x="true"
                :line-width="1" line-color="#FF000088"
                :tooltip-style="tooltipStyle"
                >
                <v-rect-ext-mouse v-for="(r, idx) in rects" :key="'vrect-'+ idx" :name="'vrect-' + idx" :view-pos-x="r.viewPosX" 
                    :view-pos-y="r.viewPosY" :view-width="r.viewWidth" :enabled="true"
                    :draggable='true'
                    :on-ext-mouse-pos="(...args) => processTooltip(...args)"
                    :view-height="r.viewHeight" :fill-color="r.fillColor" />
            </v-layer>
        </v-rect>
    </v-scene>
    `,
    data: function () {
        const size = 70;
        return {
            rects: [{
                viewPosX: 0, viewPosY: 0, viewWidth: size, viewHeight: size, fillColor: 'yellow'
            }, {
                viewPosX: size + 10, viewPosY: 20, viewWidth: size, viewHeight: size, fillColor: 'pink'
            }, {
                viewPosX: 2 * (size + 10), viewPosY: 40, viewWidth: size, viewHeight: size, fillColor: 'lime'
            },],
            tooltipStyle: {
                fontSize: 12,
                stroke: '#FFFFFF',
                strokeThickness: 4,
                fontWeight: 'bold'
            }
        }
    },
    methods: {
        processTooltip: function (comp, target, globalPos, srcLocalPos, refLines) {
            let localPos = comp.pixiObj.toLocal(globalPos);
            let hit = false;
            if (refLines.refLineX) {
                hit = ((localPos.y - 0) * (localPos.y - comp.height) < 0);
            }
            if (refLines.refLineY) {
                hit = hit || ((localPos.x - 0) * (localPos.x - comp.width) < 0);
            }
            if (!hit) comp.signal('tooltip-off', comp);
            else comp.signal('tooltip-on', comp, {
                content: `x: ${localPos.x.toFixed(2)} - y: ${localPos.y.toFixed(2)}`,
            });
        }
    },
    components: {
        VScene, VLayer, VRect, VRectExtMouse: VRectFactory({ extMouseListener: true })
    }
})