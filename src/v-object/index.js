import Vue from 'vue';
import {Fragment} from 'vue-fragment';
import template from './template.html';
import style from './style.less';
import {scaleLinear, scaleLog} from 'd3-scale';
import {
    processColorStr,
    getTransparency,
    DefaultValues,
    convert2rgbColor
} from '../utils';

function makeScene() {
    let maskObj = this.getMaskObj();
    let pixiObj = this.getPixiObj();
    
    if (this.constrained) {
        this.coordinate.x = this.$parent.getChildX(this);
        this.coordinate.y = this.$parent.getChildY(this);
    }
    else this.coordinate = {}

    maskObj && this.drawMask(maskObj);
    pixiObj && this.draw(pixiObj);
    this.renderGraphic();
}

function createPixiObj() {
    console.log("abstract createPixiObj");
}
function getPixiObj() {
    if (!this.pixiObj) {
        if (this.getParent()) {
            this.pixiObj = this.createPixiObj();
            this.pixiObj.sortableChildren = true;
            this.pixiObj.hostComponent = this;
            this.pixiObj.cursor = this.cursor || this.kursor || 'default';
            let parentObj = this.getParent().getPixiObj();
            this.pixiObj.mask = this.getParent().getMaskObj();
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
            debug: false,
            kursor: null, 
            pixiObj: null,
            maskObj: null,
            coordinate: {}
        };
    },
    mounted: function () {
        this.makeScene();
        this.registerEvents();
    },
    beforeDestroy: function() {
        console.log('before destroy');
        this.cleanUp();
    },
    computed: {
        watchedKeys: function() {
            return Object.keys(this.$props);
        },
        componentTypePrefix: function() {return ""},
        componentType: function() {return this.componentTypePrefix + " VObject"},
        compProps: function() {
            let hash = {};
            for (let key of this.watchedKeys) {
                hash[key] = this[key];
            }
            return this.componentType + ":" + JSON.stringify(hash);
        },
        cLineColor: function () {
            return processColorStr(this.lineColor, DefaultValues.lineColor,
                getTransparency(this.lineTransparency));
        },
        cFillColor: function () {
            let cFc = processColorStr(this.fillColor, DefaultValues.fillColor,
                getTransparency(this.fillTransparency));
            return cFc;
        },
        cForegroundColor: function() {
            return convert2rgbColor(this.foregroundColor);
        },
        cBackgroundColor: function() {
            return convert2rgbColor(this.backgroundColor);
        },
        cPath: function() {
            let path = this.path.map((item, idx) => idx % 2 ? this._getY(item) : this._getX(item));
            return path;
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
            if (isNaN(this.viewWidth) || isNaN(this.realMinX) || isNaN(this.realMaxX)  ) 
            {
                return null;
            }
            return transformFn.domain([this.realMinX, this.realMaxX])
                .range([0, this.viewWidth]);
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
            if (isNaN(this.viewHeight) || isNaN(this.realMinY) || isNaN(this.realMaxY)) {
                return null;
            }
            return transformFn.domain([this.realMinY, this.realMaxY])
                .range([0, this.viewHeight]);
        }
    },
    watch: {
        compProps: makeScene
    },
    methods: {
        makeScene, createPixiObj, getPixiObj, getMaskObj, 
        renderGraphic, rawRenderGraphic, registerEvents, 
        draw,
        drawMask: function(obj) {
            this.draw(obj);
        },
        getParent: function() {
            return this.$parent;
        },
        getRenderer: function() {
            if (!this._renderer) {
                this._renderer = this.$parent.getRenderer();
            }
            return this._renderer;
        },
        getRoot: function() {
            return this.$parent.getRoot();
        },
        getRootComp: function() {
            return this.$parent.getRootComp();
        },
        triggerRelayout: function() {
            this.$parent.relayout(this);
        },
        _getX: function(realX) {
            let transformX = this.getParent().transformX;
            if (transformX) {
                return transformX(realX);
            }
            return 0;
        },
        _getY: function(realY) {
            let transformY = this.getParent().transformY;
            if (transformY) {
                return transformY(realY);
            }
            return 0;
        },
        cleanUp: function() {
            let parentObj = this.getParent().getPixiObj();
            parentObj.removeChild(this.pixiObj);
            if (this.maskObj) parentObj.removeChild(this.maskObj);
            this.pixiObj = null;
            this.maskObj = null;
        }
    },
    components: {Fragment}
}

export default Vue.extend(component);
