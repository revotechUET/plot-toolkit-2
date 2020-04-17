import VShape from "../v-shape";
import {
    getColor,
    DefaultValues,
    blendColorImage,
    getImagePattern,
    getTransparency,
    getPosX,
    getPosY,
} from "../utils";
import { Texture } from "pixi.js";

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
        this.cFillColor.transparency,
        this.fillTexture
    );

    /*if (this.imagePatternUrl) {
        let imagePattern = await getImagePattern(this.imagePatternUrl)
        let canvas = blendColorImage(imagePattern, this.cForegroundColor, this.cBackgroundColor);

        const texture = Texture.from(canvas);
        obj.beginTextureFill(texture);

    }*/

    obj.drawCircle(0, 0, this.radius || 0);

    obj.endFill();
    obj.x = getPosX(this.coordinate, this.posX);
    obj.y = getPosY(this.coordinate, this.posY);
    obj.rotation = this.rotation || 0;
}

let component = {
    methods: {
        draw,
    }
};
export default VShape.extend(component);
