import VScene from '../v-scene';
import VHeaderCurve from '../v-header-curve';
import Vue from 'vue';
import { Fragment } from 'vue-fragment';

const template = `<fragment>
    <v-scene 
        :transparent="true" 
        :view-width="width" 
        :view-height="height" 
        x-transform="none" 
        y-transform="none"
    >
        <v-header-curve
            curve-name="Sang"
            :content-style="contentStyle"
            :view-width="200"
            :view-height="60"
            :line-dash="lineDash"
            :path-color="0xFF0000"
            :left-value="0"
            :right-value="1"
            unit="V/V"
        >
        </v-header-curve>
    </v-scene>
</fragment>
`;

const app = new Vue({
    el: "#vue-app",
    template: template,
    data: {
        width: 600,
        height: 400,
        lineDash: "5 3",
        contentStyle: {
            fontFamily: 'Arial',
            fontStyle: 'italic',
            align: 'center',
            padding: 5,
            fontSize: 13,
            fill: 0xFF0000
        }
    },
    components: {
        VScene,
        VHeaderCurve,
        Fragment
    }
});
