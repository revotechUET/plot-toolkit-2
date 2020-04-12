import { utils } from "pixi.js";

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
	return value.toFixed(decimals||4);
}
export function genLogTickValues(minVal, maxVal) {
    var tickValues = new Array();
    // THANG: standardize min, max values to prevent inf loop
    if(minVal <= 0) minVal = 0.001;
    if(maxVal <= 0) maxVal = 1;

    var leftExponent = Math.floor(Math.log10(minVal));
    var rightExponent = Math.ceil(Math.log10(maxVal));
    for (let i = leftExponent; i <= rightExponent; i++) {
        for (let j = 1; j < 10; j++) {
            let value = j * Math.pow(10, i);
            if (value >= minVal && value <= maxVal)
                tickValues.push(value);
        }
    }
    return tickValues;
}
export function logMajorTest(value) {
    return Number.isInteger(Math.log10(value))?true:false;
}
export const DefaultValues = {
	lineColor: 0x0000ff,
	fillColor: 0xcccccc,
	lineWidth: 1,
};