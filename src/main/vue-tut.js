import Vue from 'vue';
import HelloComponent from '../hello-component';

let app = new Vue({
    el: "#vue-app",
    template: `<div>
        <hello-component name='World' />
        <hello-component :name='person' />
    </div>
    `,
    data: function() {
        return {person: "Quang"}
    },
    components: {
        HelloComponent
    }
});