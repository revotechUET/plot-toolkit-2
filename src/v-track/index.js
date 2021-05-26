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
import selectable from '../mixins/selectable';
import { scaleLinear, } from 'd3';
import eventManager from '../event-manager';

let component = {
    props: {
        beforeMouseDown: {
            type: Function
        },
        afterMouseDown: {
            type: Function
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
        grid: {
            type: Boolean,
            default: true
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
        unit: {
            type: String
        }
    },
    computed: {
        componentType: function () {
            return "VTrack";
        },
        checkSelected: function () {
            return this.selectionStates.some(item => item);
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
            scaleTrackHeight: 0,
            trackHeaderChildrenHeight: 0,
            headerContentStyle: {
                fontFamily: 'Arial',
                fontStyle: 'italic',
                align: 'center',
                padding: 5,
                fontSize: 13,
            },
            selectionStates: [],
            childrenHeaderPosYList: [0],
            nChildren: 0
        }
    },
    template,
    components: {
        VPath, VRect, VResizable, VViewport, VHeaderCurve,
        VContainer, Fragment, VTextbox, VShape, VHeaderShading,
        VCartersianExtMouse: VCartersianFactory({ extMouseListener: true }),
        VRectWithMountedEvent: VRectFactory({ onMounted: true }),
        VAxisExtMouse: VAxisFactory({ extMouseListener: true })
    },
    methods: {
        registerEvents: function () {
            eventManager.on("viewport-scroll", val => {
                this.$refs.viewportBody.offsetY = val;
            });
        },
        childHighlight: function (target, localPos, globalPos, evt) {
            let name = target.hostComponent.name.split(" ");
            let typeMouseDown = evt.data.button;
            let idx = Number(name[name.length - 1]);
            if (!this.selectionStates[idx]) {
                this.selectionStates = this.selectionStates.map((item, index) => {
                    this.$refs.trackChildren.$children[index].isSelected = index !== idx ? false : true;
                    return index === idx ? true : false
                })

            } else {
                this.selectionStates.splice(idx, 1, false);
                this.$refs.trackChildren.$children[idx].isSelected = false;
            }
            this.afterMouseDown && this.afterMouseDown(evt, this.$refs.trackChildren.$children[idx].componentType, typeMouseDown);
        },
        onRefsReady: function () {
            if (this.$refs.trackChildren) {
                return this.$refs.trackChildren.$children;
            }
            return []
        },
        textWidth: function (content) {
            let text = new Text(content);
            let textWidth = text.getLocalBounds().width * this.headerContentStyle.fontSize / 26;
            return textWidth;
        },
        textHeight: function (content) {
            let text = new Text(content);
            let textHeight = text.getLocalBounds().height * this.headerContentStyle.fontSize / 26;
            return textHeight;
        },
        getCentimeterFromPixel() {
            return 38;
        },
        onTrackMouseDown: function (target, localPos, globalPos, evt) {
            let { x, y } = localPos;
            let typeMouseDown = evt.data.button;
            let pixelPathLeft, pixelPathRight, pixelPath, child, exitFlag = false, contextType = "VTrack";
            let xPos, children = this.$refs.trackChildren.$children;
            for (let i = 0; i < children.length; i++) {
                child = children[i];
                switch (child.componentType) {
                    case "VShading":
                        let idx = null;
                        if (!Array.isArray(child.realLeft)) {
                            xPos = this.$refs.viewportBody.transformX(child.realLeft);
                            pixelPathRight = this.transformPath(child.realRight);
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
                                        this.$refs.trackChildren.$children[idx].isSelected = i !== idx ? false : true;
                                        return idx === i ? true : false
                                    });
                                    exitFlag = true;
                                    contextType = "VShading";
                                    break;
                                }
                            }
                        } else if (!Array.isArray(child.realRight)) {
                            xPos = this.$refs.viewportBody.transformX(child.realRight);
                            pixelPathLeft = this.transformPath(child.realLeft);
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
                                        this.$refs.trackChildren.$children[idx].isSelected = i !== idx ? false : true;
                                        return idx === i ? true : false
                                    });
                                    exitFlag = true;
                                    contextType = "VShading";
                                    break;
                                }
                            }
                        } else {
                            pixelPathLeft = this.transformPath(child.realLeft);
                            pixelPathRight = this.transformPath(child.realRight);
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
                                        this.$refs.trackChildren.$children[idx].isSelected = i !== idx ? false : true;
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
                        pixelPath = this.transformPath(child.realPath);
                        for (let j = 0; j < pixelPath.length; j++) {
                            if (pixelPath[j].y <= y && pixelPath[j + 1].y >= y) {
                                index = j;
                                break;
                            }
                        }
                        if (index !== null) {
                            let distance1 = Math.sqrt(Math.pow(x - pixelPath[index].x, 2) + Math.pow(y - pixelPath[index].y, 2));
                            let distance2 = Math.sqrt(Math.pow(x - pixelPath[index + 1].x, 2) + Math.pow(y - pixelPath[index + 1].y, 2));
                            console.log(distance1, distance2);
                            if (distance1 <= 4 || distance2 <= 4) {
                                this.selectionStates = this.selectionStates.map((child, idx) => {
                                    this.$refs.trackChildren.$children[idx].isSelected = i !== idx ? false : true;
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
                                this.$refs.trackChildren.$children[idx].isSelected = i !== idx ? false : true;
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
                this.$refs.trackChildren.$children[idx].isSelected = false;
                return false;
            });
            this.afterMouseDown && this.afterMouseDown(evt, contextType, typeMouseDown);
        },
        getPosX: function (posX) {
            return this.$refs.viewportBody.transformX(posX);
        },
        getPosY: function (posY) {
            return this.$refs.viewportBody.transformY(posY);
        },
        transformPath: function (realPath) {
            return realPath.map(point => {
                return {
                    x: this.getPosX(point.x),
                    y: this.getPosY(point.y)
                }
            })
        },
        getLinearLine: function (point1, point2, num = 0) {
            let res = {};
            let a = (point1["y"] - point2['y']) / (point1["x"] - point2["x"]);
            let b = point1["y"] - a * point1["x"];
            num ? res[`a${num}`] = a : res['a'] = a;
            num ? res[`b${num}`] = b : res['b'] = b;
            return res;
        },

        genTooltip: function (comp, target, globalPos, srcLocalPos, refLines) {
            let localPos = comp.pixiObj.toLocal(globalPos);
            const width = comp.viewWidth;
            let yCoord = comp.transformY.invert(localPos.y);
            let depthInfo = `   MD(Ref): ${yCoord.toFixed(2)} (M) \n   MD: ${yCoord.toFixed(2)} (M)`;
            let tooltipPosY = this.trackHeaderHeight;
            let children = this.$refs.trackChildren.$children.filter(child => child.componentType === "VCurve");
            if (this.trackType === 'Depth Track' || children.length === 0) {
                comp.signal('tooltip-on', comp, {
                    content: depthInfo,
                    viewWidth: width,
                    viewHeight: 50,
                    fillColor: '#F0F000',
                    fillTransparency: 0.3,
                    tooltipPosY
                });
            } else {
                let curveInfoList = [];
                for (let i = 0; i < children.length; i++) {
                    children[i].realPath.some(point => {
                        if (point.y > yCoord) {
                            let content = `   ${children[i].name}: ${point.x} (${children[i].unit})`
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
                    fillColor: '#F0F000',
                    fillTransparency: 0.3,
                    tooltipPosY
                });
            }
        },
        onTitleDragMove: function (target, localPos, globalPos, evts) {
            if (target.hostComponent.dragging) {
                if (globalPos.y < target.hostComponent.viewHeight) {
                    return;
                }
                if (globalPos.x < this.viewPosX || globalPos.x > this.viewPosX + this.viewWidth) {
                    console.log(globalPos.x, globalPos.y);
                }
            }
        },
        onTitleDrag: function (target) {
            target.hostComponent.dragging = true;
        }
    },
    mounted: function () {
        document.body.oncontextmenu = (evt) => false;
        if (this.trackRealMinY >= this.trackRealMaxY) {
            throw new Error(`Error in VTrack with range: ${this.trackRealMinY} and ${this.trackRealMaxY}`);
        }
        console.log("Track draw");
        //calculate offset for viewport
        const y = (this.viewHeight - this.trackHeaderHeight) * (this.realMaxY - this.realMinY)
            / (this.trackRealMaxY - this.trackRealMinY);
        this.scaleTrackHeight = y;

        if (this.trackType !== 'Depth Track') {
            let children = this.$refs.trackChildren.$children;
            this.nChildren = children.length;
            this.selectionStates.push(...children.map(child => false));
            let height;
            for (let i = 0; i < children.length; i++) {
                height = children[i].componentType === 'VCurve' ? 60 : 30;
                this.trackHeaderChildrenHeight += height;
                i === 0 ? this.childrenHeaderPosYList.push(height) :
                    this.childrenHeaderPosYList.push(height + this.childrenHeaderPosYList[i]);
            };
            this.childrenHeaderPosYList.pop();
        } else {
            this.trackHeaderChildrenHeight += this.textHeight(this.unit || 'M') + this.textWidth(this.cRatioScreen) + 20;
        }
        let transformFn = scaleLinear().domain([this.realMinY, this.realMaxY]).range([0, y]);
        this.$refs.viewportBody.offsetY -= transformFn(this.trackRealMinY);
        this.$watch(
            () => {
                return this.$refs.viewportBody.offsetY;
            },
            (val) => {
                eventManager.emit("viewport-scroll", val);
            }
        )
    },
    watch: {
        trackChildren: function (newValue, oldValue) {
            this.nChildren = this.$refs.trackChildren.$children.length;
            let height;
            if (newValue > oldValue) {
                let newChild = this.$refs.trackChildren.$children[this.nChildren - 1];
                height = newChild.componentType === 'VCurve' ? 60 : 30;
                this.trackHeaderChildrenHeight += height;
                oldValue !== 0 && this.childrenHeaderPosYList.push(height + this.childrenHeaderPosYList[oldValue - 1]);
                this.selectionStates.push(false);
            } else {
                this.trackHeaderChildrenHeight = this.childrenHeaderPosYList[oldValue - 1];
                if (this.childrenHeaderPosYList.length !== 1) {
                    this.childrenHeaderPosYList.pop();
                }
                this.selectionStates.pop();
            }
        },
    },
    mixins: [selectable],
}

export default VResizable.extend(component);