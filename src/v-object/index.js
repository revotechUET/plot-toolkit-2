import template from './template.html';
import baseObject from '../mixins/base-object'
import style from './style.less';

let component = {
    template,
    mixins: [baseObject],
}

// export default Vue.extend(component);
export default component