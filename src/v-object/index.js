import Vue from 'vue';
import {Graphics} from 'pixi.js';
function getPixiObj() {
    if (!this.pixiObj) {
        if (this.$parent) {
            this.pixiObj = new Graphics();
            this.pixiObj.sortableChildren = true;
            this.pixiObj.hostedComponent = this;
            let parentObj = this.$parent.getPixiObj();
            this.pixiObj.mask = this.$parent.getMaskObj();
            parentObj.addChild(this.pixiObj);
        }
        else return null;
    }
    return this.pixiObj;
}
function getMaskObj() {
    if (!this.clipped) return null;
    if (!this.maskObj) {
        if (this.$parent) {
            this.maskObj = new Graphics();
            let parentObj = this.$parent.getPixiObj();
            parentObj.addChild(this.maskObj);
        }
        else return null;
    }
    return this.maskObj;
}

function renderGraphic() {
    this.$parent.renderGraphic();
}
function draw(obj) {
    console.log('abstract draw function');
}
function registerEvents(pixiObj) {
    console.log('abstract: register events');
}
function makeScene() {
    let pixiObj = this.getPixiObj();
    let maskObj = this.getMaskObj();
    pixiObj && this.draw(pixiObj);
    maskObj && this.draw(maskObj);
    this.renderGraphic();
}

let component = {
    template: require('./template.html'),
    props: ['posX', 'posY', 'width', 'height', 'rotation'],
    data: function () {
        return {
            pixiObj: null
        }
    },
    computed: {
        baseCompProps: function() {
            return `${this.width} | ${this.height}`;
        },
        compProps: function () {
            return `${this.baseCompProps}`;
        },
        thisComponent: function() {
            return this;
        }
    },
    watch: {
        compProps: makeScene
    },
    methods: {
        getPixiObjBase: getPixiObj,
        getPixiObj: function() {
            return this.getPixiObjBase();
        },
        getMaskObj, makeScene, draw, renderGraphic, registerEvents
    }
};
export default Vue.extend(component);