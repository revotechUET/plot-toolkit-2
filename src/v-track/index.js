import { Fragment } from 'vue-fragment';
import { Text } from 'pixi.js';
import VPath from '../v-path';
import VRect from '../v-rect';
import { VAxisFactory } from '../v-axis';
import { VRectFactory } from '../v-rect';
import VContainer from '../v-container';
import VResizable from '../v-resizable';
import VViewport from '../v-viewport';
import { VCartersianFactory } from '../v-cartersian';
import VTextbox from '../v-textbox';
import VHeaderCurve from '../v-header-curve';
import VHeaderShading from '../v-header-shading';
import template from './template.html';
import VShape from '../v-shape';
import { scaleLinear, } from 'd3';
import eventManager from '../event-manager';
import baseResizable from '../mixins/base-resizable'

let component = {
    props: {
        beforeMouseDown: {
            type: Function
        },
        afterMouseDown: {
            type: Function
        },
        showTitle: {
            type: Boolean,
            default: true
        },
        justification: {
            type: String,
            default: 'center'
        },
        trackTitleFillColor: {
            default: 0x3366ff
        },
        trackType: {
            type: String
        },
        trackRealMinY: {
            type: Number
        },
        trackRealMaxY: {
            type: Number
        },
        trackHeaderHeight: {
            type: Number,
            default: 100
        },
        trackHeaderResize: {
            type: Function
        },
        knobFlags: {
            type: Array,
            default: () => [false, true]
        },
        direction: {
            type: String,
            default: "horizontal"
        },
        trackChildren: {
            type: Number
        },
        majorTickLength: {
            type: Number
        },
        minorTicks: {
            type: Number
        },
        majorTicks: {
            type: Number
        },
        unit: {
            type: String
        },
        trackId: Number,
        orderNum: {
            default: ""
        },
        showDepthGrid: {
            type: Boolean,
            default: true
        },
        showValueGrid: {
            type: Boolean,
            default: true
        },
        isSelected: {
            type: Boolean,
            default: false
        },
        onPlotZoom: Function,
        trackViewportBodyHeight: Number,
        plotSignal: String //handle when signal with multiple plots
    },
    computed: {
        componentType: function () {
            return "VTrack";
        },
        checkSelected: function () {
            return this.selectionStates.some(item => item) || this.isSelected;
        },
        cRatioScreen: function () {
            let ratio = this.getCentimeterFromPixel() *
                (this.viewHeight - Math.max(this.trackHeaderHeight - 20, this.trackHeaderChildrenHeight)) / (this.trackRealMaxY - this.trackRealMinY);
            return `1:${Math.floor(ratio)}`;
        },
    },
    data: function () {
        return {
            kursor: "default",
            trackHeaderChildrenHeight: 0,
            headerContentStyle: {
                fontFamily: 'Arial',
                fontStyle: 'italic',
                align: 'center',
                padding: 5,
                fontSize: 12,
            },
            selectionStates: [],
            nChildren: 0
        }
    },
    template: `<div>
        <div v-if="debug" class="v-object">{{compProps}}
            ${require('./fragment.html')}
            ${require('../v-resizable/fragment.html')}
        </div>
        <fragment v-if="!debug" props="compProps">
            ${require('./fragment.html')}
            ${require('../v-resizable/fragment.html')}
        </fragment>
    </div>`,
    components: {
        VPath, VRect, VResizable, VViewport, VHeaderCurve,
        VContainer, Fragment, VTextbox, VShape, VHeaderShading,
        VCartersianExtMouse: VCartersianFactory({ extMouseListener: true }),
        VRectWithMountedEvent: VRectFactory({ onMounted: true }),
        VRectExtMouseWithMountedEvent: VRectFactory({ onMounted: true, extMouseListener: true }),
        VRectWithDestroyedEvt: VRectFactory({ onDestroyed: true }),
        VAxisExtMouse: VAxisFactory({ extMouseListener: true })
    },
    methods: {
        onViewportZoom: function (deltaY, offsetX, offsetY, evt) {
            this.onPlotZoom && this.onPlotZoom(deltaY, offsetX, offsetY, this.name)
        },
        registerEvents: function () {
            eventManager.on("viewport-scroll", (val, trackId) => {
                if (trackId === this.trackId) {
                    return;
                }
                if (this.$refs.viewportBody && this.$refs.viewportBody.offsetY !== val) {
                    this.$refs.viewportBody.offsetY = val;
                }
            });
        },
        onViewportScroll: function (offsetY) {
            let realOffsetYScroll = scaleLinear()
                .domain([this.realMinY, this.realMaxY]).range([0, this.trackViewportBodyHeight])
                .invert(-offsetY) - this.realMinY;
            this.$emit("trackScroll", realOffsetYScroll);
        },
        onHeaderMouseDown: function (target, localPos, globalPos, evt) {
            this.selectionStates = this.selectionStates.map(state => false);
            this.$emit("trackMouseDown", this.trackId);
        },
        onChildRemove: function (childHeight) {
            this.trackHeaderChildrenHeight -= childHeight;
        },
        childHighlight: function (target, localPos, globalPos, evt) {
            let name = target.hostComponent.name.split(" ");
            let typeMouseDown = evt.data.button;
            let idx = Number(name[name.length - 1]);
            this.selectionStates = this.selectionStates.map((item, index) => {
                this.$refs.trackChildren.$children[index].isSelected = index !== idx ? false : true;
                return index === idx ? true : false
            });
            this.$emit("trackMouseDown", this.trackId);
            this.afterMouseDown && this.afterMouseDown(evt, this.$refs.trackChildren.$children[idx].componentType, typeMouseDown);
        },
        onRefsReady: function () {
            if (this.$refs.trackChildren) {
                return this.$refs.trackChildren.$children;
            }
            return []
        },
        textHeaderWidth: function (content) {
            let text = new Text(content);
            let textWidth = text.getLocalBounds().width * this.headerContentStyle.fontSize / 26;
            return textWidth;
        },
        textHeaderHeight: function (content) {
            let text = new Text(content);
            let textHeight = text.getLocalBounds().height * this.headerContentStyle.fontSize / 26;
            return textHeight;
        },
        textHeight: function (content) {
            let text = new Text(content);
            let textHeight = text.getLocalBounds().height;
            return textHeight;
        },
        textWidth: function (content) {
            let text = new Text(content);
            let textWidth = text.getLocalBounds().width;
            return textWidth;
        },
        getCentimeterFromPixel() {
            return 38;
        },
        onTrackMouseDown: function (target, localPos, globalPos, evt) {
            if (this.trackType === 'Depth Track') {
                this.$refs.axis.isSelected = !this.$refs.axis.isSelected;
                return;
            }
            let { x, y } = localPos;
            let typeMouseDown = evt.data.button;
            let pixelPathLeft, pixelPathRight, pixelPath, child, exitFlag = false, contextType = "VTrack";
            let xPos, children = this.$refs.trackChildren.$children;
            this.$emit("trackMouseDown", this.trackId);
            for (let i = 0; i < children.length; i++) {
                child = children[i];
                switch (child.componentType) {
                    case "VShading":
                        let idx = null;
                        if (!Array.isArray(child.realLeft)) {
                            // xPos = this.$refs.viewportBody.transformX(child.realLeft);
                            xPos = child.transformX(child.realLeft);
                            pixelPathRight = this.transformPath(child, child.realRight);
                            for (let j = 0; j < pixelPathRight.length - 1; j++) {
                                if (pixelPathRight[j].y <= y && pixelPathRight[j + 1].y >= y) {
                                    idx = j;
                                    break;
                                }
                            }
                            if (idx !== null) {
                                let { a, b } = this.getLinearLine(pixelPathRight[idx], pixelPathRight[idx + 1]);
                                let x1 = (y - b) / a;
                                if ((xPos < x && x < x1) || (xPos > x && x > x1)) {
                                    this.selectionStates = this.selectionStates.map((child, idx) => {
                                        return idx === i ? true : false
                                    });
                                    exitFlag = true;
                                    contextType = "VShading";
                                    break;
                                }
                            }
                        } else if (!Array.isArray(child.realRight)) {
                            // xPos = this.$refs.viewportBody.transformX(child.realRight);
                            xPos = child.transformX(child.realRight);
                            pixelPathLeft = this.transformPath(child, child.realLeft);
                            for (let j = 0; j < pixelPathLeft.length - 1; j++) {
                                if (pixelPathLeft[j].y <= y && pixelPathLeft[j + 1].y >= y) {
                                    idx = j;
                                    break;
                                }
                            }
                            if (idx !== null) {
                                let { a, b } = this.getLinearLine(pixelPathLeft[idx], pixelPathLeft[idx + 1]);
                                let x1 = (y - b) / a;
                                if (xPos < x && x < x1 || (xPos > x && x > x1)) {
                                    this.selectionStates = this.selectionStates.map((child, idx) => {
                                        return idx === i ? true : false
                                    });
                                    exitFlag = true;
                                    contextType = "VShading";
                                    break;
                                }
                            }
                        } else {
                            // pixelPathLeft = this.transformPath(child, child.realLeft);
                            const shadingLeftTransform = child.leftTransformX();
                            pixelPathLeft = child.realLeft.map(point => {
                                return {
                                    x: shadingLeftTransform(point.x),
                                    y: child.transformY(point.y)
                                }
                            })
                            pixelPathRight = this.transformPath(child, child.realRight);
                            for (let j = 0; j < pixelPathLeft.length - 1; j++) {
                                if (pixelPathLeft[j].y <= y && pixelPathLeft[j + 1].y >= y) {
                                    idx = j;
                                    break;
                                }
                            }
                            if (idx !== null) {
                                let { a1, b1 } = this.getLinearLine(pixelPathLeft[idx], pixelPathLeft[idx + 1], 1);
                                let { a2, b2 } = this.getLinearLine(pixelPathRight[idx], pixelPathRight[idx + 1], 2);
                                let x1 = Math.min((y - b1) / a1, (y - b2) / a2);
                                let x2 = Math.max((y - b1) / a1, (y - b2) / a2);
                                if (x1 < x && x < x2) {
                                    this.selectionStates = this.selectionStates.map((child, idx) => {
                                        return idx === i ? true : false
                                    });
                                    exitFlag = true;
                                    contextType = "VShading";
                                    break;
                                }
                            }
                        }
                        break;
                    case "VCurve":
                        let index = null;
                        pixelPath = this.transformPath(child, child.realPath);
                        if (y > pixelPath[pixelPath.length - 1].y) break;
                        for (let j = 0; j < pixelPath.length - 1; j++) {
                            if (pixelPath[j].y <= y && pixelPath[j + 1].y >= y) {
                                index = j;
                                break;
                            }
                        }
                        if (index !== null) {
                            let distance1, distance2;
                            switch (child.wrapMode) {
                                case "None":
                                    distance1 = Math.sqrt(Math.pow(x - pixelPath[index].x, 2) + Math.pow(y - pixelPath[index].y, 2));
                                    distance2 = Math.sqrt(Math.pow(x - pixelPath[index + 1].x, 2) + Math.pow(y - pixelPath[index + 1].y, 2));
                                    break;
                                case "Left":
                                    distance1 = Math.sqrt(Math.pow(x - (pixelPath[index].x > child.viewWidth ?
                                        pixelPath[index].x - child.viewWidth : pixelPath[index].x), 2) +
                                        Math.pow(y - pixelPath[index].y, 2));
                                    distance2 = Math.sqrt(Math.pow(x - (pixelPath[index + 1].x > child.viewWidth ?
                                        pixelPath[index + 1].x - child.viewWidth : pixelPath[index + 1].x), 2) +
                                        Math.pow(y - pixelPath[index + 1].y, 2));
                                    break;
                                case "Right":
                                    distance1 = Math.sqrt(Math.pow(x - (pixelPath[index].x < 0 ?
                                        pixelPath[index].x + child.viewWidth : pixelPath[index].x), 2) +
                                        Math.pow(y - pixelPath[index].y, 2));
                                    distance2 = Math.sqrt(Math.pow(x - (pixelPath[index + 1].x < 0 ?
                                        pixelPath[index + 1].x + child.viewWidth : pixelPath[index + 1].x), 2) +
                                        Math.pow(y - pixelPath[index + 1].y, 2));
                                    break;
                                case "Both":
                                    distance1 = Math.sqrt(Math.pow(x - (pixelPath[index].x > child.viewWidth ?
                                        pixelPath[index].x - child.viewWidth : pixelPath[index].x), 2) +
                                        Math.pow(y - pixelPath[index].y, 2));
                                    distance2 = Math.sqrt(Math.pow(x - (pixelPath[index + 1].x > child.viewWidth ?
                                        pixelPath[index + 1].x - child.viewWidth : pixelPath[index + 1].x), 2) +
                                        Math.pow(y - pixelPath[index + 1].y, 2));
                                    if (distance1 > 4 && distance2 > 4) {
                                        distance1 = Math.sqrt(Math.pow(x - (pixelPath[index].x < 0 ?
                                            pixelPath[index].x + child.viewWidth : pixelPath[index].x), 2) +
                                            Math.pow(y - pixelPath[index].y, 2));
                                        distance2 = Math.sqrt(Math.pow(x - (pixelPath[index + 1].x < 0 ?
                                            pixelPath[index + 1].x + child.viewWidth : pixelPath[index + 1].x), 2) +
                                            Math.pow(y - pixelPath[index + 1].y, 2));
                                    }
                                    break;
                            }
                            // console.log(distance1, distance2);
                            if (distance1 <= 4 || distance2 <= 4) {
                                this.selectionStates = this.selectionStates.map((child, idx) => {
                                    return idx === i ? true : false
                                });
                                exitFlag = true;
                                contextType = "VCurve";
                                break;
                            }
                        }
                        break;
                    case "VZone":
                        let topPosY = this.getPosY(child.realMinY);
                        let bottomPosY = this.getPosY(child.realMaxY);
                        if (topPosY < y && y < bottomPosY) {
                            this.selectionStates = this.selectionStates.map((child, idx) => {
                                return idx === i ? true : false
                            });
                            exitFlag = true;
                            contextType = "VZone";
                            break;
                        }
                        break;
                }
            }
            if (exitFlag) {
                this.afterMouseDown && this.afterMouseDown(evt, contextType, typeMouseDown);
                return;
            }
            this.selectionStates = this.selectionStates.map((child, idx) => {
                return false;
            });
            this.afterMouseDown && this.afterMouseDown(evt, contextType, typeMouseDown);
        },
        // getPosX: function (posX) {
        //     return this.$refs.viewportBody.transformX(posX);
        // },
        getPosY: function (posY) {
            return this.$refs.viewportBody.transformY(posY);
        },
        transformPath: function (comp, realPath) {
            return realPath.map(point => {
                return {
                    x: comp.transformX(point.x),
                    y: comp.transformY(point.y)
                }
            })
        },
        getLinearLine: function (point1, point2, num = 0) {
            let res = { };
            let a = (point1["y"] - point2['y']) / (point1["x"] - point2["x"]);
            let b = point1["y"] - a * point1["x"];
            num ? res[`a${num}`] = a : res['a'] = a;
            num ? res[`b${num}`] = b : res['b'] = b;
            return res;
        },

        genTooltip: function (comp, target, globalPos, srcLocalPos, refLines, plotSignal) {
            //handle when signal with multiple plots
            if (plotSignal && this.plotSignal && this.plotSignal === plotSignal) {
                if (!comp.pixiObj) {
                    console.log('get v-axis pixiObj')
                    comp.getPixiObj()
                }
                let localPos = comp.pixiObj.toLocal(globalPos);
                const width = comp.viewWidth;
                let yCoord = comp.transformY.invert(localPos.y);
                let depthInfo = ` MD(Ref): ${yCoord.toFixed(2)} (M) \n MD: ${yCoord.toFixed(2)} (M)`;
                let tooltipPosY = this.trackHeaderHeight;
                if (this.trackType === 'Depth Track' || this.trackType === 'Zone Track' || !this.$refs.trackChildren) {
                    comp.signal('tooltip-on', comp, {
                        content: depthInfo,
                        viewWidth: width,
                        viewHeight: this.textHeight(depthInfo),
                        fillColor: 0xF0F000,
                        fillTransparency: 0.7,
                        tooltipPosY
                    });
                } else {
                    let children = this.$refs.trackChildren.$children.filter(child => child.componentType === "VCurve");
                    let curveInfoList = [];
                    for (let i = 0; i < children.length; i++) {
                        children[i].realPath.some(point => {
                            if (point.y > yCoord) {
                                let content = ` ${children[i].name}: ${!point.x ? point.x : point.x.toFixed(2)} (${children[i].unit})`
                                curveInfoList.push({
                                    content,
                                    color: children[i].symbolColor,
                                    viewHeight: this.textHeight(content),
                                })
                                return true;
                            }
                        })
                    }
                    comp.signal('tooltip-on', comp, {
                        curveInfoList,
                        content: depthInfo,
                        viewWidth: width,
                        viewHeight: this.textHeight(depthInfo),
                        fillColor: 0xF0F000,
                        fillTransparency: 0.7,
                        tooltipPosY
                    });
                }
            }
        },
        onTitleDragging: function (target, localPos, globalPos, evts) {
            if (target.hostComponent.dragging) {
                if (globalPos.y < target.hostComponent.viewHeight) {
                    return;
                }
                this.$emit("trackTitleDragging", globalPos.x, this.orderNum);
            }
        },
        onTitleDragEnd: function (target, localPos, globalPos, evts) {
            if (globalPos.y > 0 && globalPos.y < this.viewHeight) {
                this.$emit("trackTitleDragEnd", globalPos.x, this.orderNum, this.trackType)
            }
        },
        onTitleDrag: function (target) {
            target.hostComponent.dragging = true;
        },
        titlePosX: function (name) {
            if (this.justification === 'Center' || this.justification === 'center') {
                return this.viewWidth / 2 - this.textHeaderWidth(name) / 2
            } else if (this.justification === 'Left' || this.justification === 'left') {
                return 0;
            } else {
                return this.viewWidth - this.textHeaderWidth(name);
            }
        },
        getShadingPattern: function (shading) {
            if (shading.fillPatternList && shading.fillPatternList.length === 1) {
                return shading.fillPatternList[0] && `https://users.i2g.cloud${shading.fillPatternList[0]}?service=WI_BACKEND`;
            }
            return null;
        }
    },
    mounted: function () {
        document.body.oncontextmenu = (evt) => false;
        if (this.trackRealMinY >= this.trackRealMaxY) {
            throw new Error(`Error in VTrack with range: ${this.trackRealMinY} and ${this.trackRealMaxY}`);
        }
        console.log("Track draw");

        if (this.trackType !== 'Depth Track') {
            let children = this.$refs.trackChildren.$children;
            this.nChildren = children.length;
            this.selectionStates.push(...children.map(child => false));
            let height;
            for (let i = 0; i < children.length; i++) {
                height = children[i].componentType === 'VCurve' ? 60 : 30;
                this.trackHeaderChildrenHeight += height;
            };
        } else {
            this.trackHeaderChildrenHeight += this.textHeaderHeight(this.unit || 'M') + this.textHeaderHeight(this.cRatioScreen) + 20;
        }
        let transformFn = scaleLinear().domain([this.realMinY, this.realMaxY]).range([0, this.trackViewportBodyHeight]);
        this.$refs.viewportBody.offsetY -= transformFn(this.trackRealMinY);
        if (this.$refs.viewportBody) {
            this.$watch(
                () => {
                    return this.$refs.viewportBody.offsetY;
                },
                (newVal) => {
                    eventManager.emit("viewport-scroll", newVal, this.trackId);
                }
            )
        }
    },
    watch: {
        trackChildren: function (newValue, oldValue) {
            this.nChildren = this.$refs.trackChildren.$children.length;
            let height;
            if (newValue > oldValue) {
                let newChild = this.$refs.trackChildren.$children[this.nChildren - 1];
                height = newChild.componentType === 'VCurve' ? 60 : 30;
                this.trackHeaderChildrenHeight += height;
                this.selectionStates.push(false);
            } else {
                // this.trackHeaderChildrenHeight = this.childrenHeaderPosYList[oldValue - 1];
                this.selectionStates.pop();
            }
        },
        selectionStates: function () {
            this.selectionStates.forEach((state, idx) => {
                this.$refs.trackChildren.$children[idx].isSelected = state;
            })
        },
        isSelected: function () {
            if (!this.isSelected) {
                this.selectionStates = this.selectionStates.map(state => false);
            }
        },
    },
    mixins: [baseResizable]
}

// export default VResizable.extend(component);
export default component;