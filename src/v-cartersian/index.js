import VRect from '../v-rect';
import VAxis from '../v-axis';
import template from './template.html';
import factoryFn from '../mixins';

let component = {
    props: ['majorTicksX', 'majorTicksY', 'minorTicksX', 'minorTicksY',
        "majorTickLengthX", "majorTickLengthY", 
        'grid', 'gridX', 'gridY', 
        'tickLabelPosition', "tickLabelPositionX", "tickLabelPositionY",
        'tickPrecision', 'tickPrecisionX', 'tickPrecisionY', "labelFillColor", "labelStrokeColor"
    ],
    computed: {
        componentType: function() {
            return "VCartersian";
        }
    },
    components: {VAxis},
    template
}
let VCartersian = VRect.extend(component);
export default VCartersian;
export function VCartersianFactory(opts) {
    return factoryFn(VCartersian, opts);
}