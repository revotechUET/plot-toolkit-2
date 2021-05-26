import axios from 'axios';

export default {
    namespaced: true,
    state: () => ({
        plot: null
    }),
    mutations: {
        getData(state, plot) {
            console.log('Update plot');
            state.plot = plot;
        }
    },
    actions: {
        getData({ state, commit }, { idProject, idPlot }) {
            console.log('Get data');
            axios.post('http://localhost:3000/project/plot/info', {
                idProject: idProject,
                idPlot: idPlot
            })
                .then(response => {
                    console.log(response);
                    commit('getData', response.data);
                })
        }
    }
}