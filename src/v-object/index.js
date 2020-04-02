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

function renderGraphic(obj) {
    this.$parent.renderGraphic(obj);
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
const propKeys = ['posX', 'posY', 'width', 'height', 'rotation'];
let component = {
    template: require('./template.html'),
    props: propKeys,
    data: function () {
        return {
            pixiObj: null,
            maskObj: null
        }
    },
    computed: {
        baseCompProps: function() {
            let array = [];
            propKeys.forEach(k => {
                if (typeof this[k] !== 'function') array.push(this[k])
            });
            return array.join('|');
            //return `${this.width} | ${this.height}`;
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