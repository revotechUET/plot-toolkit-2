import VObject from '../v-object';
import { Graphics } from 'pixi.js';
import { getPosX, getPosY, getColor, getTransparency, DefaultValues } from '../utils';
import layoutMixin from '../mixins/layout';

let component = {
    props: ['clipped', "lineWidth", "lineColor", "lineTransparency", "fillColor"],
    computed: {
        componentType: function () {
            return "VContainer";
        }
    },
    methods: {
        draw: function (obj) {
            obj.clear();
            let lw = this.lineWidth || 0;
            let lt = getTransparency(this.lineTransparency);
            obj.lineStyle(lw, this.cLineColor.color, this.cLineColor.transparency, 0);
            obj.beginFill(0xFFFFFF, 0.001);
            obj.drawRect(0, 0, this.width, this.height);
            obj.endFill();
            obj.x = getPosX(this.coordinate, this.posX);
            obj.y = getPosY(this.coordinate, this.posY);
        },
        createPixiObj: function createPixiObj() {
            return new Graphics();
        },
        getMaskObj: function () {
            if (!this.clipped) return null;
            if (!this.maskObj) {
                if (this.$parent) {
                    this.maskObj = new Graphics();
                    let parentObj = this.$parent.getPixiObj();
                    parentObj.addChild(this.maskObj);
                }
                else return null;
            }
            return this.maskObj;
        }
    },
    mixins: [layoutMixin]
}
export default VObject.extend(component);
