import VRect from '../v-rect';
import {Text} from "pixi.js";
//import sticky from '../mixins/stick-to-root';
import factoryFn from '../mixins';

let component = {
    props: ["content"],
    data: function() {
        return {
            _content: null
        }
    },
    computed: {
        componentType: function() {
            return this.componentTypePrefix + " VTextBox";
        }
    },
    methods: {
        draw: function(obj) {
            this.drawRect(obj);
            let text = this.getContent();
            text.text = this.content;
            if (this.clipped) {
                text.mask = this.getMaskObj();
            }
        },
        getContent: function() {
            if (!this._content) {
                this._content = new Text(this.content);
                this.getPixiObj().addChild(this._content);
            }
            return this._content;
        }
    }
}
let VTextbox = VRect.extend(component);
export default VTextbox;

export function VTextboxFactory(opts) {
    return factoryFn(VTextbox, opts);
}