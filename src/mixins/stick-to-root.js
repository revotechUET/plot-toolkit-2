export default {
    methods: {
        getParent: function() {
            return this.getRootComp();
        }
    },
    computed: {
        componentTypePrefix: function() {
            return 'sticky';
        }
    }    
}