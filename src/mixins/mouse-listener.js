import eventManager from '../event-manager';
export default {
    props: ['onExtMousePos'],
    created: function() {
        eventManager.on('ext-mousepos', this.extMouseposHandler);
    },
    methods: {
        extMouseposHandler: function(target, globalPos, localPos, refLines) {
            this.onExtMousePos && this.onExtMousePos(this, target, globalPos, localPos, refLines);
        },
        signal: function(eventName, ...args) {
            eventManager.emit(eventName, ...args);
        }
    },
    computed: {
        componentTypePrefix: function(){
            return 'extMouse';
        }
    }
}