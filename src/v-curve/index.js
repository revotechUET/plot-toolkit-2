import VPath from '../v-path';
import selectable from '../mixins/selectable';
import { getColor, DefaultValues } from "../utils";

let component = {
    props: {
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
            let obj = this.getPixiObj();
            if (newValue) {
                let points = this.getShadingPath();
                obj.lineStyle(2, getColor(this.symbolColor, DefaultValues.lineColor), 0.05, 0.5);
                obj.moveTo(points[0].x, points[0].y);
                for (let i = 1; i < points.length; i++) {
                    if (i < points.length - 1 && !this.realPath[i].x) {
                        obj.moveTo(points[i + 1].x, points[i + 1].y)
                    } else {
                        obj.myLineTo(points[i].x, points[i].y);
                    }
                }
            } else {
                this.draw(obj);
            }
        }
    },
    methods: {
        getShadingPath: function () {
            let transformXFn = this.getTransformX() || this.$parent.getTransformX();
            let transformYFn = this.getTransformY() || this.$parent.getTransformY();
            return this.realPath.map((point) => ({
                x: transformXFn(point.x) + 2,
                y: transformYFn(point.y) + 2,
            }));
        },
    },
    mixins: [selectable]
}

export default VPath.extend(component);