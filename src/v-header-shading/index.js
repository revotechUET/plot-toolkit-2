import { Fragment } from 'vue-fragment';
import { Text } from 'pixi.js';
import VTextbox from '../v-textbox';
// import VRect from '../v-rect';
import selectable from '../mixins/selectable';
import baseRect from '../mixins/base-rect';
// import template from './template.html';

let component = {
    props: {
        shadingLowValue: Number,
        shadingHighValue: Number,
        contentStyle: Object,
        shadingName: String,
    },
    template: `<div>
        <div v-if="debug" class="v-object">{{compProps}}
            ${require('./fragment.html')}
        </div>
        <fragment v-if="!debug" props="compProps">
            ${require('./fragment.html')}
        </fragment>
    </div>`,
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
    mixins: [selectable, baseRect]
}

// export default VRect.extend(component);
export default component;