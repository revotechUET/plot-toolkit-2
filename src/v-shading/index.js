import VShape from "../v-shape";
import VPath from '../v-path';
import VRect from '../v-rect';
import { scaleLinear, scaleQuantile, scaleLog } from "d3-scale";
import {
	processColorStr,
	DefaultValues,
	getImagePattern,
	convert2rgbColor,
	blendColorImage,
	getPosX,
	getPosY
} from "../utils";
import template from './template.html';
import selectable from '../mixins/selectable';
import { Texture, utils } from "pixi.js";

async function draw(obj) {
	console.log("isShading draw");
	obj.clear();
	let fillValues = [],
		bgColors = [],
		fillPatterns = [],
		fgColors = [],
		mn, mx,
		transformColor,
		positiveTransformColor,
		negativeTransformColor,
		myPalette;
	let normalFillDomain = [
		(!isNaN(this.realMinX) ? this.realMinX : this.$parent.realMinX),
		(!isNaN(this.realMaxX) ? this.realMaxX : this.$parent.realMaxX)
	]
	if (!isNaN(this.shadingLowValue) && !isNaN(this.shadingHighValue)) {
		normalFillDomain = [this.shadingLowValue, this.shadingHighValue]
	}
	switch (this.typeFillColor) {
		case "Gradient": //transform linear
			if (!this.isNormalFill) {
				if (!this.positiveSideColor || !this.negativeSideColor) {
					throw new Error(`No sufficient information for Gradient positive/negative fill color`);
				}
				positiveTransformColor = scaleLinear()
					.domain([
						this.shadingPositiveLowValue, this.shadingPositiveHighValue
					])
					.range([this.positiveSideColor.minColor, this.positiveSideColor.maxColor]);
				negativeTransformColor = scaleLinear()
					.domain([
						this.shadingNegativeLowValue, this.shadingNegativeHighValue
					])
					.range([this.negativeSideColor.minColor, this.negativeSideColor.maxColor]);
			} else {
				if (!this.minColor || !this.maxColor) {
					throw new Error(`No sufficient information for fill color
                                Gradient: min color ${this.minColor} and max color ${this.maxColor}`)
				}
				transformColor = scaleLinear()
					.domain(normalFillDomain)
					.range([this.minColor, this.maxColor]);
			}
			break;
		case "Custom Fills": //transform discrete
			if (!this.customFillValues && this.shadingType === 'varShading') {
				throw new Error(`No sufficient information for custom fill color`)
			}
			if (this.shadingType === 'pattern' && !this.customFillValues) {
				await this.myDrawPolygon3(obj);
				return;
			}
			let flag = false;
			if (this.shadingType === 'pattern' && !this.isNormalFill) {
				if (this.realLeft < this.shadingLowValue && this.realLeft < this.shadingHighValue) {
					flag = true;
					fillValues.push(this.realLeft);
					bgColors.push(this.backgroundColorList[1]);
					fgColors.push(this.foregroundColorList[1]);
					fillPatterns.push(this.fillPatternList[1]);
				} else if (this.realLeft > this.shadingLowValue && this.realLeft > this.shadingHighValue) {
					flag = true;
					fillValues.push(this.realLeft);
					bgColors.push(this.backgroundColorList[0]);
					fgColors.push(this.foregroundColorList[0]);
					fillPatterns.push(this.fillPatternList[1]);
				}
			}
			let rangeCheck = {};
			if (!flag) {
				for (let i = 0; i < this.customFillValues.length; i++) {
					let ele = this.customFillValues[i];
					mn = Math.min(ele["lowVal"], ele["highVal"]);
					mx = Math.max(ele["lowVal"], ele["highVal"]);
					if (fillValues.length === 0) {
						fillValues.push(mn, mx);
						rangeCheck[mn] = mx;
						bgColors.push(this.backgroundColorList[0]);
						fgColors.push(this.foregroundColorList[0]);
						fillPatterns.push(this.fillPatternList[0]);
					} else {
						if (mn > fillValues[fillValues.length - 1]) { //case: lowVal > maximum of fillValues => push both lowVal and highVal
							rangeCheck[mn] = mx;
							fillValues.push(mn, mx);
							bgColors.push("transparent", this.backgroundColorList[i]);
							fgColors.push("white", this.foregroundColorList[i]);
							fillPatterns.push(null, this.fillPatternList[i]);
							continue;
						} else if (mn === fillValues[fillValues.length - 1]) { //case: lowVal = maximum of fillValues => just push highVal
							rangeCheck[fillValues[fillValues.length - 1]] = mx;
							fillValues.push(mx);
							bgColors.push(this.backgroundColorList[i]);
							fgColors.push(this.foregroundColorList[i]);
							fillPatterns.push(this.fillPatternList[i]);
							continue;
						}

						if (mx < fillValues[0]) { //case: highVal < minimum of fillValues => unshift both lowVal and highVal
							rangeCheck[mn] = mx;
							fillValues.unshift(mn, mx);
							bgColors.unshift(this.backgroundColorList[i], "transparent");
							fgColors.unshift(this.foregroundColorList[i], "white");
							fillPatterns.unshift(this.fillPatternList[i], null);
							continue;
						} else if (mx === fillValues[0]) { //case: highVal = minimum of fillValues => just unshift lowVal
							rangeCheck[mn] = mx;
							fillValues.unshift(mn);
							bgColors.unshift(this.backgroundColorList[i]);
							fgColors.unshift(this.foregroundColorList[i]);
							fillPatterns.unshift(this.fillPatternList[i]);
							continue;
						}

						let flag = false;
						for (let j = 0; j < fillValues.length; j++) {
							if (fillValues[j] === mn) {
								flag = true;
							}
						}
						if (rangeCheck[mn] || !flag) {
							throw new Error(`Range duplicated: ${fillValues} with: ${mn} and ${mx}`);
						} let idx = fillValues.indexOf(mn);
						if (fillValues[idx + 1]) {
							if (mx > fillValues[idx + 1]) {
								throw new Error(`Range duplicated: ${fillValues} with: ${mn} and ${mx}`);
							} else if (mx === fillValues[idx + 1]) {
								rangeCheck[mn] = mx;
								bgColors.splice(idx, 1, this.backgroundColorList[i]);
								fgColors.splice(idx, 1, this.foregroundColorList[i]);
								fillPatterns.splice(idx, 1, this.fillPatternList[i]);
							}
						}
					}
				}
			}

			fillPatterns = fillPatterns.map((item, idx) => {
				return {
					src: fillPatterns[idx],
					texture: null
				}
			})
			for (let i = 0; i < fillPatterns.length; i++) {
				if (fillPatterns[i].src) {
					const texture = await this.getTexture(bgColors[i], fgColors[i], fillPatterns[i].src);
					fillPatterns[i].texture = texture;
				}
			}
			transformColor = scaleQuantile().domain(fillValues).range(bgColors);
			if (!this.isNormalFill) {
				if (!isNaN(this.realLeft)) {
					positiveTransformColor = scaleQuantile()
						.domain([this.shadingPositiveLowValue, this.shadingPositiveHighValue])
						.range([bgColors[1]]);
					negativeTransformColor = scaleQuantile()
						.domain([this.shadingNegativeLowValue, this.shadingNegativeHighValue])
						.range([bgColors[0]]);
				}
			}
			break;
		case "Palette":
			if (!this.isNormalFill) {
				if (!this.positiveSidePalette || !this.negativeSidePalette) {
					throw new Error(`No sufficient information for Palette positive/negative fill color`);
				}
				positiveTransformColor = scaleQuantile()
					.domain([
						this.shadingPositiveLowValue, this.shadingPositiveHighValue
					])
					.range(this.positiveSidePalette.map(p => `rgba(${p["red"]}, ${p["green"]}, ${p["blue"]}, ${p["alpha"]})`));
				negativeTransformColor = scaleQuantile()
					.domain([
						this.shadingNegativeLowValue, this.shadingNegativeHighValue
					])
					.range(this.negativeSidePalette.map(p => `rgba(${p["red"]}, ${p["green"]}, ${p["blue"]}, ${p["alpha"]})`));
			} else {
				if (!this.palette) {
					throw new Error(`No sufficient information for fill color Palette: ${this.palette}`);
				}
				myPalette = this.palette.map(p => `rgba(${p["red"]}, ${p["green"]}, ${p["blue"]}, ${p["alpha"]})`);
				transformColor = scaleQuantile()
					.domain(normalFillDomain)
					.range(myPalette);
			}
			break;
		default:
			throw new Error(`No sufficient information for type fill color : ${this.typeFillColor}`);
	}

	let shadingIdx = 0; // index for checking 2 curve(realLeft & realRight) of shading intersect
	let posRealLeft;
	let posXFillColor;
	let polygon;
	if (!isNaN(this.realLeft)) {
		posRealLeft = this.transformX(this.realLeft)
	}

	let shadingCtrlTransform = scaleLinear().domain([this.shadingLowValue, this.shadingHighValue])
		.range([0, this.viewWidth || this.$parent.viewWidth])

	for (let i = 0; i < this.cPolygonList.length; i++) {
		let myFillColor;
		polygon = this.cPolygonList[i];
		posXFillColor = this.shadingControlCurve[shadingIdx].x;
		if (i && this.checkTriangle[i - 1]) {
			posXFillColor = this.shadingControlCurve[shadingIdx + 1].x;
		}
		if (!this.checkTriangle[i]) {
			shadingIdx++;
		};
		if (polygon.some(point => point.x === null)) {
			continue;
		};
		if (!this.isNormalFill) {
			let polygonMaxX = Math.max(...polygon.map(point => point["x"]));
			if (posRealLeft !== null) {
				if (shadingCtrlTransform(posXFillColor) > posRealLeft
					|| (shadingCtrlTransform(posXFillColor) === posRealLeft
						&& shadingCtrlTransform(polygonMaxX) > posRealLeft)) {
					myFillColor = processColorStr(positiveTransformColor(posXFillColor));
				} else {
					myFillColor = processColorStr(negativeTransformColor(posXFillColor));
				}
			}
		}
		switch (this.typeFillColor) {
			case "Gradient":
				this.myDrawPolygon2(obj, polygon, myFillColor, posXFillColor, negativeTransformColor, positiveTransformColor);
				break;
			case "Custom Fills":
				if (this.isNormalFill && this.shadingType === 'varShading' &&
					(posXFillColor < fillValues[0] || posXFillColor > fillValues[fillValues.length - 1])) {
					break;
				}
				let index = 0;
				for (let j = 0; j < fillValues.length; j++) {
					if (fillValues[j] <= posXFillColor) {
						index = j;
					}
				}
				if (index === fillValues.length - 1 && fillValues.length !== 1) {
					index--;
				}
				if (fillPatterns[index] && fillPatterns[index].src) {
					obj.beginTextureFill(fillPatterns[index].texture);
				} else {
					if (transformColor(posXFillColor) === 'transparent') {
						continue;
					}
					myFillColor = processColorStr(bgColors[index]);
					obj.beginFill(
						myFillColor.color,
						myFillColor.transparency
					);
				}
				await this.myDrawPolygon(obj, polygon, myFillColor, fillPatterns, bgColors, fgColors);
				obj.endFill();
				break;
			case "Palette":
				this.myDrawPolygon2(obj, polygon, myFillColor, posXFillColor, negativeTransformColor, positiveTransformColor);
				break;
		}
	};

	obj.x = getPosX(this.coordinate, this.posX);
	obj.y = getPosY(this.coordinate, this.posY);
	obj.rotation = this.rotation || 0;
}

function getLinearLine(point1, point2, num = 0) {
	let res = {};
	let a = (point1["y"] - point2['y']) / (point1["x"] - point2["x"]);
	let b = point1["y"] - a * point1["x"];
	num ? res[`a${num}`] = a : res['a'] = a;
	num ? res[`b${num}`] = b : res['b'] = b;
	return res;
}

function generatePolygons(path, bothIsArr) {
	let polygonArr = [], checkArr = [];
	if (!bothIsArr) {
		let x = path[0]["x"];
		let polygon;
		let i = 1;
		while (i < path.length - 2) {
			polygon = [{ x, y: path[i]["y"] }, ...path.slice(i, i + 2), { x, y: path[i + 1]["y"] }];
			if ((polygon[1]["x"] >= x && polygon[2]["x"] < x) || (polygon[1]["x"] <= x && polygon[2]["x"] > x)) {
				let { a, b } = getLinearLine(polygon[1], polygon[2]);
				polygonArr.push([...polygon.slice(0, 2), { x, y: a * x + b }]);
				polygonArr.push([...polygon.slice(2, 4), { x, y: a * x + b }]);
				checkArr.push(true, false);
				i++;
				continue;
			}
			checkArr.push(false);
			polygonArr.push(polygon);
			i++;
		}
	} else {
		let arr = [];
		for (let i = 0; i < path.length; i += 2) {
			arr.push(path.slice(i, i + 2));
		}
		for (let i = 0; i < arr.length - 1; i++) {
			let mx = Math.max(arr[i + 1][0]["x"], arr[i + 1][1]["x"]);
			let indexMx;
			arr[i + 1].forEach((item, idx) => {
				if (item.x === mx) {
					indexMx = idx;
				}
			});

			let x, y;
			let secondPath = [];
			if (arr[i][0]["x"] < arr[i][1]["x"]) {
				if (indexMx === 0) {
					let { a1, b1 } = getLinearLine(arr[i][1], arr[i + 1][1], 1);
					let { a2, b2 } = getLinearLine(arr[i][0], arr[i + 1][0], 2);
					x = (b2 - b1) / (a1 - a2);
					y = a1 * x + b1;
				} else {
					secondPath.push(arr[i + 1][1], arr[i + 1][0]);
				}
			} else {
				if (indexMx === 1) {
					let { a1, b1 } = getLinearLine(arr[i][1], arr[i + 1][1], 1);
					let { a2, b2 } = getLinearLine(arr[i][0], arr[i + 1][0], 2);
					x = (b2 - b1) / (a1 - a2);
					y = a1 * x + b1;
				} else {
					secondPath.push(arr[i + 1][1], arr[i + 1][0]);
				}
			}
			if (x && y) {
				polygonArr.push([...arr[i], { x, y }]);
				polygonArr.push([...arr[i + 1], { x, y }]);
				checkArr.push(true, false);
			} else {
				polygonArr.push([...arr[i], ...secondPath]);
				checkArr.push(false);
			}
		}
	}
	return {
		arr: polygonArr,
		checkArr
	};
}

let component = {
	props: {
		leftRealMinX: Number,
		leftRealMaxX: Number,
		realLeft: [Number, Array],
		realRight: [Number, Array],
		shadingControlCurve: Array,
		minColor: [Number, String, Array],
		maxColor: [Number, String, Array],
		shadingType: String,
		typeFillColor: String,
		customFillValues: Array,
		foregroundColorList: Array,
		backgroundColorList: Array,
		fillPatternList: Array,
		palette: Array,
		shadingLowValue: Number,
		shadingHighValue: Number,
		shadingPositiveLowValue: Number,
		shadingPositiveHighValue: Number,
		shadingNegativeLowValue: Number,
		shadingNegativeHighValue: Number,
		isNormalFill: {
			type: Boolean,
			default: true
		},
		positiveSideColor: Object,
		negativeSideColor: Object,
		positiveSidePalette: Array,
		negativeSidePalette: Array,
		wrapMode: String,
		leftWrapMode: String
	},
	template,
	data: function () {
		return {
			checkTriangle: [],
			notIsArray: '',
		}
	},
	computed: {
		cPolygonList: function () {
			let begin, end, path = [];
			let bothIsArray = Array.isArray(this.realLeft) && Array.isArray(this.realRight);
			let transformXFn = this.getTransformX() || this.$parent.getTransformX(),
				transformYFn = this.getTransformY() || this.$parent.getTransformY();
			if (bothIsArray) {
				let leftTransformXFn = this.leftTransformX();
				for (let i = 0; i < this.realLeft.length; i++) {
					path.push({
						x: this.realLeft[i]["x"] != null ? leftTransformXFn(this.realLeft[i]["x"]) : null,
						y: transformYFn(this.realLeft[i]["y"])
					});
					path.push({
						x: this.realRight[i]["x"] != null ? transformXFn(this.realRight[i]["x"]) : null,
						y: transformYFn(this.realRight[i]['y'])
					});
				}
			}
			else {
				if (Array.isArray(this.realLeft) && !Array.isArray(this.realRight)) {
					this.notIsArray = "Real Right";
					path = this.realLeft.map(point => ({
						x: point.x != null ? transformXFn(point.x) : null,
						y: transformYFn(point.y)
					}));
					begin = {
						x: transformXFn(this.realRight),
						y: transformYFn(path[0]["y"])
					};
					end = {
						x: transformXFn(this.realRight),
						y: transformYFn(path[path.length - 1]["y"])
					};
				} else if (!Array.isArray(this.realLeft) && Array.isArray(this.realRight)) {
					this.notIsArray = "Real Left";
					path = this.realRight.map(point => ({
						x: point.x != null ? transformXFn(point.x) : null,
						y: transformYFn(point.y)
					}));
					begin = {
						x: transformXFn(this.realLeft),
						y: transformYFn(path[0]["y"])
					};
					end = {
						x: transformXFn(this.realLeft),
						y: transformYFn(path[path.length - 1]["y"])
					};
				}
				path = [begin, ...path, end];
			}
			let { arr, checkArr } = generatePolygons(path, bothIsArray);
			this.checkTriangle = checkArr;
			return arr;
		},
		getShadingMinColor: function () {
			if (this.minColor) {
				return this.minColor;
			}
			if (this.positiveSideColor) {
				return this.positiveSideColor.minColor;
			}
		},
		getShadingMaxColor: function () {
			if (this.maxColor) {
				return this.maxColor;
			}
			if (this.positiveSideColor) {
				return this.positiveSideColor.maxColor;
			}
		},
		componentType: function () {
			return "VShading";
		},
	},
	methods: {
		draw,
		//draw Custom fills
		myDrawPolygon: async function (obj, polygon, fillColor, fillPatterns, bgColors, fgColors) {
			if (polygon.some(point => point.x === null)) return;
			let leftFlag, rightFlag;
			switch (this.wrapMode) {
				case "Left":
					leftFlag = polygon.some(point => point.x > this.viewWidth);
					if (leftFlag) {
						await this.drawWrapMode(...arguments, 0);
					} else {
						let res = [];
						polygon.forEach(point => res.push(point.x, point.y));
						obj.drawPolygon(res);
					}
					break;
				case "Right":
					rightFlag = polygon.some(point => point.x < 0);
					if (rightFlag) {
						await this.drawWrapMode(...arguments, 1);
					} else {
						let res = [];
						polygon.forEach(point => res.push(point.x, point.y));
						obj.drawPolygon(res);
					}
					break;
				case "Both":
					leftFlag = polygon.some(point => point.x > this.viewWidth);
					rightFlag = polygon.some(point => point.x < 0);
					if (!leftFlag && !rightFlag) {
						let res = [];
						polygon.forEach(point => res.push(point.x, point.y));
						obj.drawPolygon(res);
					} else {
						if (leftFlag) {
							await this.drawWrapMode(...arguments, 0);
						}
						if (rightFlag) {
							await this.drawWrapMode(...arguments, 1);
						}
					}
					break;
				default:
					let res = [];
					polygon.forEach(point => res.push(point.x, point.y));
					obj.drawPolygon(res);
			}
		},
		//draw gradient - palette
		myDrawPolygon2: function (obj, polygon, myFillColor, posXFillColor, negativeTransformColor, positiveTransformColor) {
			if (this.isNormalFill) {
				myFillColor = processColorStr(transformColor(posXFillColor));
			} else {
				let res = [], leftFlag, rightFlag;
				switch (this.wrapMode) {
					case "Left":
						leftFlag = polygon.some(point => point.x > this.viewWidth);
						break;
					case "Right":
						rightFlag = polygon.some(point => point.x < 0);
						break;
					case "Both":
						leftFlag = polygon.some(point => point.x > this.viewWidth);
						rightFlag = polygon.some(point => point.x < 0);
						break;
					default:
				}
				if (leftFlag) {
					polygon.forEach(point => res.push(point.x - this.viewWidth, point.y));
					let { color, transparency } = processColorStr(negativeTransformColor(posXFillColor));
					obj.beginFill(color, transparency);
					obj.drawPolygon(res);
				}
				if (rightFlag) {
					res = [];
					polygon.forEach(point => res.push(point.x + this.viewWidth, point.y));
					let { color, transparency } = processColorStr(positiveTransformColor(posXFillColor));
					obj.beginFill(color, transparency);
					obj.drawPolygon(res);
				}
			}
			obj.beginFill(
				myFillColor.color,
				myFillColor.transparency
			);
			this.drawPolygon(obj, polygon);
			obj.endFill();
		},
		//draw shading based on 2 curve
		myDrawPolygon3: async function (obj) {
			let fillPatterns = [], texture;
			for (let i = 0; i < this.fillPatternList.length; i++) {
				if (this.fillPatternList[i]) {
					texture = await this.getTexture(this.backgroundColorList[i],
						this.foregroundColorList[i], this.fillPatternList[i]);
					fillPatterns.push(texture)
				} else {
					fillPatterns.push(null);
				}
			}
			let leftTransformXFn = this.leftTransformX();
			let rightTransformFn = this.getTransformX();
			let polygon, shadingIdx = 0, rightCurvePoint, leftCurvePoint;
			for (let i = 0; i < this.cPolygonList.length; i++) {
				polygon = this.cPolygonList[i];
				rightCurvePoint = rightTransformFn(this.realRight[shadingIdx].x);
				leftCurvePoint = leftTransformXFn(this.realLeft[shadingIdx].x);
				if (i && this.checkTriangle[i - 1]) {
					rightCurvePoint = rightTransformFn(this.realRight[shadingIdx + 1].x);
					leftCurvePoint = leftTransformXFn(this.realLeft[shadingIdx + 1].x);
				}
				if (rightCurvePoint === leftCurvePoint) continue;
				else if (rightCurvePoint > leftCurvePoint) {
					if (fillPatterns[1]) {
						obj.beginTextureFill(fillPatterns[1]);
					} else if (this.backgroundColorList[1] !== 'transparent') {
						let { color, transparency } = processColorStr(this.backgroundColorList[1]);
						obj.beginFill(color, transparency);
					}
				} else if (rightCurvePoint < leftCurvePoint) {
					if (fillPatterns[0]) {
						obj.beginTextureFill(fillPatterns[0]);
					} else if (this.backgroundColorList[0] !== 'transparent') {
						let { color, transparency } = processColorStr(this.backgroundColorList[0]);
						obj.beginFill(color, transparency);
					}
				}
				this.drawPolygon(obj, polygon);
				let leftFlag, rightFlag;
				switch (this.wrapMode) {
					case "Left":
						leftFlag = polygon.some(point => point.x > this.viewWidth);
						break;
					case "Right":
						rightFlag = polygon.some(point => point.x < 0);
						break;
					case "Both":
						leftFlag = polygon.some(point => point.x > this.viewWidth);
						rightFlag = polygon.some(point => point.x < 0);
						break;
					default:
				}
				let res = [];
				if (leftFlag) {
					polygon.forEach(point => res.push(point.x - this.viewWidth, point.y));
					obj.drawPolygon(res);
				}
				if (rightFlag) {
					res = [];
					polygon.forEach(point => res.push(point.x + this.viewWidth, point.y));
					obj.drawPolygon(res);
				}
				switch (this.leftWrapMode) {
					case "Left":
						leftFlag = polygon.some(point => point.x > this.viewWidth);
						break;
					case "Right":
						rightFlag = polygon.some(point => point.x < 0);
						break;
					case "Both":
						leftFlag = polygon.some(point => point.x > this.viewWidth);
						rightFlag = polygon.some(point => point.x < 0);
						break;
					default:
						leftFlag = rightFlag = null;
				}
				res = [];
				if (leftFlag) {
					polygon.forEach(point => res.push(point.x - this.viewWidth, point.y));
					obj.drawPolygon(res);
				}
				if (rightFlag) {
					res = [];
					polygon.forEach(point => res.push(point.x + this.viewWidth, point.y));
					obj.drawPolygon(res);
				}
				if (!this.checkTriangle[i]) {
					shadingIdx++;
				};
				obj.endFill();
			}
			obj.x = getPosX(this.coordinate, this.posX);
			obj.y = getPosY(this.coordinate, this.posY);
			obj.rotation = this.rotation || 0;
		},
		drawWrapMode: async function (obj, polygon, fillColor, fillPatterns, bgColors, fgColors, index) {
			let res = [];
			if (this.shadingType === 'pattern') {
				if (fillPatterns.length === 1) {
					if (fillPatterns[0].src) {
						obj.beginTextureFill(fillPatterns[0].texture)
					} else {
						let { color, transparency } = processColorStr(bgColors[0]);
						obj.beginFill(color, transparency);
					}
				} else {
					if (fillPatterns[index].src) {
						obj.beginTextureFill(fillPatterns[index]);
					} else {
						let { color, transparency } = processColorStr(bgColors[index]);
						obj.beginFill(color, transparency);
					}
				}
				!index ?
					polygon.forEach(point => res.push(point.x - this.viewWidth, point.y))
					: polygon.forEach(point => res.push(point.x + this.viewWidth, point.y));
				obj.drawPolygon(res);
				if (fillPatterns.length > 1) {
					let reverseIdx = index ? 0 : 1;
					if (fillPatterns[reverseIdx].src) {
						obj.beginTextureFill(fillPatterns[reverseIdx].texture);
					} else {
						obj.beginFill(fillColor.color, fillColor.transparency);
					}
				}
			}
			this.drawPolygon(obj, polygon);
		},
		drawPolygon(obj, polygon) {
			let arr = [];
			polygon.forEach(point => arr.push(point.x, point.y));
			obj.drawPolygon(arr);
		},
		getTexture: async function (bgColor, fgColor, src) {
			let srcUrl = `https://users.i2g.cloud${src}?service=WI_BACKEND`;
			let myFgColor = convert2rgbColor(fgColor),
				myBgColor = convert2rgbColor(bgColor);
			let imagePattern = await getImagePattern(srcUrl);
			let canvas = blendColorImage(imagePattern, myFgColor, myBgColor);
			const texture = Texture.from(canvas);
			return texture;
		},
		leftTransformX: function () {
			let transformFn;
			if (!isNaN(this.leftRealMinX) && !isNaN(this.leftRealMinX)) {
				switch (this.xTransform) {
					case "linear":
						transformFn = scaleLinear();
						break;
					case "loga":
						transformFn = scaleLog();
						break;
				}
			}
			return transformFn.domain([this.leftRealMinX, this.leftRealMaxX])
				.range([0, this.viewWidth || this.$parent.viewWidth]);
		}
	},
	components: {
		VRect, VPath
	},
	mixins: [selectable]
};

export default VShape.extend(component);