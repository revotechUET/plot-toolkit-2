import VPath from '../v-path';

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
    }
}

export default VPath.extend(component);