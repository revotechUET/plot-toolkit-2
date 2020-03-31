import Vue from 'vue';
export default Vue.extend({
    template: require('./template.html'),
    props: ["slogan", "title"],
    data: function() {
        return {
        }
    }
});