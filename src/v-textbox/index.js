import VRect from "../v-rect";
import { Text, TextStyle } from "pixi.js";

let component = {
	props: ["content", "contentStyle", "contentPos"],
	data: function() {
		return {
			_content: null
		};
	},
	methods: {
		draw: function(obj) {
			this.drawRect(obj);
			let text = this.getContent();
			console.log(this);
			text.text = this.content;
			if (this.contentStyle) {
				text.style = new TextStyle(this.contentStyle);
			}
			if (this.contentPos) {
				let arr = this.contentPos
					.replace("(", "")
					.replace(")", "")
					.replace("[", "")
					.replace("]", "")
					.split(/[\s,]+/)
					.map(e => parseInt(e))
					.filter(e => !isNaN(e));
				text.x = arr[0];
				text.y = arr[1];
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
		getWidthOfText: function(){
			
		}
	},
	computed: {
		width: function() {
			if(!isNaN(this.viewWidth)) return this.viewWidth;
			return this.getWidthOfText();
		},
		height: function(){

		},
		
	}
};

export default VRect.extend(component);
