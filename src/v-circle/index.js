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
	obj.lineStyle(lw, this.cLineColor.color, this.cLineColor.transparency, 0);

	obj.beginFill(
		this.cFillColor.color,
    this.cFillColor.transparency	
	);

	obj.drawCircle(0, 0, this.radius || 0);

	obj.endFill();
	obj.x = getPosX(this.coordinate, this.posX);
	obj.y = getPosY(this.coordinate, this.posY);
	obj.rotation = this.rotation || 0;
}

let component = {
	methods: {
		draw,
	},
};
export default VShape.extend(component);
