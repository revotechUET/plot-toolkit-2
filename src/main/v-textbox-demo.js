import Vue from "vue";
import { Fragment } from "vue-fragment";
import VTextbox from "../v-textbox";
import VScene from "../v-scene";

new Vue({
    el: "#vue-app",
    template: `<fragment>
        <v-scene :view-width="600" :view-height="400" :transparent="true">
            <v-textbox :view-pos-x="30" :view-pos-y="30" 
                content="1234567890" 
                :content-style="style"
                />
        </v-scene>
    </fragment>
    `,
    data: {
        style: {
            fontFamily: "Arial",
            fontSize: 20,
            //fill: "#00ff99", // gradient
            //stroke: "#4a1850",
            //strokeThickness: 5
        },
    },
    components: {
        Fragment,
        VTextbox,
        VScene,
    },
});
