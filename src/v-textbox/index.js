import VRect from "../v-rect";
import { Text, TextStyle } from "pixi.js";
import factoryFn from "../mixins";
import baseRect from '../mixins/base-rect';

let component = {
    props: ["content", "contentStyle", "padding"],
    data: function () {
        return {
            intFillTransparency: 0
        };
    },
    computed: {
        componentType: function () {
            return this.componentTypePrefix + " VTextBox";
        },
        width: function () {
            if (!isNaN(this.viewWidth)) return this.viewWidth;
            return this.getWidthOfText();
        },
        height: function () {
            if (!isNaN(this.viewHeight)) return this.viewHeight;
            return this.getHeightOfText();
        },
    },
    methods: {
        draw: function (obj) {
            if (obj === this.pixiObj) {
                let text = this.getContent();
                text.text = this.content;
                if (this.contentStyle) {
                    text.style = new TextStyle(this.contentStyle);
                }
                text.mask = this.getMaskObj();
            }
            this.drawRect(obj);
        },
        getContent: function () {
            if (!this._content) {
                this._content = new Text(this.content);
                this.getPixiObj().addChild(this._content);
            }
            return this._content;
        },
        getWidthOfText: function () {
            let text = this.getContent();
            return text.getLocalBounds().width;
        },
        getHeightOfText: function () {
            let text = this.getContent();
            return text.getLocalBounds().height;
        },
    },
    mixins: [baseRect]
};
// let VTextbox = VRect.extend(component);
let VTextbox = component;
export default VTextbox;

export function VTextboxFactory(opts) {
    return factoryFn(VTextbox, opts);
}
