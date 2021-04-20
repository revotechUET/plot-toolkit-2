import VShape from "../v-shape";
import { getColor, DefaultValues, getPosX, getPosY } from "../utils";

async function draw(obj) {
    obj.clear();
    let lw = this.lineWidth || 1;
    // let lt = this.lineTransparency || 1.0;
    // this.shadingSide = this.shadingDirection || 'left';
    // this.path = this.realPath;
    // obj.lineStyle(lw, this.cLineColor.color, this.cLineColor.transparency, 0);
    obj.beginFill(
        this.cFillColor.color,
        this.cFillColor.transparency
    );

    let minX = Math.min(...this.cShadingPath.filter((item, index) => index % 2 === 0));
    console.log('minX', minX);

    obj.drawPolygon(this.cShadingPath);

    if (!Array.isArray(this.realLeft)) {
        obj.moveTo(this._getX(this.realLeft), this.cShadingPath[1]);
        obj.lineStyle(lw, this.cLineColor.color, this.cLineColor.transparency, 0);
        obj.lineTo(this._getX(this.realLeft), this.cShadingPath[this.cShadingPath.length - 1]);
    }

    if (!Array.isArray(this.realRight)) {
        obj.moveTo(this._getX(this.realRight), this.cShadingPath[1]);
        obj.lineStyle(lw, this.cLineColor.color, this.cLineColor.transparency, 0);
        obj.lineTo(this._getX(this.realRight), this.cShadingPath[this.cShadingPath.length - 1]);
    }

    obj.endFill();
    obj.x = getPosX(this.coordinate, this.posX);
    obj.y = getPosY(this.coordinate, this.posY);
    obj.rotation = this.rotation || 0;
}

let component = {
    props: [
        "realLeft",
        "realRight",
    ],
    computed: {
        cShadingPath: function () {
            let path, begin, end;
            if (Array.isArray(this.realLeft)) {
                path = this.realLeft.map((item, idx) => idx % 2 ? this._getY(item) : this._getX(item));
                if (!Array.isArray(this.realRight)) {
                    let pixelRight = this._getX(this.realRight);
                    console.log("pixcel", pixelRight);
                    begin = [pixelRight || this.viewPosX, path[1]];
                    end = [pixelRight || this.viewPosX, path[path.length - 1]];
                }
            } else {
                path = this.realRight.map((item, idx) => idx % 2 ? this._getY(item) : this._getX(item));
                if (!Array.isArray(this.realLeft)) {
                    let pixelLeft = this._getX(this.realLeft);
                    console.log("pixel", pixelLeft);
                    begin = [pixelLeft || this.viewPosX, path[1]];
                    end = [pixelLeft || this.viewPosX, path[path.length - 1]];
                }
            }
            path = [...begin, ...path, ...end];
            console.log(path);
            return path;
        }
    },
    methods: {
        draw,
    },
};

export default VShape.extend(component);