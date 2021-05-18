/*
    Template: v-xone
    props:  :enabled="true"             : default = false
            :constrained="true"         : default = false
            fill-color                  : Background color, type: String, default: "0xcccccc" in (utils.js)
            name="stratigraphy"         : 
            direction                   : Drag direction, type: String, default is "vertical"
            :view-pos-x                 : Left position, type: Number default is 0
            :view-pos-y                 : Top position, type: Number, default is 0
            :line-width                 : Border line width, type: Number
            :line-color                 : Border line color, type: String, default: "0xcccccc" in (utils.js)
            :on-resize                  : function({ width, height }), save new size after drag
            :view-width                 : type: Number, widt of zone
            :view-height                : type: Number, height of zone
            size                        : type: String, knob-drag size
            content                     : type: String, label of zone -> zone-name
            :content-style              : type: Object, style of label
            :no-label                   : type: Boolean, if true => no label
            :no-fill                    : type: Boolean, if true => background transparent is 0
            v-on:dragViewPosX           : function(newViewPosX) {viewPosX = newViewPosX}, handle change view position X when drag first knob
            v-on:dragViewPosY           : function(newViewPosY) {viewPosY = newViewPosY}
            real-min-y
            real-max-y
*/

import { Fragment } from 'vue-fragment';
import VResizable from "../v-resizable";
import VTextBox from "../v-textbox";
import VRect from '../v-rect';
import template from "./template.html";
import { Text } from "pixi.js";
import { getTransparency, DefaultValues, processColorStr } from "../utils";
import VContainer from '../v-container';
import { scaleLinear, scaleLog } from 'd3-scale';
import factoryFn from '../mixins';

let component = {
    props: {
        content: String,
        contentStyle: Object,
        noLabel: Boolean,
        onResize: {
            type: Function,
        },
        viewWidth: Number, 
        viewHeight: Number
    },
    template,
    components: {
        Fragment, VTextBox, VResizable, VContainer
    },
    data: function() {
        return {
            height1: null,
            // horizontal
            topPosX: null,
            bottomPosX: null,
            // vertical
            topPosY: this.viewPosY,
            bottomPosY: null,
            // label
            textWidth: new Text(this.content).getLocalBounds.width,
            textHeight: new Text(this.content).getLocalBounds.height,
            // real-min-y, real-max-y
            realMinYComputed: this.realMinY,
            realMaxYComputed: this.realMaxY,
        }
    },
    computed: {
        width1: function() {
            return this.viewWidth;
        },
        textPosX: function() {
            let text = new Text(this.content);
            let textHeight = text.getLocalBounds().height;
            let textWidth = text.getLocalBounds().width;
            if (textWidth > this.width1) {
                return this.width1 / 2 - textHeight / 2;
            } else {
                return this.width1 / 2 - textWidth / 2;
            }
        },
        textPosY: function() {
            let text = new Text(this.content);
            let textHeight = text.getLocalBounds().height;
            let textWidth = text.getLocalBounds().width;
            if (textWidth > this.width1) {
                return this.height1 / 2 + textWidth / 2;
            } else {
                return this.height1 / 2 - textHeight / 2;
            }
        },
        cFillColor: function () {
            let noFillColor = this.noFill ? 0 : this.fillTransparency;
            let color = this.fillColor;
            let cFc = processColorStr(
                color,
                DefaultValues.fillColor,
                getTransparency(noFillColor)
            );
            return cFc;
        },
        labelRotation: function() {
            let text = new Text(this.content);
            let textWidth = text.getLocalBounds().width;
            if (textWidth > this.viewWidth) {
                return -1.55;
            }
            return 0;
        }
    },
    methods: {
        knobDragEnd: function(knobIdx, pos, target) {
            let width = this.width;
            let height = this.height;
            console.log(pos.x, pos.y, this.minSize);
            switch(knobIdx) {
                case 0: {
                    if (this.direction === 'vertical') {
                        if (height - pos.y > this.minSize) {
                            this.topPosY += pos.y;
                            height -= pos.y;
                        } else {
                            this.topPosY = this.bottomPosY - this.minSize;
                            height = this.minSize;
                        }
                        // this.realMinYComputed = this.topPosY;
                    }
                    if (this.direction === 'horizontal') {
                        if (width - pos.x > this.minSize) {
                            this.topPosX += pos.x;
                            width -= pos.x;
                        } else {
                            this.topPosX = this.bottomPosX - this.minSize;
                            width = this.minSize;
                        }
                    }
                    break;
                }
                case 1: {
                    if (this.direction === 'vertical') {
                        if (pos.y > this.minSize) {
                            this.bottomPosY = this.topPosY + pos.y + this.knobSize;
                            height = pos.y + this.knobSize;
                        } else {
                            this.bottomPosY = this.topPosY + this.minSize;
                            height = this.minSize;
                        }
                        // this.realMaxYComputed = this.bottomPosY; 
                    }
                    else if (this.direction === 'horizontal') {
                        if (pos.x > this.minSize) {
                            this.bottomPosX = this.topPosX + pos.x;
                            width = pos.x;
                        } else {
                            this.bottomPosX = this.topPosX + this.minSize;
                            width = this.minSize;
                        }
                    }
                    break;
                }
            }
            target.mask = this.knobs[knobIdx].mask;
            this.knobs[knobIdx].mask = null;
            this.resize({width, height});
            this.viewPosY = this.topPosY;
            this.handleRealY(this.topPosY, this.bottomPosY);
        },
        resize: function({ width, height }) {
            this.height1 = height;
            this.viewWidth = width;
            this.viewHeight = height;
        },
        handleRealY: function(topPosY, bottomPosY) {
            this.realMinY = this.scaleViewToReal(topPosY);
            this.realMaxY = this.scaleViewToReal(bottomPosY);
        },
        scaleViewToReal: function(value) {
            let real = scaleLinear()
                .domain([0, this.$parent.viewHeight])
                .range([this.$parent.realMinY, this.$parent.realMaxY]);
            return real(value);
        },
        scaleRealToView: function(value) {
            let view = scaleLinear()
                .domain([this.$parent.realMinY, this.$parent.realMaxY])
                .range([0, this.$parent.viewHeight]);
            return view(value);
        }
    },
    mounted() {
        let zoneHeight = (this.realMaxY - this.realMinY) / (this.$parent.realMaxY - this.$parent.realMinY) * this.$parent.viewHeight;
        this.height1 = zoneHeight;
        this.viewHeight = zoneHeight;

        let view = scaleLinear()
                .domain([this.$parent.realMinY, this.$parent.realMaxY])
                .range([0, this.$parent.viewHeight]);
        this.viewPosY = view(this.realMinY);
        this.topPosY = this.viewPosY;
        this.bottomPosY = this.topPosY + this.height1;
    }
}

let VXone = VResizable.extend(component);

export function VXoneFactory(opts) {
    return factoryFn(VXone, opts);
}

export default VXone;