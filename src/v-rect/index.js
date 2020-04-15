import VShape from "../v-shape";
import {
    getColor,
    DefaultValues,
    getTransparency,
    getPosX,
    getPosY,
} from "../utils";
import layoutMixin from '../mixins/layout';
import factoryFn from '../mixins';

function drawRect(obj, align = 0) {
    obj.clear();
    let lw = this.lineWidth || 0;
    let lt = this.lineTransparency || 1.0;
    if (this.hasMouseOver) {
        lw = lw ? (lw + 4) : 0;
        lt /= 2;
    }
    obj.lineStyle(lw, this.cLineColor.color, this.cLineColor.transparency, align);
    //obj.lineStyle(lw, getColor(this.lineColor, DefaultValues.lineColor), lt, align);

    //obj.beginFill(
    //getColor(this.fillColor, DefaultValues.fillColor),
    //getTransparency(this.fillTransparency)
    //);
    obj.beginFill(
        this.cFillColor.color,
        this.cFillColor.transparency
    );

    obj.drawRect(0, 0, this.width || 0, this.height || 0);

    obj.endFill();
    obj.x = getPosX(this.coordinate, this.posX);
    obj.y = getPosY(this.coordinate, this.posY);
    obj.rotation = this.rotation || 0;
}

let component = {
    computed: {
        componentType: function() {
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