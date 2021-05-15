import VShape from '../v-shape';
import VRect from '../v-rect';
import layoutMixin from "../mixins/layout";
import { getColor, getPosX, getPosY, getTransparency, DefaultValues } from "../utils";
import template from './template.html';

const KNOB_OUTLINE_TRANS = 0.01;
const KNOB_FILL_TRANS = 0.2;
const KNOB_OUTLINE_TRANS_HIGHTLIGHT = 0.01;
const KNOB_FILL_TRANS_HIGHTLIGHT = 1;
let component = {
    props: {
        direction: {
            default: 'vertical',
            type: String
        },
        size: {
            default: 10,
        },
        onResize: {
            type: Function
        },
        knobFlags: {
            default: () => ([true, true]),
            type: Array
        },
        viewPosX: {
            default: 0,
            type: Number
        },
        viewPosY: {
            default: 0,
            type: Number
        },
        realMinY: {
            type: Number
        },
        realMaxY: {
            type: Number
        }
    },
    components: {
        VRect
    },
    template,
    data: function () {
        return {
            knobs: [{
                outline: KNOB_OUTLINE_TRANS,
                fill: KNOB_FILL_TRANS,
                mask: null
            }, {
                outline: KNOB_OUTLINE_TRANS,
                fill: KNOB_FILL_TRANS,
                mask: null
            }],
            // New
            topPosY: 0,
            bottomPosY: 190,
        }
    },
    computed: {
        componentType: function () { return "VResizable" },
        _knobFlags: function () {
            return (this.knobFlags || [true, true]).map(f => f ? 1 : 0);
        },
        knobSize: function () {
            return parseInt(this.size) || 10;
        },
        minSize: function () {
            return 2 * this.knobSize;
        },
        maxSize: function () {
            switch (this.direction) {
                case "vertical":
                    return this.$parent.height - (getPosY(this.coordinate, this.posY || 0));
                case "horizontal":
                    return this.$parent.width - (getPosX(this.coordinate, this.posX || 0));
            }
        },

    },
    methods: {
        hightlight: function (knob) {
            knob.outline = KNOB_OUTLINE_TRANS_HIGHTLIGHT;
            knob.fill = KNOB_FILL_TRANS_HIGHTLIGHT;
        },
        dehightlight: function (knob) {
            knob.outline = KNOB_OUTLINE_TRANS;
            knob.fill = KNOB_FILL_TRANS;
        },
        knobDragStart: function (knobIdx, target) {
            this.knobs[knobIdx].mask = target.mask;
            target.mask = null;
        },
        knobDragEnd: function (knobIdx, pos, target) {
            let width = this.width;
            let height = this.height;
            switch (knobIdx) {
                case 0: {
                    if (this.direction === 'vertical') {
                        height -= pos.y;
                        height = Math.max(height, this.minSize);
                        height = Math.min(height, this.maxSize);
                        this.$emit('topPosYChange', pos.y);
                    }
                    else if (this.direction === 'horizontal') {
                        width -= pos.x;
                        width = Math.max(width, this.minSize);
                        width = Math.min(width, this.maxSize);
                    }
                    break;
                }
                case 1: {
                    if (this.direction === 'vertical') {
                        let bYc = pos.y + this.knobSize - height;
                        this.$emit('bottomPosYChange', bYc);
                        height = pos.y + this.knobSize;
                        height = Math.max(height, this.minSize);
                        height = Math.min(height, this.maxSize);
                    }
                    else if (this.direction === 'horizontal') {
                        width = pos.x + this.knobSize;
                        width = Math.max(width, this.minSize);
                        width = Math.min(width, this.maxSize);
                    }
                    break;
                }
            }
            target.mask = this.knobs[knobIdx].mask;
            this.knobs[knobIdx].mask = null;
            this.onResize && this.onResize({ width, height }, this);
        },
        validateDrag: function (knobIdx, pPos, targetComp) {
            let v1, v2;
            switch (this.direction) {
                case "vertical":
                    switch (knobIdx) {
                        case 0:
                            v1 = -getPosY(this.coordinate, this.posY);
                            v2 = this.height - 2 * this.knobSize;
                            break;
                        case 1:
                            v1 = 2 * this.knobSize;
                            v2 = this.$parent.height - getPosY(this.coordinate, this.posY);
                            break;
                    }
                    if (pPos.y < v1) return { x: pPos.x, y: v1 };
                    if (pPos.y > v2) return { x: pPos.x, y: v2 };
                    break;
                case "horizontal":
                    switch (knobIdx) {
                        case 0:
                            v1 = -getPosX(this.coordinate, this.posX);
                            v2 = this.width - 2 * this.knobSize;
                            break;
                        case 1:
                            v1 = 2 * this.knobSize;
                            v2 = this.$parent.width - getPosX(this.coordinate, this.posX);
                            break;
                    }
                    if (pPos.x < v1) return { x: v1, y: pPos.y };
                    if (pPos.x > v2) return { x: v2, y: pPos.y };
                    break;
            }
            return pPos;
        },
        draw: function (obj) {
            obj.clear();
            let lw = parseInt(this.lineWidth);
            lw = isNaN(lw) ? 0 : lw;
            let lt = this.lineTransparency || 1.0;
            obj.lineStyle(lw, this.cLineColor.color, this.cLineColor.transparency, 0);
            obj.beginFill(this.cFillColor.color, this.cFillColor.transparency);
            obj.drawRect(0, 0, this.width, this.height);

            obj.endFill();
            obj.x = getPosX(this.coordinate, this.posX);
            obj.y = getPosY(this.coordinate, this.posY);
            obj.rotation = this.rotation || 0;
        }
    },
    mounted() {
        // console.log(typeof(this.direction))
    },
    mixins: [layoutMixin]
}
export default VShape.extend(component);
