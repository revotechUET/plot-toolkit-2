import { Fragment } from 'vue-fragment';
import { Text } from 'pixi.js';
import VPath from '../v-path';
import VRect from '../v-rect';
import VContainer from '../v-container';
import VResizable from '../v-resizable';
import VViewport from '../v-viewport';
import VCartersian from '../v-cartersian';
import VTextBox from '../v-textbox';
import template from './template.html';

let component = {
    props: [
        "isShading",
        "trackHeaderFillColor",
        "trackHeaderHeight",
        "trackViewWidth",
        "trackBodyHeight",
        "trackResize",
        "trackHeaderResize",
    ],
    computed: {
        componentType: function () {
            return "VTrack";
        },
        checkShading: function () {
            let check = false;
            this.shadingList.forEach(item => {
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
                fontSize: 12,
            },
            shadingColor: '',
            shadingList: [],
            pathList: []
        }
    },
    template,
    components: {
        VPath, VRect, VResizable, VViewport,
        VContainer, VCartersian, Fragment, VTextBox
    },
    methods: {
        childHighlight: function (target, localPos, globalPos, evt) {
            let name = target.hostComponent.name.split(" ");
            let idx = Number(name[name.length - 1]);
            let compType = this.shadingList[idx]["comp"];
            console.log(compType);
            let comp = this.$refs.trackChildren.$children[idx];
            if (!this.shadingList[idx].shading) {
                this.shadingList = this.shadingList.map((item, index) => {
                    return {
                        ...item,
                        shading: index !== idx ? false : true
                    }
                });
                this.shadingColor = this.shadingList[idx].color;
                this.pathList = [];
                switch (compType) {
                    case "VShading":
                        this.pathList.push(comp.shadingPathLeft, comp.shadingPathRight);
                        break;
                    case "VPath":
                        this.pathList.push(comp.realPath);
                        break;
                }
            } else {
                this.shadingList[idx].shading = false;
                this.pathList = [];
            }
        },
        textWidth: function (content) {
            let text = new Text(content);
            let textWidth = text.getLocalBounds().width;
            return textWidth;
        },
        textHeight: function (content) {
            let text = new Text(content);
            let textHeight = text.getLocalBounds().height;
            return textHeight;
        },
        trackMouseDown: function (target, localPos, globalPos, evt) {
            this.shadingList = this.shadingList.map(item => {
                return {
                    ...item,
                    shading: false
                }
            });
            this.pathList = [];
        }
    },
    watch: {
        isShading: function (newVal, oldVal) {
            this.shadingList = this.shadingList.map((item, idx) => {
                return {
                    ...item,
                    shading: newVal[idx]
                }
            })
        }
    },
    mounted: function () {
        console.log("Track draw");
        let children = this.$refs.trackChildren.$children;
        if (!this.isShading && this.isShading.length !== children.length) {
            throw new Error(`Shading list of VTrack must have a length equal to the children: ${children.length}`);
        }
        this.trackHeaderChildrenHeight = children.length * 50;
        this.shadingList.push(...children.map((child, idx) => {
            if (child.minColor || child.maxColor) {
                console.log(child.minColor);
                console.log(child.maxColor)
            }
            return {
                comp: child.compProps.split(":")[0],
                name: child.name || child.compProps.split(":")[0] + idx,
                color: child.symbolColor || '0x010101',
                shading: false
            }
        }))
    }
}

export default VRect.extend(component);