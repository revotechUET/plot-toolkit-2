import template from './template.html';
import { Fragment } from 'vue-fragment';
import VTrack from '../v-track';
import options from '../stores/logplot-store.js';

const component = {
    name: 'v-plot',
    props: ["idProject", "idPlot"],
    data: function() {
        return {}
    },
    components: {
        Fragment, VTrack
    },
    template,
    computed: {
        moduleName: function() {
            return `plot${this.idPlot}`;
        },
        cName: function() {
            return ((this.$store.state[this.moduleName] || {}).plot || {}).name; 
        },
    },
    mounted: function() {
        if (!this.$store.hasModule(this.moduleName)) {
            this.$store.registerModule(this.moduleName, options);
        };
        this.$store.dispatch(`${this.moduleName}/getData`, { idProject: this.idProject, idPlot: this.idPlot });
    },
}

export default component;