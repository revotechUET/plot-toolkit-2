import sticky from './stick-to-root';
import layout from './layout';
import extMouseListener from './mouse-listener';

const features = {
    sticky, layout, extMouseListener
}
export default function factoryFn(baseComp, opts) {
    let outComponent = baseComp;
    for (let key in features) {
        if (opts[key]) {
            outComponent = outComponent.extend(features[key]);
        }
    }
    return outComponent;
}