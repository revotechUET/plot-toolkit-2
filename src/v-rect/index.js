import VShape from "../v-shape";
import { Text, TextStyle, Texture } from "pixi.js";
import {
    getColor,
    DefaultValues,
    blendColorImage,
    getImagePattern,
    getTransparency,
    getPosX,
    getPosY,
} from "../utils";
import layoutMixin from '../mixins/layout';
import factoryFn from '../mixins';

<<<<<<< HEAD
import { Texture } from "pixi.js";

function drawRect(obj, align = 0) {
=======
async function drawRect(obj, align = 0) {
>>>>>>> e182803a907f7308697fb590282bc961bccfedda
    obj.clear();
    let lw = this.lineWidth || 0;
    let lt = this.lineTransparency || 1.0;
    if (this.hasMouseOver) {
        lw = lw ? (lw + 4) : 0;
        lt /= 2;
    }
    obj.lineStyle(lw, this.cLineColor.color, this.cLineColor.transparency, align);

    obj.beginFill(
        this.cFillColor.color,
        this.cFillColor.transparency,
        this.fillTexture
    );
    /*
        if (this.imagePatternUrl) {
            let imagePattern = await getImagePattern(this.imagePatternUrl);
            let canvas = blendColorImage(imagePattern, this.cForegroundColor, this.cBackgroundColor);
    
            const texture = Texture.from(canvas);
            obj.beginTextureFill(texture);
        }
    */
    obj.drawRect(0, 0, this.width || 0, this.height || 0);

    obj.endFill();
    obj.x = getPosX(this.coordinate, this.posX);
    obj.y = getPosY(this.coordinate, this.posY);
    obj.rotation = this.rotation || 0;
}

let component = {
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
