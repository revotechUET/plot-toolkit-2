import template from './template.html';

const component = {
    name: 'v-plot',
    props: [],
    data: function() {
        return {}
    },
    template,
    computed: {
        cName: function() {
            return (this.$store.state.plot || {}).name || 'no-name';
        },
    },
    mounted: function() {
        this.$store.dispatch('getData');
    },
}

export default component;