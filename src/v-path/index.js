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

	let points = this.getPath();
	let symbolSize =
		typeof this.symbolSize === "string"
			? parseInt(this.symbolSize)
			: this.symbolSize || 5;

	if (this.dashLine && this.lineDash !== "[0]") {
		obj.moveTo(points[0].x, points[0].y);
		for (let i = 1; i < points.length; i++) {
			if (i < points.length - 1 && !this.realPath[i].x) {
				obj.moveTo(points[i + 1].x, points[i + 1].y)
			} else {
				obj.myLineTo(points[i].x, points[i].y, this.lineDash);
			}
		}
	} else {
		obj.moveTo(points[0].x, points[0].y);
		for (let i = 1; i < points.length; i++) {
			if (i < points.length - 1 && !this.realPath[i].x) {
				obj.moveTo(points[i + 1].x, points[i + 1].y)
			} else {
				obj.lineTo(points[i].x, points[i].y);
			}
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
		// console.error("Unknown shape type");
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
		"shadingOffsetX",
		"shadingOffsetY"
	],
	computed: {
		componentType: function () {
			return "VPath";
		},
		dashLine: function () {
			return !!this.lineDash;
		},
	},
	methods: {
		draw,
		getPath: function () {
			if (this.viewPath) return this.viewPath;
			if (isNaN(this.realPath) && !this.realPath) return [];
			let transformXFn = this.getTransformX() || this.$parent.getTransformX();
			let transformYFn = this.getTransformY() || this.$parent.getTransformY();
			if (!transformXFn || !transformYFn) return [];
			if (!isNaN(this.realPath)) {
				return [
					{
						x: transformXFn(this.realPath) - (this.shadingOffsetX || 0),
						y: transformYFn(this.realMinY || this.$parent.realMinY)
					},
					{
						x: transformXFn(this.realPath) - (this.shadingOffsetX || 0),
						y: transformYFn(this.realMaxY || this.$parent.realMaxY)
					},
				]
			} else {
				return this.realPath.map((point) => ({
					x: transformXFn(point.x) - (this.shadingOffsetX || 0),
					y: transformYFn(point.y) - (this.shadingOffsetY || 0),
				}));
			}
		},
	},
};
export default VShape.extend(component);
