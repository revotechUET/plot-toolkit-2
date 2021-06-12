import template from './template.html';
import { Fragment } from 'vue-fragment';
import VTrack from '../v-track';
import VLayer from '../v-layer';
import VXone from '../v-xone';
import VShading from '../v-shading';
import VCurve from '../v-curve';
import VContainer from '../v-container';

const component = {
    name: 'v-plot',
    props: {
        idProject: {
            type: Number,
            required: true
        },
        idPlot: {
            type: Number,
            required: true
        },
        zoneContentStyle: {
            type: Object,
            default: () => {
                return {
                    fontSize: 14
                }
            }
        },
        clipped: {
            type: Boolean,
            default: false,
        }
    },
    data: function () {
        return {
            trackBodyScale: 0
        }
    },
    components: {
        Fragment, VTrack, VLayer, VXone, VShading, VCurve, VContainer
    },
    template,
    computed: {
        cName: function () {
            return (this.$store.state.plot || {}).name;
        },
        sortedTracks: function () {
            let sTracks = [];
            if (!this.$store.state.plot) {
                return [];
            }
            sTracks = [...this.$store.state.depth_axes, ...this.$store.state.zone_tracks, ...this.$store.state.tracks];
            sTracks = sTracks.sort((track1, track2) => (track1.orderNum || "").localeCompare(track2.orderNum || ""));
            return sTracks;
        },
        componentType: function () {
            return "VPlot";
        }
    },
    mounted: async function () {
        console.log("V Plot Created");
        await this.$store.dispatch("getData", { idProject: this.idProject, idPlot: this.idPlot });
        const y = (this.viewHeight - this.viewPosY) * (this.$store.state.plotBottom - this.$store.state.plotTop)
            / (this.$store.state.currentPlotBottom - this.$store.state.currentPlotTop);
        this.trackBodyScale = y;
    },
    methods: {
        convertWidth: function (widthUnit, width) {
            switch (widthUnit) {
                case "cm":
                    return width * 39;
                case "inch":
                    return width * 93;
            }
        },
        reverseWidth: function (widthUnit, width) {
            switch (widthUnit) {
                case "cm":
                    return (width / 39).toFixed(4);
                case "inch":
                    return (width / 93).toFixed(4);
            }
        },
        trackHeaderResize: function ({ width, height }, comp) {
            this.$emit("plotHeaderResize", height);
        },
        trackResize: function ({ width, height }, comp) {
            let idx;
            switch (comp.trackType) {
                case "Zone Track":
                    idx = this.$store.state.zone_tracks.findIndex(track => track.idZoneTrack === comp.trackId && track.orderNum === comp.orderNum);
                    this.$store.dispatch("trackWidthChange", {
                        idx,
                        width: this.reverseWidth(this.$store.state.zone_tracks[idx].widthUnit, width),
                        trackType: comp.trackType
                    })
                    break;
                case "Depth Track":
                    idx = this.$store.state.depth_axes.findIndex(track => track.idDepthAxis === comp.trackId && track.orderNum === comp.orderNum);
                    this.$store.dispatch("trackWidthChange", {
                        idx,
                        width: this.reverseWidth(this.$store.state.depth_axes[idx].widthUnit, width),
                        trackType: comp.trackType
                    })
                    break;
                default:
                    idx = this.$store.state.tracks.findIndex(track => track.idTrack === comp.trackId && track.orderNum === comp.orderNum);
                    this.$store.dispatch("trackWidthChange", {
                        idx,
                        width: this.reverseWidth(this.$store.state.tracks[idx].widthUnit, width),
                        trackType: "Track"
                    })
            }
            this.$nextTick(() => {
                comp.triggerRelayout();
            })
        },
        zoneResize: function (newStartDepth, newEndDepth, name, zonesetId, zoneId) {
            console.log(newStartDepth, newEndDepth);
            this.$store.commit("zoneHeightChange", {
                newStartDepth,
                newEndDepth,
                zonesetId,
                zoneId
            })
        },
        getShadingType: function (typeFill) {
            // let fill = JSON.parse(shading.fill);
            let shadingType = 'Custom Fills';
            if (typeFill.shadingType === 'varShading') {
                switch (typeFill.varShading.varShadingType) {
                    case "gradient":
                        shadingType = "Gradient";
                        break;
                    case "palette":
                        shadingType = "Palette";
                        break;
                }
            }
            return shadingType;
        },
        getXTransformShading: function (shading) {
            // let track = this.$store.state.tracks.filter(track => track.idTrack === idTrack)[0];
            let line = this.$store.state.lines.filter(line => line.idCurve === shading.idControlCurve)[0];
            return !line ? "linear" : line.displayType === "Linear" ? "linear" : "loga"
        },
        getShadingCustomFills: function (typeFill, shading) {
            let { shadingType } = typeFill;
            if (shadingType === "pattern") {
                // let { lines } = this.$store.state.tracks.filter(track => track.idTrack === idTrack)[0];
                let realMinX = this.$store.state.lines.filter(line => line.idLine = shading.idRightLine)[0].minValue;
                let realMaxX = this.$store.state.lines.filter(line => line.idLine = shading.idRightLine)[0].maxValue;
                return [{ lowVal: realMinX, highVal: realMaxX }]
            }
            let { content } = typeFill.varShading.customFills;
            if (!content) return [];
            return content.map(({ lowVal, highVal }) => {
                return { lowVal, highVal }
            })
        },
        getShadingPatternList: function (typeFill) {
            let { shadingType } = typeFill;
            if (shadingType === "pattern") {
                let { pattern } = typeFill;
                if (pattern.name === "Solid") return [];
                return [this.$store.state.patterns[pattern.name].src];
            }
            let { content } = typeFill.varShading.customFills;
            if (!content) return [];
            return content.map(item => this.$store.state.patterns[item.pattern].src);
        },
        getShadingForegroundList: function (typeFill) {
            let { shadingType } = typeFill;
            if (shadingType === "pattern") {
                let { pattern } = typeFill;
                return [pattern.foreground];
            }
            let { content } = typeFill.varShading.customFills;
            if (!content) return [];
            return content.map(item => item.foreground);
        },
        getShadingBackgroundList: function (typeFill) {
            let { shadingType } = typeFill;
            if (shadingType === "pattern") {
                let { pattern } = typeFill;
                return [pattern.background];
            }
            let { content } = typeFill.varShading.customFills;
            if (!content) return [];
            return content.map(item => item.background);
        },
        getShadingPalette: function (shading) {
            let { palette } = JSON.parse(shading.fill).varShading;
            return this.$store.state.palettes[palette];
        },
        getShadingMinColor: function (typeFill) {
            if (this.getShadingType(typeFill) === "Custom Fills") {
                return;
            }
            return typeFill.varShading.gradient.startColor;
        },
        getShadingMaxColor: function (typeFill) {
            if (this.getShadingType(typeFill) === "Custom Fills") {
                return;
            }
            return typeFill.varShading.gradient.endColor;
        },
        getShadingRealLeft(shading) {
            if (shading.leftFixedValue || shading.leftFixedValue === 0) {
                return shading.leftFixedValue;
            }
            return this.$store.state.lines.filter(line => line.idLine === shading.idLeftLine)[0].curveData;
        },
        getShadingRealRight(shading) {
            if (shading.rightFixedValue || shading.rightFixedValue === 0) {
                return shading.rightFixedValue;
            }
            return this.$store.state.lines.filter(line => line.idLine === shading.idRightLine)[0].curve;
        },
        getShadingRealMinX: function (shading) {
            let line = this.$store.state.lines.filter(line => line.idLine === shading.idRightLine)[0];
            if (!line) {
                let { varShading } = JSON.parse(shading.fill);
                if (!isNaN(varShading.startX)) {
                    return varShading.startX;
                }
            }
            return line.minValue;
        },
        getShadingRealMaxX: function (shading) {
            let line = this.$store.state.lines.filter(line => line.idLine === shading.idRightLine)[0];
            if (!line) {
                let { varShading } = JSON.parse(shading.fill);
                if (!isNaN(varShading.endX)) {
                    return varShading.endX;
                }
            }
            return line.maxValue;
        }
    }
}

export default VLayer.extend(component);