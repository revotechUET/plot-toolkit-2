import axios from 'axios';

export default {
    namespaced: true,
    state: () => ({
        plot: null,
        zone_tracks: [],
        tracks: [],
        depth_axes: [],
        curves: {},
        curveSteps: {},
        currentPlotTop: 0,
        currentPlotBottom: 0,
        plotTop: 0,
        plotBottom: 0,
        patterns: null,
        palettes: null,
    }),
    getters: {
        sortedTracks: state => {
            if (!state.plot) return [];
            let sTracks = [];
            sTracks = [...state.depth_axes, ...state.zone_tracks, ...state.tracks];
            sTracks = sTracks.sort((track1, track2) => (track1.orderNum || "").localeCompare(track2.orderNum || ""));
            return sTracks;
        }
    },
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
        setCurves(state, { idCurve, curveData }) {
            console.log(idCurve, curveData)
            state.curves[idCurve] = curveData
            // state.curves.push(curves)
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
        setCurveSteps(state, { idCurveStep, step }) {
            state.curveSteps[idCurveStep] = step;
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
        setNewTrackOrder(state, { trackDragType, trackDragIdx, newTrackDragOrder,
            trackType, trackIdx, newOrder }) {
            switch (trackDragType) {
                case "Depth Track":
                    // state.depth_axes[trackDragIdx].orderNum = newTrackDragOrder;
                    state.depth_axes = state.depth_axes.map((track, idx) => ({
                        ...track,
                        orderNum: idx === trackDragIdx ? newTrackDragOrder : track.orderNum
                    }));
                    break;
                case "Zone Track":
                    // state.zone_tracks[trackDragIdx].orderNum = newTrackDragOrder;
                    state.zone_tracks = state.zone_tracks.map((track, idx) => ({
                        ...track,
                        orderNum: idx === trackDragIdx ? newTrackDragOrder : track.orderNum
                    }));
                    break;
                default:
                    // state.tracks[trackDragIdx].orderNum = newTrackDragOrder;
                    state.tracks = state.tracks.map((track, idx) => ({
                        ...track,
                        orderNum: idx === trackDragIdx ? newTrackDragOrder : track.orderNum
                    }))
            }
            switch (trackType) {
                case "Depth Track":
                    // state.depth_axes[trackIdx].orderNum = newOrder;
                    state.depth_axes = state.depth_axes.map((track, idx) => ({
                        ...track,
                        orderNum: idx === trackIdx ? newOrder : track.orderNum
                    }));
                    break;
                case "Zone Track":
                    // state.zone_tracks[trackIdx].orderNum = newOrder;
                    state.zone_tracks = state.zone_tracks.map((track, idx) => ({
                        ...track,
                        orderNum: idx === trackIdx ? newOrder : track.orderNum
                    }));
                    break;
                default:
                    // state.tracks[trackIdx].orderNum = newOrder;
                    state.tracks = state.tracks.map((track, idx) => ({
                        ...track,
                        orderNum: idx === trackIdx ? newOrder : track.orderNum
                    }))
            }
        },
        zoneHeightChange(state, { newStartDepth, newEndDepth, zonesetId, zoneId }) {
            let zoneTrackIdx = state.zone_tracks.findIndex(track => track.idZoneSet === zonesetId);
            let zoneIdx = state.zone_tracks[zoneTrackIdx]['zone_set']['zones'].findIndex(zone => zone.idZone === zoneId);
            // state.zone_tracks[zoneTrackIdx]['zone_set']['zones'][zoneIdx] = {
            //     ...state.zone_tracks[zoneTrackIdx]['zone_set']['zones'][zoneIdx],
            //     startDepth: newStartDepth,
            //     endDepth: newEndDepth
            // }
            let newZones = state.zone_tracks[zoneTrackIdx]['zone_set']['zones'].map((zone, idx) => ({
                ...zone,
                startDepth: idx === zoneIdx ? newStartDepth : zone.startDepth,
                endDepth: idx === zoneIdx ? newEndDepth : zone.endDepth
            }))
            state.zone_tracks[zoneTrackIdx]['zone_set']['zones'] = newZones
        },
        plotOffsetChange: function (state, realOffsetY) {
            state.currentPlotTop = state.currentPlotTop + realOffsetY;
            state.currentPlotBottom = state.currentPlotBottom + realOffsetY;
        }
    },
    actions: {
        async getData({ state, commit }, { idProject, idPlot, listCurve }) {
            console.log('Get data');
            const patternResponse = await axios.post('http://112.137.129.214:35280/quangtuan/pattern/list', {
                idProject,
                idPlot
            });

            const paletteResponse = await axios.post('http://112.137.129.214:35280/quangtuan/pal/all', {
                idProject,
                idPlot
            });
            commit('setPatterns', patternResponse.data);
            commit('setPalettes', paletteResponse.data);

            try {
                if (idPlot) {
                    let plotResponse = await axios.post('http://112.137.129.214:35280/quangtuan/project/plot/info', {
                        idProject,
                        idPlot
                    });
                    const projectReponse = await axios.post('http://112.137.129.214:35280/quangtuan/project/fullInfo', {
                        idProject
                    });
                    const { wells } = projectReponse.data;
                    console.log(JSON.parse(plotResponse.data.currentState));
                    const { zone_tracks, tracks, depth_axes } = plotResponse.data

                    let { top, bottom, top0, range0 } = JSON.parse(plotResponse.data.currentState);
                    commit("setCurrentPlotTop", top);
                    commit("setCurrentPlotBottom", bottom);
                    commit("setPlotTop", top0);
                    commit("setPlotBottom", top0 + range0);

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
                        for (const well of wells) {
                            const { datasets } = well;
                            for (let j = 0; j < datasets.length; j++) {
                                let { curves } = datasets[j];
                                let step = Number(datasets[j].step);
                                commit("setCurveSteps", {
                                    idCurveStep: curves.map(curve => curve.idCurve).join("-"),
                                    step
                                })
                                curves = curves.filter(curve => tracks[i].lines.map(line => line.idCurve).indexOf(curve.idCurve) >= 0
                                    && !state.curves[curve.idCurve]);
                                for (const curve of curves) {
                                    const curveReponse = await axios.post('http://112.137.129.214:35280/quangtuan/curve/getData', {
                                        idCurve: curve.idCurve,
                                    });
                                    commit("setCurves", {
                                        idCurve: curve.idCurve,
                                        curveData: curveReponse.data.map((point, idx) => {
                                            return {
                                                ...point,
                                                y: Number(datasets[j].top) + step * idx
                                            }
                                        })
                                    })
                                }
                            }
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
                    commit('getPlotData', plotResponse.data);
                } else {
                    let plotResponse = await axios.post('http://112.137.129.214:35280/quangtuan/api/genPlotById', {
                        idProject: idProject,
                        listCurve: listCurve
                    })
                    let data = plotResponse.data
                    let { top0, range0, top, bottom } = data.currentState;
                    commit("setCurrentPlotTop", top);
                    commit("setCurrentPlotBottom", bottom);
                    commit("setPlotTop", top0);
                    commit("setPlotBottom", top0 + range0);
                    data.depth_axes.forEach(depthAxes => commit('setDepthAxes', depthAxes))
                    data.tracks.forEach(track => commit('setTracks', track))
                    data.zone_tracks.forEach(zoneTrack => commit('setZoneTracks', zoneTrack))
                    for (const track of data.tracks) {
                        for (const line of track.lines) {
                            if (!state.curves[line.idCurve]) {
                                commit('setCurves', {
                                    idCurve: line.idCurve,
                                    curveData: line.curveData.map((point, idx) => {
                                        return {
                                            ...point,
                                            y: Number(line.top) + Number(line.curve.step) * idx
                                        }
                                    })
                                })
                            }
                        }
                    }
                    data.tracks = []
                    data.depth_axes = []
                    data.zone_tracks = []
                    commit('getPlotData', data)
                }
            } catch (error) {
                console.log(error)
            }

            console.log('Store setup done')
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
        },
        updateTrackOrder({ state, commit },
            { trackDragType, newTrackDragOrder, idTrackDrag, trackType, newOrder, idTrack }) {
            let trackDragIdx, trackIdx;
            switch (trackDragType) {
                case "Depth Track":
                    trackDragIdx = state.depth_axes.findIndex(track => track.idDepthAxis === idTrackDrag);
                    break;
                case "Zone Track":
                    trackDragIdx = state.zone_tracks.findIndex(track => track.idZoneTrack === idTrackDrag);
                    break;
                default:
                    trackDragIdx = state.tracks.findIndex(track => track.idTrack === idTrackDrag);
                    break;
            }
            switch (trackType) {
                case "Depth Track":
                    trackIdx = state.depth_axes.findIndex(track => track.idDepthAxis === idTrack);
                    break;
                case "Zone Track":
                    trackIdx = state.zone_tracks.findIndex(track => track.idZoneTrack === idTrack);
                    break;
                default:
                    trackIdx = state.tracks.findIndex(track => track.idTrack === idTrack);
                    break;
            }
            commit("setNewTrackOrder",
                {
                    trackDragType, trackDragIdx, newTrackDragOrder,
                    trackType, trackIdx, newOrder
                });
        }
    }
}