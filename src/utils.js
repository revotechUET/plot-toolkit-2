import { utils, Graphics } from "pixi.js";
export function getColor(color, defaultColor = 0x000000) {
	if (!color) return defaultColor;
	if (isNaN(color)) return utils.string2hex(color);
	return parseInt(color);
}
export function getTransparency(transparency) {
	return isNaN(transparency) && transparency * (transparency - 1) < 0
		? 1
		: transparency;
}
export function getPosX(coordinate, defaultX) {
	return (coordinate || {}).x || defaultX || 0;
}
export function getPosY(coordinate, defaultY) {
	return (coordinate || {}).y || defaultY || 0;
}
export const DefaultValues = {
	lineColor: 0x0000ff,
	fillColor: 0xcccccc,
	lineWidth: 1
};

Graphics.prototype.drawDashedLine = function(points, x, y, lineDashSpec) {
	let p1, p2;
	let dashLeft = 0;
	let gapLeft = 0;
	let dash, gap;
	let lineDashArray = lineDashSpec;

	if (typeof lineDashSpec === "string") {
		lineDashArray = lineDashSpec
			.replace("(", "")
			.replace(")", "")
			.replace("[", "")
			.replace("]", "")
			.split(/[\s,]+/)
			.map(e => parseInt(e))
			.filter(e => !isNaN(e));
	}
	dash = lineDashArray[0];
	gap = lineDashArray[1];
	for (let i = 0; i < points.length; i++) {
		p1 = points[i];
		if (i == points.length - 1) break;
		else p2 = points[i + 1];
		var dx = p2.x - p1.x;
		var dy = p2.y - p1.y;
		var len = Math.sqrt(dx * dx + dy * dy);
		var normal = { x: dx / len, y: dy / len };
		var progressOnLine = 0;
		this.moveTo(
			x + p1.x + gapLeft * normal.x,
			y + p1.y + gapLeft * normal.y
		);
		while (progressOnLine <= len) {
			progressOnLine += gapLeft;
			if (dashLeft > 0) progressOnLine += dashLeft;
			else progressOnLine += dash;
			if (progressOnLine > len) {
				dashLeft = progressOnLine - len;
				progressOnLine = len;
			} else {
				dashLeft = 0;
			}
			this.lineTo(
				x + p1.x + progressOnLine * normal.x,
				y + p1.y + progressOnLine * normal.y
			);
			progressOnLine += gap;
			if (progressOnLine > len && dashLeft == 0) {
				gapLeft = progressOnLine - len;
			} else {
				gapLeft = 0;
				this.moveTo(
					x + p1.x + progressOnLine * normal.x,
					y + p1.y + progressOnLine * normal.y
				);
			}
		}
	}
};
