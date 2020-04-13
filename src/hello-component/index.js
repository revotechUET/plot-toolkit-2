import Vue from 'vue';
import template from './template.html';
import * as utils from "../utils";
const component = {
  props: ["name"],
  template,
  mounted: () => {
    let myUtils = utils;
    console.log(myUtils);
  }
}
export default component;
// Or
// export default Vue.extend(component);
