export default {
    props: ['onExtMousePos'],
    created: function () {
        this.getEventManager().on('ext-mousepos', this.extMouseposHandler);
    },
    methods: {
        extMouseposHandler: function (target, globalPos, localPos, refLines) {
            this.onExtMousePos && this.onExtMousePos(this, target, globalPos, localPos, refLines);
        },
        signal: function (eventName, ...args) {
            this.getEventManager().emit(eventName, ...args);
        }
    },
    computed: {
        componentTypePrefix: function () {
            return 'extMouse';
        }
    }
}