export default {
    props: {
        onDestroyedFn: {
            type: Function
        }
    },
    destroyed: function () {
        this.onDestroyedFn && this.onDestroyedFn(this.viewHeight);
    }
}