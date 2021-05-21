import { Fragment } from 'vue-fragment';
import { Text } from 'pixi.js';
import VPath from '../v-path';
import VRect from '../v-rect';
import VContainer from '../v-container';
import VResizable from '../v-resizable';
import VViewport from '../v-viewport';
import VCartersian, { VCartersianFactory } from '../v-cartersian';
import VTextbox from '../v-textbox';
import VHeaderCurve from '../v-header-curve';
import template from './template.html';
import VShape from '../v-shape';
import selectable from '../mixins/selectable';
import pattern from '../main/pattern_sample.json';
import { scaleLinear } from 'd3';

let component = {
    props: {
        trackRealMinY: {
            type: Number
        },
        trackRealMaxY: {
            type: Number
        },
        // trackHeaderFillColor: {
        //     default: 0xFFFFFF
        // },
        trackHeaderHeight: {
            type: Number,
            default: 100
        },
        trackHeaderResize: {
            type: Function
        },
        genTooltip: {
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
        }
    },
    computed: {
        componentType: function () {
            return "VTrack";
        },
        checkShading: function () {
            let check = false;
            this.visualizeItems.forEach(item => {
                item.selected ? check = item.selected : check; // selected => selected(prop of abstract class)
            })
            return check;
        }
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
            // selectionStates: [],
            childrenHeaderPosYList: [0],
            visualizeItems: [],
            nChildren: 0
        }
    },
    template,
    components: {
        VPath, VRect, VResizable, VViewport, VHeaderCurve,
        VContainer, VCartersian, Fragment, VTextbox, VShape,
        VCartersianExtMouse: VCartersianFactory({ extMouseListener: true })
    },
    methods: {
        childHighlight: function (target, localPos, globalPos, evt) {
            let name = target.hostComponent.name.split(" ");
            let idx = Number(name[name.length - 1]);
            let compType = this.visualizeItems[idx]["comp"];
            console.log(compType);
            if (!this.visualizeItems[idx].selected) {
                this.visualizeItems = this.visualizeItems.map((item, index) => {
                    this.$refs.trackChildren.$children[index].isSelected = index !== idx ? false : true;
                    return {
                        ...item,
                        selected: index !== idx ? false : true
                    }
                });

            } else {
                this.visualizeItems[idx].selected = false;
                this.$refs.trackChildren.$children[idx].isSelected = false;
            }
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
        onTrackMouseDown: function (target, localPos, globalPos, evt) {
            let { x, y } = localPos;
            let pixelPathLeft, pixelPathRight, pixelPath, child;
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
                                    this.visualizeItems = this.visualizeItems.map((child, idx) => {
                                        this.$refs.trackChildren.$children[idx].isSelected = i !== idx ? false : true;
                                        return { ...child, selected: idx === i ? true : false }
                                    });
                                    return;
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
                                    this.visualizeItems = this.visualizeItems.map((child, idx) => {
                                        this.$refs.trackChildren.$children[idx].isSelected = i !== idx ? false : true;
                                        return { ...child, selected: idx === i ? true : false }
                                    });
                                    return;
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
                                    this.visualizeItems = this.visualizeItems.map((child, idx) => {
                                        this.$refs.trackChildren.$children[idx].isSelected = idx !== i ? false : true;
                                        return { ...child, selected: idx === i ? true : false }
                                    });
                                    return;
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
                                this.visualizeItems = this.visualizeItems.map((child, idx) => {
                                    this.$refs.trackChildren.$children[idx].isSelected = i !== idx ? false : true;
                                    return { ...child, selected: idx === i ? true : false }
                                });
                                return;
                            }
                        }
                        break;
                }
            }
            this.visualizeItems = this.visualizeItems.map((item, index) => {
                this.$refs.trackChildren.$children[index].isSelected = false;
                return {
                    ...item,
                    selected: false
                }
            });
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
        getVisualizeItem: function (component, idx) {
            let compProp = component.componentType;
            let height = compProp === "VShading" ? 30 : 60;
            this.trackHeaderChildrenHeight += height;
            idx === 0 ? this.childrenHeaderPosYList.push(height) :
                this.childrenHeaderPosYList.push(height + this.childrenHeaderPosYList[idx]);
            let obj = {
                comp: compProp,
                height,
                name: component.name || compProp,
                color: component.symbolColor,
                selected: false
            }
            if (compProp === "VCurve") {
                let { lineDash, leftValue, rightValue, unit } = component;
                return {
                    ...obj,
                    leftValue,
                    rightValue,
                    unit,
                    lineDash,

                }
            }
            if (compProp === "VShading") {
                let { minColor, maxColor, typeFillColor,
                    pallete, foregroundColorList,
                    backgroundColorList, fillPatternList,
                    curveLowValue, curveHighValue } = component;
                obj = {
                    ...obj,
                    minColor,
                    maxColor,
                    typeFillColor,
                    pallete,
                    curveLowValue,
                    curveHighValue
                }
                if (typeFillColor === "Custom Fills" && foregroundColorList.length === 1
                    && backgroundColorList.length === 1 && fillPatternList.length === 1) {
                    obj = {
                        ...obj,
                        foregroundColor: foregroundColorList[0],
                        backgroundColor: backgroundColorList[0],
                        imagePatternUrl: `https://users.i2g.cloud/pattern/${pattern[fillPatternList[0]]}_.png?service=WI_BACKEND`
                    }
                }
            }
            return obj;
        }
    },
    mounted: function () {
        if (this.trackRealMinY >= this.trackRealMaxY) {
            throw new Error(`Error in VTrack with range: ${this.trackRealMinY} and ${this.trackRealMaxY}`);
        }
        console.log("Track draw");
        let children = this.$refs.trackChildren.$children;
        this.nChildren = children.length;
        //calculate offset for viewport
        const y = (this.viewHeight - this.trackHeaderHeight) * (this.realMaxY - this.realMinY)
            / (this.trackRealMaxY - this.trackRealMinY);
        this.scaleTrackHeight = y;

        let transformFn = scaleLinear().domain([this.realMinY, this.realMaxY]).range([0, y]);
        this.$refs.viewportBody.offsetY -= transformFn(this.trackRealMinY);

        // this.selectionStates.push(...children.map(item => true));
        this.visualizeItems.push(...children.map((child, idx) => {
            return this.getVisualizeItem(child, idx);
        }));
        this.childrenHeaderPosYList.pop();
    },
    watch: {
        trackChildren: function (newValue, oldValue) {
            this.nChildren = this.$refs.trackChildren.$children.length;
            if (newValue > oldValue) {
                let newChild = this.$refs.trackChildren.$children[this.nChildren - 1];
                this.visualizeItems.push(this.getVisualizeItem(newChild, oldValue - 1));
            } else {
                this.visualizeItems.pop();
            }
        }
    },
    mixins: [selectable]
}

export default VResizable.extend(component);