import axios from 'axios';

export default {
    namespaced: true,
    state: () => ({
        plot: null,
        zone_tracks: [],
        tracks: [],
        depth_axes: [],
        lines: [],
        currentPlotTop: 0,
        currentPlotBottom: 0,
        plotTop: 0,
        plotBottom: 0,
        patterns: null,
        palettes: null
    }),
    mutations: {
        getPlotData(state, plot) {
            console.log('Update plot');
            state.plot = plot;
        },
        setZoneTracks(state, zoneTrack) {
            state.zone_tracks.push(zoneTrack);
        },
        setTracks(state, track) {
            state.tracks.push(track);
        },
        setDepthAxes(state, depthAxis) {
            state.depth_axes.push(depthAxis)
        },
        setLines(state, { idLine, idCurve, curve, idTrack, alias,
            unit,
            symbolFillStyle,
            lineWidth,
            lineColor,
            lineDash,
            minValue,
            maxValue,
            displayType }) {
            console.log("id Line", idLine, alias)
            state.lines = state.lines.concat({
                idLine, idCurve, curve, idTrack, alias,
                unit, symbolFillStyle, lineWidth, lineColor,
                lineDash, minValue, maxValue, displayType
            })
        },
        setCurrentPlotTop(state, top) {
            state.currentPlotTop = top;
        },
        setCurrentPlotBottom(state, bottom) {
            state.currentPlotBottom = bottom;
        },
        setPlotTop(state, top) {
            state.plotTop = top;
        },
        setPlotBottom(state, bottom) {
            state.plotBottom = bottom;
        },
        setPatterns(state, patterns) {
            state.patterns = patterns;
        },
        setPalettes(state, palettes) {
            state.palettes = palettes;
        },
        setDepthTrackWidth(state, { idx, width }) {
            state.depth_axes[idx].width = Number(width);
        },
        setZoneTrackWidth(state, { idx, width }) {
            state.zone_tracks[idx].width = Number(width);
        },
        setTrackWidth(state, { idx, width }) {
            state.tracks[idx].width = Number(width);
        },
        zoneHeightChange(state, { newStartDepth, newEndDepth, zonesetId, zoneId }) {
            let zoneTrackIdx = state.zone_tracks.findIndex(track => track.idZoneSet === zonesetId);
            let zoneIdx = state.zone_tracks[zoneTrackIdx].zones.findIndex(zone => zone.idZone === zoneId);
            state.zone_tracks[zoneTrackIdx].zones[zoneIdx] = {
                ...state.zone_tracks[zoneTrackIdx].zones[zoneIdx],
                startDepth: newStartDepth,
                endDepth: newEndDepth
            }
        }
    },
    actions: {
        async getData({ state, commit }, { idProject, idPlot }) {
            console.log('Get data');
            const plotResponse = await axios.post('http://112.137.129.214:35280/quangtuan/project/plot/info', {
                idProject,
                idPlot
            });
            console.log(JSON.parse(plotResponse.data.currentState));
            const { zone_tracks, tracks, depth_axes } = plotResponse.data
            let { top, bottom, top0, range0 } = JSON.parse(plotResponse.data.currentState);

            for (let i = 0; i < zone_tracks.length; i++) {
                const zoneTracksResponse = await axios.post('http://112.137.129.214:35280/quangtuan/project/plot/zone-track/info', {
                    idProject,
                    idPlot,
                    idZoneTrack: zone_tracks[i].idZoneTrack
                });
                commit('setZoneTracks', zoneTracksResponse.data);
            }

            for (let i = 0; i < tracks.length; i++) {
                const tracksResponse = await axios.post('http://112.137.129.214:35280/quangtuan/project/plot/track/info', {
                    idProject,
                    idPlot,
                    idTrack: tracks[i].idTrack
                });
                commit('setTracks', tracksResponse.data);
                for (let j = 0; j < tracks[i].lines.length; j++) {
                    let line = tracks[i].lines[j];
                    const curveReponse = await axios.post('http://112.137.129.214:35280/quangtuan/curve/getData', {
                        idCurve: line.idCurve,
                        top: top0,
                        bottom: top0 + range0
                    });
                    commit("setLines", {
                        idLine: line.idLine,
                        idCurve: line.idCurve,
                        curve: curveReponse.data,
                        idTrack: tracks[i].idTrack,
                        alias: line.alias,
                        unit: line.unit,
                        symbolFillStyle: line.symbolFillStyle,
                        lineWidth: line.lineWidth,
                        lineColor: line.lineColor,
                        lineDash: line.lineStyle,
                        minValue: line.minValue,
                        maxValue: line.maxValue,
                        displayType: line.displayType
                    });
                }
            }

            for (let i = 0; i < depth_axes.length; i++) {
                const depthAxesResponse = await axios.post('http://112.137.129.214:35280/quangtuan/project/plot/depth-axis/info', {
                    idProject,
                    idPlot,
                    idDepthAxis: depth_axes[i].idDepthAxis
                });
                commit('setDepthAxes', depthAxesResponse.data);
            }

            const patternResponse = await axios.post('http://112.137.129.214:35280/quangtuan/pattern/list', {
                idProject,
                idPlot
            });

            const paletteResponse = await axios.post('http://112.137.129.214:35280/quangtuan/pal/all', {
                idProject,
                idPlot
            })

            commit("setCurrentPlotTop", top);
            commit("setCurrentPlotBottom", bottom);
            commit("setPlotTop", top0);
            commit("setPlotBottom", top0 + range0);
            commit('getPlotData', plotResponse.data);
            commit('setPatterns', patternResponse.data);
            commit('setPalettes', paletteResponse.data);
        },
        trackWidthChange({ state, commit }, { idx, width, trackType }) {
            switch (trackType) {
                case "Depth Track":
                    commit("setDepthTrackWidth", { idx, width });
                    break;
                case "Zone Track":
                    commit("setZoneTrackWidth", { idx, width });
                    break;
                default:
                    commit("setTrackWidth", { idx, width });
            }
        }
    }
}