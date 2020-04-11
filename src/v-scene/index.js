import {autoDetectRenderer, utils, Container} from 'pixi.js';
import VObject from '../v-object';
import template from './template.html';
import style from './style.less';
import layoutMixin from '../mixins/layout';
import {debounce} from 'lodash';
import wheelManager from '../wheel-manager';
function getPixiApp(force) {
    if (!this.pixiApp || force) {
        const renderer = autoDetectRenderer({ 
            width: this.width || 800, 
            height: this.height || 600, 
            transparent: this.transparent, 
            antialias: true 
        });
        renderer.view.onwheel = (evt) => {
            wheelManager.emit('wheel', evt);
        }
        const stage = new Container();
        stage.sortableChildren = true;
        stage.hostComponent = this;
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
function rawRenderGraphic(obj) {
    let app = this.getPixiApp();
    if (obj) {
        obj.render(app.renderer);
    }
    else app.renderer.render(obj || app.stage);
}
/*function renderGraphic(obj) {
    let app = this.getPixiApp();
    app.renderer.render(obj || app.stage);
}*/
 
let component = {
    props: ['transparent'],
    template,
    mounted: function() {
        this.$el.appendChild(this.getPixiApp().renderer.view)
    },
    computed: {
        componentType: function() {
            return "VScene";
        }
    },
    methods: {
        getPixiApp, getPixiObj,
        getRenderer: function() {
            return this.getPixiApp().renderer;
        },
        getRoot: function() {
            return this.getPixiApp().stage;
        },
        rawRenderGraphic,
        renderGraphic:debounce(rawRenderGraphic, 100) 
    },
    watch: {
        compProps: function() {
            let view = this.getPixiApp().renderer.view;
            this.$el.removeChild(view);
            let app = this.getPixiApp(true);
            this.$el.appendChild(app.renderer.view);
        }
    },
    mixins: [layoutMixin]
};

export default VObject.extend(component);