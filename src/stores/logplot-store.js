import axios from 'axios';

export default {
    namespaced: true,
    state: () => ({
        plot: null,
        zone_tracks: null,
        tracks: null,
    }),
    mutations: {
        getData(state, plot) {
            console.log('Update plot');
            state.plot = plot;
        },
        getZoneTracks(state, zoneTrack) {
            state.zone_tracks = zoneTrack;
        },
        getTracks(state, track) {
            state.tracks = track;
        }
    },
    actions: {
        async getData({ state, commit }, { idProject, idPlot }) {
            console.log('Get data');
            const data = await axios.post('http://112.137.129.214:35280/quangtuan/project/plot/info', {
                idProject: idProject,
                idPlot: idPlot
            });
            let { top, bottom } = JSON.parse(data.data.currentState);
            console.log(top, bottom)
            commit('getData', data.data);

            const zone_tracks = await axios.post('http://112.137.129.214:35280/quangtuan/project/plot/zone_track/info', {
                idProject: idProject,
                idPlot: idPlot
            });
            commit('getZoneTracks', zone_tracks.data);

            const tracks = await axios.post('http://112.137.129.214:35280/quangtuan/project/plot/track/info', {
                idProject: idProject,
                idPlot: idPlot,
                top: parseInt(top),
                bottom: parseInt(bottom)
            });
            commit('getTracks', tracks.data);
        }
    }
}