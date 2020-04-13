import Vue from 'vue';
import {Plugin} from 'vue-fragment';
Vue.use(Plugin);

let component = {
    props: ['debug', 'compProps', 'klass', 'xtyle'],
    template: `<fragment>
        <div :class="klass" :style="xtyle" v-if="debug">{{compProps}}
            <slot />
        </div>
        <fragment v-if="!debug" :props="compProps">
            <slot />
        </fragment>
    </fragment>
    `,
    methods: {
        getRenderer: function() {
            return this.$parent.getRenderer();
        },
        getRoot: function() {
            return this.$parent.getRoot();
        },
        getPixiObj: function() {
            return this.$parent.getPixiObj();
        },
        getMaskObj: function() {
            return this.$parent.getMaskObj();
        },
        renderGraphic: function() {
            return this.$parent.renderGraphic();
        },
        rawRenderGraphic: function() {
            return this.$parent.rawRenderGraphic();
        }
    },
    computed: {
        transformX: function() {
            return this.$parent.transformX;
        },
        transformY: function() {
            return this.$parent.transformY;
        }
    }
}

export default Vue.extend(component);