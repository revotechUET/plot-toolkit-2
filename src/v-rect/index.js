import baseRect from '../mixins/base-rect'
import factoryFn from '../mixins';

let component = {
    mixins: [baseRect],
};
let VRect = component;
export function VRectFactory(opts) {
    return factoryFn(VRect, opts);
}
export default VRect;
