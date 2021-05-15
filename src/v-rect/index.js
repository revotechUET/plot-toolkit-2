import VShape from "../v-shape";
import { Text, TextStyle, Texture } from "pixi.js";
import {
    getColor,
    DefaultValues,
    blendColorImage,
    getImagePattern,
    processColorStr,
    getTransparency,
    getPosX,
    getPosY,
} from "../utils";
import { scaleLinear, scaleQuantile } from "d3-scale";
import layoutMixin from '../mixins/layout';
import factoryFn from '../mixins';

async function drawRect(obj, align = 0) {
    obj.clear();
    let lw = this.lineWidth || 0;
    let lt = this.lineTransparency || 1.0;
    if (this.hasMouseOver) {
        lw = lw ? (lw + 4) : 0;
        lt /= 2;
    }

    if (this.typeFillColor) {
        console.log("VRect", this.typeFillColor);
    }

    if (this.typeFillColor) {
        let transformFn;
        switch (this.typeFillColor) {
            case "Gradient":
                if (!this.minColor || !this.maxColor) {
                    throw new Error(`No sufficient information for VRect typeFillColor
                        ${this.typeFillColor} with: ${this.minColor} and ${this.maxColor}`);
                }
                transformFn = scaleLinear().domain([0, this.viewWidth]).range([this.minColor, this.maxColor]);
                break;
            case "Pallete":
                let myPallete = this.pallete.map(p => `rgba(${p["red"]}, ${p["green"]}, ${p["blue"]}, ${p["alpha"]})`);
                if (!this.pallete) {
                    throw new Error(`No sufficient information for VRect typeFillColor
                    ${this.typeFillColor} with: ${this.pallete}`);
                }
                transformFn = scaleQuantile().domain([0, this.viewWidth]).range(myPallete);
                break;
        }
        if (transformFn) {
            let polygon, myFillColor, posXFillColor;
            for (let i = 0; i <= this.viewWidth; i += 1) {
                polygon = [i, 0, i + 1, 0, i + 1, this.viewHeight, i, this.viewHeight];
                posXFillColor = i;
                myFillColor = processColorStr(transformFn(posXFillColor));
                obj.beginFill(
                    myFillColor.color,
                    myFillColor.transparency
                );
                obj.drawPolygon(polygon);
                obj.endFill();
            }
        }
    } else {
        obj.beginFill(
            this.cFillColor.color,
            this.cFillColor.transparency,
            this.fillTexture
        );
    }

    if (this.imagePatternUrl) {
        let imagePattern = await getImagePattern(this.imagePatternUrl);
        let canvas = blendColorImage(imagePattern, this.cForegroundColor, this.cBackgroundColor);

        const texture = Texture.from(canvas);
        obj.beginTextureFill(texture);
    }

    obj.lineStyle(lw, this.cLineColor.color, this.cLineColor.transparency, align);
    obj.drawRect(0, 0, this.width || 0, this.height || 0);

    obj.endFill();
    obj.x = getPosX(this.coordinate, this.posX);
    obj.y = getPosY(this.coordinate, this.posY);
    obj.rotation = this.rotation || 0;
}

let component = {
    props: [
        "typeFillColor",
        "minColor",
        "maxColor",
        "pallete"
    ],
    computed: {
        componentType: function () {
            return this.componentTypePrefix + " VRect";
        }
    },
    methods: {
        drawRect,
        draw: drawRect
    },
    mixins: [layoutMixin]
};
let VRect = VShape.extend(component);
export function VRectFactory(opts) {
    return factoryFn(VRect, opts);
}
export default VRect;
