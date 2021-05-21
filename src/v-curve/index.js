import VPath from '../v-path';
import selectable from '../mixins/selectable';
import { getColor, DefaultValues } from "../utils";

let component = {
    props: {
        leftValue: {
            type: Number,
            default: 0
        },
        rightValue: {
            type: Number,
            default: 1
        },
        unit: {
            type: String,
            default: "V/V"
        }
    },
    computed: {
        componentType: function () {
            return "VCurve"
        }
    },
    components: {
        VPath
    },
    watch: {
        isSelected: function (newValue, oldValue) {
            console.log(oldValue, newValue);
            let obj = this.getPixiObj();
            if (newValue) {
                let points = this.getShadingPath();
                obj.lineStyle(3, getColor(this.symbolColor, DefaultValues.lineColor), 0.3, 0.5);
                obj.moveTo(points[0].x, points[0].y);
                for (let i = 1; i < points.length; i++) {
                    obj.myLineTo(points[i].x, points[i].y);
                }
            } else {
                this.draw(obj);
            }
        }
    },
    methods: {
        getShadingPath: function () {
            let transformXFn = this.$parent.getTransformX();
            let transformYFn = this.$parent.getTransformY();
            return this.realPath.map((point) => ({
                x: transformXFn(point.x) + 2,
                y: transformYFn(point.y) + 2,
            }));
        },
    },
    mixins: [selectable]
}

export default VPath.extend(component);