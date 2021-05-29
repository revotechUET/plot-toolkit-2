import template from './template.html';
import { Fragment } from 'vue-fragment';
import VTrack from '../v-track';

const component = {
    name: 'v-plot',
    props: [
        "idProject",
        "idPlot"
    ],
    data: function() {
        return {}
    },
    components: {
        Fragment, VTrack
    },
    template,
    computed: {
        cName: function() {
            return (this.$store.state.plot || {}).name; 
        },
    },
    mounted: function() {
        this.$store.dispatch("getData", { idProject: this.idProject, idPlot: this.idPlot });
    },
}

export default component;