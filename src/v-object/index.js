import Vue from 'vue';
import template from './template.html';
import {scaleLinear, scaleLog} from 'd3-scale';

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
    props: ["name", "viewPosX", "viewPosY", "viewWidth", "viewHeight", 'rotation', 'cursor', 'constrained',
        'realMinX', 'realMaxX', 'realMinY', 'realMaxY', 'xTransform', 'yTransform'    
    ],
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
        },
        posX: function() {
            if (!isNaN(this.viewPosX)) return this.viewPosX;
            return this._getX(this.realMinX);
        },
        posY: function() {
            if (!isNaN(this.viewPosY)) return this.viewPosY;
            return this._getY(this.realMinY);
        },
        width: function() {
            if (!isNaN(this.viewWidth)) return this.viewWidth;
            return this._getX(this.realMaxX) - this._getX(this.realMinX);
        },
        height: function() {
            if (!isNaN(this.viewHeight)) return this.viewHeight;
            return this._getY(this.realMaxY) - this._getY(this.realMinY);
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
        },
        _getX: function(realX) {
            let transformX = this.$parent.transformX();
            if (transformX) {
                return transformX(realX);
            }
            return 0;
        },
        _getY: function(realY) {
            let transformY = this.$parent.transformY();
            if (transformY) {
                return transformY(realY);
            }
            return 0;
        },
        transformX: function(){
            let transformFn;
            switch (this.xTransform) {
                case "linear":
                    transformFn = scaleLinear();
                    break;
                case "loga":
                    transformFn = scaleLog();
                    break;
                default:
                    return null;
            }
            if (isNaN(this.viewWidth) || isNaN(this.viewPosX)|| 
                isNaN(this.realMinX)  || isNaN(this.realMaxX)  ) 
            {
                return null;
            }
            return transformFn.domain([this.realMinX, this.realMaxX])
                .range([this.viewPosX, this.viewPosX + this.viewWidth]);
        },
        transformY: function() {
            let transformFn;
            switch (this.yTransform) {
                case "linear":
                    transformFn = scaleLinear();
                    break;
                case "loga":
                    transformFn = scaleLog();
                    break;
                default:
                    return null;
            }
            if (isNaN(this.viewHeight) || isNaN(this.viewPosY)|| 
                isNaN(this.realMinY)  || isNaN(this.realMaxY)  ) 
            {
                return null;
            }
            return transformFn.domain([this.realMinY, this.realMaxY])
                .range([this.viewPosY, this.viewPosY + this.viewHeight]);
        }
    }
}

export default Vue.extend(component);