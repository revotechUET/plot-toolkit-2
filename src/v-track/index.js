import { Fragment } from 'vue-fragment';
import VShading from '../v-shading';
import VPath from '../v-path';
import VRect from '../v-rect';
import VContainer from '../v-container';
import VResizable from '../v-resizable';
import VCartersian from '../v-cartersian';
import template from './template.html';

let component = {
    props: [
        "trackViewWidth",
        "realLeft",
        "realRight",
        "minColor",
        "maxColor",
        "typeFillColor",
        "customFillValues",
        "foregroundColorList",
        "backgroundColorList",
        "fillPatternList",
        "pallete",
        "colorPathList",
    ],
    computed: {
        componentType: function () {
            return "VTrack";
        },
    },
    data: function () {
        return {
            trackWidth: 0
        }
    },
    template,
    components: {
        VShading, VPath, VRect, VResizable,
        VContainer, VCartersian, Fragment
    },
    methods: {
        trackResize: function ({ width, height }, comp) {
            this.trackWidth = width;
        }
    },
    mounted: function () {
        // console.log(this.trackBodyPosY);
        this.trackWidth = this.trackViewWidth || this.viewWidth;
    }
}

export default VRect.extend(component);