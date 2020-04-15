import VObject from '../v-object';
import {VTextboxFactory} from '../v-textbox';
import { Graphics } from 'pixi.js';
import {getPosX, getPosY, getColor, getTransparency, DefaultValues} from '../utils';
import template from "./template.html";
import eventManager from '../event-manager';

let component = {
    props: ["enabled", "lineWidth", "lineColor", "lineTransparency", "fillColor", "refLineX", "refLineY"],
    template,
    components: { VTextboxSticky: VTextboxFactory({'sticky': true}) },
    data: function() {
        return {
            kursor: 'crosshair',
            hasMouseOver: false,
            mouseGlobalX: null,
            mouseGlobalY: null, 
            tooltips: [{
                content:"hello",
                viewPosX: 0,
                viewPosY: 0,
                fillTransparency: 0. 
            },{
                content:"goodbye",
                viewPosX: 150,
                viewPosY: 0,
                fillTransparency: 0. 
            }]
        }
    },
    computed: {
        componentType: function() {
            return "VLayer";
        }
    },
    methods: {
        draw: function(obj) {
            obj.clear();
            obj.lineStyle(0, 0xeeeeee, 1, 0.5, true);
            obj.beginFill(0xeeeeee, 0.001);
            obj.drawRect(0, 0, this.width, this.height);
            obj.endFill();
            obj.x = getPosX(this.coordinate, this.posX);
            obj.y = getPosY(this.coordinate, this.posY);
            this.drawRefLines(obj);
        },
        drawRefLines: function() {
            if (!this.hasMouseOver || (!this.refLineX && !this.refLineY)) return;
            let obj = this.getLayerObj();
            if (!obj) return;
            obj.clear();
            let refPosition = this.pixiObj.toGlobal({x:this.posX, y: this.posY});
            obj.lineStyle(this.lineWidth, this.cLineColor.color, 
                this.cLineColor.transparency, 0.5, true);

            if (this.refLineX) {
                obj.moveTo(refPosition.x, this.mouseGlobalY);
                obj.lineTo(refPosition.x + this.width, this.mouseGlobalY);
            }
            if (this.refLineY) {
                obj.moveTo(this.mouseGlobalX, refPosition.y);
                obj.lineTo(this.mouseGlobalX, refPosition.y + this.height);
            }
        },
        createPixiObj: function () {
            let pixiObj = new Graphics();
            return pixiObj;
        },
        getLayerObj: function() {
            if (!this.layerObj) {
                this.layerObj = new Graphics();
                this.getRoot().addChild(this.layerObj);
            }
            return this.layerObj;
        },
        addTooltip: function(srcComp, message) {
            let key = srcComp.componentType + srcComp.name;
            let tooltipIdx = this.tooltips.findIndex(t => t.key === key);
            let tooltipGlobalPos = srcComp.pixiObj.getGlobalPosition();
            if (tooltipIdx < 0) {
                this.tooltips.push({
                    key : key,
                    content : message,
                    viewPosX: tooltipGlobalPos.x,
                    viewPosY: tooltipGlobalPos.y,
                    fillTransparency: 0.3
                });
            }
            else {
                this.tooltips.splice(tooltipIdx, 1, {
                    key : key,
                    content : message,
                    viewPosX: tooltipGlobalPos.x,
                    viewPosY: tooltipGlobalPos.y,
                    fillTransparency: 0.3
                });
            }
        },
        removeTooltip: function(srcComp, message) {
            let key = srcComp.componentType + srcComp.name;
            let tooltipIdx = this.tooltips.findIndex(t => t.key === key);
            if (tooltipIdx < 0) return;
            this.tooltips.splice(tooltipIdx, 1);
        },
        processMouseEvent: function (target, globalPos, localPos) {
            this.mouseGlobalX = globalPos.x;
            this.mouseGlobalY = globalPos.y;
            eventManager.emit('ext-mousepos', target, globalPos, localPos, {
                refLineX: this.refLineX, 
                refLineY: this.refLineY
            });
            requestAnimationFrame(() => {
                this.drawRefLines();
                this.rawRenderGraphic();
            });
        },
        registerEvents: function (_pixiObj) {
            let pixiObj = _pixiObj || this.getPixiObj();
            if (this.enabled) {
                pixiObj.interactive = true;
            }
            const handleMouseOver = evt => {
                this.hasMouseOver = true;
                let currentTarget = evt.currentTarget;
                let globalPos = evt.data.global;
                let localPos = currentTarget.toLocal(globalPos);

                this.processMouseEvent(currentTarget, globalPos, localPos);
                this.onmouseover &&
                    this.onmouseover(
                        evt.currentTarget,
                        localPos,
                        evt.data.global,
                        evt
                    );
            };
            const handleMouseMove = evt => {
                if (!this.hasMouseOver) return;
                let currentTarget = evt.currentTarget;
                let globalPos = evt.data.global;
                let localPos = currentTarget.toLocal(globalPos);

                this.processMouseEvent(currentTarget, globalPos, localPos);
                this.onmousemove &&
                    this.onmousemove(
                        currentTarget,
                        localPos,
                        globalPos,
                        evt
                    );
            };
            const handleMouseOut = evt => {
                this.hasMouseOver = false;
                this.tooltips.splice(0);
                requestAnimationFrame(() => {
                    this.getLayerObj().clear();
                    this.rawRenderGraphic();
                });
                this.onmouseout &&
                    this.onmouseout(
                        evt.currentTarget,
                        evt.currentTarget.toLocal(evt.data.global),
                        evt.data.global,
                        evt
                    );
            };
            const handleMouseUp = (evt) => {
                requestAnimationFrame(() => {
                    this.drawRefLines();
                    this.rawRenderGraphic();
                });
            }
            pixiObj
                .on("mouseover", handleMouseOver)
                .on("mouseout", handleMouseOut)
                .on("mousemove", handleMouseMove)
                .on('mouseup', handleMouseUp);
            
            eventManager.on('tooltip-on', this.addTooltip);
            eventManager.on('tooltip-off', this.removeTooltip);
        }
    }
}
export default VObject.extend(component);