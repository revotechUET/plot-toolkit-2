import VObject from '../v-object';
import { Graphics, Container } from 'pixi.js';
import {getPosX, getPosY, getColor, getTransparency, DefaultValues} from '../utils';
let component = {
    props: ['clipped', "lineWidth", "lineColor", "lineTransparency"],
    methods: {
        draw: function() {
            let obj = this.getPixiObj();
            obj.clear();
            let lw = this.lineWidth || 0;
            let lt = getTransparency(this.lineTransparency);
            obj.lineStyle(lw, getColor(this.lineColor, DefaultValues.lineColor), lt, 0);
            obj.drawRect(0, 0, this.width, this.height);
            obj.x = getPosX(this.coordinate, this.posX);
            obj.y = getPosY(this.coordinate, this.posY);
        },
        createPixiObj: function createPixiObj() {
            return new Graphics();
        }, 
        getMaskObj: function() {
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
    }
}
export default VObject.extend(component);