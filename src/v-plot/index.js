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
            sTracks = [...this.$store.state.plot.depth_axes, ...this.$store.state.zone_tracks, ...this.$store.state.tracks];
            sTracks = sTracks.sort((track1, track2) => (track1.orderNum || "").localeCompare(track2.orderNum || ""));
            return sTracks;
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
                    idx = this.$store.state.plot.depth_axes.findIndex(track => track.idDepthAxis === comp.trackId && track.orderNum === comp.orderNum);
                    this.$store.dispatch("trackWidthChange", {
                        idx,
                        width: this.reverseWidth(this.$store.state.plot.depth_axes[idx].widthUnit, width),
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
                newEndDepth: newEndDepth,
                zonesetId,
                zoneId
            })
        },
        getShadingInfo: function (lines, shading) {
            let line = lines.filter(line => line.idCurve === shading.idControlCurve)[0];
            return {
                xTransform: line.displayType === "Linear" ? 'linear' : 'loga',
                realMinX: line.minValue,
                realMaxX: line.maxValue,
                curveData: line.curveData
            }
        },
        getShadingCustomFills: function ({ content }) {
            if (!content) return [];
            return content.map(item => {
                return {
                    lowVal: item.lowVal,
                    highVal: item.highVal
                }
            })
        },
        getShadingPatternList: function ({ content }) {
            if (!content) return [];
            return content.map(item => item.pattern);
        },
        getShadingForegroundList: function ({ content }) {
            if (!content) return [];
            return content.map(item => item.foreground);
        },
        getShadingBackgroundList: function ({ content }) {
            if (!content) return [];
            return content.map(item => item.background);
        },
        formatShadingTypeFill: function (typeFill) {
            switch (typeFill) {
                case "gradient":
                    return "Gradient";
                case "palette":
                    return "Palette";
                case "customFills":
                    return "Custom Fills"
            }
        }
    }
}

export default VLayer.extend(component);