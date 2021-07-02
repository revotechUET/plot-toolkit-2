import template from './template.html';
import { Fragment } from 'vue-fragment';
import VTrack from '../v-track';
import VLayer from '../v-layer';
import VXone from '../v-xone';
import VShading from '../v-shading';
import VCurve from '../v-curve';
import VContainer from '../v-container';
import axios from 'axios';

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
            // let line = this.$store.state.lines.filter(line => line.idCurve === shading.idControlCurve)[0];
            let line = this.getLine(shading.idRightLine)
            return !line ? "linear" : line.displayType === "Linear" ? "linear" : "loga"
        },
        getShadingCustomFills: function (typeFill, shading) {
            let { shadingType } = typeFill;
            if (shadingType === "pattern") {
                let realMinX = this.getLine(shading.idRightLine).minValue;
                let realMaxX = this.getLine(shading.idRightLine).maxValue;
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
                if (pattern.name === "Solid" || pattern.name === 'none') return [];
                return [this.$store.state.patterns[pattern.name].src];
            }
            let { content } = typeFill.varShading.customFills;
            if (!content) return [];
            return content.map(item => {
                if (item.pattern === "Solid" || item.pattern === "none") return null;
                return this.$store.state.patterns[item.pattern].src
            });
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
        getShadingPalette: function (typeFill) {
            let palette;
            if (typeFill.display) {
                palette = typeFill.varShading.palette;
            }
            if (palette) {
                return this.$store.state.palettes[palette];
            }
            return [];
        },
        getShadingMinColor: function (typeFill) {
            if (this.getShadingType(typeFill) === "Custom Fills") {
                return;
            }
            return typeFill.varShading.gradient.startColor || typeFill.varShading.startX;
        },
        getShadingMaxColor: function (typeFill) {
            if (this.getShadingType(typeFill) === "Custom Fills") {
                return;
            }
            return typeFill.varShading.gradient.endColor || typeFill.varShading.endX;
        },
        getObjShadingColor: function (typeFill) {
            if (!typeFill.varShading.gradient) {
                return;
            }
            let { startColor, endColor } = typeFill.varShading.gradient;
            return {
                minColor: startColor,
                maxColor: endColor
            }
        },
        getShadingRealLeft: function (shading) {
            if (shading.leftFixedValue || shading.leftFixedValue === 0) {
                return shading.leftFixedValue;
            }
            let line = this.getLine(shading.idLeftLine);
            if (line) return this.getCurveData(line.idCurve);
        },
        getShadingRealRight: function (shading) {
            if (shading.rightFixedValue || shading.rightFixedValue === 0) {
                return shading.rightFixedValue;
            }
            let line = this.getLine(shading.idRightLine);
            if (line) return this.getCurveData(line.idCurve);

        },
        getShadingRealMinX: function (shading) {
            let line = this.getLine(shading.idRightLine);
            return line.minValue;
        },
        getShadingRealMaxX: function (shading) {
            let line = this.getLine(shading.idRightLine);
            return line.maxValue;
        },
        getCurveData: function (idCurve) {
            let curveIdx = this.$store.state.curves
                .map(curve => Number(Object.keys(curve)[0]))
                .indexOf(idCurve)
            // if (curveIdx < 0) {
            //     let curveList = this.$store.state.curveSteps
            //         .map(item => item.split(':step')[0])
            //     let idx;
            //     for (let i = 0; i < curveList.length; i++) {
            //         if (curveList[i].indexOf(idCurve.toString()) >= 0) {
            //             idx = i;
            //             break;
            //         }
            //     }
            //     let step = Number(this.$store.state.curveSteps[idx].split(":step")[1]);
            //     const curveReponse = await axios.post('http://112.137.129.214:35280/quangtuan/curve/getData', {
            //         idCurve: idCurve,
            //     });
            //     let curve = curveReponse.data.map((point, idx) => {
            //         return {
            //             ...point,
            //             y: this.$store.state.plotTop + step * idx
            //         }
            //     });
            //     this.$store.commit("setCurves", {
            //         [idCurve]: curve
            //     })
            //     return curve;
            // }
            return this.$store.state.curves[curveIdx][idCurve];
        },
        getLeftShadingRealMinX: function (shading) {
            if (shading.idLeftLine && shading.idRightLine) {
                let line = this.getLine(shading.idLeftLine);
                if (line) return line.minValue;
            }
        },
        getLeftShadingRealMaxX: function (shading) {
            if (shading.idLeftLine && shading.idRightLine) {
                let line = this.getLine(shading.idLeftLine);
                if (line) return line.maxValue;
            }
        },
        getLine: function (idLine) {
            for (const track of this.$store.state.tracks) {
                for (const line of track.lines) {
                    if (line.idLine === idLine) {
                        return line;
                    }
                }
            }
        }
    }
}

export default VLayer.extend(component);