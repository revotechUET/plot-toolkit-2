import sticky from './stick-to-root';
import layout from './layout';
import extMouseListener from './mouse-listener';
import selectable from './selectable';

const features = {
    sticky, layout, extMouseListener, selectable
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