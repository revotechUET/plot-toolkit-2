import VShape from "../v-shape";
import {
	getColor,
	DefaultValues,
	getTransparency,
	getPosX,
	getPosY,
} from "../utils";

function draw(obj) {
	obj.clear();
	let lw = this.lineWidth || 1;
	let lt = this.lineTransparency || 1.0;
	if (this.hasMouseOver) {
		lw += 4;
		lt /= 2;
	}
	obj.lineStyle(lw, getColor(this.lineColor, DefaultValues.lineColor), lt, 0);

	obj.beginFill(
		getColor(this.fillColor, DefaultValues.fillColor),
		getTransparency(this.fillTransparency)
	);

	obj.drawPolygon(this.path || []);

	obj.endFill();
	obj.x = getPosX(this.coordinate, this.posX);
	obj.y = getPosY(this.coordinate, this.posY);
	obj.rotation = this.rotation || 0;
}

let component = {
	props: ["path"],
	methods: {
		draw,
	},
};
export default VShape.extend(component);
