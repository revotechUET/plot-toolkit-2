import Vue from 'vue';

import Hello from '../hello';

export default Hello.extend({
    props: ["size"],
    template: require('./template.html')
})