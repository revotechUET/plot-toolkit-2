import { utils, Graphics } from "pixi.js";

export function processColorStr(
	color,
	defaultColor = 0x000000,
	defaultTransparency = 1
) {
	let hex = color;
	let transparency = defaultTransparency;
	if (color) {
		switch (true) {
			case getColorRegex("rgb").test(color): {
				let sep = color.indexOf(",") > -1 ? "," : " ";
				let rgb = color
					.substr(4)
					.split(")")[0]
					.split(sep);
				for (let R in rgb) {
					let r = rgb[R];
					if (r.indexOf("%") > -1)
						rgb[R] = Math.round(
							(r.substr(0, r.length - 1) / 100) * 255
						);
				}

				let r = (+rgb[0]).toString(16),
					g = (+rgb[1]).toString(16),
					b = (+rgb[2]).toString(16);

				r = r.length == 1 ? "0" + r : r;
				g = g.length == 1 ? "0" + g : g;
				b = b.length == 1 ? "0" + b : b;

				hex = "0x" + r + g + b;
				break;
			}
			case getColorRegex("rgba").test(color): {
				let sep = color.indexOf(",") > -1 ? "," : " ";
				let rgba = color
					.substr(5)
					.split(")")[0]
					.split(sep);

				if (rgba.indexOf("/") > -1) rgba.splice(3, 1);

				for (let R in rgba) {
					let r = rgba[R];
					if (r.indexOf("%") > -1) {
						let p = r.substr(0, r.length - 1) / 100;

						if (R < 3) {
							rgba[R] = Math.round(p * 255);
						} else {
							rgba[R] = p;
						}
					}
				}
				let r = (+rgba[0]).toString(16),
					g = (+rgba[1]).toString(16),
					b = (+rgba[2]).toString(16);

				r = r.length == 1 ? "0" + r : r;
				g = g.length == 1 ? "0" + g : g;
				b = b.length == 1 ? "0" + b : b;

				hex = "0x" + r + g + b;
				transparency = +rgba[3];
				break;
			}
			case getColorRegex("hex").test(color): {
				hex = color.replace("#", "0x");
				if (hex.length == 5)
					hex = `0x${hex[2]}${hex[2]}${hex[3]}${hex[3]}${hex[4]}${hex[4]}`;
				break;
			}
			case getColorRegex("hexA").test(color): {
				hex = color.replace("#", "0x");
				if (hex.length == 6) {
					transparency = +(`0x${hex[5]}${hex[5]}` / 255).toFixed(3);
					hex = `0x${hex[2]}${hex[2]}${hex[3]}${hex[3]}${hex[4]}${hex[4]}`;
				} else {
					transparency = +(`0x${hex[8]}${hex[9]}` / 255).toFixed(3);
					hex = hex.slice(0, -2);
				}
				break;
			}
			case isNaN(color): {
				// Build-in Colors
				// 0x000000 for invalid colors
				let fakeDiv = document.createElement("div");
				fakeDiv.style.color = color;
				document.body.appendChild(fakeDiv);

				let cs = window.getComputedStyle(fakeDiv),
					pv = cs.getPropertyValue("color");

				document.body.removeChild(fakeDiv);
				let rgb = pv
						.substr(4)
						.split(")")[0]
						.split(","),
					r = (+rgb[0]).toString(16),
					g = (+rgb[1]).toString(16),
					b = (+rgb[2]).toString(16);

				r = r.length == 1 ? "0" + r : r;
				g = g.length == 1 ? "0" + g : g;
				b = b.length == 1 ? "0" + b : b;

				hex = "0x" + r + g + b;
				break;
			}
		}
	}
	return { color: getColor(parseInt(hex), defaultColor), transparency };
}

function getColorRegex(format) {
	switch (format) {
		case "rgb":
			return /^rgb\((((((((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5]),\s?)){2}|((((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5])\s)){2})((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5]))|((((([1-9]?\d(\.\d+)?)|100|(\.\d+))%,\s?){2}|((([1-9]?\d(\.\d+)?)|100|(\.\d+))%\s){2})(([1-9]?\d(\.\d+)?)|100|(\.\d+))%))\)$/i;
		case "rgba":
			return /^rgba\((((((((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5]),\s?)){3})|(((([1-9]?\d(\.\d+)?)|100|(\.\d+))%,\s?){3}))|(((((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5])\s){3})|(((([1-9]?\d(\.\d+)?)|100|(\.\d+))%\s){3}))\/\s)((0?\.\d+)|[01]|(([1-9]?\d(\.\d+)?)|100|(\.\d+))%)\)$/i;
		case "hex":
			return /^(#|0x)([\da-f]{3}){1,2}$/i;
		case "hexA":
			return /^(#|0x)([\da-f]{4}){1,2}$/i;
	}
}

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
export function formatNumber(value, decimals) {
	return value.toFixed(decimals || 4);
}
export function genLogTickValues(minVal, maxVal) {
	var tickValues = new Array();
	// THANG: standardize min, max values to prevent inf loop
	if (minVal <= 0) minVal = 0.001;
	if (maxVal <= 0) maxVal = 1;

	var leftExponent = Math.floor(Math.log10(minVal));
	var rightExponent = Math.ceil(Math.log10(maxVal));
	for (let i = leftExponent; i <= rightExponent; i++) {
		for (let j = 1; j < 10; j++) {
			let value = j * Math.pow(10, i);
			if (value >= minVal && value <= maxVal) tickValues.push(value);
		}
	}
	return tickValues;
}
export function logMajorTest(value) {
	return Number.isInteger(Math.log10(value)) ? true : false;
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

Graphics.prototype.drawPlus = function(x, y, symbolSize) {
	this.moveTo(x, y - symbolSize);
	this.lineTo(x, y + symbolSize);
	this.moveTo(x - symbolSize, y);
	this.lineTo(x + symbolSize, y);
};
