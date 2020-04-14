import VRect from "../v-rect";
import { Text } from "pixi.js";

let component = {
	props: ["content, style"],
	data: function() {
		return {
			_content: null
		};
	},
	methods: {
		draw: function(obj) {
			this.drawRect(obj);
			let text = this.getContent();
			text.text = this.content;
			// if (this.style) text.style = this.style;
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
};

export default VRect.extend(component);
