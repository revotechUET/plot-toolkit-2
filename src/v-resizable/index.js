import template from './template.html';

import baseResizable from '../mixins/base-resizable';

let component = {
    template: `<fragment>
        <div v-if="debug" style="padding-left:12px;">{{compProps}}
            <slot />
            ${require('./fragment.html')}
        </div>
        <fragment v-if="!debug" :props="compProps">
            <slot />
            ${require('./fragment.html')}
        </fragment>
    </fragment>`,
    mixins: [baseResizable],
}
// export default VShape.extend(component);
export default component;
