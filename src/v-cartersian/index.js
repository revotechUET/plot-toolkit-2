// import VRect from '../v-rect';
import VAxis from '../v-axis';
import template from './template.html';
import factoryFn from '../mixins';
import baseRect from '../mixins/base-rect';

let component = {
    props: ['majorTicksX', 'majorTicksY', 'minorTicksX', 'minorTicksY',
        "majorTickLengthX", "majorTickLengthY",
        'grid', 'gridX', 'gridY',
        'tickLabelPosition', "tickLabelPositionX", "tickLabelPositionY",
        'tickPrecision', 'tickPrecisionX', 'tickPrecisionY', "labelFillColor", "labelStrokeColor"
    ],
    computed: {
        componentType: function () {
            return "VCartersian";
        }
    },
    components: { VAxis },
    template: `<div>
        <div v-if="debug" class="v-object">{{compProps}}
            ${require('./fragment.html')}
        </div>
        <fragment v-if="!debug" props="compProps">
            ${require('./fragment.html')}
        </fragment>
    </div>`,
    mixins: [baseRect]
}
// let VCartersian = VRect.extend(component);
let VCartersian = component;
export default VCartersian;
export function VCartersianFactory(opts) {
    return factoryFn(VCartersian, opts);
}