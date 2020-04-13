import Vue from 'vue';
import {Fragment} from 'vue-fragment';
import VTextbox from '../v-textbox';
import VScene from '../v-scene'

new Vue({
    el: '#vue-app',
    template: `<fragment>
        <v-scene :view-width="600" :view-height="400" :transparent="true">
            <v-textbox :view-pos-x="30" :view-pos-y="30" :view-width="100" :view-height="50" 
                :line-width="1" :clipped="true"
                line-color="rgba(0, 0, 255, 1)" fill-color="#FFFF0088" content="Troi"
            />
        </v-scene>
    </fragment>
    `,
    components: {
        Fragment, VTextbox, VScene
    }
});