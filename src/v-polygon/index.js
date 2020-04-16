import VShape from "../v-shape";
import {
    getColor,
    DefaultValues,
    getTransparency,
    getPosX,
    getImagePattern,
    blendColorImage,
    getPosY,
} from "../utils";
import { Texture } from "pixi.js";

async function draw(obj) {
    obj.clear();
    let lw = this.lineWidth || 1;
    let lt = this.lineTransparency || 1.0;
    this.shadingSide = this.shadingSide || 'left';
    if (this.hasMouseOver) {
        lw += 4;
        lt /= 2;
    }
    obj.lineStyle(lw, this.cLineColor.color, this.cLineColor.transparency, 0);

    obj.beginFill(
        this.cFillColor.color,
        this.cFillColor.transparency	
    );

    if (this.imagePatternUrl) {
        let imagePattern = await getImagePattern(this.imagePatternUrl);
        let canvas = blendColorImage(imagePattern, this.cForegroundColor, this.cBackgroundColor);

        const texture = Texture.from(canvas);
        obj.beginTextureFill(texture);
    }

    obj.drawPolygon(this.isShading ? this.cShadingPath : this.path || []);

    obj.endFill();
    obj.x = getPosX(this.coordinate, this.posX);
    obj.y = getPosY(this.coordinate, this.posY);
    obj.rotation = this.rotation || 0;
}

const props = [
    'path',
    'imagePatternUrl',
    'foregroundColor',
    'backgroundColor',
    'isShading',
    'shadingSide'
]

let component = {
    props,
    methods: {
        draw,
    },
};
export default VShape.extend(component);
