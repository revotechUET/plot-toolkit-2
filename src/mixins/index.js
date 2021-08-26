import sticky from './stick-to-root';
import layout from './layout';
import extMouseListener from './mouse-listener';
import selectable from './selectable';
import onMounted from './on-mounted';
import onDestroyed from './on-destroyed';

const features = {
    sticky, layout, extMouseListener, selectable, onMounted, onDestroyed
}
// export default function factoryFn(baseComp, opts) {
//     let outComponent = baseComp;
//     for (let key in features) {
//         if (opts[key]) {
//             outComponent = outComponent.extend(features[key]);
//         }
//     }
//     return outComponent;
// }

export default function factoryFn(baseComp, opts) {
    let newMixins = []
    for (let key in features) {
        if (opts[key]) {
            newMixins.push(features[key])
        }
    }
    return {
        ...baseComp,
        mixins: [...baseComp.mixins, ...newMixins]
    }
}