import VRect from "../v-rect";
import { Text, TextStyle } from "pixi.js";
import factoryFn from "../mixins";

let component = {
	props: ["content", "contentStyle", "padding"],
	data: function() {
		return {
			_content: null,
		};
	},
	computed: {
		componentType: function() {
			return this.componentTypePrefix + " VTextBox";
		},
		width: function() {
			if (!isNaN(this.viewWidth)) return this.viewWidth;
			return this.getWidthOfText();
		},
		height: function() {
			if (!isNaN(this.viewHeight)) return this.viewHeight;
			return this.getHeightOfText();
		},
	},
	methods: {
		draw: function(obj) {
			this.drawRect(obj);
			let text = this.getContent();

			text.text = this.content;
			if (this.contentStyle) {
				text.style = new TextStyle(this.contentStyle);
			}

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
		},
		getWidthOfText: function() {
			let text = this.getContent();
			return text.getLocalBounds().width;
		},
		getHeightOfText: function() {
			let text = this.getContent();
			return text.getLocalBounds().height;
		},
	},
};
let VTextbox = VRect.extend(component);
export default VTextbox;

export function VTextboxFactory(opts) {
	return factoryFn(VTextbox, opts);
}
