import Vuex from 'vuex';
import axios from 'axios';

export default function createStore(idProject, idPlot) {
    return new Vuex.Store({
        state: {
            plot: null
        },
        mutations: {
            updatePlot(state, plot) {
                console.log('Update plot');
                state.plot = plot;
            }
        },
        actions: {
            getData({ state, commit }) {
                console.log('Get data');
                axios.post('http://localhost:3000/project/plot/info', {
                    idProject: idProject,
                    idPlot: idPlot
                })
                    .then(response => {
                        console.log(response);
                        commit('updatePlot', response.data);
                    })
            }
        }
    })
}