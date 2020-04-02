import {autoDetectRenderer, utils, Container} from 'pixi.js';
import VObject from '../v-object';
function getPixiApp(force) {
    if (!this.pixiApp || force) {
        const renderer = autoDetectRenderer({ 
            width: this.width || 800, 
            height: this.height || 600, 
            transparent: this.transparent, 
            antialias: true 
        });
        const stage = new Container();
        stage.sortableChildren = true;
        stage.hostedComponent = this;
        this.pixiApp = {
            renderer, stage,
            transparent: this.transparent
        };
    }
    return this.pixiApp;
}
function getPixiObj() {
    return (this.getPixiApp() || {}).stage;
}
function renderGraphic(obj) {
    //console.log("Graphic render");
    let app = this.getPixiApp();
    app.renderer.render(obj || app.stage);
}
 
let component = {
    props: ['transparent'],
    mounted: function() {
        console.log('v-scene mounted fn');
        console.log(utils.string2hex('#FF00FF44'));
        this.$el.appendChild(this.getPixiApp().renderer.view)
    },
    methods: {
        getPixiApp, getPixiObj, renderGraphic
    },
    computed: {
        compProps: function() {
            return `${this.baseCompProps} | ${this.transparent}`;
        }
    },
    watch: {
        compProps: function() {
            let view = this.getPixiApp().renderer.view;
            this.$el.removeChild(view);
            let app = this.getPixiApp(true);
            this.$el.appendChild(app.renderer.view);
        }
    }
};

export default VObject.extend(component);