import VRect from '../v-rect';
import VAxis from '../v-axis';
import template from './template.html';

let component = {
    props: ['majorTicksX', 'majorTicksY', 'minorTicksX', 'minorTicksY',
        "majorTickLengthX", "majorTickLengthY", 
        'grid', 'gridX', 'gridY', 
        'tickLabelPosition', "tickLabelPositionX", "tickLabelPositionY",
        'tickPrecision', 'tickPrecisionX', 'tickPrecisionY'
    ],
    components: {VAxis},
    template
}

export default VRect.extend(component);