import VResizable from "../v-resizable";

import { Text, TextStyle } from "pixi.js";

let component = {
	props: ["content", "contentStyle", "marginTop", "marginLeft"],
	data: function() {
		return {
			_content: null,
		};
	},
	methods: {
		draw: function(obj) {
			obj.clear();
			let lw = parseInt(this.lineWidth);
			lw = isNaN(lw) ? 0 : lw;
			let lt = this.lineTransparency || 1.0;
			obj.lineStyle(
				lw,
				this.cLineColor.color,
				this.cLineColor.transparency,
				0
			);
			obj.beginFill(this.cFillColor.color, this.cFillColor.transparency);
			obj.drawRect(0, 0, this.width, this.height);

			obj.endFill();
			// obj.x = getPosX(this.coordinate, this.posX);
			// obj.y = getPosY(this.coordinate, this.posY);
			// obj.rotation = this.rotation || 0;

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
		},
	},
	computed: {
		width: function() {
			if (!isNaN(this.viewWidth)) return this.viewWidth;
			return this.getWidthOfText();
		},
		height: function() {
			if (!isNaN(this.viewHeight)) return this.viewHeight;
			return this.getHeightOfText();
		},
	},
};

export default VResizable.extend(component);
