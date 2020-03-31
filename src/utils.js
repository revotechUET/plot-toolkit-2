import {utils} from 'pixi.js';
export function getColor(color, defaultColor = 0x000000) {
    if (!color) return defaultColor;
    if (isNaN(color)) return utils.string2hex(color);
    return parseInt(color);
}
export function getTransparency(transparency) {
    return (isNaN(transparency) && (transparency*(transparency - 1) < 0))?1:transparency;
}
export const DefaultColors = {
    lineColor: 0x0000FF,
    fillColor: 0xFFFF00,
    lineWidth: 1
}