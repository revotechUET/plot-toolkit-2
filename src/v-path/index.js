import VShape from "../v-shape";
import { getColor, DefaultValues, getPosX, getPosY } from "../utils";

function draw(obj) {
	obj.clear();
	let lw = this.lineWidth || 1;
	let lt = this.lineTransparency || 1.0;
	let symbolColor = this.symbolColor;

	if (this.hasMouseOver) {
		lw += 2;
		lt /= 2;
	}
	obj.lineStyle(lw, getColor(symbolColor, DefaultValues.lineColor), lt, 0.5);

	let points = this.realPath;
	let symbolSize =
		typeof this.symbolSize === "string"
			? parseInt(this.symbolSize)
			: this.symbolSize || 5;

	if (this.dashLine) {
		for (let i = 0; i < points.length - 1; i++) {
			obj.drawLine(
				points[i].x,
				points[i].y,
				points[i + 1].x,
				points[i + 1].y,
				this.lineDash
			);
		}
	} else {
		for (let i = 0; i < points.length - 1; i++) {
			obj.drawLine(
				points[i].x,
				points[i].y,
				points[i + 1].x,
				points[i + 1].y
			);
		}
	}

	obj.beginFill(symbolColor, 1);
	switch (this.symbolShape) {
		case "square":
			for (let i = 0; i < points.length; i++) {
				var edge = symbolSize * 2;
				obj.drawRect(
					points[i].x - edge / 2,
					points[i].y - edge / 2,
					edge,
					edge
				);
			}
			break;
		case "circle":
			for (let i = 0; i < points.length; i++) {
				obj.drawCircle(points[i].x, points[i].y, symbolSize);
			}
			break;
		case "star":
			for (let i = 0; i < points.length; i++) {
				obj.drawStar(points[i].x, points[i].y, 5, symbolSize * 2, 0);
			}
			break;
		case "plus":
			for (let i = 0; i < points.length; i++) {
				obj.drawPlus(points[i].x, points[i].y, symbolSize);
			}
			break;
		default:
			console.error("Unknown shape type");
	}

	obj.endFill();
	obj.x = getPosX(this.coordinate, this.posX);
	obj.y = getPosY(this.coordinate, this.posY);
	obj.rotation = this.rotation || 0;
}

let component = {
	props: [
		"symbolShape",
		"viewPath",
		"realPath",
		"symbolSize",
		"symbolColor",
		"lineDash",
	],
	computed: {
		path: function() {
			if (this.viewPath) return this.viewPath;
			if (!this.realPath) return [];
			let transformXFn = this.$parent.transformX();
			let transformYFn = this.$parent.transformY();
			if (!transformXFn || !transformYFn) return [];
			return this.realPath.map((point) => ({
				x: transformXFn(point.x),
				y: transformYFn(point.y),
			}));
		},
		dashLine: function() {
			return !!this.lineDash;
		},
	},
	methods: {
		draw,
	},
};
export default VShape.extend(component);
