import { Fragment } from 'vue-fragment';
import { Text } from 'pixi.js';
import VPath from '../v-path';
import VRect from '../v-rect';
import VContainer from '../v-container';
import VResizable from '../v-resizable';
import VViewport, { VViewportFactory } from '../v-viewport';
import VCartersian, { VCartersianFactory } from '../v-cartersian';
import VTextbox from '../v-textbox';
import VHeaderCurve from '../v-header-curve';
import template from './template.html';
import VXone, { VXoneFactory } from '../v-xone';

let component = {
    props: [
        "isShading",
        "trackHeaderFillColor",
        "trackHeaderHeight",
        "trackViewWidth",
        "trackBodyHeight",
        "trackResize",
        "trackKnobFlags",
        "trackHeaderResize",
        "genTooltip",
        "zones",
        "zoneHeaderLabel"
    ],
    computed: {
        componentType: function () {
            return "VTrack";
        },
        checkShading: function () {
            let check = false;
            this.visualizeItems.forEach(item => {
                item.shading ? check = item.shading : check;
            })
            return check;
        }
    },
    data: function () {
        return {
            kursor: "default",
            trackChilren: null,
            trackHeaderChildrenHeight: 0,
            headerContentStyle: {
                fontFamily: 'Arial',
                fontStyle: 'italic',
                align: 'center',
                padding: 5,
                fontSize: 13,
            },
            childrenHeaderPosYList: [0],
            shadingColor: '',
            visualizeItems: [],
            pathList: [],
            zoneList: this.zones
        }
    },
    template,
    components: {
        VPath, VRect, VResizable, 
        VViewport, VViewportExtMouse: VViewportFactory({ extMouseListener: true }),
        VHeaderCurve,
        VContainer, VCartersian, Fragment, VTextbox,
        VCartersianExtMouse: VCartersianFactory({ extMouseListener: true }),
        VXone, VXoneExtMouse: VXoneFactory({ extMouseListener: true })
    },
    methods: {
        childHighlight: function (target, localPos, globalPos, evt) {
            let name = target.hostComponent.name.split(" ");
            let idx = Number(name[name.length - 1]);
            let compType = this.visualizeItems[idx]["comp"];
            console.log(compType);
            let comp = this.$refs.trackChildren.$children[idx];
            if (!this.visualizeItems[idx].shading) {
                this.visualizeItems = this.visualizeItems.map((item, index) => {
                    return {
                        ...item,
                        shading: index !== idx ? false : true
                    }
                });
                this.shadingColor = this.visualizeItems[idx].color;
                this.pathList = [];
                switch (compType) {
                    case "VShading":
                        this.pathList.push(comp.shadingPathLeft, comp.shadingPathRight);
                        break;
                    case "VPath":
                    case "VCurve":
                        this.pathList.push(comp.realPath);
                        break;
                }
            } else {
                this.visualizeItems[idx].shading = false;
                this.pathList = [];
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
        // trackMouseDown: function (target, localPos, globalPos, evt) {
        //     this.visualizeItems = this.visualizeItems.map(item => {
        //         return {
        //             ...item,
        //             shading: false
        //         }
        //     });
        //     this.pathList = [];
        // },
        generateRandomStr: function () {
            return Math.floor(Math.random() * 100000);
        }
    },
    watch: {
        isShading: function (newVal, oldVal) {
            this.visualizeItems = this.visualizeItems.map((item, idx) => {
                return {
                    ...item,
                    shading: newVal[idx]
                }
            })
        }
    },
    mounted: function () {
        // console.log("Track draw");
        // let children = this.$refs.trackChildren.$children;
        // if (!this.isShading && this.isShading.length !== children.length) {
        //     throw new Error(`Shading list of VTrack must have a length equal to the children: ${children.length}`);
        // };
        // let compProp = "", height = 0, obj;
        // this.visualizeItems.push(...children.map((child, idx) => {
        //     compProp = child.componentType;
        //     height = compProp === "VShading" ? 30 : 60;
        //     this.trackHeaderChildrenHeight += height;
        //     idx === 0 ? this.childrenHeaderPosYList.push(height) : this.childrenHeaderPosYList.push(height + this.childrenHeaderPosYList[idx]);
        //     if (child.minColor || child.maxColor) {
        //         console.log(child.minColor);
        //         console.log(child.maxColor)
        //     }
        //     obj = {
        //         comp: compProp,
        //         height,
        //         name: child.name || compProp,
        //         color: child.symbolColor || '0x010101',
        //         shading: false
        //     }
        //     if (compProp === "VCurve") {
        //         let { lineDash, leftValue, rightValue, unit } = child;
        //         return {
        //             ...obj,
        //             leftValue,
        //             rightValue,
        //             unit,
        //             lineDash,

        //         }
        //     }
        //     if (compProp === "VShading") {
        //         let { minColor, maxColor, typeFillColor, pallete, curveLowValue, curveHighValue } = child;
        //         return {
        //             ...obj,
        //             minColor,
        //             maxColor,
        //             typeFillColor,
        //             pallete,
        //             curveLowValue: curveLowValue || 0,
        //             curveHighValue: curveHighValue || 1
        //         }
        //     }
        //     return obj;
        // }));
        // this.childrenHeaderPosYList.pop();

    }
}

export default VRect.extend(component);