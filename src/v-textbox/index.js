import VRect from "../v-rect";
import { Text, TextStyle } from "pixi.js";

let component = {
	props: ["content", "contentStyle", "marginTop", "marginLeft"],
	data: function() {
		return {
			_content: null
		};
	},
	methods: {
		draw: function(obj) {
			this.drawRect(obj);
			let text = this.getContent();
			console.log(text);
			text.text = this.content;
			if (this.contentStyle) {
				text.style = new TextStyle(this.contentStyle);
			}
			text.y = this.marginTop ? this.marginTop : text.y;
			text.x = this.marginLeft ? this.marginLeft : text.x;

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
			return 200;
		},
		getHeightOfText: function() {
			return 100;
		}
	},
	computed: {
		width: function() {
			if (!isNaN(this.viewWidth)) return this.viewWidth;
			return this.getWidthOfText();
		},
		height: function() {
			if (!isNaN(this.viewHeight)) return this.viewHeight;
			return this.getHeightOfText();
		}
	}
};

export default VRect.extend(component);
