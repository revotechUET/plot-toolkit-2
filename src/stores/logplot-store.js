import axios from 'axios';

export default {
    namespaced: true,
    state: () => ({
        plot: null,
        zone_tracks: null,
        tracks: null,
        currentPlotTop: 0,
        currentPlotBottom: 0,
        plotTop: 0,
        plotBottom: 0
    }),
    mutations: {
        getPlotData(state, plot) {
            console.log('Update plot');
            state.plot = plot;
        },
        setZoneTracks(state, zoneTrack) {
            state.zone_tracks = zoneTrack;
        },
        setTracks(state, track) {
            state.tracks = track;
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
        setDepthTrackWidth(state, { idx, width }) {
            console.log("Depth Track Width Change", idx, width);
            state.plot.depth_axes[idx].width = Number(width);
        },
        setZoneTrackWidth(state, { idx, width }) {
            console.log("Zone Track Width Change", idx, width);
            state.zone_tracks[idx].width = Number(width);
        },
        setTrackWidth(state, { idx, width }) {
            console.log("Track Width Change", idx, width);
            state.tracks[idx].width = Number(width);
        },
        zoneHeightChange(state, { newStartDepth, newEndDepth, zonesetId, zoneId }) {
            console.log(newStartDepth, newEndDepth, zonesetId, zoneId);
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
                idProject: idProject,
                idPlot: idPlot
            });
            console.log(JSON.parse(plotResponse.data.currentState));
            let { top, bottom, top0, range0 } = JSON.parse(plotResponse.data.currentState);

            const zoneTracksResponse = await axios.post('http://112.137.129.214:35280/quangtuan/project/plot/zone_track/info', {
                idProject: idProject,
                idPlot: idPlot
            });

            const tracksResponse = await axios.post('http://112.137.129.214:35280/quangtuan/project/plot/track/info', {
                idProject: idProject,
                idPlot: idPlot,
                top: parseInt(top0),
                bottom: parseInt(top0 + range0)
            });

            commit("setCurrentPlotTop", top);
            commit("setCurrentPlotBottom", bottom);
            commit("setPlotTop", top0);
            commit("setPlotBottom", top0 + range0);
            commit('getPlotData', plotResponse.data);
            commit('setZoneTracks', zoneTracksResponse.data);
            commit('setTracks', tracksResponse.data);
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