export default {
    props: {
        onMountedFn: {
            type: Function,
            default: null
        }
    },
    mounted: function () {
        this.onMountedFn && this.onMountedFn();
    }
}