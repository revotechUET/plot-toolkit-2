import template from './template.html';
import { Fragment } from 'vue-fragment';
import VTrack from '../v-track';
import VLayer from '../v-layer';
import VXone from '../v-xone';
import VShading from '../v-shading';
import VCurve from '../v-curve';

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
        }
    },
    data: function () {
        return {
            trackBodyScale: 0
        }
    },
    components: {
        Fragment, VTrack, VLayer, VXone, VShading, VCurve
    },
    template,
    computed: {
        cName: function () {
            return (this.$store.state.plot || {}).name;
        },
        tracksPosXList: function () {
            let tracksPosX = {}, previousWidth = 0, track, trackList = [];
            if (this.$store.state.plot) {
                for (let i = 0; i < this.$store.state.plot.depth_axes.length; i++) {
                    track = this.$store.state.plot.depth_axes[i];
                    trackList.push({
                        name: track.title + " " + i,
                        width: this.convertWidth(track.widthUnit, track.width)
                    })
                }
            }
            if (this.$store.state.zone_tracks.length) {
                for (let i = 0; i < this.$store.state.zone_tracks.length; i++) {
                    track = this.$store.state.zone_tracks[i];
                    trackList.push({
                        name: track.title + " " + i,
                        width: this.convertWidth(track.widthUnit, track.width)
                    })
                }
            }
            if (this.$store.state.tracks.length) {
                for (let i = 0; i < this.$store.state.tracks.length; i++) {
                    track = this.$store.state.tracks[i];
                    trackList.push({
                        name: track.title + " " + i,
                        width: this.convertWidth(track.widthUnit, track.width)
                    })
                }
            }
            console.log(trackList);
            if (trackList.length) {
                tracksPosX[trackList[0].name] = 0;
                previousWidth = trackList[0].width;
                for (let i = 1; i < trackList.length; i++) {
                    tracksPosX[trackList[i].name] = previousWidth;
                    previousWidth += trackList[i].width;
                }
            }
            console.log(tracksPosX);
            return tracksPosX;
        }
    },
    mounted: async function () {
        console.log("V Plot Created");
        await this.$store.dispatch("getData", { idProject: this.idProject, idPlot: this.idPlot });
        const y = (this.viewHeight - this.viewPosY) * (this.$store.state.plotBottom - this.$store.state.plotTop)
            / (this.$store.state.currentPlotBottom + 100 - this.$store.state.currentPlotTop);
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
        },
        zoneResize: function (newStartDepth, newEndDepth, name, zonesetId, zoneId) {
            console.log(newStartDepth, newEndDepth);
            this.$store.commit("zoneHeightChange", {
                newStartDepth,
                newEndDepth: newEndDepth - 100,
                zonesetId,
                zoneId
            })
        }
    }
}

export default VLayer.extend(component);