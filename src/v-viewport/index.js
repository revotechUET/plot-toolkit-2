import template from "./template.html";
import { Graphics, Point } from 'pixi.js';
import VContainer from "../v-container";
import VRect from "../v-rect";
import eventManager from '../event-manager';
import { getColor, getPosX, getPosY, getTransparency, DefaultValues } from '../utils';
import factoryFn from '../mixins';

console.log('Load v-viewport');
let component = {
    props: ["viewportWidth", "viewportHeight", "pan", "onPan", "onZoom"],
    template,
    created: function () {
        eventManager.on('wheel', (evt) => {
            // if((evt.metaKey || evt.ctrlKey) && this.pixiObj.containsPoint({x:evt.offsetX, y:evt.offsetY})) {
            if (this.pixiObj.containsPoint({ x: evt.offsetX, y: evt.offsetY })) {
                evt.stopPropagation();
                evt.preventDefault();
                if (evt.metaKey || evt.ctrlKey) {
                    this.onZoom && this.onZoom(evt.deltaY, evt.offsetX, evt.offsetY, evt);
                }
                else {
                    let panFn = this.onPan ? this.onPan : this.onPanDefault;
                    switch (this.pan) {
                        case "x":
                            panFn(evt.deltaY, 0);
                            break;
                        case "y":
                            panFn(0, evt.deltaY);
                            break;
                        case "none":
                            break;
                        default:
                            if (evt.shiftKey) {
                                panFn(evt.deltaY, 0);
                            }
                            else {
                                panFn(0, evt.deltaY);
                            }
                            break;
                    }
                }
            }
        });
    },
    data: function () {
        return { offsetX: 0, offsetY: 0 }
    },
    computed: {
        componentType: function () { return "VViewport"; }
    },
    methods: {
        getMaskObj: function () {
            if (!this.maskObj) {
                if (this.$parent) {
                    this.maskObj = new Graphics();
                    let parentObj = this.$parent.getPixiObj();
                    parentObj.addChild(this.maskObj);
                }
                else return null;
            }
            return this.maskObj;
        },
        draw: function (obj) {
            obj.clear();
            let lw = isNaN(this.lineWidth) ? 0 : this.lineWidth;
            let lt = getTransparency(this.lineTransparency);
            obj.lineStyle(lw, getColor(this.lineColor, DefaultValues.lineColor), this.cLineColor.transparency || lt, 0);
            obj.beginFill(0xEEEEEE, 0.2);
            obj.drawRect(0, 0, this.viewportWidth || 0, this.viewportHeight || 0);
            obj.endFill();
            obj.x = getPosX(this.coordinate, this.posX);
            obj.y = getPosY(this.coordinate, this.posY);
            obj.rotation = this.rotation || 0;
        },
        drawMask: function (obj) {
            obj.clear();
            let lw = isNaN(this.lineWidth) ? 0 : this.lineWidth;
            let w = (this.viewportWidth > 2 * lw) ? (this.viewportWidth - 2 * lw) : 0;
            let h = (this.viewportHeight - 2 * lw) ? (this.viewportHeight - 2 * lw) : 0;
            obj.lineStyle(1, 0xCCCCCC, 1, 0);
            obj.beginFill(0xEEEEEE, 1);
            obj.drawRect(lw, lw, w, h);
            obj.endFill();
            obj.x = getPosX(this.coordinate, this.posX);
            obj.y = getPosY(this.coordinate, this.posY);
            obj.rotation = this.rotation || 0;
        },
        detectCursor: function (target, localPos, globalPos, evt) {
            if (evt.data.originalEvent.metaKey || evt.data.originalEvent.ctrlKey) {
                switch (this.pan) {
                    case "x":
                        target.cursor = 'ew-resize';
                        target.locked = false;
                        break;
                    case "y":
                        target.cursor = "ns-resize";
                        target.locked = false;
                        break;
                    case "none":
                        target.cursor = 'default';
                        target.locked = true;
                        break;
                    default:
                        target.cursor = 'move';
                        target.locked = false;
                }
            }
            else {
                target.cursor = "default";
                target.locked = true;
            }
        },
        dragEnd: function (target, pos) {
            let ofX = pos.x;
            ofX = Math.max(ofX, this.viewportWidth - this.width);
            ofX = Math.min(ofX, 0);
            let ofY = pos.y;
            ofY = Math.max(ofY, this.viewportHeight - this.height);
            ofY = Math.min(ofY, 0);
            this.offsetX = ofX;
            this.offsetY = ofY;
        },
        translate: function (deltaX, deltaY) {
            if (deltaX) {
                let x = this.offsetX + deltaX;
                this.offsetX = x;
            }
            if (deltaY) {
                let y = this.offsetY + deltaY;
                this.offsetY = y;
            }
        },
        onPanDefault: function (deltaX, deltaY) {
            const resolution = 100;
            let xFull = (this.width - this.viewportWidth);
            let yFull = (this.height - this.viewportHeight);
            let xDir = (deltaX > 0) ? 1 : ((deltaX == 0) ? 0 : -1);
            let yDir = (deltaY > 0) ? 1 : ((deltaY == 0) ? 0 : -1);
            if (xDir) {
                let x = this.offsetX + (xFull * xDir / resolution);
                if (x > 0) {
                    x = 0;
                }
                else if (x < this.viewportWidth - this.width) {
                    x = this.viewportWidth - this.width
                }
                this.offsetX = x;
            }
            if (yDir) {
                let y = this.offsetY + (yFull * yDir / resolution);
                if (y > 0) {
                    y = 0;
                }
                else if (y < this.viewportHeight - this.height) {
                    y = this.viewportHeight - this.height
                }
                this.offsetY = y;
            }
            requestAnimationFrame(() => {
                this.rawRenderGraphic();
            });
        }
    },
    components: {
        VContainer, VRect
    }
}

let VViewport = VContainer.extend(component);

export function VViewportFactory(opts) {
    return factoryFn(VViewport, opts);
}

export default VViewport;
