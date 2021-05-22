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
import { scaleLinear, scaleLog } from 'd3-scale';

let component = {
    props: {
        trackHeaderHeight: Number,
        trackBodyHeight: Number,
        trackResize: Function,
        direction: {
            type: String,
            default: 'horizontal'
        },
        trackKnobFlags: {
            type: Array,
            default: () => [false, true]
        },
        trackHeaderResize: Function,
        genTooltip: Function,
        zoneHeaderLabel: String,
        viewPortRealMinY: Number,
        viewPortRealMaxY: Number,
    },
    computed: {
        componentType: function () {
            return "VTrack2";
        }
    },
    data: function () {
        return {
            kursor: "default",
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
            zoneList: [],
            listZoneHeaderHeight: 0,
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
    computed: {
        scaleViewHeight: function() {
            let baseHeight = this.viewHeight - this.trackHeaderHeight;
            return baseHeight * (this.realMaxY - this.realMinY) / (this.viewPortRealMaxY - this.viewPortRealMinY)
        }
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
        },
        scaleRealToView: function(value) {
            let view = scaleLinear()
                .domain([this.realMinY, this.realMaxY])
                .range([0, this.scaleViewHeight]);
            return view(value);
        }
    },
    mounted: function () {
        this.zoneList = this.$refs.zoneTrackList.$children.slice(1);
        console.log(this.zoneList);
        for(let zone in this.zoneList) {
            this.listZoneHeaderHeight += (this.textHeight(zone.name) + 15)
        };
        this.$refs.trackBodyViewPort.offsetY -= this.scaleRealToView(this.viewPortRealMinY);
    }
}

export default VResizable.extend(component);