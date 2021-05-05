import Vue from 'vue';
import { Fragment } from 'vue-fragment';
import template from './template.html';
import style from './style.less';
import { scaleLinear, scaleLog } from 'd3-scale';
import {
    processColorStr,
    getTransparency,
    DefaultValues,
    convert2rgbColor
} from '../utils';

async function makeScene() {
    let maskObj = this.getMaskObj();
    let pixiObj = this.getPixiObj();

    if (this.constrained) {
        this.coordinate.x = this.$parent.getChildX(this);
        this.coordinate.y = this.$parent.getChildY(this);
    }
    else this.coordinate = {}

    maskObj && this.drawMask(maskObj);
    pixiObj && await this.draw(pixiObj);
    if (this.live) {
        requestAnimationFrame(() => {
            this.rawRenderGraphic();
        });
    }
    else {
        this.renderGraphic();
    }
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
    props: ["name", "viewPosX", "viewPosY", "viewWidth", "viewHeight", 'rotation', 'cursor', 'constrained', 'expanded',
        'realMinX', 'realMaxX', 'realMinY', 'realMaxY', 'xTransform', 'yTransform'
    ],
    template,
    data: function () {
        return {
            debug: false,
            kursor: null,
            pixiObj: null,
            maskObj: null,
            coordinate: {},
            intFillTransparency: 1
        };
    },
    mounted: function () {
        this.buildTexture().then(() => {
        }).catch(error => {
            this.fillTexture = null;
            console.error(error.message);
        }).finally(async () => {
            await this.makeScene();
            this.registerEvents();
        });
    },
    beforeDestroy: function () {
        this.cleanUp();
    },
    destroyed: function () {
        if (this.constrained) {
            this.$parent.relayout();
        }
    },
    computed: {
        watchedKeys: function () {
            return Object.keys(this.$props);
        },
        componentTypePrefix: function () { return "" },
        componentType: function () { return this.componentTypePrefix + " VObject" },
        compProps: function () {
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
                getTransparency(this.fillTransparency || this.intFillTransparency));
            return cFc;
        },
        cForegroundColor: function () {
            return convert2rgbColor(this.foregroundColor);
        },
        cBackgroundColor: function () {
            return convert2rgbColor(this.backgroundColor);
        },
        cShadingPath: function () {
            let path = this.path.map((item, idx) => idx % 2 ? this._getY(item) : this._getX(item));
            let begin, end;
            switch (this.shadingSide) {
                case 'left': {
                    begin = [this.posX, path[1]];
                    end = [this.posX, path[path.length - 1]];
                    break;
                }
                case 'right': {
                    begin = [this.posX + this.width, path[1]];
                    end = [this.posX + this.width, path[path.length - 1]];
                    break;
                }
                case 'up': {
                    begin = [path[0], this.posY];
                    end = [path[path.length - 2], this.posY];
                    break;
                }
                case 'down': {
                    begin = [path[0], this.posY + this.height];
                    end = [path[path.length - 2], this.posY + this.height];
                    break;
                }
            }
            return [...begin, ...path, ...end];
        },
        posX: function () {
            if (!isNaN(this.viewPosX)) return this.viewPosX;
            return this._getX(this.realMinX);
        },
        posY: function () {
            if (!isNaN(this.viewPosY)) return this.viewPosY;
            return this._getY(this.realMinY);
        },
        width: function () {
            if (this.expanded) {
                return this.$parent.width;
            }
            if (!isNaN(this.viewWidth)) return this.viewWidth;
            return this._getX(this.realMaxX) - this._getX(this.realMinX);
        },
        height: function () {
            if (this.expanded) {
                return this.$parent.height;
            }
            if (!isNaN(this.viewHeight)) return this.viewHeight;
            return this._getY(this.realMaxY) - this._getY(this.realMinY);
        },
        transformX: function () {
            return this.getTransformX();
        },
        transformY: function () {
            return this.getTransformY();
        }
    },
    watch: {
        compProps: makeScene
    },
    methods: {
        makeScene, createPixiObj, getPixiObj, getMaskObj,
        renderGraphic, rawRenderGraphic, registerEvents,
        draw,
        drawMask: function (obj) {
            this.draw(obj);
        },
        getParent: function () {
            return this.$parent;
        },
        getRenderer: function () {
            if (!this._renderer) {
                this._renderer = this.$parent.getRenderer();
            }
            return this._renderer;
        },
        getRoot: function () {
            return this.$parent.getRoot();
        },
        getRootComp: function () {
            return this.$parent.getRootComp();
        },
        triggerRelayout: function () {
            this.$parent.relayout(this);
        },
        _getX: function (realX) {
            let transformX = this.getParent().transformX;
            if (transformX) {
                return transformX(realX);
            }
            return 0;
        },
        _getY: function (realY) {
            let transformY = this.getParent().transformY;
            if (transformY) {
                return transformY(realY);
            }
            return 0;
        },
        getTransformX: function () {
            let transformFn;
            switch (this.xTransform) {
                case "linear":
                    transformFn = scaleLinear();
                    break;
                case "loga":
                    transformFn = scaleLog();
                    break;
                case "none":
                    return null;
                default:
                    throw new Error(`Unrecognized xTransform ${this.xTransform} of this component (${this.compProps})`);
            }
            if (isNaN(this.viewWidth) || isNaN(this.realMinX) || isNaN(this.realMaxX)) {
                throw new Error(`Insufficient information for calculating transformX - (${this.compProps})`);
            }
            return transformFn.domain([this.realMinX, this.realMaxX])
                .range([0, this.viewWidth]);
        },
        getTransformY: function () {
            let transformFn;
            switch (this.yTransform) {
                case "linear":
                    transformFn = scaleLinear();
                    break;
                case "loga":
                    transformFn = scaleLog();
                    break;
                case "none":
                    return null;
                default:
                    throw new Error(`unrecognized yTransform ${this.yTransform} of this component (${this.compProps})`);
            }
            if (isNaN(this.viewHeight) || isNaN(this.realMinY) || isNaN(this.realMaxY)) {
                throw new Error(`Insufficient information for calculating transformY - (${this.compProps})`);
            }
            return transformFn.domain([this.realMinY, this.realMaxY])
                .range([0, this.viewHeight]);
        },
        cleanUp: function () {
            let parentObj = this.getParent().getPixiObj();
            parentObj.removeChild(this.pixiObj);
            if (this.maskObj) parentObj.removeChild(this.maskObj);
            this.pixiObj = null;
            this.maskObj = null;
        },
        buildTexture: function () {
            return new Promise(resolve => resolve(null));
        }
    },
    components: { Fragment }
}

export default Vue.extend(component);
