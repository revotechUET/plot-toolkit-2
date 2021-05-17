import { Fragment } from 'vue-fragment';
import { Text } from 'pixi.js';
import VPath from '../v-path';
import VTextbox from '../v-textbox';
import VRect from '../v-rect';
import template from './template.html';

let component = {
    props: {
        curveName: {
            type: String,
            default: ""
        },
        fillTransparency: {
            type: Number,
            default: 0
        },
        fillColor: {
            default: 0xFFFFFF
        },
        contentStyle: {
            type: Object,
            default: {
                fontSize: 13
            }
        },
        leftValue: {
            type: Number,
            default: 0
        },
        lineDash: {
            type: String
        },
        pathColor: {
            type: Number,
        },
        unit: {
            type: String,
            default: ""
        },
        rightValue: {
            type: Number,
            default: 1
        },
        xTransform: {
            type: String,
            default: "none"
        },
        yTransform: {
            type: String,
            default: "none"
        }
    },
    template,
    components: {
        VPath, VTextbox, Fragment
    },
    computed: {
        viewPath: function () {
            return [{ x: 0, y: this.viewHeight / 2 }, { x: this.viewWidth, y: this.viewHeight / 2 }];
        },
        componentType: function () {
            return "VHeaderCurve";
        }
    },
    methods: {
        textWidth: function (content) {
            let text = new Text(content);
            let textWidth = text.getLocalBounds().width * (this.contentStyle.fontSize || 26) / 26;
            return textWidth;
        },
        textHeight: function (content) {
            let text = new Text(content);
            let textHeight = text.getLocalBounds().height * (this.contentStyle.fontSize || 26) / 26;
            return textHeight;
        },
    }
}

export default VRect.extend(component);