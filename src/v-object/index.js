import Vue from 'vue';
import template from './template.html';

function makeScene() {
    let pixiObj = this.getPixiObj();
    let maskObj = this.getMaskObj();
    
    if (this.constrained) {
        this.coordinate.x = this.$parent.getX(this);
        this.coordinate.y = this.$parent.getY(this);
    }
    else this.coordinate = {}

    pixiObj && this.draw(pixiObj);
    maskObj && this.draw(maskObj);
    this.renderGraphic();
}

function createPixiObj() {
    console.log("abstract createPixiObj");
}
function getPixiObj() {
    if (!this.pixiObj) {
        if (this.$parent) {
            this.pixiObj = this.createPixiObj();
            this.pixiObj.sortableChildren = true;
            this.pixiObj.hostComponent = this;
            this.pixiObj.cursor = this.cursor || 'default';
            let parentObj = this.$parent.getPixiObj();
            this.pixiObj.mask = this.$parent.getMaskObj();
            parentObj.addChild(this.pixiObj);
        }
        else return null;       
    }
    return this.pixiObj;
}

function getMaskObj() {
    console.log("VObject getMaskObj");
    return null;
}
function renderGraphic(obj) {
    this.$parent.renderGraphic(obj);
}
function rawRenderGraphic(obj) {
    this.$parent.rawRenderGraphic(obj);
}
function registerEvents(pixiObj) {
    console.log('abstract: register events');
}
function draw(obj) {
    console.log('abstract draw function');
}
let component = {
    props: ["name", "posX", "posY", "width", "height", 'rotation', 'cursor', 'constrained'],
    template,
    data: function() {
        return {
            pixiObj: null,
            maskObj: null,
            coordinate: {}
        };
    },
    mounted: function () {
        this.makeScene();
        this.registerEvents();
    },
    computed: {
        watchedKeys: function() {
            return Object.keys(this.$props);
        },
        compProps: function() {
            let hash = {};
            for (let key of this.watchedKeys) {
                hash[key] = this[key];
            }
            return JSON.stringify(hash);
        }
    },
    watch: {
        compProps: makeScene
    },
    methods: {
        makeScene, createPixiObj, getPixiObj, getMaskObj, 
        renderGraphic, rawRenderGraphic, registerEvents, 
        draw, 
        getRoot: function() {
            return this.$parent.getRoot();
        },
        triggerRelayout: function() {
            this.$parent.relayout(this);
        }
    }
}

export default Vue.extend(component);