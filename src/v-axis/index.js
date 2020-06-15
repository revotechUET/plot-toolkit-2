import VRect from '../v-rect';
import {getColor, formatNumber, genLogTickValues, logMajorTest, DefaultValues, getTransparency} from '../utils';
import { Container, Text } from 'pixi.js';
import {debounce} from 'lodash';

const TICK_SIZE = 5;
const TICK_SIZE_MAJOR = 8;
function drawOneXTick(obj, thisComp, container, i, majorTickIdx) {
    let x = thisComp.transformFn(thisComp.tickValues[i]);
    if (thisComp.grid) {
        obj.moveTo(x, 0);
        obj.lineTo(x, thisComp.viewHeight);
    }
    else {
        let tickSize = (majorTickIdx < 0)? TICK_SIZE:TICK_SIZE_MAJOR;
        let offsetY = 0;
        let viewHeight = thisComp.viewHeight;
        if (thisComp.tickLabelPosition == "sticky") {
            let viewport = thisComp.getContainingViewport();
            offsetY = (viewport || {}).offsetY || 0;
            viewHeight = (viewport || {}).viewportHeight || viewHeight;
        }

        obj.moveTo(x, 0 - offsetY);
        obj.lineTo(x, tickSize - offsetY);
        obj.moveTo(x, viewHeight - tickSize - offsetY);
        obj.lineTo(x, viewHeight - offsetY);
    }
    if (majorTickIdx < 0) return;
    switch (thisComp.tickLabelPosition) {
        case "low": 
            container.drawLabel(majorTickIdx, x, TICK_SIZE + 5, thisComp.tickValues[i], {top: 0, left: 0, xTranslate: 0.5, yTranslate: 0});
            break;
        case "high":
            container.drawLabel(majorTickIdx, x, -TICK_SIZE - 5, thisComp.tickValues[i], {top: 1, left: 0, xTranslate: 0.5, yTranslate: 1});
            break;
        case "middle":
            container.drawLabel(majorTickIdx, x, 0, thisComp.tickValues[i], {top: 0.5, left: 0, xTranslate: 0.5, yTranslate: 0.5});
            break;
        case "sticky":
            let viewport = thisComp.getContainingViewport();
            let offsetY = (viewport || {}).offsetY || 0;
            const yTickPos = -(thisComp.viewHeight / 2) + TICK_SIZE + 5 - offsetY;
            container.drawLabel(majorTickIdx, x, yTickPos, thisComp.tickValues[i], {top: 0.5, left: 0, xTranslate: 0.5, yTranslate: 0.5});
            break;
        default:
            if(!isNaN(thisComp.tickLabelPosition)) {
                const yTickPos = Number(thisComp.tickLabelPosition);
                container.drawLabel(majorTickIdx, x, yTickPos, thisComp.tickValues[i], {top: 0.5, left: 0, xTranslate: 0.5, yTranslate: 0.5});
            }
    }
}
function drawOneYTick(obj, thisComp, container, i, majorTickIdx) {
    let y = thisComp.transformFn(thisComp.tickValues[i]);
    if (thisComp.grid) {
        obj.moveTo(0, y);
        obj.lineTo(thisComp.viewWidth, y);
    }
    else {
        let tickSize = (majorTickIdx < 0)? TICK_SIZE:TICK_SIZE_MAJOR;
        let offsetX = 0;
        let viewWidth = thisComp.viewWidth;
        if (thisComp.tickLabelPosition == "sticky") {
            let viewport = thisComp.getContainingViewport();
            offsetX = (viewport || {}).offsetX || 0;
            viewWidth = (viewport || {}).viewportWidth || viewWidth;
        }
        obj.moveTo(0 - offsetX, y);
        obj.lineTo(tickSize - offsetX, y);
        obj.moveTo(viewWidth - tickSize - offsetX, y);
        obj.lineTo(viewWidth - offsetX, y);
    }
    if (majorTickIdx < 0) return;
    switch (thisComp.tickLabelPosition) {
        case "low": 
            container.drawLabel(majorTickIdx, TICK_SIZE + 5, y, thisComp.tickValues[i], {top: 0, left: 0, xTranslate: 0, yTranslate: 0.5});
            break;
        case "high":
            container.drawLabel(majorTickIdx, -TICK_SIZE - 5, y, thisComp.tickValues[i], {top: 0, left: 1, xTranslate: 1, yTranslate: 0.5});
            break;
        case "middle":
            container.drawLabel(majorTickIdx, 0, y, thisComp.tickValues[i], {top: 0, left: 0.5, xTranslate: 0.5, yTranslate: 0.5});
            break;
        case "sticky":
            let viewport = thisComp.getContainingViewport();
            let offsetX = (viewport || {}).offsetX || 0;
            const xTickPos = -(thisComp.viewWidth / 2) + TICK_SIZE + 5 - offsetX;
            container.drawLabel(majorTickIdx, xTickPos, y, thisComp.tickValues[i], {top: 0, left: 0.5, xTranslate: 0.5, yTranslate: 0.5});
            break;
        default:
            if(!isNaN(thisComp.tickLabelPosition)) {
                const xTickPos = Number(thisComp.tickLabelPosition);
                container.drawLabel(majorTickIdx, xTickPos, y, thisComp.tickValues[i], {top: 0, left: 0.5, xTranslate: 0.5, yTranslate: 0.5});
            }
    }
}
class LabelParticleContainer extends Container {
    constructor(axisComp) {
        super();
        this.labels = [];
        this.axisComp = axisComp;
        this.renderer = axisComp.getRenderer();
    }
    drawLabel(idx, x, y, value, {top, left, xTranslate, yTranslate}) {
        let label;
        if (idx < this.children.length) {
            label = this.getChildAt(idx);
        }
        else {
            label = new Text("");
            label.style.fontSize = 12;
            this.addChild(label);
        }
        label.text = formatNumber(value, this.axisComp.tickPrecision);
        let bounds = label.getBounds();
        label.x = left * this.axisComp.width + x - bounds.width * xTranslate;
        label.y = top * this.axisComp.height + y - bounds.height * yTranslate;
    }
    removeSpritesFrom(idx) {
        if (idx >= 0 && idx < this.children.length) 
            this.removeChildren(idx);
    }
}

let component = {
    props: ['axis', 'majorTicks', "majorTickLength", "minorTicks", "grid", "tickLabelPosition", "tickPrecision", "spaceComponent", "onAxisChanged"],
    created: function() {
        this._makeSceneDebounce = debounce(this.makeScene,200);
    },
    beforeMount: function() {
        this.processTickValues();
    },
    computed: {
		watchedKeys: function() {
			return ["hasMouseOver", ...Object.keys(this.$props)].filter(
				(v) => (v !== "dragLimits" && v !== "spaceComponent" && v !== "onAxisChanged")
			);
		},
        componentType: function() { return "VAxis" },
        transformFn: function() {
            switch(this.axis) {
                case "x":
                    return this.transformX;
                case 'y':
                    return this.transformY;
            }
            return null;
        },
        tickProps: function() {
            let watchedProps;
            switch(this.axis) {
                case 'x':
                    watchedProps = ['realMinX', 'realMaxX', 'width', 'minorTicks', 'majorTicks', 'majorTickLength', 'xTransform'];
                    break;
                case 'y':
                    watchedProps = ['realMinY', 'realMaxY', 'height', 'minorTicks', 'majorTicks', 'majorTickLength', 'yTransform'];
                    break;
            }

            let hash = {};
            for (let key of watchedProps) {
                hash[key] = this[key];
            }
            return "tickProps:" + JSON.stringify(hash);
        },
        transformPropsObj : function() {
            let watchedProps;
            switch(this.axis) {
                case 'x':
                    watchedProps = ['realMinX', 'realMaxX', 'width', 'xTransform'];
                    break;
                case 'y':
                    watchedProps = ['realMinY', 'realMaxY', 'height', 'yTransform'];
                    break;
            }

            let hash = {};
            for (let key of watchedProps) {
                hash[key] = this[key];
            }
            return hash;
        },
        transformProps: function() {
            let watchedProps;
            switch(this.axis) {
                case 'x':
                    watchedProps = ['realMinX', 'realMaxX', 'width', 'xTransform'];
                    break;
                case 'y':
                    watchedProps = ['realMinY', 'realMaxY', 'height', 'yTransform'];
                    break;
            }

            let hash = {};
            for (let key of watchedProps) {
                hash[key] = this[key];
            }
            return "transformProps:" + JSON.stringify(hash);
        },

        containingViewportOffset: function() {
            let viewport = this.getContainingViewport() || {};
            if (this.axis === "x") {
                return viewport.offsetY;
            }
            else {
                return viewport.offsetX;
            }
        }
    },
    watch: {
        containingViewportOffset: function() {
            if (this.tickLabelPosition === 'sticky') {
                this.makeScene();
            }
        },
        transformProps: function() {
            this.onAxisChanged && this.onAxisChanged(this.transformProps);
        },
        tickProps: function() {
            this.processTickValues();
            this.makeSceneDebounce();
        },
        compProps: function() {
            this.makeSceneDebounce();
        }
    },
    methods: {
        getContainingViewport: function() {
            if (this.spaceComponent) 
                return this.spaceComponent.$parent.$parent;
            return null;
        },
        getLabelContainer: function() {
            if (!this.container) {
                this.container = new LabelParticleContainer(this);
                this.container.x = 0;
                this.container.y = 0;
                this.pixiObj.addChild(this.container);
            }
            return this.container;
        },
        draw: function(obj) {
            if (obj === this.pixiObj) {
                console.log('VAxis draw')
                this.drawRect(obj, 1);
                this.drawGrid(obj);
            }
            else {
                console.log('VAxis draw mask')
                this.drawRect(obj, 1);
            }
        },
        drawGrid: function(obj) {
            let container = this.getLabelContainer();
            obj.lineStyle(5, 0x880000, 1, 0.5, false);
            let drawOneTick;
            switch (this.axis) {
                case 'x':
                    drawOneTick = drawOneXTick;
                    break;
                case 'y':
                    drawOneTick = drawOneYTick;
                    break;
            }
            let majorTickIdx = -1;
            for (let i = 0; i < this.tickValues.length; i++) {
                if (this.tickMarks[i]) {
                    majorTickIdx++;
                    obj.lineStyle(1.5, 0x888888, 1, 0.5, false);
                    drawOneTick(obj, this, container, i, majorTickIdx);
                }
                else {
                    obj.lineStyle(1, 0xcccccc, 1, 0.5, false);
                    drawOneTick(obj, this, container, i, -1);
                }
            }
            this.container.removeSpritesFrom(this.tickValues.length);
        },
        processLinearTickValues: function() {
            let minVal, maxVal;
            if (!this.transformFn)  {
                this.tickValues = [];
                return;
            }
            switch(this.axis) {
                case "x":
                    minVal = this.realMinX;
                    maxVal = this.realMaxX;
                    break;
                case "y":
                    minVal = this.realMinY;
                    maxVal = this.realMaxY;
                    break;
            }
            if (!this.majorTickLength) {
                let N = this.majorTicks * this.minorTicks;
                let step = (maxVal - minVal) / N;
                if (isNaN(maxVal) || isNaN(minVal) || isNaN(step)) return [];
                let tickIndices = [... Array(N + 1).keys()];
                this.tickMarks = tickIndices.map(idx => (idx % this.minorTicks === 0));
                this.tickValues = tickIndices.map(idx => minVal + idx * step);
            }
            else {
                let N = (parseInt(Math.max(maxVal, minVal) / this.majorTickLength) + 1) * this.minorTicks;
                let step = this.majorTickLength / this.minorTicks;
                let tickIndices = [... Array(N).keys()];
                let tickVals = tickIndices.map(idx => idx * step);
                this.tickMarks = tickIndices.map(idx => (idx % this.minorTicks === 0) );
                this.tickMarks = this.tickMarks.filter(
                    (v, idx) => ( (tickVals[idx] >= minVal) && (tickVals[idx] <= maxVal) )
                );
                this.tickValues = tickVals.filter(v => (v >= minVal && v <= maxVal));
            }
        },
        processLogaTickValues: function() {
            let minVal, maxVal;
            switch (this.axis) {
                case 'x':
                    minVal = this.realMinX;
                    maxVal = this.realMaxX;
                    break;
                case 'y':
                    minVal = this.realMinY;
                    maxVal = this.realMaxY;
                    break;
            }
            this.tickValues = genLogTickValues(minVal, maxVal);
            this.tickMarks = this.tickValues.map(v => logMajorTest(v));
        },
        processTickValues: function() {
            let scaleType;
            switch(this.axis) {
                case 'x':
                    scaleType = this.xTransform;
                    break;
                case 'y':
                    scaleType = this.yTransform;
                    break;
            }
            switch (scaleType) {
                case 'linear':
                    this.processLinearTickValues();
                    break;
                case 'loga':
                    this.processLogaTickValues();
                    break;
            }
        },
        makeSceneDebounce: function() {
            this._makeSceneDebounce();
        }
    }
}

export default VRect.extend(component);