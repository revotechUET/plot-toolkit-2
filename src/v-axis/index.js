import VRect from '../v-rect';
import {formatNumber} from '../utils';
import { Container, Text } from 'pixi.js';

const TICK_SIZE = 5;
function drawOneXTick(obj, thisComp, container, i) {
    let x = thisComp.transformFn(thisComp.tickValues[i]);
    if (thisComp.grid) {
        obj.moveTo(x, 0);
        obj.lineTo(x, thisComp.viewHeight);
    }
    else {
        obj.moveTo(x, 0);
        obj.lineTo(x, TICK_SIZE);
        obj.moveTo(x, thisComp.viewHeight - TICK_SIZE);
        obj.lineTo(x, thisComp.viewHeight);
    }
    switch (thisComp.tickLabelPosition) {
        case "low": 
            container.drawLabel(i, x, TICK_SIZE + 4, thisComp.tickValues[i], {top: 0, left: 0, xTranslate: 0.5, yTranslate: 0});
            break;
        case "high":
            container.drawLabel(i, x, -TICK_SIZE - 4, thisComp.tickValues[i], {top: 1, left: 0, xTranslate: 0.5, yTranslate: 1});
            break;
        case "middle":
        default:
            container.drawLabel(i, x, 0, thisComp.tickValues[i], {top: 0.5, left: 0, xTranslate: 0.5, yTranslate: 0.5});
    }
}
function drawOneYTick(obj, thisComp, container, i) {
    let y = thisComp.transformFn(thisComp.tickValues[i]);
    if (thisComp.grid) {
        obj.moveTo(0, y);
        obj.lineTo(thisComp.viewWidth, y);
    }
    else {
        obj.moveTo(0, y);
        obj.lineTo(TICK_SIZE, y);
        obj.moveTo(thisComp.viewWidth - TICK_SIZE, y);
        obj.lineTo(thisComp.viewWidth, y);
    }
    switch (thisComp.tickLabelPosition) {
        case "low": 
            container.drawLabel(i, TICK_SIZE + 4, y, thisComp.tickValues[i], {top: 0, left: 0, xTranslate: 0, yTranslate: 0.5});
            break;
        case "high":
            container.drawLabel(i, -TICK_SIZE - 4, y, thisComp.tickValues[i], {top: 0, left: 1, xTranslate: 1, yTranslate: 0.5});
            break;
        case "middle":
        default:
            container.drawLabel(i, 0, y, thisComp.tickValues[i], {top: 0, left: 0.5, xTranslate: 0.5, yTranslate: 0.5});
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
    props: ['axis', 'majorTicks', "minorTicks", "grid", "tickLabelPosition", "tickPrecision"],
    computed: {
        componentType: function() { return "VAxis" },
        tickValues: function() {
            let minVal, maxVal;
            if (!this.transformFn) return [];
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
            let N = this.majorTicks * this.minorTicks;
            let step = (maxVal - minVal) / N;
            if (isNaN(maxVal) || isNaN(minVal) || isNaN(step)) return [];
            return [... Array(N + 1).keys()].map(idx => minVal + idx * step);
        },
        transformFn: function() {
            switch(this.axis) {
                case "x":
                    return this.transformX;
                case 'y':
                    return this.transformY;
            }
            return null;
        }
    },
    methods: {
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
            obj.lineStyle(1, 0x888888, 1, 0.5, true);
            switch (this.axis) {
                case 'x':
                    for (let i = 0; i < this.tickValues.length; i++) {
                        drawOneXTick(obj, this, container, i);
                    }
                    break;
                case 'y':
                    for (let i = 0; i < this.tickValues.length; i++) {
                        drawOneYTick(obj, this, container, i);
                    }
                    break;
            }
            this.container.removeSpritesFrom(this.tickValues.length);
        }
    }
}

export default VRect.extend(component);