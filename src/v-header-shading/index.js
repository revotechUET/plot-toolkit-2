import { Fragment } from 'vue-fragment';
import { Text } from 'pixi.js';
import VTextbox from '../v-textbox';
import VRect from '../v-rect';
import selectable from '../mixins/selectable';
import template from './template.html';

let component = {
    props: {
        curveLowValue: Number,
        curveHighValue: Number,
        contentStyle: Object,
        shadingName: String,
    },
    template,
    components: {
        VTextbox, Fragment
    },
    computed: {
        componentType: function () {
            return "VHeaderShading";
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
    },
    mixins: [selectable]
}

export default VRect.extend(component);