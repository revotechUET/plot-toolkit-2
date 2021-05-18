import { Fragment } from 'vue-fragment';
import { Text } from 'pixi.js';
import VPath from '../v-path';
import VRect from '../v-rect';
import VContainer from '../v-container';
import VResizable from '../v-resizable';
import VViewport, { VViewportFactory } from '../v-viewport';
import VCartersian, { VCartersianFactory } from '../v-cartersian';
import VTextbox from '../v-textbox';
import VHeaderCurve from '../v-header-curve';
import template from './template.html';
import VXone, { VXoneFactory } from '../v-xone';

let component = {
    props: [
        "isShading",
        "trackHeaderFillColor",
        "trackHeaderHeight",
        "trackViewWidth",
        "trackBodyHeight",
        "trackResize",
        "trackKnobFlags",
        "trackHeaderResize",
        "genTooltip",
        "zones",
        "zoneHeaderLabel"
    ],
    computed: {
        componentType: function () {
            return "VTrack2";
        }
    },
    data: function () {
        return {
            kursor: "default",
            trackChilren: null,
            trackHeaderChildrenHeight: 0,
            headerContentStyle: {
                fontFamily: 'Arial',
                fontStyle: 'italic',
                align: 'center',
                padding: 5,
                fontSize: 15,
            },
            labelStyle: {
                fontFamily: 'Arial',
                fontStyle: 'italic',
                align: 'center',
                padding: 5,
                fontSize: 19,
            },
            childrenHeaderPosYList: [0],
            shadingColor: '',
            visualizeItems: [],
            pathList: [],
            zoneList: this.zones
        }
    },
    template,
    components: {
        VPath, VRect, VResizable, 
        VViewport, VViewportExtMouse: VViewportFactory({ extMouseListener: true }),
        VHeaderCurve,
        VContainer, VCartersian, Fragment, VTextbox,
        VCartersianExtMouse: VCartersianFactory({ extMouseListener: true }),
        VXone, VXoneExtMouse: VXoneFactory({ extMouseListener: true })
    },
    methods: {
        textWidth: function (content) {
            let text = new Text(content);
            let textWidth = text.getLocalBounds().width * this.headerContentStyle.fontSize / 26;
            return textWidth;
        },
        textHeight: function (content) {
            let text = new Text(content);
            let textHeight = text.getLocalBounds().height * this.headerContentStyle.fontSize / 26;
            return textHeight;
        }
    },
    mounted: function () {
    
    }
}

export default VRect.extend(component);